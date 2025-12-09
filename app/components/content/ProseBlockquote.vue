<template>
  <blockquote class="border-l-4 border-accent-500 pl-6 py-4 my-8 bg-dark-800 rounded-r-lg">
    <slot />
  </blockquote>
</template>

<style scoped>
:deep(p) {
  color: var(--color-dark-100);
  font-style: italic;
  margin-bottom: 0.5rem;
}

:deep(p:last-child) {
  color: var(--color-accent-400);
  font-weight: 600;
  font-style: normal;
  margin-bottom: 0;
}
</style>
