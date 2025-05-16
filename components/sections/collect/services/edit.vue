<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Modifier un service</h1>

    <form v-if="service" @submit.prevent="submit" class="space-y-4">
      <!-- Questions transversales -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-4">Informations générales</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium block mb-1">Nom de la structure</label>
            <input v-model="form.nom_structure" class="w-full p-2 border rounded dark:bg-zinc-800 dark:text-white" />
          </div>

          <div>
            <label class="text-sm font-medium block mb-1">Fonction du répondant</label>
            <input v-model="form.fonction_repondant" class="w-full p-2 border rounded dark:bg-zinc-800 dark:text-white" />
          </div>

          <div>
            <label class="text-sm font-medium block mb-1">Nom du répondant</label>
            <input v-model="form.nom_repondant" class="w-full p-2 border rounded dark:bg-zinc-800 dark:text-white" />
          </div>

          <div>
            <label class="text-sm font-medium block mb-1">Téléphone</label>
            <input v-model="form.telephone_repondant" class="w-full p-2 border rounded dark:bg-zinc-800 dark:text-white" />
          </div>

          <div>
            <label class="text-sm font-medium block mb-1">Email</label>
            <input v-model="form.email" type="email" class="w-full p-2 border rounded dark:bg-zinc-800 dark:text-white" />
          </div>

          <div>
            <label class="text-sm font-medium block mb-1">Site web</label>
            <input v-model="form.site_web" type="url" class="w-full p-2 border rounded dark:bg-zinc-800 dark:text-white" />
          </div>

          <div>
            <label class="text-sm font-medium block mb-1">Latitude</label>
            <input v-model="form.latitude" type="number" class="w-full p-2 border rounded dark:bg-zinc-800 dark:text-white" />
          </div>

          <div>
            <label class="text-sm font-medium block mb-1">Longitude</label>
            <input v-model="form.longitude" type="number" class="w-full p-2 border rounded dark:bg-zinc-800 dark:text-white" />
          </div>

          <div>
            <label class="text-sm font-medium block mb-1">Heures d'ouverture</label>
            <input v-model="form.heures_ouverture" class="w-full p-2 border rounded dark:bg-zinc-800 dark:text-white" />
          </div>
        </div>
      </div>

      <!-- Questions spécifiques selon la catégorie -->
      <div v-if="service.category" class="mb-6">
        <h3 class="text-lg font-semibold mb-4">Questions spécifiques - {{ service.category.name }}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <template v-if="service.category.name === 'Soins médicaux'">
            <!-- Champs pour soins médicaux -->
            <div v-for="(value, key) in service.soins_medicaux" :key="key">
              <label class="text-sm font-medium block mb-1">{{ formatLabel(key) }}</label>
              <input 
                v-if="typeof value === 'number'"
                v-model.number="service.soins_medicaux[key]"
                type="number"
                class="w-full p-2 border rounded dark:bg-zinc-800 dark:text-white"
              />
              <input 
                v-else-if="typeof value === 'string'"
                v-model="service.soins_medicaux[key]"
                type="text"
                class="w-full p-2 border rounded dark:bg-zinc-800 dark:text-white"
              />
              <input
                v-else
                v-model="service.soins_medicaux[key]"
                type="checkbox"
                class="mr-2"
              />
            </div>
          </template>
          <!-- Ajouter d'autres templates pour les autres catégories -->
        </div>
      </div>

      <button type="submit" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded">
        Enregistrer
      </button>
    </form>

    <div v-else class="text-center text-gray-500 dark:text-gray-400">
      Chargement du service...
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, reactive } from 'vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id

// Récupération des données du service
const { data: service } = await useApi(`http://localhost:8000/api/question-transversale/${id}/`)
const { data: transversalData } = await useApi(`http://localhost:8000/api/question-transversale/`)

// Form data
const form = reactive({
  nom_structure: service?.value?.nom_structure || '',
  fonction_repondant: service?.value?.fonction_repondant || '',
  nom_repondant: service?.value?.nom_repondant || '',
  telephone_repondant: service?.value?.telephone_repondant || '',
  longitude: service?.value?.longitude || '',
  latitude: service?.value?.latitude || '',
  email: service?.value?.email || '',
  site_web: service?.value?.site_web || '',
  langues_parlees: service?.value?.langues_parlees || {},
  jours_ouverture: service?.value?.jours_ouverture || {},
  heures_ouverture: service?.value?.heures_ouverture || '',
  gratuit: service?.value?.gratuit || {},
  author: service?.value?.author || 0
})

// Helpers
function formatLabel(key: string): string {
  return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

async function submit() {
  try {
    await useApi(`http://localhost:8000/api/question-transversale/${id}/`, {
      method: 'PUT',
      body: JSON.stringify({
        ...form,
        ...service.value
      })
    })

    alert('Service mis à jour avec succès')
    router.push('/collect')
  } catch (error) {
    alert('Erreur lors de la mise à jour du service')
    console.error(error)
  }
}
</script>