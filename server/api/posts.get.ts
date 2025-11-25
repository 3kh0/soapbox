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
    const { results } = await db.prepare("SELECT slug, title, description, created_at FROM posts ORDER BY created_at DESC").all();

    return results;
  } catch (e) {
    console.error("Database error:", e);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
