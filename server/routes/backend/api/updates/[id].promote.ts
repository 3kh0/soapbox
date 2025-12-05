import { createError } from "h3";
import { promoteSlackMessage } from "../../../../utils/slack";

export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare?.env?.soapbox;
  const slackToken = event.context.cloudflare?.env?.SLACK_BOT_TOKEN;
  const slackChannel = event.context.cloudflare?.env?.SLACK_CHANNEL_ID;
  const slackStagingChannel = event.context.cloudflare?.env?.SLACK_STAGING_CHANNEL_ID;

  if (!db) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Database binding "soapbox" not found.',
    });
  }

  if (!slackToken || !slackChannel || !slackStagingChannel) {
    throw createError({
      statusCode: 500,
      statusMessage: "Slack configuration missing.",
    });
  }

  try {
    const id = event.context.params?.id;

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Update ID is required",
      });
    }

    // Get the update from database
    const updateResult = await db
      .prepare("SELECT id, headline, subtext, slack_ts, is_staging FROM updates WHERE id = ?")
      .bind(id)
      .first();

    if (!updateResult) {
      throw createError({
        statusCode: 404,
        statusMessage: "Update not found",
      });
    }

    if (!updateResult.is_staging) {
      throw createError({
        statusCode: 400,
        statusMessage: "Update is not in staging channel",
      });
    }

    // Promote the message
    const newSlackTs = await promoteSlackMessage(
      { SLACK_BOT_TOKEN: slackToken, SLACK_CHANNEL_ID: slackChannel, SLACK_STAGING_CHANNEL_ID: slackStagingChannel },
      { headline: updateResult.headline, subtext: updateResult.subtext },
      updateResult.slack_ts
    );

    if (!newSlackTs) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to promote message to main channel",
      });
    }

    // Update the database record
    await db
      .prepare("UPDATE updates SET slack_ts = ?, is_staging = 0 WHERE id = ?")
      .bind(newSlackTs, id)
      .run();

    return { success: true };
  } catch (error) {
    console.error("Error promoting update:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to promote update",
    });
  }
});
