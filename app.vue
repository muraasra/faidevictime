<template>
  <NuxtLayout>
    <NuxtPage />
    <LoadingOverlay :show="loading" />
  </NuxtLayout>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import LoadingOverlay from '~/components/loadingOverlay.vue'
import { ref, onMounted } from 'vue'
import { SITE_URL, SITE_NAME, SITE_DEFAULT_OG_IMAGE } from '~/utils/site'

// Organization + WebSite en JSON-LD, valables sur tout le site (données stables,
// pas de raison de les redéclarer page par page) — sert le SEO classique (Google)
// et le GEO (moteurs de réponse IA : ChatGPT, Perplexity, AI Overviews...) qui
// s'appuient beaucoup sur les données structurées pour citer une source fiable.
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'NGO',
        name: SITE_NAME,
        url: SITE_URL,
        logo: SITE_DEFAULT_OG_IMAGE,
        description: "Plateforme camerounaise d'assistance gratuite, anonyme et confidentielle aux victimes de violences : orientation vers des services de soutien psychologique, soins médicaux, aide juridique, hébergement d'urgence, sécurité, santé mentale et réinsertion économique.",
        sameAs: ['https://twitter.com/cipcre'],
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: 'fr',
      }),
    },
  ],
})

const loading = ref(false)
const router = useRouter()

onMounted(() => {
  router.beforeEach(() => {
    loading.value = true
  })

  router.afterEach(() => {
    setTimeout(() => loading.value = false,400) // petit délai pour l'effet visuel
  })
})


interface User {
  id: number
  username: string
}
const user = ref<User | null>(null)
// Fonction pour restaurer l'utilisateur
function restoreUser() {
  if (process.client) {
    const storedUser = sessionStorage.getItem('user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
      console.log('Session restaurée avec succès')
      return true
    }
  }
  return false
}
// Restaurer l'utilisateur au démarrage
if (process.client) {
  restoreUser()
}
</script>