import { createError } from "h3";

export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare?.env?.soapbox;

  if (!db) {
    throw createError({
      statusCode: 500,
      statusMessage: "no db?",
    });
  }

  try {
    const { results } = await db.prepare("SELECT id, headline, subtext, slack_ts, created_at FROM updates ORDER BY created_at DESC LIMIT 5").all();

    return results;
  } catch (e) {
    console.error("api/updates error", e);
    throw createError({
      statusCode: 500,
      statusMessage: "The server is having issues with your request, please try again later.",
    });
  }
});
