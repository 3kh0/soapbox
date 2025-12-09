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
    const body = await readBody(event);

    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: "no slug",
      });
    }

    const now = Math.floor(Date.now() / 1000);
    let updated_at = body.hasOwnProperty("updated_at") ? body.updated_at : now;
    const created_at = body.created_at || now;
    const published = body.published ? 1 : 0;

    const currentPost = await db.prepare("SELECT published, published_at FROM posts WHERE slug = ?").bind(slug).first();

    let published_at = currentPost?.published_at;
    if (published && !currentPost?.published) {
      published_at = now;
      updated_at = now;
    }

    await db
      .prepare(
        `UPDATE posts 
       SET title = ?, description = ?, content = ?, created_at = ?, updated_at = ?, published = ?, published_at = ? 
       WHERE slug = ?`,
      )
      .bind(body.title, body.description, body.content, created_at, updated_at, published, published_at, slug)
      .run();

    return { success: true };
  } catch (error) {
    console.error("Error updating post:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "failed to update post",
    });
  }
});
