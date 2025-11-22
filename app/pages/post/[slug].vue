<script setup lang="ts">
import ProseH3 from "../../components/content/ProseH3.vue";
import ProseP from "../../components/content/ProseP.vue";
import ProseUl from "../../components/content/ProseUl.vue";
import ProseLi from "../../components/content/ProseLi.vue";
import ProseBlockquote from "../../components/content/ProseBlockquote.vue";
import ProseStrong from "../../components/content/ProseStrong.vue";

const components = {
  h3: ProseH3,
  p: ProseP,
  ul: ProseUl,
  li: ProseLi,
  blockquote: ProseBlockquote,
  strong: ProseStrong,
};

const route = useRoute();
const { data: post, error } = await useFetch(`/api/post/${route.params.slug}`);

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Post not found",
    fatal: true,
  });
}

useSeoMeta({
  title: () => post.value?.title,
  description: () => post.value?.description,
  ogTitle: () => post.value?.title,
  ogDescription: () => post.value?.description,
  articlePublishedTime: () =>
    post.value?.created_at
      ? new Date(post.value.created_at * 1000).toISOString()
      : undefined,
  articleModifiedTime: () =>
    post.value?.updated_at
      ? new Date(post.value.updated_at * 1000).toISOString()
      : undefined,
});
</script>

<template>
  <div v-if="post" class="max-w-4xl mx-auto">
    <article>
      <div class="mb-6">
        <h1 class="text-4xl font-bold mt-2 mb-4 text-dark-50">
          {{ post.title }}
        </h1>
        <div class="text-dark-400 text-sm">
          Published on
          {{
            new Date(post.created_at * 1000).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          }}
        </div>
      </div>

      <div class="prose prose-invert max-w-none">
        <div v-if="post.ast">
          <MDCRenderer
            :body="post.ast.body"
            :data="post.ast.data"
            :components="components"
          />
        </div>
      </div>
    </article>
  </div>
</template>
