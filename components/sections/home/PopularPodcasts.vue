<template>
    <section class="pt-16 relative">
        <div aria-hidden="true" class="absolute inset-y-0 w-44 left-0 hidden dark:flex">
            <div
                class="h-full md:h-1/2 lg:h-full w-full bg-gradient-to-tr opacity-40 dark:blur-2xl dark:from-[#570cac] dark:opacity-20">
            </div>
        </div>
        <div class="absolute top-14 inset-x-0 h-64 flex items-start">
            <div
                class="h-24 w-2/3 bg-gradient-to-br from-primary opacity-20 blur-2xl dark:from-[#570cac] dark:invisible dark:opacity-40">
            </div>
            <div
                class="h-20 w-3/5 bg-gradient-to-r from-[#8cd66a] opacity-40 blur-2xl dark:from-[#670ccf] dark:opacity-40">
            </div>
        </div>
        <AtomsContainer class-name="relative">
            <!-- Première ligne : Formations -->
            <div class="flex justify-between pb-6 relative">
                <div class="">
                    <AtomsTitle texte="Formations & Sensibilisation" />
                </div>
                <div class="flex items-center min-w-max gap-5">
                    <AtomsLinkBtn href="/formations" variant="primary">
                        Voir toutes les formations
                    </AtomsLinkBtn>
                </div>
            </div>
            <div
                class="grid grid-cols-2 items-stretch sm:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-10 sm:gap-x-5 sm:gap-y-8 mb-12">

                <div
                    v-for="formation in featuredFormations" 
                    :key="formation.id"
                    class="lg:p-1 relative h-auto flex flex-col lg:rounded-2xl lg:bg-box-bg lg:shadow-lg lg:shadow-box-shadow lg:border lg:border-box-border"
                >
                    <div class="relative h-max min-h-max">
                        <div class="w-full h-32 sm:h-36 md:h-40 lg:h-48 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <div class="text-6xl">{{ formation.icon }}</div>
                        </div>
                        <span class="absolute top-2 right-2 px-2 rounded-full text-sm text-white bg-blue-500">
                            {{ formation.duration }}
                        </span>
                    </div>
                    <div class="lg:px-2 pt-2 lg:pb-4 xl:px-4 md:pt-4 h-full flex flex-col justify-between">
                        <div class="h-full">
                            <h2 class="font-semibold text-base md:text-lg lg:text-xl line-clamp-2 md:line-clamp-3 text-gray-700 dark:text-white">
                                {{ formation.title }}
                            </h2>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                                {{ formation.description }}
                            </p>
                            <div class="mt-2">
                                <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                                    {{ formation.category }}
                                </span>
                            </div>
                        </div>
                        <div class="pt-3 sm:pt-5 min-h-max h-max">
                            <NuxtLink :to="`/formations?id=${formation.id}`"
                                class="flex relative group items-center text-white px-5 py-2 bg-primary gap-1 text-sm w-max rounded-full">
                                <span class="absolute inset-0 rounded-full group-hover:scale-105 origin-center transition-all ease-in-out bg-primary">
                                </span>
                                <span class="relative flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                        fill="currentColor" class="w-3 h-3">
                                        <path fill-rule="evenodd"
                                            d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    Consulter
                                </span>
                            </NuxtLink>
                        </div>
                    </div>
                </div>
                
            </div>

            <!-- Deuxième ligne : Documents PDF -->
            <div class="flex justify-between pb-6 relative">
                <div class="">
                    <AtomsTitle texte="Documents & Ressources" />
                </div>
                <div class="flex items-center min-w-max gap-5">
                    <AtomsLinkBtn href="/formations" variant="secondary">
                        Voir tous les documents
                    </AtomsLinkBtn>
                </div>
            </div>
            <div
                class="grid grid-cols-2 items-stretch sm:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-10 sm:gap-x-5 sm:gap-y-8">

                <div
                    v-for="document in featuredDocuments" 
                    :key="document.id"
                    class="lg:p-1 relative h-auto flex flex-col lg:rounded-2xl lg:bg-box-bg lg:shadow-lg lg:shadow-box-shadow lg:border lg:border-box-border"
                >
                    <div class="relative h-max min-h-max">
                        <div class="w-full h-32 sm:h-36 md:h-40 lg:h-48 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
                            <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <span class="absolute top-2 right-2 px-2 rounded-full text-sm text-white bg-primary">
                            PDF
                        </span>
                    </div>
                    <div class="lg:px-2 pt-2 lg:pb-4 xl:px-4 md:pt-4 h-full flex flex-col justify-between">
                        <div class="h-full">
                            <h2 class="font-semibold text-base md:text-lg lg:text-xl line-clamp-2 md:line-clamp-3 text-gray-700 dark:text-white">
                                {{ document.title }}
                            </h2>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                                {{ document.description }}
                            </p>
                        </div>
                        <div class="pt-3 sm:pt-5 min-h-max h-max flex gap-2">
                            <button @click="openPreview(document)"
                                class="flex relative group items-center text-white px-4 py-2 bg-primary gap-1 text-sm w-max rounded-full hover:bg-emerald-600 transition-colors">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                                Aperçu
                            </button>
                            <a :href="`/pdf/${document.filename}`" download
                                class="flex relative group items-center text-primary dark:text-primary px-4 py-2 border border-primary dark:border-primary gap-1 text-sm w-max rounded-full hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                Télécharger
                            </a>
                        </div>
                    </div>
                </div>
                
            </div>
        </AtomsContainer>
    </section>

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

const formations = ref<any[]>([])
const documents = ref<any[]>([])
const isLoading = ref(true)
const previewDocument = ref<any>(null)

// Charger les formations depuis le fichier JSON
onMounted(async () => {
  try {
    // Charger les formations
    const formationsResponse = await fetch('/formations.json')
    const formationsData = await formationsResponse.json()
    formations.value = formationsData.formations || []

    // Charger les documents PDF
    const documentsResponse = await fetch('/documents.json')
    const documentsData = await documentsResponse.json()
    documents.value = documentsData.documents || []
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
    formations.value = []
    documents.value = []
  } finally {
    isLoading.value = false
  }
})

// Sélectionner les 4 premières formations pour l'affichage
const featuredFormations = computed(() => {
  return formations.value.slice(0, 4)
})

// Sélectionner les 4 premiers documents pour l'affichage
const featuredDocuments = computed(() => {
  return documents.value.slice(0, 4)
})

// Fonctions pour le modal d'aperçu
const openPreview = (document: any) => {
  previewDocument.value = document
}

const closePreview = () => {
  previewDocument.value = null
}
</script>