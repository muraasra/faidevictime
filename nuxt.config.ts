// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
      '@nuxtjs/color-mode',
      '@nuxt/image',
      '@pinia/nuxt',
  ], 
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8000/api', // <- ta base URL ici
        }
  },

  css:[
      '~/assets/css/app.css'
  ],

  colorMode:{
      preference: 'system', // default value of $colorMode.preference
      fallback: 'dark', // fallback value if not system preference found
      hid: 'nuxt-color-mode-script',
      globalName: '__NUXT_COLOR_MODE__',
      componentName: 'ColorScheme',
      classPrefix: '',
      classSuffix: '',
      storageKey: 'nuxt-color-mode'
  },

  postcss:{
      plugins: {
          tailwindcss: {},
          autoprefixer: {}
      }
  },

  compatibilityDate: '2025-04-13',
})
