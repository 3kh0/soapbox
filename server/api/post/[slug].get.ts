import { createError } from "h3";
import { parseMarkdown } from '@nuxtjs/mdc/runtime';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  // Access D1 binding from Cloudflare context
  const db = event.context.cloudflare?.env?.soapbox;

  if (!db) {
    console.error('Cloudflare context:', JSON.stringify(event.context.cloudflare, null, 2));
    // Check if we are in development and maybe warn or mock?
    // For now, fail hard if DB is missing, as it means misconfiguration.
    throw createError({
      statusCode: 500,
      statusMessage:
        'Database binding "soapbox" not found. Ensure you are running with wrangler.',
    });
  }

  try {
    const post = await db
      .prepare("SELECT * FROM posts WHERE slug = ?")
      .bind(slug)
      .first();

    if (!post) {
      throw createError({
        statusCode: 404,
        statusMessage: "Post not found",
      });
    }

    const ast = await parseMarkdown(post.content);

    return {
      ...post,
      ast
    };
  } catch (e) {
    console.error("Database error:", e);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
