<template>
  <blockquote
    class="border-l-4 border-accent-500 pl-6 py-4 my-8 bg-dark-800 rounded-r-lg"
  >
    <slot />
  </blockquote>
</template>

<style>
/* Using global or non-scoped style to target the slotted prose-p components if needed, 
   but since slots render in parent scope, scoped styles with :deep() is better */
</style>

<style scoped>
/* Target the p tags (which are likely ProseP components) inside the blockquote */
:deep(p) {
  color: var(--color-dark-100);
  font-style: italic;
  margin-bottom: 0.5rem; /* mb-2 */
}

:deep(p:last-child) {
  color: var(--color-accent-400);
  font-weight: 600; /* font-semibold */
  font-style: normal;
  margin-bottom: 0;
}
</style>
