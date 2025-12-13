<template>
  <a :href="href" target="_blank" rel="noopener noreferrer" class="text-accent-500 hover:text-accent-400 underline transition-colors">
    <slot />
  </a>
</template>

<script setup lang="ts">
defineProps<{
  href?: string;
}>();
</script>
