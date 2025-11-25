<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
  error: Object as () => NuxtError,
});

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
  <NuxtLayout name="default">
    <div class="flex flex-col items-center justify-center min-h-[50vh] p-4 font-sans">
      <div class="max-w-md w-full text-center space-y-8">
        <div v-if="error?.statusCode === 404" class="space-y-4">
          <h1 class="text-9xl font-black text-accent-400 opacity-20 select-none leading-none">404</h1>
          <div class="relative -mt-16">
            <h2 class="text-3xl font-bold text-white mb-3">Page Not Found</h2>
            <p class="text-dark-300 text-lg">We couldn't find the page you're looking for. It might have been moved, deleted, or it never existed.</p>
          </div>
        </div>

        <div v-else class="space-y-4">
          <h1 class="text-9xl font-black text-red-500 opacity-20 select-none leading-none">
            {{ error?.statusCode || "500" }}
          </h1>
          <div class="relative -mt-16">
            <h2 class="text-3xl font-bold text-white mb-3">Aw snap!</h2>
            <p class="text-dark-300 text-lg">
              {{ error?.message || "Something went wrong." }}
            </p>
          </div>
        </div>

        <button @click="handleError" class="inline-block px-8 py-3 bg-accent-600 hover:bg-accent-500 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-dark-900 cursor-pointer">Return Home</button>
      </div>
    </div>
  </NuxtLayout>
</template>
