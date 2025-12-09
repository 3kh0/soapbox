import { createError } from "h3";
import { parseMarkdown } from "@nuxtjs/mdc/runtime";

export default defineEventHandler(async (event) => {
  const s = getRouterParam(event, "slug");
  const db = event.context.cloudflare?.env?.soapbox;

  if (!db) {
    console.error("cf ctx: ", JSON.stringify(event.context.cloudflare, null, 2));
    throw createError({
      statusCode: 500,
      statusMessage: "no db?",
    });
  }

  try {
    const post = await db.prepare("SELECT * FROM posts WHERE slug = ?").bind(s).first();

    if (!post) {
      throw createError({
        statusCode: 404,
        statusMessage: "Post not found",
      });
    }

    const ast = await parseMarkdown(post.content);

    return {
      ...post,
      ast,
    };
  } catch (e) {
    console.error("api/post error", e);
    throw createError({
      statusCode: 500,
      statusMessage: "The server is having issues with your request, please try again later.",
    });
  }
});
