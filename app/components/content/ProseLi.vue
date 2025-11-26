<script setup lang="ts">
const listType = inject("listType", "ul");
</script>

<template>
  <li v-if="listType === 'ul'" class="flex gap-3">
    <span class="text-accent-400 font-bold shrink-0">•</span>
    <span><slot /></span>
  </li>
  <li v-else class="pl-1 marker:text-accent-400 marker:font-bold">
    <slot />
  </li>
</template>
