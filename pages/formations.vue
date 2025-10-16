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
      <div v-else-if="filteredFormations.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
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

      <!-- Section Documents PDF -->
      <div v-if="documents.length > 0" class="mb-8">
        <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Documents & Ressources PDF
        </h3>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="document in documents"
            :key="document.id"
            class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div class="flex items-center space-x-2">
                <span class="px-2 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary text-xs font-medium rounded-full">
                  {{ document.category }}
                </span>
                <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
                  {{ document.size }}
                </span>
              </div>
            </div>
            
            <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
              {{ document.title }}
            </h3>
            
            <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {{ document.description }}
            </p>
            
            <div class="flex gap-2">
              <button @click="openPreview(document)"
                class="flex items-center text-white px-4 py-2 bg-primary gap-2 text-sm rounded-lg hover:bg-emerald-600 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                Aperçu
              </button>
              <a :href="`/pdf/${document.filename}`" download
                class="flex items-center text-primary dark:text-primary px-4 py-2 border border-primary dark:border-primary gap-2 text-sm rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Télécharger
              </a>
            </div>
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
    <div v-else class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="showConfetti" class="pointer-events-none fixed inset-0 z-[60]"></div>
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

      <!-- Wrapper avec sidebar (desktop) -->
      <div class="grid grid-cols-12 gap-6">
        <!-- Sidebar latérale (desktop) -->
        <aside class="hidden md:block col-span-4 lg:col-span-3">
          <div class="sticky top-24 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Sommaire</h4>
            <nav class="space-y-1">
              <button
                v-for="(section, index) in selectedFormation.sections"
                :key="section.id"
                @click="selectedSection = section.id"
                :class="[
                  'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                  selectedSection === section.id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                ]"
              >
                {{ index + 1 }}. {{ section.title }}
              </button>
            </nav>
          </div>
        </aside>

        <!-- Navigation des sections (mobile) -->
        <div class="md:hidden col-span-12 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-2">
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
        <div v-if="currentSection" class="col-span-12 md:col-span-8 lg:col-span-9 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          {{ currentSection.title }}
        </h3>
        
        <div class="prose prose-lg max-w-none dark:prose-invert">
          <div class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {{ currentSection.content }}
          </div>
        </div>

        <!-- Quiz (optionnel) -->
        <div v-if="currentSection.quiz && currentSection.quiz.length" class="mt-8">
          <h4 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Questions de révision</h4>
          <div class="space-y-6">
            <div v-for="(q, qi) in currentSection.quiz" :key="q.id || qi" class="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
              <p class="font-medium text-gray-800 dark:text-gray-100 mb-3">{{ qi + 1 }}. {{ q.question }}</p>
              <div class="space-y-2">
                <label v-for="(choice, ci) in q.choices" :key="ci" class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input type="radio" :name="'q'+qi" :value="ci" v-model="quizAnswers[qi]" class="text-blue-600" />
                  <span>{{ choice }}</span>
                </label>
              </div>
            </div>
          </div>
          <div class="mt-4 flex items-center gap-3">
            <button @click="submitQuiz()" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">Vérifier mes réponses</button>
            <span v-if="quizResult !== null" class="text-sm text-gray-700 dark:text-gray-300">Score: {{ quizResult }}/{{ currentSection.quiz.length }}</span>
          </div>
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
        
        <div class="flex gap-3">
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
          <button
            v-else
            @click="completeFormation()"
            class="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Terminer la formation
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="isCompleted && nextFormation" class="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-green-200 dark:border-green-700">
        <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Bravo ! 🎉 Formation terminée</h4>
        <p class="text-gray-600 dark:text-gray-400 mb-4">Souhaitez-vous poursuivre avec la prochaine formation recommandée ?</p>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-gray-800 dark:text-gray-100">{{ nextFormation.title }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ nextFormation.description }}</p>
          </div>
          <button @click="selectFormation(nextFormation)" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">Commencer</button>
        </div>
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

  <!-- Modal d'aperçu PDF -->
  <div v-if="previewDocument" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click="closePreview">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col" @click.stop>
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">{{ previewDocument.title }}</h3>
        <button @click="closePreview" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div class="flex-1 p-4">
        <iframe 
          :src="`/pdf/${previewDocument.filename}#toolbar=1&navpanes=0&scrollbar=1`" 
          class="w-full h-full min-h-[500px] rounded border"
          frameborder="0">
        </iframe>
      </div>
      <div class="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
        <a :href="`/pdf/${previewDocument.filename}`" download
          class="flex items-center text-primary px-4 py-2 border border-primary gap-2 text-sm rounded-lg hover:bg-primary/10 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Télécharger
        </a>
        <button @click="closePreview" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
          Fermer
        </button>
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
  quiz?: Array<{ id?: string; question: string; choices: string[]; answer: number }>
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
const documents = ref<any[]>([])
const isLoadingFormations = ref(false)
const previewDocument = ref<any>(null)
const isCompleted = ref(false)
const showConfetti = ref(false)
const quizAnswers = ref<Record<number, number>>({})
const quizResult = ref<number | null>(null)

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

const progressPercent = computed(() => {
  if (!selectedFormation.value) return 0
  const total = selectedFormation.value.sections.length
  return Math.min(100, Math.round(((currentSectionIndex.value + 1) / total) * 100))
})

const nextFormation = computed(() => {
  if (!selectedFormation.value) return null
  const idx = formations.value.findIndex(f => f.id === selectedFormation.value!.id)
  if (idx < 0) return null
  return formations.value[idx + 1] || formations.value[0] || null
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
  isCompleted.value = false
  showConfetti.value = false
  quizAnswers.value = {}
  quizResult.value = null
}

const loadFormations = async () => {
  isLoadingFormations.value = true
  try {
    // Charger les formations
    const formationsData = await $fetch('/formations.json') as { formations: Formation[] }
    if (formationsData && Array.isArray(formationsData.formations)) {
      formations.value = formationsData.formations
    } else {
      console.error('Format de données formations invalide')
      formations.value = []
    }

    // Charger les documents PDF
    const documentsData = await $fetch('/documents.json') as { documents: any[] }
    if (documentsData && Array.isArray(documentsData.documents)) {
      documents.value = documentsData.documents
    } else {
      console.error('Format de données documents invalide')
      documents.value = []
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
    formations.value = []
    documents.value = []
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

// Quiz
const submitQuiz = () => {
  if (!currentSection.value || !currentSection.value.quiz) return
  let score = 0
  currentSection.value.quiz.forEach((q, i) => {
    if (quizAnswers.value[i] === q.answer) score += 1
  })
  quizResult.value = score
}

// Completion + Confetti
const completeFormation = () => {
  isCompleted.value = true
  launchConfetti()
}

const launchConfetti = () => {
  showConfetti.value = true
  const colors = ['#34d399', '#60a5fa', '#f472b6', '#facc15', '#f87171']
  const amount = 120
  for (let i = 0; i < amount; i++) {
    const piece = document.createElement('div')
    piece.className = 'confetti-piece'
    piece.style.position = 'fixed'
    piece.style.zIndex = '70'
    piece.style.top = '-10px'
    piece.style.left = Math.random() * 100 + 'vw'
    piece.style.width = Math.random() * 8 + 4 + 'px'
    piece.style.height = Math.random() * 8 + 4 + 'px'
    piece.style.background = colors[Math.floor(Math.random() * colors.length)]
    piece.style.opacity = '0.9'
    piece.style.transform = `rotate(${Math.random() * 360}deg)`
    piece.style.borderRadius = '2px'
    piece.style.animation = `confetti-fall ${3 + Math.random() * 2}s linear forwards`
    document.body.appendChild(piece)
    setTimeout(() => piece.remove(), 6000)
  }
  setTimeout(() => { showConfetti.value = false }, 3500)
}

// Fonctions pour le modal d'aperçu PDF
const openPreview = (document: any) => {
  previewDocument.value = document
}

const closePreview = () => {
  previewDocument.value = null
}
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

/* Confetti */
@keyframes confetti-fall {
  0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0.7; }
}
</style>