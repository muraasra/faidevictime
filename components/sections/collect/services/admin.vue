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
            <th class="p-3 text-left font-semibold whitespace-nowrap">Statut</th>
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
            <td class="p-3 text-gray-800 dark:text-white">{{ service.soins_medicaux ? 'Soins Médicaux' : 'Autre' }}</td>
            <td class="p-3 text-gray-800 dark:text-white">
              <span 
                :class="service.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'" 
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ service.is_active ? 'Actif' : 'Inactif' }}
              </span>
            </td>
            <td class="p-3 text-right space-x-2 whitespace-nowrap">
              <NuxtLink :to="`/collect/viewAdmin/${service.id}`" class="text-blue-600 hover:underline">Voir</NuxtLink>
              <NuxtLink :to="`/collect/edit/${service.id}`" class="text-yellow-600 hover:underline">Éditer</NuxtLink>
              <button 
                @click="toggleServiceStatus(service)" 
                :class="service.is_active ? 'text-red-600' : 'text-green-600'"
                class="hover:underline"
              >
                {{ service.is_active ? 'Désactiver' : 'Activer' }}
              </button>
              <button @click="deleteService(service.id)" class="text-red-600 hover:underline">Supprimer</button>
            </td>
          </tr>
          <tr v-if="filteredServices.length === 0">
            <td colspan="7" class="p-4 text-center text-gray-500 dark:text-gray-400">
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
  is_active: boolean // Ajout du champ pour le statut
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

// Changer le statut d'un service (actif/inactif)
async function toggleServiceStatus(service: Service) {
  try {
    const newStatus = !service.is_active
    const confirmMessage = newStatus 
      ? `Voulez-vous vraiment activer le service "${service.nom_structure}" ?` 
      : `Voulez-vous vraiment désactiver le service "${service.nom_structure}" ?`
    
    if (confirm(confirmMessage)) {
      // Mise à jour optimiste de l'UI
      service.is_active = newStatus
      
      // Appel API pour mettre à jour le statut
      await $fetch(`http://localhost:8000/api/question-transversale/${service.id}/`, {
        method: 'PATCH',
        body: { is_active: newStatus },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        }
      })
      
      // Notification de succès
      alert(`Le service a été ${newStatus ? 'activé' : 'désactivé'} avec succès.`)
    }
  } catch (error) {
    // Rétablir l'état précédent en cas d'erreur
    service.is_active = !service.is_active
    console.error('Erreur lors de la mise à jour du statut:', error)
    alert('Une erreur est survenue lors de la mise à jour du statut du service.')
  }
}
</script>