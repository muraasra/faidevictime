<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-4">Modification du Formulaire de Service</h1>
      </div>

      <!-- Notification -->
      <div v-if="notification.show" 
           :class="`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
             notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
           }`">
        <div class="flex items-center">
          <i class="fas fa-exclamation-circle mr-2"></i>
          {{ notification.message }}
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">
            Étape {{ currentStep }} sur {{ totalSteps }}
          </span>
          <span class="text-sm text-gray-500">
            {{ Math.round((currentStep / totalSteps) * 100) }}% complété
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
          />
        </div>
      </div>

      <!-- Form Content -->
      <div v-if="!isLoading" class="bg-white rounded-lg shadow-md p-6">
        <!-- Étapes générales -->
        <div v-if="currentStep <= Math.ceil(generalQuestions.length / questionsPerStep)">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            Informations générales - Étape {{ currentStep }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="(question, index) in getQuestionsForStep(currentStep)" :key="index">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ question.label }} <span v-if="question.required" class="text-red-500">*</span>
              </label>
              <component 
                :is="getFieldComponent(question)"
                v-model="formData[question.section][question.key]"
                :name="question.key"
                :type="question.type"
                :placeholder="question.label"
                :options="question.options"
                :error="errors[question.key]"
              />
            </div>
          </div>
        </div>

        <!-- Sélection de catégorie -->
        <div v-if="currentStep === Math.ceil(generalQuestions.length / questionsPerStep) + 1">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Sélection de la catégorie</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Catégorie de service <span class="text-red-500">*</span>
            </label>
            <select
              v-model="selectedCategory"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Sélectionner --</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
        </div>

        <!-- Questions spécifiques -->
        <div v-if="currentStep > Math.ceil(generalQuestions.length / questionsPerStep) + 1 && selectedCategory">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            Questions spécifiques - {{ selectedCategory }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="(question, index) in getSpecificQuestionsForStep(currentStep - Math.ceil(generalQuestions.length / questionsPerStep) - 1)" 
                 :key="index" 
                 class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ question.label }} <span v-if="question.required" class="text-red-500">*</span>
              </label>
              <component 
                :is="getFieldComponent(question)"
                v-model="formData[question.section][question.key]"
                :name="question.key"
                :type="question.type"
                :placeholder="question.label"
                :options="question.options"
                :error="errors[question.key]"
              />
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex justify-between items-center mt-8 pt-6 border-t">
          <button
            @click="previousStep"
            :disabled="currentStep === 1"
            class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            Précédent
          </button>

          <div class="flex space-x-2">
            <button
              v-if="currentStep < totalSteps"
              @click="nextStep"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Suivant
            </button>
            <button
              v-else
              @click="saveForm"
              :disabled="isSaving"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <i v-if="isSaving" class="fas fa-spinner fa-spin mr-2"></i>
              <i v-else class="fas fa-save mr-2"></i>
              {{ isSaving ? 'Sauvegarde...' : 'Sauvegarder' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else class="bg-white rounded-lg shadow-md p-6 text-center">
        <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
        <p class="text-gray-600">Chargement des données...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import InputField from './fields/InputField.vue'
import CheckboxField from './fields/CheckboxField.vue'
import RadioBolField from './fields/RadioBolField.vue'
import HommeFemmeField from './fields/HommeFemmeField.vue'
import CoordinateField from './fields/CoordinateField.vue'

// Props
const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
})

// État
const isLoading = ref(true)
const isSaving = ref(false)
const currentStep = ref(1)
const selectedCategory = ref('')
const notification = ref({ show: false, message: '', type: 'success' })
const errors = ref({})
  
  // Données du formulaire
const formData = ref({
    transversales: {
      nom_structure: "",
      fonction_repondant: "",
      nom_repondant: "",
      telephone_repondant: "",
      longitude: "",
      latitude: "",
      email: "",
      site_web: "",
      langues_parlees: [],
      jours_ouverture: [],
      heures_ouverture: "",
      gratuit: [],
      author: 1
    },
    specifiques: {}
})

// Configuration
const categories = ['Soins médicaux', 'Appui psychosocial', 'Police / Sécurité', 'Assistance juridique', 'Hébergement', 'Réinsertion économique']
const questionsPerStep = 6
  
  const generalQuestions = [
  { key: 'nom_structure', label: 'Nom de la structure', type: 'text', required: true, section: 'transversales' },
  { key: 'fonction_repondant', label: 'Fonction du répondant', type: 'text', required: true, section: 'transversales' },
  { key: 'nom_repondant', label: 'Nom du répondant', type: 'text', required: true, section: 'transversales' },
  { key: 'telephone_repondant', label: 'Téléphone du répondant', type: 'tel', required: true, section: 'transversales' },
  { key: 'longitude', label: 'Longitude', type: 'longitude', required: true, section: 'transversales' },
  { key: 'latitude', label: 'Latitude', type: 'latitude', required: true, section: 'transversales' },
  { key: 'email', label: 'Email', type: 'email', required: true, section: 'transversales' },
  { key: 'site_web', label: 'Site web', type: 'url', required: false, section: 'transversales' },
  { key: 'langues_parlees', label: 'Langues parlées', type: 'checkbox', required: true, section: 'transversales',
      options: ['Français', 'Anglais', 'Arabe', 'Espagnol', 'Autre'] },
  { key: 'jours_ouverture', label: 'Jours d\'ouverture', type: 'checkbox', required: true, section: 'transversales',
      options: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'] },
  { key: 'heures_ouverture', label: 'Heures d\'ouverture', type: 'time', required: true, section: 'transversales' },
  { key: 'gratuit', label: 'Services gratuits', type: 'checkbox', required: false, section: 'transversales',
      options: ['Consultation', 'Médicaments', 'Analyses', 'Hospitalisation'] }
]

  const specificQuestions = {
    'Soins médicaux': [
    { key: 'protocole_viol', label: 'Protocole de prise en charge du viol', type: 'radioBol', required: true, section: 'specifiques' },
    { key: 'infirmiers', label: 'Nombre d\'infirmiers', type: 'homme_femme', required: true, section: 'specifiques' },
    { key: 'medecins', label: 'Nombre de médecins', type: 'homme_femme', required: true, section: 'specifiques' },
    { key: 'salle_privee', label: 'Salle privée disponible', type: 'radioBol', required: true, section: 'specifiques' },
    { key: 'table_examen', label: 'Table d\'examen', type: 'radioBol', required: true, section: 'specifiques' },
    { key: 'kit_ist', label: 'Kit IST disponible', type: 'radioBol', required: true, section: 'specifiques' },
    { key: 'formation_viol', label: 'Formation sur la prise en charge du viol', type: 'radioBol', required: true, section: 'specifiques' }
  ],
  // ... autres catégories ...
}

// Computed
const totalSteps = computed(() => {
  return Math.ceil(generalQuestions.length / questionsPerStep) + 1 + 
    (selectedCategory.value ? Math.ceil((specificQuestions[selectedCategory.value] || []).length / questionsPerStep) : 0)
})

// Méthodes
  const showNotification = (message, type = 'success') => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

  const validateField = (key, value) => {
  const newErrors = { ...errors.value }
  delete newErrors[key]

    if (key === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    newErrors[key] = "Email invalide"
    }
    if (key === 'telephone_repondant' && value && !/^(\+\d{1,3}\s?)?\d{10}$/.test(value.replace(/\s/g, ''))) {
    newErrors[key] = "Téléphone invalide"
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

  const fillCoordinates = () => {
    if (!navigator.geolocation) {
    showNotification('Géolocalisation non supportée', 'error')
    return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
      formData.value.transversales.longitude = position.coords.longitude.toFixed(6)
      formData.value.transversales.latitude = position.coords.latitude.toFixed(6)
      showNotification('Coordonnées récupérées avec succès')
      },
      (error) => {
      showNotification('Erreur de géolocalisation: ' + error.message, 'error')
    }
  )
}

const loadFormData = async () => {
  console.log('Début du chargement des données pour ID:', props.id)
  isLoading.value = true
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/question-transversale/${props.id}/`)
    if (!response.ok) {
      console.error('Erreur de réponse:', response.status)
      throw new Error('Erreur lors du chargement')
    }
    
    const data = await response.json()
    console.log('Données reçues:', data)
    
    // Mapper les données
    formData.value = {
        transversales: {
          nom_structure: data.nom_structure || "",
          fonction_repondant: data.fonction_repondant || "",
          nom_repondant: data.nom_repondant || "",
          telephone_repondant: data.telephone_repondant || "",
          longitude: data.longitude || "",
          latitude: data.latitude || "",
          email: data.email || "",
          site_web: data.site_web || "",
          langues_parlees: Array.isArray(data.langues_parlees) ? data.langues_parlees : [],
          jours_ouverture: Array.isArray(data.jours_ouverture) ? data.jours_ouverture : [],
          heures_ouverture: data.heures_ouverture || "",
          gratuit: Array.isArray(data.gratuit) ? data.gratuit : [],
          author: data.author || 1
        },
        specifiques: {}
    }

      if (data.category) {
      selectedCategory.value = data.category.name
        
      const categoryKey = data.category.name.toLowerCase().replace(/\s+/g, '_').replace('/', '_')
      const categoryData = data[categoryKey] || {}
        
        Object.keys(categoryData).forEach(key => {
          if (key !== 'id' && key !== 'question_transversale') {
          formData.value.specifiques[key] = categoryData[key]
          }
      })
      }

    showNotification('Données chargées avec succès')
    } catch (error) {
    console.error('Erreur lors du chargement:', error)
    showNotification('Erreur lors du chargement: ' + error.message, 'error')
    } finally {
    isLoading.value = false
  }
}

const saveForm = async () => {
  isSaving.value = true
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/question-transversale/${props.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        ...formData.value.transversales,
        categorie: selectedCategory.value,
        specifiques: formData.value.specifiques
      })
    })

    if (!response.ok) throw new Error('Erreur lors de la sauvegarde')
    
    showNotification('Formulaire modifié avec succès')
    } catch (error) {
    showNotification('Erreur lors de la sauvegarde: ' + error.message, 'error')
    } finally {
    isSaving.value = false
  }
    }

  const nextStep = () => {
  if (currentStep.value < totalSteps.value) {
    currentStep.value++
  }
    }

  const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
    }

  const getQuestionsForStep = (step) => {
  const startIndex = (step - 1) * questionsPerStep
  return generalQuestions.slice(startIndex, startIndex + questionsPerStep)
}

  const getSpecificQuestionsForStep = (step) => {
  if (!selectedCategory.value || !specificQuestions[selectedCategory.value]) return []
  const questions = specificQuestions[selectedCategory.value]
  const startIndex = (step - 1) * questionsPerStep
  return questions.slice(startIndex, startIndex + questionsPerStep)
}

const getFieldComponent = (question) => {
    switch (question.type) {
      case 'checkbox':
      return 'CheckboxField'
      case 'radioBol':
      return 'RadioBolField'
      case 'homme_femme':
      return 'HommeFemmeField'
      case 'longitude':
      case 'latitude':
      return 'CoordinateField'
      default:
      return 'InputField'
  }
}

// Modifier onMounted pour s'assurer que l'ID est disponible
onMounted(() => {
  if (props.id) {
    console.log('Composant monté avec ID:', props.id)
    loadFormData()
  } else {
    console.error('Aucun ID fourni au composant')
    showNotification('Erreur: Aucun ID fourni', 'error')
  }
})
</script>

<style scoped>
/* Styles existants conservés */
</style>