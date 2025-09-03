<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header avec navigation -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <button @click="$router.push('/')" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 mr-3">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7m-9 2v6m0 0h4m-4 0a2 2 0 01-2-2v-4a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2z" />
              </svg>
            </button>
            <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">Formations & Sensibilisation</h1>
          </div>
          <button @click="toggleDarkMode" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg v-if="isDarkMode" class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Vue liste des formations -->
    <div v-if="!selectedFormation" class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- En-tête -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Formations & Sensibilisation
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Découvrez nos formations éducatives pour comprendre, prévenir et agir contre les violences. 
          Chaque formation est conçue pour vous informer et vous donner les outils nécessaires.
        </p>
      </div>

      <!-- Filtres par catégorie -->
      <div class="flex flex-wrap justify-center gap-2 mb-8">
        <button
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = selectedCategory === category ? null : category"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            selectedCategory === category
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
        >
          {{ category }}
        </button>
      </div>

      <!-- Indicateur de chargement -->
      <div v-if="isLoadingFormations" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-400">Chargement des formations...</span>
      </div>

      <!-- Liste des formations -->
      <div v-else-if="filteredFormations.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="formation in filteredFormations"
          :key="formation.id"
          @click="selectFormation(formation)"
          class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer group"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="text-4xl">{{ formation.icon }}</div>
            <div class="flex items-center space-x-2">
              <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                {{ formation.category }}
              </span>
              <span class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                {{ formation.duration }}
              </span>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {{ formation.title }}
          </h3>
          
          <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
            {{ formation.description }}
          </p>
          
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ formation.sections.length }} sections
            </span>
            <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Message si aucune formation -->
      <div v-else class="text-center py-12">
        <div class="text-6xl mb-4">📚</div>
        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Aucune formation trouvée
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          Les formations seront bientôt disponibles.
        </p>
      </div>
    </div>

    <!-- Vue détaillée d'une formation -->
    <div v-else class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- En-tête de la formation -->
      <div class="mb-8">
        <button 
          @click="selectedFormation = null"
          class="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Retour aux formations
        </button>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="flex items-start justify-between mb-4">
            <div class="text-5xl mr-4">{{ selectedFormation.icon }}</div>
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
                  {{ selectedFormation.category }}
                </span>
                <span class="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-medium rounded-full">
                  {{ selectedFormation.duration }}
                </span>
              </div>
              <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                {{ selectedFormation.title }}
              </h2>
              <p class="text-lg text-gray-600 dark:text-gray-400">
                {{ selectedFormation.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation des sections -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div class="flex overflow-x-auto space-x-2">
          <button
            v-for="(section, index) in selectedFormation.sections"
            :key="section.id"
            @click="selectedSection = section.id"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              selectedSection === section.id
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            {{ index + 1 }}. {{ section.title }}
          </button>
        </div>
      </div>

      <!-- Contenu de la section -->
      <div v-if="currentSection" class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          {{ currentSection.title }}
        </h3>
        
        <div class="prose prose-lg max-w-none dark:prose-invert">
          <div class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {{ currentSection.content }}
          </div>
        </div>
      </div>

      <!-- Navigation entre sections -->
      <div class="flex justify-between mt-8">
        <button
          v-if="previousSection"
          @click="selectedSection = previousSection.id"
          class="flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          {{ previousSection.title }}
        </button>
        
        <div v-else></div>
        
        <button
          v-if="nextSection"
          @click="selectedSection = nextSection.id"
          class="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {{ nextSection.title }}
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Lien vers services -->
      <div class="mt-8 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 text-center">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
          Besoin d'aide immédiate ?
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Consultez notre carte interactive pour trouver les services adaptés à votre situation
        </p>
        <button 
          @click="$router.push('/services')"
          class="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Voir les services disponibles
        </button>
      </div>

      <!-- Avertissement -->
      <div class="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
        <div class="flex items-start">
          <svg class="w-6 h-6 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h4 class="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">Important</h4>
            <p class="text-sm text-yellow-700 dark:text-yellow-300">
              Ces informations sont à titre informatif et éducatif. Elles ne remplacent pas l'avis d'un professionnel de santé, d'un juriste ou d'un psychologue. En cas de situation d'urgence, contactez immédiatement les services compétents.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({ layout: 'default' })

// Types
interface Section {
  id: string
  title: string
  content: string
}

interface Formation {
  id: string
  title: string
  description: string
  icon: string
  category: string
  duration: string
  sections: Section[]
}

// État réactif
const isDarkMode = ref(false)
const selectedFormation = ref<Formation | null>(null)
const selectedSection = ref<string | null>(null)
const selectedCategory = ref<string | null>(null)
const formations = ref<Formation[]>([])
const isLoadingFormations = ref(false)

// Computed
const categories = computed(() => {
  const cats = [...new Set(formations.value.map(f => f.category))]
  return ['Toutes', ...cats]
})

const filteredFormations = computed(() => {
  if (!selectedCategory.value || selectedCategory.value === 'Toutes') {
    return formations.value
  }
  return formations.value.filter(f => f.category === selectedCategory.value)
})

const currentSection = computed(() => {
  if (!selectedFormation.value || !selectedSection.value) return null
  return selectedFormation.value.sections.find(s => s.id === selectedSection.value)
})

const currentSectionIndex = computed(() => {
  if (!selectedFormation.value || !selectedSection.value) return -1
  return selectedFormation.value.sections.findIndex(s => s.id === selectedSection.value)
})

const previousSection = computed(() => {
  const index = currentSectionIndex.value
  if (index <= 0 || !selectedFormation.value) return null
  return selectedFormation.value.sections[index - 1]
})

const nextSection = computed(() => {
  const index = currentSectionIndex.value
  if (index < 0 || !selectedFormation.value || index >= selectedFormation.value.sections.length - 1) return null
  return selectedFormation.value.sections[index + 1]
})

// Méthodes
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
  }
  document.documentElement.classList.toggle('dark', isDarkMode.value)
}

const selectFormation = (formation: Formation) => {
  selectedFormation.value = formation
  selectedSection.value = formation.sections[0]?.id || null
}

const loadFormations = async () => {
  isLoadingFormations.value = true
  try {
    const data = await $fetch('/formations.json') as { formations: Formation[] }
    if (data && Array.isArray(data.formations)) {
      formations.value = data.formations
    } else {
      console.error('Format de données invalide')
      formations.value = []
    }
  } catch (error) {
    console.error('Erreur lors du chargement des formations:', error)
    // Données de fallback en cas d'erreur
    formations.value = []
  } finally {
    isLoadingFormations.value = false
  }
}

// Lifecycle
onMounted(async () => {
  if (typeof window !== 'undefined') {
    isDarkMode.value = localStorage.getItem('theme') === 'dark'
  }
  document.documentElement.classList.toggle('dark', isDarkMode.value)
  await loadFormations()
})
</script>

<style scoped>
/* Animations et transitions */
.transition-colors {
  transition: background-color 0.2s ease, color 0.2s ease;
}

/* Scrollbar personnalisée */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.dark .overflow-x-auto::-webkit-scrollbar-track {
  background: #374151;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb {
  background: #6b7280;
}

/* Line clamp pour la description */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Responsive */
@media (max-width: 768px) {
  .grid.gap-6.md\\:grid-cols-2.lg\\:grid-cols-3 {
    grid-template-columns: 1fr;
  }
  
  .flex.justify-between {
    flex-direction: column;
    gap: 1rem;
  }
  
  .flex.justify-between button {
    width: 100%;
    justify-content: center;
  }
}
</style>