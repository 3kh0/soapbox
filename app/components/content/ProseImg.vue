<template>
  <img :src="src" :alt="alt" :title="title" class="rounded-xl w-full my-8 border border-dark-700" />
</template>

<script setup lang="ts">
defineProps({
  src: {
    type: String,
    default: "",
  },
  alt: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: null,
  },
});
</script>
