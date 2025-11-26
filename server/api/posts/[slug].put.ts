import { createError } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const db = event.context.cloudflare?.env?.soapbox;

    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database binding "soapbox" not found.',
      });
    }

    const slug = getRouterParam(event, "slug");
    const body = await readBody(event);

    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing slug parameter",
      });
    }

    const updated_at = body.hasOwnProperty("updated_at") ? body.updated_at : Math.floor(Date.now() / 1000);
    const created_at = body.created_at || Math.floor(Date.now() / 1000);

    await db
      .prepare(
        `UPDATE posts 
       SET title = ?, description = ?, content = ?, created_at = ?, updated_at = ? 
       WHERE slug = ?`,
      )
      .bind(body.title, body.description, body.content, created_at, updated_at, slug)
      .run();

    return { success: true };
  } catch (error) {
    console.error("Error updating post:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update post",
    });
  }
});
