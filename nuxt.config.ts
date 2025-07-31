// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/image',
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
    '@nuxtjs/color-mode',
  ],
  css: [
    '~/assets/css/app.css',
    '@fortawesome/fontawesome-free/css/all.css'
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  compatibilityDate: '2025-04-13',
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'AviSafeSpace',
      short_name: 'Avina',
      description: "Application d'assistance et de soutien moral avec carte interactive des services.",
      theme_color: '#059669',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/',
      icons: [
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
      runtimeCaching: [
        {
          urlPattern: '^https://wilfriedtayou\.pythonanywhere\.com/api/',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: { maxEntries: 50, maxAgeSeconds: 86400 }
          }
        }
      ]
    }
  }
})
