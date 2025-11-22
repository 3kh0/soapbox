<script setup lang="ts">
import ProseH3 from '../../components/content/ProseH3.vue'
import ProseP from '../../components/content/ProseP.vue'
import ProseUl from '../../components/content/ProseUl.vue'
import ProseLi from '../../components/content/ProseLi.vue'
import ProseBlockquote from '../../components/content/ProseBlockquote.vue'
import ProseStrong from '../../components/content/ProseStrong.vue'

const components = {
  h3: ProseH3,
  p: ProseP,
  ul: ProseUl,
  li: ProseLi,
  blockquote: ProseBlockquote,
  strong: ProseStrong
}

const route = useRoute();
const { data: post, error } = await useFetch(
  `/api/post/${route.params.slug}`
);

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
  articlePublishedTime: () => post.value?.created_at ? new Date(post.value.created_at * 1000).toISOString() : undefined,
  articleModifiedTime: () => post.value?.updated_at ? new Date(post.value.updated_at * 1000).toISOString() : undefined,
});
</script>

<template>
    <div v-if="post" class="max-w-4xl mx-auto">
      <article>
        <div class="mb-6">
          <h1 class="text-4xl font-bold mt-2 mb-4 text-dark-50">{{ post.title }}</h1>
          <div class="text-dark-400 text-sm">
            Published on {{
              new Date(post.created_at * 1000).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }}
          </div>
        </div>

        <!-- Featured image placeholder -->
        <div
          class="mb-8 aspect-video bg-linear-to-br from-accent-400 to-dark-400 rounded-lg flex items-center justify-center border border-dark-600"
        >
          <div class="text-center">
            <svg
              class="w-16 h-16 text-white mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p class="text-white">Featured Image</p>
          </div>
        </div>

        <div class="prose prose-invert max-w-none">
          <div v-if="post.ast">
             <MDCRenderer :body="post.ast.body" :data="post.ast.data" :components="components" />
          </div>
          <div v-else>
            Loading markdown...
          </div>
        </div>
      </article>
    </div>
</template>
