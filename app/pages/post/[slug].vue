<script setup lang="ts">
import ProseH1 from "../../components/content/ProseH1.vue";
import ProseH2 from "../../components/content/ProseH2.vue";
import ProseH3 from "../../components/content/ProseH3.vue";
import ProseH4 from "../../components/content/ProseH4.vue";
import ProseH5 from "../../components/content/ProseH5.vue";
import ProseH6 from "../../components/content/ProseH6.vue";
import ProseP from "../../components/content/ProseP.vue";
import ProseUl from "../../components/content/ProseUl.vue";
import ProseOl from "../../components/content/ProseOl.vue";
import ProseLi from "../../components/content/ProseLi.vue";
import ProseBlockquote from "../../components/content/ProseBlockquote.vue";
import ProseStrong from "../../components/content/ProseStrong.vue";
import ProseImg from "../../components/content/ProseImg.vue";
import ProseTable from "../../components/content/ProseTable.vue";
import ProseThead from "../../components/content/ProseThead.vue";
import ProseTbody from "../../components/content/ProseTbody.vue";
import ProseTr from "../../components/content/ProseTr.vue";
import ProseTh from "../../components/content/ProseTh.vue";
import ProseTd from "../../components/content/ProseTd.vue";
import ProseCodeInline from "../../components/content/ProseCodeInline.vue";
import ProseHr from "../../components/content/ProseHr.vue";

const components = {
  h1: ProseH1,
  h2: ProseH2,
  h3: ProseH3,
  h4: ProseH4,
  h5: ProseH5,
  h6: ProseH6,
  p: ProseP,
  ul: ProseUl,
  ol: ProseOl,
  li: ProseLi,
  blockquote: ProseBlockquote,
  strong: ProseStrong,
  img: ProseImg,
  table: ProseTable,
  thead: ProseThead,
  tbody: ProseTbody,
  tr: ProseTr,
  th: ProseTh,
  td: ProseTd,
  code: ProseCodeInline,
  hr: ProseHr,
};

const route = useRoute();
const { data: post, error } = await useFetch(`/api/post/${route.params.slug}`);
const showDateDetails = ref(false);

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Post not found",
    fatal: true,
  });
}

const getRelativeTime = (timestamp: number) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const formatFullDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
};

useSeoMeta({
  title: () => post.value?.title,
  description: () => post.value?.description,
  ogTitle: () => post.value?.title,
  ogDescription: () => post.value?.description,
  ogType: () => "article",
  ogImage: () => "https://soapbox.3kh0.net/og.png",
  ogUrl: () => `https://soapbox.3kh0.net/post/${route.params.slug}`,
  twitterCard: () => "summary_large_image",
  articlePublishedTime: () => (post.value?.created_at ? new Date(post.value.created_at * 1000).toISOString() : undefined),
  articleModifiedTime: () => (post.value?.updated_at ? new Date(post.value.updated_at * 1000).toISOString() : undefined),
});
</script>

<template>
  <div v-if="post" class="max-w-5xl mx-auto">
    <article>
      <div class="mb-6">
        <h1 class="text-4xl font-bold mt-2 mb-4 text-dark-50">
          {{ post.title }}
        </h1>
        <div class="text-dark-400 text-sm">
          <div class="flex items-center gap-2 group">
            <span>
              {{ post.updated_at && post.updated_at !== post.created_at ? "Updated " + getRelativeTime(post.updated_at * 1000) : "Published " + getRelativeTime(post.created_at * 1000) }}
            </span>
            <button class="opacity-75 group-hover:opacity-100 transition-opacity cursor-pointer" @click="showDateDetails = !showDateDetails" :aria-label="showDateDetails ? 'Hide date details' : 'Show date details'">
              <svg class="w-4 h-4 transform transition-transform" :class="{ 'rotate-180': showDateDetails }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
          <div v-if="showDateDetails" class="mt-2 text-dark-500 text-xs space-y-1">
            <div v-if="post.updated_at && post.updated_at !== post.created_at">Updated {{ formatFullDate(post.updated_at * 1000) }} ({{ getRelativeTime(post.updated_at * 1000) }})</div>
            <div>Published {{ formatFullDate(post.created_at * 1000) }} ({{ getRelativeTime(post.created_at * 1000) }})</div>
          </div>
        </div>
      </div>

      <div class="prose prose-invert max-w-none">
        <div v-if="post.ast">
          <MDCRenderer :body="post.ast.body" :data="post.ast.data" :components="components" />
        </div>
      </div>
    </article>
  </div>
</template>
