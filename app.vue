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
</script>