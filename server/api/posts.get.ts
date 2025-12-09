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
    const { results } = await db.prepare("SELECT slug, title, description, created_at, published, published_at FROM posts WHERE published = 1 ORDER BY published_at DESC").all();

    return results;
  } catch (e) {
    console.error("api/posts error", e);
    throw createError({
      statusCode: 500,
      statusMessage: "The server is having issues with your request, please try again later.",
    });
  }
});
