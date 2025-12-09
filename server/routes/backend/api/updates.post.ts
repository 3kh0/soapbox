import { createError } from "h3";
import { push } from "../../../utils/slack";

export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare?.env?.soapbox;
  const slackToken = event.context.cloudflare?.env?.SLACK_BOT_TOKEN;
  const slackChannel = event.context.cloudflare?.env?.SLACK_CHANNEL_ID;
  const slackStagingChannel = event.context.cloudflare?.env?.SLACK_STAGING_CHANNEL_ID;

  if (!db) {
    throw createError({
      statusCode: 500,
      statusMessage: "no db?",
    });
  }

  try {
    const body = await readBody(event);
    const isStaging = body.isStaging === true;
    const slackTs = await push({ SLACK_BOT_TOKEN: slackToken, SLACK_CHANNEL_ID: slackChannel, SLACK_STAGING_CHANNEL_ID: slackStagingChannel }, { headline: body.headline, subtext: body.subtext }, isStaging);

    if (!slackTs) {
      throw createError({
        statusCode: 500,
        statusMessage: "failed to post slack update",
      });
    }

    const now = Math.floor(Date.now() / 1000);

    await db
      .prepare(`INSERT INTO updates (headline, subtext, slack_ts, is_staging, created_at) VALUES (?, ?, ?, ?, ?)`)
      .bind(body.headline, body.subtext || null, slackTs, isStaging ? 1 : 0, now)
      .run();

    return { success: true };
  } catch (error) {
    console.error("backend/api/updates.post.ts error: ", error);
    throw createError({
      statusCode: 500,
      statusMessage: "failed to create update",
    });
  }
});
