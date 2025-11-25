<script setup lang="ts">
const { data: posts } = await useFetch("/api/posts");

const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<template>
  <div>
    <p class="text-dark-400 mb-6">Soapbox is your spot to stay up to date with the latest news and happenings around Hack Club. Written by trusted members of the Hack Club community to keep you informed.</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <NuxtLink v-for="post in posts" :key="post.slug" :to="`/post/${post.slug}`" class="group flex flex-col bg-dark-800 rounded-xl overflow-hidden border border-dark-700 hover:border-accent-500/50 hover:shadow-lg hover:shadow-accent-500/10 transition-all duration-300">
        <div class="p-6 flex flex-col flex-1">
          <h2 class="text-xl font-bold mb-3 text-dark-50 group-hover:text-accent-400 transition-colors">
            {{ post.title }}
          </h2>

          <p class="text-dark-300 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
            {{ post.description }}
          </p>

          <div class="flex items-center justify-between">
            <span class="text-xs text-dark-400">{{ formatDate(post.created_at) }}</span>
          </div>

          <div class="flex items-center text-sm font-semibold text-accent-400 group-hover:text-accent-300">
            Read Article
            <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
