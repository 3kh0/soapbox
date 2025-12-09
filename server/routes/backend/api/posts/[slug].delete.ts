import { createError } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const db = event.context.cloudflare?.env?.soapbox;

    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: "no db?",
      });
    }

    const slug = getRouterParam(event, "slug");

    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: "no slug",
      });
    }

    await db.prepare(`DELETE FROM posts WHERE slug = ?`).bind(slug).run();

    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "failed to delete post",
    });
  }
});
