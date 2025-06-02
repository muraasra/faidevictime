<template>
  <div class="min-h-screen bg-gray-50 dark:bg-zinc-900">
    <!-- En-tête -->
    <div class="bg-white dark:bg-zinc-800 shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Collecte des demandes</h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Visualisez et gérez toutes les demandes d'assistance reçues
        </p>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Filtres -->
      <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-4 mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Filtre par type de situation -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type de situation
            </label>
            <select 
              v-model="filters.situationType"
              class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-zinc-700 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            >
              <option value="">Tous</option>
              <option value="urgence">Urgence</option>
              <option value="harcelement">Harcèlement</option>
              <option value="violence">Violence</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <!-- Filtre par statut -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Statut
            </label>
            <select 
              v-model="filters.status"
              class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-zinc-700 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            >
              <option value="">Tous</option>
              <option value="en_attente">En attente</option>
              <option value="en_cours">En cours</option>
              <option value="termine">Terminé</option>
            </select>
          </div>

          <!-- Filtre par mode de contact -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mode de contact
            </label>
            <select 
              v-model="filters.contactPreference"
              class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-zinc-700 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            >
              <option value="">Tous</option>
              <option value="chat">Chat</option>
              <option value="email">Email</option>
              <option value="phone">Téléphone</option>
            </select>
          </div>

          <!-- Recherche -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Recherche
            </label>
            <input 
              type="text"
              v-model="filters.search"
              placeholder="Rechercher..."
              class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-zinc-700 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            >
          </div>
        </div>
      </div>

      <!-- Tableau des demandes -->
      <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-sm overflow-hidden">
        <!-- Version mobile -->
        <div class="md:hidden">
          <div v-for="request in paginatedRequests" :key="request.id" class="p-4 border-b dark:border-gray-700">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">
                  {{ request.first_name || 'Anonyme' }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(request.created_at) }}
                </p>
              </div>
              <span 
                class="px-2 py-1 text-xs font-semibold rounded-full"
                :class="getStatusClass(request.status)"
              >
                {{ formatStatus(request.status) }}
              </span>
            </div>
            <div class="mt-2 space-y-1">
              <p class="text-sm text-gray-600 dark:text-gray-300">
                <span class="font-medium">Type:</span> {{ formatSituationType(request.situation_type) }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                <span class="font-medium">Contact:</span> {{ formatContactPreference(request.contact_preference) }}
              </p>
            </div>
            <div class="mt-3 flex space-x-2">
              <button 
                @click="viewDetails(request)"
                class="flex-1 px-3 py-1.5 text-sm text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300 border border-emerald-600 dark:border-emerald-400 rounded-md"
              >
                Voir détails
              </button>
              <button 
                @click="openStatusModal(request)"
                class="flex-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-600 dark:border-blue-400 rounded-md"
              >
                Changer statut
              </button>
            </div>
          </div>
        </div>

        <!-- Version desktop -->
        <div class="hidden md:block overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-zinc-700">
              <tr>
                <th 
                  v-for="header in headers" 
                  :key="header.key"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  @click="sortBy(header.key)"
                >
                  <div class="flex items-center space-x-1">
                    <span>{{ header.label }}</span>
                    <span v-if="sortKey === header.key" class="text-emerald-500">
                      {{ sortOrder === 'asc' ? '↑' : '↓' }}
                    </span>
                  </div>
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="request in paginatedRequests" :key="request.id" class="hover:bg-gray-50 dark:hover:bg-zinc-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ request.first_name || 'Anonyme' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatSituationType(request.situation_type) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatContactPreference(request.contact_preference) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getStatusClass(request.status)"
                  >
                    {{ formatStatus(request.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(request.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button 
                    @click="viewDetails(request)"
                    class="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    Voir détails
                  </button>
                  <button 
                    @click="openStatusModal(request)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Changer statut
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-white dark:bg-zinc-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button 
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <button 
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Affichage de 
                <span class="font-medium">{{ paginationStart }}</span>
                à
                <span class="font-medium">{{ paginationEnd }}</span>
                sur
                <span class="font-medium">{{ totalItems }}</span>
                résultats
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button 
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Précédent</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                <button 
                  v-for="page in displayedPages" 
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    currentPage === page 
                      ? 'z-10 bg-emerald-50 dark:bg-emerald-900 border-emerald-500 dark:border-emerald-400 text-emerald-600 dark:text-emerald-300'
                      : 'bg-white dark:bg-zinc-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-600',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                  ]"
                >
                  {{ page }}
                </button>
                <button 
                  @click="currentPage++"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Suivant</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de détails -->
    <div v-if="selectedRequest" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-zinc-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                Détails de la demande
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                ID: {{ selectedRequest.id }}
              </p>
            </div>
            <button 
              @click="selectedRequest = null"
              class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="space-y-6">
            <!-- Informations personnelles -->
            <div class="bg-gray-50 dark:bg-zinc-700/50 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Informations personnelles</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Prénom</p>
                  <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ selectedRequest.first_name || 'Non renseigné' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Âge</p>
                  <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ selectedRequest.age || 'Non renseigné' }}</p>
                </div>
              </div>
            </div>

            <!-- Situation -->
            <div class="bg-gray-50 dark:bg-zinc-700/50 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Situation</h4>
              <div class="space-y-4">
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Type de situation</p>
                  <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ formatSituationType(selectedRequest.situation_type) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Message</p>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{{ selectedRequest.message }}</p>
                </div>
              </div>
            </div>

            <!-- Contact -->
            <div class="bg-gray-50 dark:bg-zinc-700/50 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Contact</h4>
              <div class="space-y-4">
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Mode de contact préféré</p>
                  <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ formatContactPreference(selectedRequest.contact_preference) }}</p>
                </div>
                <div v-if="selectedRequest.contact_preference === 'email'">
                  <p class="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ selectedRequest.email }}</p>
                </div>
                <div v-if="selectedRequest.contact_preference === 'phone'">
                  <p class="text-sm text-gray-500 dark:text-gray-400">Téléphone</p>
                  <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ selectedRequest.phone }}</p>
                </div>
              </div>
            </div>

            <!-- Statut -->
            <div class="bg-gray-50 dark:bg-zinc-700/50 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Statut actuel</h4>
              <div>
                <span 
                  class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full"
                  :class="getStatusClass(selectedRequest.status)"
                >
                  {{ formatStatus(selectedRequest.status) }}
                </span>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button 
              @click="selectedRequest = null"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de changement de statut -->
    <div v-if="statusModalRequest" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-zinc-800 rounded-lg max-w-md w-full">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Changer le statut
            </h3>
            <button 
              @click="statusModalRequest = null"
              class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nouveau statut
            </label>
            <select 
              v-model="newStatus"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-zinc-700 dark:text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
            >
              <option value="en_attente">En attente</option>
              <option value="en_cours">En cours</option>
              <option value="termine">Terminé</option>
            </select>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button 
              @click="statusModalRequest = null"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600"
            >
              Annuler
            </button>
            <button 
              @click="updateRequestStatus"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'root'
})

const router = useRouter()
const API_BASE = 'https://wilfriedtayou.pythonanywhere.com/assistance'

// État
const requests = ref([])
const selectedRequest = ref(null)
const currentPage = ref(1)
const itemsPerPage = 10
const sortKey = ref('created_at')
const sortOrder = ref('desc')

// Filtres
const filters = ref({
  situationType: '',
  status: '',
  contactPreference: '',
  search: ''
})

// En-têtes du tableau
const headers = [
  { key: 'first_name', label: 'Prénom' },
  { key: 'situation_type', label: 'Type de situation' },
  { key: 'contact_preference', label: 'Mode de contact' },
  { key: 'status', label: 'Statut' },
  { key: 'created_at', label: 'Date' }
]

// État pour le modal de statut
const statusModalRequest = ref(null)
const newStatus = ref('')

// Charger les demandes
const loadRequests = async () => {
  try {
    const response = await $fetch(`${API_BASE}/requests/`, {
      credentials: 'include'
    })
    requests.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Erreur lors du chargement des demandes:', error)
  }
}

// Filtrer et trier les demandes
const filteredRequests = computed(() => {
  let result = [...requests.value]

  // Appliquer les filtres
  if (filters.value.situationType) {
    result = result.filter(r => r.situation_type === filters.value.situationType)
  }
  if (filters.value.status) {
    result = result.filter(r => r.status === filters.value.status)
  }
  if (filters.value.contactPreference) {
    result = result.filter(r => r.contact_preference === filters.value.contactPreference)
  }
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(r => 
      (r.first_name && r.first_name.toLowerCase().includes(search)) ||
      (r.message && r.message.toLowerCase().includes(search))
    )
  }

  // Trier
  result.sort((a, b) => {
    const aValue = a[sortKey.value]
    const bValue = b[sortKey.value]
    const modifier = sortOrder.value === 'asc' ? 1 : -1
    
    if (aValue < bValue) return -1 * modifier
    if (aValue > bValue) return 1 * modifier
    return 0
  })

  return result
})

// Pagination
const totalItems = computed(() => filteredRequests.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))
const paginationStart = computed(() => ((currentPage.value - 1) * itemsPerPage) + 1)
const paginationEnd = computed(() => Math.min(currentPage.value * itemsPerPage, totalItems.value))
const displayedPages = computed(() => {
  const pages = []
  const maxPages = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxPages / 2))
  let end = Math.min(totalPages.value, start + maxPages - 1)
  
  if (end - start + 1 < maxPages) {
    start = Math.max(1, end - maxPages + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Paginer les résultats
const paginatedRequests = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredRequests.value.slice(start, end)
})

// Trier
const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

// Formater les valeurs
const formatSituationType = (type) => {
  const types = {
    urgence: 'Urgence',
    harcelement: 'Harcèlement',
    violence: 'Violence',
    autre: 'Autre'
  }
  return types[type] || type
}

const formatContactPreference = (preference) => {
  const preferences = {
    chat: 'Chat en ligne',
    email: 'Email',
    phone: 'Téléphone'
  }
  return preferences[preference] || preference
}

const formatStatus = (status) => {
  const statuses = {
    en_attente: 'En attente',
    en_cours: 'En cours',
    terminee: 'Terminée'
  }
  return statuses[status] || status
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Obtenir la classe CSS pour le statut
const getStatusClass = (status) => {
  const classes = {
    en_attente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    en_cours: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    terminee: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

// Actions
const viewDetails = (request) => {
  selectedRequest.value = { ...request }
}

const openStatusModal = (request) => {
  statusModalRequest.value = { ...request }
  newStatus.value = request.status
}

const updateRequestStatus = async () => {
  try {
    await $fetch(`${API_BASE}/requests/${statusModalRequest.value.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus.value }),
      credentials: 'include'
    })
    // Mettre à jour la liste des demandes
    await loadRequests()
    // Fermer le modal
    statusModalRequest.value = null
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error)
    alert('Erreur lors de la mise à jour du statut')
  }
}

// Charger les données au montage
onMounted(() => {
  loadRequests()
})
</script>

<style scoped>
/* Styles pour le mode sombre */
:deep(.dark) {
  color-scheme: dark;
}

/* Styles pour la scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Styles pour le mode sombre */
:deep(.dark) ::-webkit-scrollbar-track {
  background: #1e293b;
}

:deep(.dark) ::-webkit-scrollbar-thumb {
  background: #475569;
}

:deep(.dark) ::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style> 