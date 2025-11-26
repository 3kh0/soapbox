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
  articlePublishedTime: () => (post.value?.created_at ? new Date(post.value.created_at * 1000).toISOString() : undefined),
  articleModifiedTime: () => (post.value?.updated_at ? new Date(post.value.updated_at * 1000).toISOString() : undefined),
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
          <MDCRenderer :body="post.ast.body" :data="post.ast.data" :components="components" />
        </div>
      </div>
    </article>
  </div>
</template>
