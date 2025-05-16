<template>
  <div class="max-w-6xl mx-auto p-4">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Mes services enregistrés</h1>
      <NuxtLink to="/collect/addroot" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded transition-colors w-full sm:w-auto text-center">
        Ajouter un service
      </NuxtLink>
    </div>

    <div class="overflow-x-auto mt-6 rounded-md shadow">
      <table class="min-w-full bg-white dark:bg-zinc-900 text-sm">
        <thead class="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300">
          <tr>
            <th class="p-3 text-left font-semibold whitespace-nowrap">Nom Structure</th>
            <th class="p-3 text-left font-semibold whitespace-nowrap">Fonction Répondant</th>
            <th class="p-3 text-left font-semibold whitespace-nowrap">Nom Répondant</th>
            <th class="p-3 text-left font-semibold whitespace-nowrap">Téléphone Répondant</th>
            <th class="p-3 text-left font-semibold whitespace-nowrap">Catégorie</th>
            <th class="p-3 text-right font-semibold whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="service in paginatedServices"
            :key="service.id"
            class="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
          >
            <td class="p-3 text-gray-800 dark:text-white">{{ capitalize(service.nom_structure) }}</td>
            <td class="p-3 text-gray-800 dark:text-white">{{ capitalize(service.fonction_repondant) }}</td>
            <td class="p-3 text-gray-800 dark:text-white">{{ capitalize(service.nom_repondant) }}</td>
            <td class="p-3 text-gray-800 dark:text-white">{{ service.telephone_repondant }}</td>
            <td class="p-3 text-gray-800 dark:text-white font-semibold text-emerald-600 dark:text-emerald-400">{{ getServiceCategory(service) }}</td>
            <td class="p-3 text-right space-x-2 whitespace-nowrap">
              <NuxtLink :to="`/collect/view/${service.id}`" class="text-blue-600 hover:underline">Voir</NuxtLink>
              <NuxtLink :to="`/collect/edit/${service.id}`" class="text-yellow-600 hover:underline">Éditer</NuxtLink>
              <button @click="deleteService(service.id)" class="text-red-600 hover:underline">Supprimer</button>
            </td>
          </tr>
          <tr v-if="filteredServices.length === 0">
            <td colspan="6" class="p-4 text-center text-gray-500 dark:text-gray-400">
              Aucun service enregistré par vous.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center items-center gap-4 mt-6">
      <button
        class="px-4 py-1 bg-gray-200 dark:bg-zinc-800 rounded hover:bg-gray-300 dark:hover:bg-zinc-700"
        @click="prevPage"
        :disabled="currentPage === 1"
      >
        Précédent
      </button>
      <span class="text-sm text-gray-700 dark:text-gray-300">
        Page {{ currentPage }} / {{ totalPages }}
      </span>
      <button
        class="px-4 py-1 bg-gray-200 dark:bg-zinc-800 rounded hover:bg-gray-300 dark:hover:bg-zinc-700"
        @click="nextPage"
        :disabled="currentPage === totalPages"
      >
        Suivant
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

// Typage
type SoinsMedicaux = {
  id: number
  protocole_viol: boolean
}

type Service = {
  id: number
  nom_structure: string
  fonction_repondant: string
  nom_repondant: string
  telephone_repondant: string
  soins_medicaux: SoinsMedicaux | null
  author: number | null
}

// Authentification
const auth = useAuthStore()
const userId = auth.user?.id

// Appel API
const { data: services } = await useApi<Service[]>('http://localhost:8000/api/question-transversale/', {
  server: false
})

// Format majuscule première lettre
function capitalize(text: string): string {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// Filtrer les services de l'utilisateur connecté
const filteredServices = computed(() =>
  (services.value || [])
)

// Pagination
const itemsPerPage = 10
const currentPage = ref(1)

const totalPages = computed(() =>
  Math.ceil(filteredServices.value.length / itemsPerPage)
)

const paginatedServices = computed(() =>
  filteredServices.value.slice(
    (currentPage.value - 1) * itemsPerPage,
    currentPage.value * itemsPerPage
  )
)

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Supprimer un service (à connecter plus tard)
function deleteService(id: number) {
  if (confirm('Voulez-vous vraiment supprimer ce service ?')) {
    console.log('Suppression du service ID:', id)
    // TODO : appel API + rechargement
  }
}

function getServiceCategory(service: any): string {
  if (!service) return 'Non spécifié';
  if (service.soins_medicaux) return 'Soins médicaux';
  if (service.appui_psychosocial) return 'Appui psychosocial';
  if (service.police_securite) return 'Police / Sécurité';
  if (service.assistance_juridique) return 'Assistance juridique';
  if (service.sante_mentale) return 'Santé mentale';
  if (service.reinsertion_economique) return 'Réinsertion économique';
  return 'Non spécifié';
}
</script>
