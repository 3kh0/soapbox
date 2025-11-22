<script setup lang="ts">
const { data: updates } = await useFetch('/api/updates')

function timeAgo(timestamp: number) {
  const seconds = Math.floor((Date.now() - timestamp * 1000) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y";
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo";
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d";
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h";
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m";
  
  return Math.floor(seconds) + "s";
}

onMounted(() => {
  setTimeout(() => {
    const marquee = document.querySelector('.animate-marquee')
    if (marquee) marquee.classList.add('active')
  }, 2000)
})
</script>

<template>
  <div class="min-h-screen bg-dark-900 text-dark-100 flex flex-col">
    <header
      class="border-b border-dark-700 bg-dark-800/50 backdrop-blur-sm sticky top-0 z-10"
    >
      <NuxtLink to="/" class="block">
        <div class="max-w-5xl mx-auto px-6 py-4">
          <h1 class="text-2xl font-bold text-accent-400">Soapbox</h1>
          <p class="text-dark-400 text-sm mt-1">
            The independent Hack Club news source.
          </p>
        </div>
      </NuxtLink>

      <div v-if="updates && updates.length" class="border-t border-dark-700 bg-dark-900 text-sm h-10 flex items-center relative">
        <div class="z-20 pl-6 pr-3 font-bold text-accent-400 bg-dark-900 h-full flex items-center shadow-[4px_0_24px_rgba(0,0,0,0.5)] whitespace-nowrap">
          Recent Updates:
        </div>

        <div class="overflow-hidden relative grow h-full flex items-center">
          <div class="absolute left-0 top-0 bottom-0 w-10 bg-linear-to-r from-dark-900 to-transparent z-10 pointer-events-none"></div>
          <div class="absolute right-0 top-0 bottom-0 w-10 bg-linear-to-l from-dark-900 to-transparent z-10 pointer-events-none"></div>

          <div class="animate-marquee inline-block whitespace-nowrap">
            <span v-for="(update, index) in updates" :key="update.id" class="inline-flex items-center first:ml-6">
              <span class="text-dark-200">{{ update.content }}</span>
              <span class="text-dark-500 text-xs ml-1.5">{{ timeAgo(update.created_at) }}</span>
              <span class="mx-3 text-dark-600">-</span>
            </span>
             <!-- Duplicate for seamless loop effect -->
             <span v-for="(update, index) in updates" :key="'dup-'+update.id" class="inline-flex items-center">
              <span class="text-dark-200">{{ update.content }}</span>
              <span class="text-dark-500 text-xs ml-1.5">{{ timeAgo(update.created_at) }}</span>
              <span class="mx-3 text-dark-600">-</span>
            </span>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-5xl mx-auto p-6 grow w-full">
      <slot />
    </main>

    <footer class="border-t border-dark-700 bg-dark-800/50">
      <div class="max-w-5xl mx-auto px-6 py-8">
        <p class="text-dark-400 text-sm">
          Presented by Soapbox, bringing you unparalleled coverage of all-things
          Hack Club in real-time. We are not affiliated with Hack Club HQ, we are an
          independent organization and fully run by the Hack Club community. Follow our channel on
          <a
            href="https://hackclub.slack.com/archives/C09UK67E4SZ"
            class="text-accent-400"
            >Slack (#soapbox)</a
          > for more updates.
        </p>
      </div>
    </footer>
  </div>
</template>

<style>
.animate-marquee {
  animation: marquee 40s linear infinite;
  animation-play-state: paused;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee:hover {
  animation-play-state: paused;
}

.animate-marquee.active {
  animation-play-state: running;
}
</style>