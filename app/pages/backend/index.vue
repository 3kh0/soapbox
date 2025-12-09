<script setup lang="ts">
definePageMeta({
  layout: "admin",
});
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-dark-50 mb-2">omg hello admin!!</h1>
      <p class="text-dark-400">whatcha upto today?</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <NuxtLink to="/backend/posts" class="group p-6 bg-dark-800 rounded-xl border border-dark-700 hover:border-accent-500/50 hover:shadow-lg hover:shadow-accent-500/10 transition-all duration-300">
        <div class="flex items-start justify-between mb-3">
          <h2 class="text-xl font-bold text-dark-50 group-hover:text-accent-400 transition-colors">articles</h2>
        </div>
        <p class="text-dark-400 text-sm mb-4">wanna write a article or update an existing one?</p>
      </NuxtLink>

      <NuxtLink to="/backend/updates" class="group p-6 bg-dark-800 rounded-xl border border-dark-700 hover:border-accent-500/50 hover:shadow-lg hover:shadow-accent-500/10 transition-all duration-300">
        <div class="flex items-start justify-between mb-3">
          <h2 class="text-xl font-bold text-dark-50 group-hover:text-accent-400 transition-colors">rapid updates</h2>
        </div>
        <p class="text-dark-400 text-sm mb-4">got headlines to push? send em to slack and the news feed!</p>
      </NuxtLink>
    </div>
  </div>
</template>
