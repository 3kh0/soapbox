import { createError } from "h3";
import { deleteSlackMessage } from "../../../../utils/slack";

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

  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Update ID is required",
    });
  }

  try {
    const update = await db.prepare("SELECT slack_ts FROM updates WHERE id = ?").bind(id).first();

    if (!update) {
      throw createError({
        statusCode: 404,
        statusMessage: "Update not found",
      });
    }

    if (update.slack_ts && slackToken && slackChannel) {
      await deleteSlackMessage({ SLACK_BOT_TOKEN: slackToken, SLACK_CHANNEL_ID: slackChannel }, update.slack_ts as string);
    }

    await db.prepare("DELETE FROM updates WHERE id = ?").bind(id).run();

    return { success: true };
  } catch (error) {
    console.error("Error deleting update:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete update",
    });
  }
});
