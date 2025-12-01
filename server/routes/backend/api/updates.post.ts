import { createError } from "h3";
import { postSlackUpdate } from "../../../utils/slack";

export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare?.env?.soapbox;
  const slackToken = event.context.cloudflare?.env?.SLACK_BOT_TOKEN;
  const slackChannel = event.context.cloudflare?.env?.SLACK_CHANNEL_ID;

  if (!db) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Database binding "soapbox" not found.',
    });
  }

  if (!slackToken || !slackChannel) {
    throw createError({
      statusCode: 500,
      statusMessage: "Slack configuration missing.",
    });
  }

  try {
    const body = await readBody(event);

    if (!body.headline) {
      throw createError({
        statusCode: 400,
        statusMessage: "Headline is required",
      });
    }

    const slackTs = await postSlackUpdate(
      { SLACK_BOT_TOKEN: slackToken, SLACK_CHANNEL_ID: slackChannel },
      { headline: body.headline, subtext: body.subtext }
    );

    if (!slackTs) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to post to Slack",
      });
    }

    const now = Math.floor(Date.now() / 1000);

    await db
      .prepare(
        `INSERT INTO updates (headline, subtext, slack_ts, created_at) VALUES (?, ?, ?, ?)`
      )
      .bind(body.headline, body.subtext || null, slackTs, now)
      .run();

    return { success: true };
  } catch (error) {
    console.error("Error creating update:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create update",
    });
  }
});
