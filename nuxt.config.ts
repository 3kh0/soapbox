// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  nitro: {
    preset: "cloudflare-pages",
  },
  css: ["./app/assets/main.css"],
  vite: { plugins: [tailwindcss()] },
  modules: ["nitro-cloudflare-dev", "@nuxt/eslint", "@nuxt/fonts", "@nuxt/hints", "@nuxtjs/mdc"],
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "Soapbox News",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        {
          name: "description",
          content:
            "Soapbox, bringing you unparalleled coverage of all-things Hack Club in real-time. We are not affiliated with Hack Club HQ, we are an independent organization and fully run by the Hack Club community.",
        },
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon.png",
        },
        { rel: "apple-touch-icon", href: "/icon.png" },
      ],
    },
  },
});
