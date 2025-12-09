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

    const body = await readBody(event);
    const now = Math.floor(Date.now() / 1000);
    const created_at = body.hasOwnProperty("created_at") ? body.created_at : now;
    const published = body.published ? 1 : 0;
    const published_at = published && body.published ? now : null;

    await db
      .prepare(
        `INSERT INTO posts (slug, title, description, content, created_at, updated_at, published, published_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(body.slug, body.title, body.description, body.content, created_at, now, published, published_at)
      .run();

    return { success: true };
  } catch (error) {
    console.error("/backend/api/posts.post.ts error", error);
    throw createError({
      statusCode: 500,
      statusMessage: "failed to create post",
    });
  }
});
