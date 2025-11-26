<script setup lang="ts">
const isNested = !!inject("listType", null);
provide("listType", "ol");
</script>

<template>
  <ol :class="['space-y-2 list-decimal list-outside ml-6 text-dark-300', isNested ? 'mt-2 mb-0' : 'mb-6']">
    <slot />
  </ol>
</template>
