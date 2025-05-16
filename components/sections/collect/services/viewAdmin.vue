<template>
  <div class="max-w-5xl mx-auto p-4 sm:p-6">
    <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Détails de la structure</h1>
      
      <div class="mt-4 sm:mt-0 flex items-center space-x-2">
        <NuxtLink :to="`/collect/edit/${service?.id}`" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm">
          Modifier
        </NuxtLink>
        <span 
          v-if="service" 
          :class="service.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'" 
          class="px-3 py-1.5 rounded-md text-sm font-medium"
        >
          {{ service.is_active ? 'Actif' : 'Inactif' }}
        </span>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div v-else-if="service" class="space-y-8">
      <!-- Informations générales -->
      <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden">
        <div class="bg-gray-50 dark:bg-zinc-700 px-4 py-3 border-b dark:border-zinc-600">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Informations générales</h2>
        </div>
        <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <p class="flex justify-between border-b dark:border-zinc-700 pb-2">
              <span class="font-medium">Nom de la structure:</span>
              <span>{{ service.nom_structure }}</span>
            </p>
            <p class="flex justify-between border-b dark:border-zinc-700 pb-2">
              <span class="font-medium">Catégorie:</span>
              <span class="font-semibold text-emerald-600 dark:text-emerald-400">
                {{ getServiceCategory(service) }}
              </span>
            </p>
            <p class="flex justify-between border-b dark:border-zinc-700 pb-2">
              <span class="font-medium">Fonction du répondant:</span>
              <span>{{ service.fonction_repondant }}</span>
            </p>
            <p class="flex justify-between border-b dark:border-zinc-700 pb-2">
              <span class="font-medium">Nom du répondant:</span>
              <span>{{ service.nom_repondant }}</span>
            </p>
            <p class="flex justify-between border-b dark:border-zinc-700 pb-2">
              <span class="font-medium">Téléphone:</span>
              <span>{{ service.telephone_repondant }}</span>
            </p>
          </div>
          <div class="space-y-2">
            <p class="flex justify-between border-b dark:border-zinc-700 pb-2">
              <span class="font-medium">Email:</span>
              <span>{{ service.email || 'Non spécifié' }}</span>
            </p>
            <p class="flex justify-between border-b dark:border-zinc-700 pb-2">
              <span class="font-medium">Site web:</span>
              <span>{{ service.site_web || 'Non spécifié' }}</span>
            </p>
            <p class="flex justify-between border-b dark:border-zinc-700 pb-2">
              <span class="font-medium">Coordonnées:</span>
              <span>{{ service.latitude }}, {{ service.longitude }}</span>
            </p>
            <p class="flex justify-between border-b dark:border-zinc-700 pb-2">
              <span class="font-medium">Langues parlées:</span>
              <span>{{ formatArrayField(service.langues_parlees) }}</span>
            </p>
          </div>
          
          <div class="col-span-1 md:col-span-2">
            <p class="flex justify-between border-b dark:border-zinc-700 pb-2">
              <span class="font-medium">Jours d'ouverture:</span>
              <span>{{ formatArrayField(service.jours_ouverture) }}</span>
            </p>
            <p class="flex justify-between border-b dark:border-zinc-700 pb-2">
              <span class="font-medium">Heures d'ouverture:</span>
              <span>{{ service.heures_ouverture || 'Non spécifié' }}</span>
            </p>
            <p class="flex justify-between pb-2">
              <span class="font-medium">Gratuité du service:</span>
              <span>{{ service.gratuit || 'Non spécifié' }}</span>
            </p>
          </div>
        </div>
      </div>
       

      <!-- Services spécifiques -->
      <template v-if="service.soins_medicaux">
        <ServiceMedical :service="service" />
      </template>

      <template v-if="service.appui_psychosocial">
        <ServicePsychosocial :service="service" />
      </template>

      <template v-if="service.police_securite">
        <ServicePolice :service="service" />
      </template>

      <template v-if="service.assistance_juridique">
        <ServiceJuridique :service="service" />
      </template>

      <template v-if="service.sante_mentale">
        <ServiceSanteMentale :service="service" />
      </template>

      <template v-if="service.reinsertion_economique">
        <ServiceReinsertion :service="service" />
      </template>

      <!-- Boutons d'action -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center mt-8">
        <NuxtLink :to="`/collect`" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-center">
          Retour à la liste
        </NuxtLink>
        <NuxtLink :to="`/collect/edit/${service.id}`" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-center">
          Modifier
        </NuxtLink>
        <button 
          @click="toggleServiceStatus" 
          :class="service.is_active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'"
          class="text-white px-4 py-2 rounded text-center"
        >
          {{ service.is_active ? 'Désactiver' : 'Activer' }}
        </button>
      </div>
    </div>

    <div v-else class="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 text-center text-gray-500 dark:text-gray-400">
      Impossible de charger les détails du service. Vérifiez la connexion ou réessayez plus tard.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Import des composants de service
import ServiceMedical from './ServiceMedical.vue'
import ServicePsychosocial from './ServicePsychosocial.vue'
import ServicePolice from './ServicePolice.vue'
import ServiceJuridique from './ServiceJuridique.vue'
import ServiceSanteMentale from './ServiceSanteMentale.vue'
import ServiceReinsertion from './ServiceReinsertion.vue'

export type Service = {
  id: number
  soins_medicaux: any | null
  appui_psychosocial: any | null
  police_securite: any | null
  assistance_juridique: any | null
  sante_mentale: any | null
  reinsertion_economique: any | null
  nom_structure: string
  fonction_repondant: string
  nom_repondant: string
  telephone_repondant: string
  longitude: string
  latitude: string
  email: string
  site_web: string
  langues_parlees: string[]
  jours_ouverture: string[]
  heures_ouverture: string
  gratuit: string
  is_active: boolean
  statut: boolean
}

const route = useRoute()
const auth = useAuthStore()
const id = route.params.id
const loading = ref(true)

const { data: service } = await useApi<Service>(`http://localhost:8000/api/question-transversale/${id}/`, {
  server: false,
  onResponse: () => {
    loading.value = false
  },
  onResponseError: () => {
    loading.value = false
  }
})

function formatArrayField(arr: string[] | undefined): string {
  if (!arr || arr.length === 0) return 'Non spécifié'
  return arr.join(', ')
}

async function toggleServiceStatus() {
  try {
    if (!service.value) return
    
    const newStatus = !service.value.is_active
    const confirmMessage = newStatus 
      ? `Voulez-vous vraiment activer le service "${service.value.nom_structure}" ?` 
      : `Voulez-vous vraiment désactiver le service "${service.value.nom_structure}" ?`
    
    if (confirm(confirmMessage)) {
      // Mise à jour optimiste de l'UI
      service.value.is_active = newStatus
      service.value.statut = newStatus // Mettre à jour aussi le champ statut
      
      await $fetch(`http://localhost:8000/api/question-transversale/${service.value.id}/`, {
        method: 'PATCH',
        body: { 
          is_active: newStatus,
          statut: newStatus // Envoyer aussi le champ statut
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        }
      })
      
      alert(`Le service a été ${newStatus ? 'activé' : 'désactivé'} avec succès.`)
    }
  } catch (error) {
    if (service.value) {
      // Rétablir l'état précédent en cas d'erreur
      service.value.is_active = !service.value.is_active
      service.value.statut = !service.value.is_active // Rétablir aussi le champ statut
    }
    console.error('Erreur lors de la mise à jour du statut:', error)
    alert('Une erreur est survenue lors de la mise à jour du statut du service.')
  }
}

// Ajouter la fonction pour déterminer la catégorie avec un retour par défaut
function getServiceCategory(service: Service): string {
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