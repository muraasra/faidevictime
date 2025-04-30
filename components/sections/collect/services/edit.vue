<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Modifier un service</h1>

    <form v-if="service" @submit.prevent="submit" class="space-y-4">
      <div>
        <label class="text-sm font-medium block mb-1">Nom</label>
        <input v-model="service.name" class="w-full p-2 border rounded dark:bg-zinc-800 dark:text-white" />
      </div>
      <div>
        <label class="text-sm font-medium block mb-1">Adresse</label>
        <input v-model="service.address" class="w-full p-2 border rounded dark:bg-zinc-800 dark:text-white" />
      </div>
      <div>
        <label class="text-sm font-medium block mb-1">Téléphone</label>
        <input v-model="service.phone" class="w-full p-2 border rounded dark:bg-zinc-800 dark:text-white" />
      </div>
      <div>
        <label class="text-sm font-medium block mb-1">Latitude</label>
        <input v-model="service.latitude" type="number" class="w-full p-2 border rounded dark:bg-zinc-800 dark:text-white" />
      </div>
      <div>
        <label class="text-sm font-medium block mb-1">Longitude</label>
        <input v-model="service.longitude" type="number" class="w-full p-2 border rounded dark:bg-zinc-800 dark:text-white" />
      </div>
      <button type="submit" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded">Enregistrer</button>
    </form>

    <div v-else class="text-center text-gray-500 dark:text-gray-400">Chargement du service...</div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

type Category = {
  id: number
  name: string
  description: string
}

type Service = {
  id: number
  name: string
  category: Category
  address: string
  phone: string
  latitude: number
  longitude: number
  get_address_phone: string
  author: number | null
}

const route = useRoute()
const router = useRouter()
const id = route.params.id

const { data: service, refresh } = await useApi<Service>(`http://127.0.0.1:8000/api/services/${id}/`, {
  server: false
})

async function submit() {
  await $fetch(`http://127.0.0.1:8000/api/services/${id}/`, {
    method: 'PUT',
    body: service.value
  })

  alert('Service mis à jour avec succès')
  router.push('/collect')
}
</script>