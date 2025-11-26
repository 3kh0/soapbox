<script setup lang="ts">
const sidebarOpen = ref(false);
</script>

<template>
  <div class="min-h-screen bg-dark-900 text-dark-100 flex flex-col">
    <header class="border-b border-dark-700 bg-dark-800/50 backdrop-blur-sm sticky top-0 z-10">
      <NuxtLink to="/" class="block">
        <div class="max-w-5xl mx-auto px-6 py-4">
          <h1 class="text-2xl font-bold text-accent-400">Soapbox</h1>
          <p class="text-red-400 text-sm mt-1">Admin Panel</p>
        </div>
      </NuxtLink>
    </header>

    <div class="flex flex-1 max-w-7xl mx-auto w-full gap-6 px-6 py-6">
      <!-- Sidebar -->
      <aside :class="['fixed md:static inset-0 md:inset-auto md:w-64 md:block', sidebarOpen ? 'block' : 'hidden']" class="bg-dark-800 md:bg-transparent rounded-lg md:rounded-none border md:border-0 border-dark-700 p-6 md:p-0">
        <nav class="space-y-3">
          <NuxtLink to="/backend" class="block px-4 py-2 rounded-lg hover:bg-dark-700 text-dark-200 hover:text-accent-400 transition-colors" :class="$route.path === '/backend' ? 'bg-dark-700 text-accent-400' : ''"> dashboard </NuxtLink>
          <NuxtLink to="/backend/posts" class="block px-4 py-2 rounded-lg hover:bg-dark-700 text-dark-200 hover:text-accent-400 transition-colors" :class="$route.path.startsWith('/backend/posts') ? 'bg-dark-700 text-accent-400' : ''"> articles </NuxtLink>
        </nav>

        <div class="mt-8 pt-6 border-t border-dark-700">
          <NuxtLink to="/" class="block px-4 py-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-dark-200 transition-colors text-sm"> ← Back to Soapbox </NuxtLink>
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 min-w-0">
        <slot />
      </main>
    </div>
  </div>
</template>
