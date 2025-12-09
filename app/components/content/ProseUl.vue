<script setup lang="ts">
const isNested = !!inject("listType", null);
provide("listType", "ul");
</script>

<template>
  <ul :class="['space-y-2', isNested ? 'mt-2 mb-0' : 'mb-6']">
    <slot />
  </ul>
</template>
