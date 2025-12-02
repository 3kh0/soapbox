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

    const body = await readBody(event);

    // Validate required fields
    if (!body.slug || !body.title || !body.description || !body.content) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing required fields",
      });
    }

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
    console.error("Error creating post:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create post",
    });
  }
});
