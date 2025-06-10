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