<template>
  <div class="max-w-6xl mx-auto">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Mes services enregistrés</h1>
      <NuxtLink to="/collect/addroot" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded transition-colors w-full sm:w-auto text-center">
        Ajouter un service
      </NuxtLink>
    </div>

    <!-- Filtres et recherche -->
    <div class="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Barre de recherche -->
      <div class="col-span-1 sm:col-span-2">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher un service..."
          class="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <!-- Filtre par catégorie -->
      <div class="col-span-1">
        <select
          v-model="categoryFilter"
          class="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="">Toutes les catégories</option>
          <option value="soins_medicaux">Soins médicaux</option>
          <option value="appui_psychosocial">Appui psychosocial</option>
          <option value="police_securite">Police / Sécurité</option>
          <option value="assistance_juridique">Assistance juridique</option>
          <option value="sante_mentale">Santé mentale</option>
          <option value="reinsertion_economique">Réinsertion économique</option>
          <option value="hebergement">Hébergement</option>
        </select>
      </div>

      <!-- Filtre par statut -->
      <div class="col-span-1">
        <select
          v-model="statusFilter"
          class="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="">Tous les statuts</option>
          <option value="true">Actif</option>
          <option value="false">Inactif</option>
        </select>
      </div>
    </div>

    <!-- Résumé des filtres actifs -->
    <div v-if="hasActiveFilters" class="mb-4 flex flex-wrap gap-2">
      <span class="text-sm text-gray-600 dark:text-gray-400">Filtres actifs:</span>
      <span
        v-if="searchQuery"
        class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
      >
        Recherche: "{{ searchQuery }}"
        <button @click="searchQuery = ''" class="ml-1 hover:text-emerald-600">&times;</button>
      </span>
      <span
        v-if="categoryFilter"
        class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      >
        Catégorie: {{ getCategoryLabel(categoryFilter) }}
        <button @click="categoryFilter = ''" class="ml-1 hover:text-blue-600">&times;</button>
      </span>
      <span
        v-if="statusFilter !== ''"
        class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      >
        Statut: {{ statusFilter === 'true' ? 'Actif' : 'Inactif' }}
        <button @click="statusFilter = ''" class="ml-1 hover:text-purple-600">&times;</button>
      </span>
    </div>

    <!-- Vue Desktop/Tablet - Table classique -->
    <div class="hidden md:block overflow-x-auto mt-6 rounded-md shadow">
      <table class="min-w-full bg-white dark:bg-zinc-900 text-sm">
        <thead class="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300">
          <tr>
            <th class="p-3 text-left font-semibold whitespace-nowrap w-1/4">Nom Structure</th>
            <th class="p-3 text-left font-semibold whitespace-nowrap w-1/6">Fonction Répondant</th>
            <th class="p-3 text-left font-semibold whitespace-nowrap w-1/6">Nom Répondant</th>
            <th class="p-3 text-left font-semibold whitespace-nowrap w-1/6">Téléphone</th>
            <th class="p-3 text-left font-semibold whitespace-nowrap w-[15%]">Catégorie</th>
            <th class="p-3 text-left font-semibold whitespace-nowrap w-[10%]">Statut</th>
            <th class="p-3 text-right font-semibold whitespace-nowrap w-[10%]">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="service in paginatedServices"
            :key="service.id"
            class="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
          >
            <td class="p-3 text-gray-800 dark:text-white w-1/4">{{ capitalize(service.nom_structure) }}</td>
            <td class="p-3 text-gray-800 dark:text-white w-1/6">{{ capitalize(service.fonction_repondant) }}</td>
            <td class="p-3 text-gray-800 dark:text-white w-1/6">{{ capitalize(service.nom_repondant) }}</td>
            <td class="p-3 text-gray-800 dark:text-white w-1/6">{{ service.telephone_repondant }}</td>
            <td class="p-3 text-gray-800 dark:text-white font-semibold text-emerald-600 dark:text-emerald-400 w-[15%]">{{ getServiceCategory(service) }}</td>
            <td class="p-3 text-gray-800 dark:text-white w-[10%]">
              <span 
                :class="service.statut ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'" 
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ service.statut ? 'Actif' : 'Inactif' }}
              </span>
            </td>
            <td class="p-3 text-right w-[10%]">
              <div class="flex justify-end gap-1">
                <!-- Voir -->
                <div class="relative group flex items-center justify-center w-8 h-8 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <NuxtLink :to="`/collect/viewAdmin/${service.id}`" class="p-1 text-blue-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </NuxtLink>
                  <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Voir les détails
                  </div>
                </div>

                <!-- Éditer -->
                <div class="relative group flex items-center justify-center w-8 h-8 rounded-md hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors">
                  <NuxtLink :to="`/collect/edit/${service.id}`" class="p-1 text-yellow-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </NuxtLink>
                  <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Modifier le service
                  </div>
                </div>

                <!-- Activer/Désactiver -->
                <div class="relative group flex items-center justify-center w-8 h-8 rounded-md "
                   :class="service.is_active ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'">
                  <button 
                    @click="toggleServiceStatus(service)" 
                    class="p-1"
                  >
                    <svg v-if="service.is_active" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </button>
                  <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {{ service.is_active ? 'Désactiver' : 'Activer' }}
                  </div>
                </div>

                <!-- Supprimer -->
                <div class="relative group flex items-center justify-center w-8 h-8 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <button @click="deleteService(service.id)" class="p-1 text-red-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                  <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Supprimer le service
                  </div>
                </div>
              </div>
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

    <!-- Vue Mobile - Cards -->
    <div class="md:hidden mt-6 space-y-4">
      <div
        v-for="service in paginatedServices"
        :key="service.id"
        class="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-4 border dark:border-gray-700"
      >
        <!-- Header avec nom et statut -->
        <div class="flex justify-between items-start mb-3">
          <h3 class="font-semibold text-gray-800 dark:text-white text-lg">
            {{ capitalize(service.nom_structure) }}
          </h3>
          <span 
            :class="service.statut ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'" 
            class="px-2 py-1 rounded-full text-xs font-medium"
          >
            {{ service.statut ? 'Actif' : 'Inactif' }}
          </span>
        </div>

        <!-- Informations principales -->
        <div class="space-y-2 mb-4">
          <div class="flex items-center text-sm">
            <span class="font-medium text-gray-600 dark:text-gray-400 w-20">Contact:</span>
            <span class="text-gray-800 dark:text-white">{{ capitalize(service.nom_repondant) }}</span>
          </div>
          <div class="flex items-center text-sm">
            <span class="font-medium text-gray-600 dark:text-gray-400 w-20">Tél:</span>
            <span class="text-gray-800 dark:text-white">{{ service.telephone_repondant }}</span>
          </div>
          <div class="flex items-center text-sm">
            <span class="font-medium text-gray-600 dark:text-gray-400 w-20">Catégorie:</span>
            <span class="text-emerald-600 dark:text-emerald-400 font-medium">{{ getServiceCategory(service) }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-2 pt-3 border-t dark:border-gray-700">
          <!-- Voir -->
          <div class="relative group flex items-center justify-center w-9 h-9 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            <NuxtLink :to="`/collect/viewAdmin/${service.id}`" class="p-1 text-blue-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </NuxtLink>
            <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              Voir
            </div>
          </div>

          <!-- Éditer -->
          <div class="relative group flex items-center justify-center w-9 h-9 rounded-md hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors">
            <NuxtLink :to="`/collect/edit/${service.id}`" class="p-1 text-yellow-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </NuxtLink>
            <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              Éditer
            </div>
          </div>

          <!-- Activer/Désactiver -->
          <div class="relative group flex items-center justify-center w-9 h-9 rounded-md"
             :class="service.is_active ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'">
            <button 
              @click="toggleServiceStatus(service)" 
              class="p-1"
            >
              <svg v-if="service.is_active" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </button>
            <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {{ service.is_active ? 'Activer' : 'Désactiver' }}
            </div>
          </div>

          <!-- Supprimer -->
          <div class="relative group flex items-center justify-center w-9 h-9 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <button @click="deleteService(service.id)" class="p-1 text-red-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
            <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              Supprimer
            </div>
          </div>
        </div>
      </div>

      <!-- Message si aucun service -->
      <div v-if="filteredServices.length === 0" class="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8 text-center border dark:border-gray-700">
        <div class="text-gray-500 dark:text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p>Aucun service enregistré par vous.</p>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center items-center gap-4 mt-6">
      <button
        class="px-4 py-2 bg-gray-200 dark:bg-zinc-800 rounded hover:bg-gray-300 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        @click="prevPage"
        :disabled="currentPage === 1"
      >
        Précédent
      </button>
      <span class="text-sm text-gray-700 dark:text-gray-300 px-4">
        Page {{ currentPage }} / {{ totalPages }}
      </span>
      <button
        class="px-4 py-2 bg-gray-200 dark:bg-zinc-800 rounded hover:bg-gray-300 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
  appui_psychosocial: any | null
  police_securite: any | null
  assistance_juridique: any | null
  sante_mentale: any | null
  reinsertion_economique: any | null
  hebergement: any | null
  author: number | null
  is_active: boolean
  statut: boolean
}

interface User {
  id: number
  username: string
}
const user = ref<User | null>(null)
// Fonction pour restaurer l'utilisateur
function restoreUser() {
  if (process.client) {
    const storedUser = localStorage.getItem('user')
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
// Authentification
const userId = user.value?.id

// Appel API
const { data: services } = await useApi<Service[]>('https://wilfriedtayou.pythonanywhere.com/api/question-transversale/', {
  server: false
})

// Format majuscule première lettre
function capitalize(text: string): string {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// Filtres
const searchQuery = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')

// Computed pour vérifier si des filtres sont actifs
const hasActiveFilters = computed(() => {
  return searchQuery.value || categoryFilter.value || statusFilter.value !== ''
})

// Fonction pour obtenir le label d'une catégorie
function getCategoryLabel(category: string): string {
  const categories: { [key: string]: string } = {
    soins_medicaux: 'Soins médicaux',
    appui_psychosocial: 'Appui psychosocial',
    police_securite: 'Police / Sécurité',
    assistance_juridique: 'Assistance juridique',
    sante_mentale: 'Santé mentale',
    reinsertion_economique: 'Réinsertion économique',
    hebergement : 'Hébergement'
  }
  return categories[category] || category
}

// Filtrer les services
const filteredServices = computed(() => {
  let filtered = services.value || []

  // Filtre par auteur
  if (user.value?.username !== 'admin' && user.value?.username !== 'tayou') {
    filtered = filtered.filter(service => service.author === user.value?.id)
  }

  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(service => 
      service.nom_structure.toLowerCase().includes(query) ||
      service.nom_repondant.toLowerCase().includes(query) ||
      service.fonction_repondant.toLowerCase().includes(query) ||
      service.telephone_repondant.includes(query)
    )
  }

  // Filtre par catégorie
  if (categoryFilter.value) {
    filtered = filtered.filter(service => service[categoryFilter.value as keyof Service])
  }

  // Filtre par statut
  if (statusFilter.value !== '') {
    const isActive = statusFilter.value === 'true'
    filtered = filtered.filter(service => service.statut === isActive)
  }

  // Trier par ordre décroissant (par ID)
  filtered = filtered.sort((a, b) => b.id - a.id)

  return filtered
})

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

const showDeletePopup = ref(false)
const serviceToDelete = ref<number | null>(null)

function confirmDeleteService(id: number) {
  serviceToDelete.value = id
  showDeletePopup.value = true
}

function deleteService(id: number) {
  console.log('Suppression du service ID:', id)
  // TODO : appel API + rechargement
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
      service.statut = newStatus
      
      // Appel API pour mettre à jour le statut
      await $fetch(`https://wilfriedtayou.pythonanywhere.com/api/question-transversale/${service.id}/`, {
        method: 'PATCH',
        body: { 
          is_active: newStatus,
          statut: newStatus
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        }
      })
      
      // Notification de succès
      showSuccessPopup(`Le service a été ${newStatus ? 'activé' : 'désactivé'} avec succès.`)
    }
  } catch (error) {
    // Rétablir l'état précédent en cas d'erreur
    service.is_active = !service.is_active
    service.statut = !service.is_active
    console.error('Erreur lors de la mise à jour du statut:', error)
    alert('Une erreur est survenue lors de la mise à jour du statut du service.')
  }
}

function getServiceCategory(service: Service): string {
  if (!service) return 'Non spécifié';
  if (service.soins_medicaux) return 'Soins médicaux';
  if (service.appui_psychosocial) return 'Appui psychosocial';
  if (service.police_securite) return 'Police / Sécurité';
  if (service.assistance_juridique) return 'Assistance juridique';
  if (service.sante_mentale) return 'Santé mentale';
  if (service.reinsertion_economique) return 'Réinsertion économique';
  if (service.hebergement) return 'Hébergement';
  return 'Non spécifié';
}
function showSuccessPopup(message: string) {
  // Display a success popup to the user
  const successPopup = document.createElement('div');
  successPopup.textContent = message;
  successPopup.style.position = 'fixed';
  successPopup.style.bottom = '20px';
  successPopup.style.right = '20px';
  successPopup.style.backgroundColor = '#4caf50';
  successPopup.style.color = 'white';
  successPopup.style.padding = '10px 20px';
  successPopup.style.borderRadius = '5px';
  successPopup.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
  successPopup.style.zIndex = '1000';
  document.body.appendChild(successPopup);

  setTimeout(() => {
    successPopup.style.opacity = '0';
    successPopup.style.transition = 'opacity 0.5s';
    setTimeout(() => document.body.removeChild(successPopup), 500);
  }, 3000);
}
</script>