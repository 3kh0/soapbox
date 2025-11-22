import { createError } from "h3";

export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare?.env?.soapbox;

  if (!db) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Database binding "soapbox" not found.',
    });
  }

  try {
    const { results } = await db
      .prepare("SELECT id, content, created_at FROM updates ORDER BY created_at DESC LIMIT 5")
      .all();

    return results;
  } catch (e) {
    console.error("Database error:", e);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
