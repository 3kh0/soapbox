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
    </header>

    <main class="max-w-5xl mx-auto px-6 py-12 grow w-full">
      <slot />
    </main>

    <footer class="border-t border-dark-700 bg-dark-800/50">
      <div class="max-w-5xl mx-auto px-6 py-8">
        <p class="text-dark-400 text-sm">
          Presented by Soapbox, bringing you unparalleled coverage of all-things
          Hack Club in real-time. Not affiliated with Hack Club HQ, we are an
          independent organization. Follow our channel on
          <a
            href="https://hackclub.slack.com/archives/C09UK67E4SZ"
            class="text-accent-400"
            >Slack (#soapbox)</a
          >!
        </p>
      </div>
    </footer>
  </div>
</template>
