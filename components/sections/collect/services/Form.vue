<template>
  
  <div class="p-6 bg-white dark:bg-zinc-900 rounded shadow w-full max-w-full lg:max-w-none">
    <h2 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">Formulaire de service</h2>

    <!-- Progress bar -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Étape {{ currentStep }} sur {{ totalSteps }}
        </span>
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ Math.round((currentStep / totalSteps) * 100) }}% complété
        </span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="bg-blue-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: (currentStep / totalSteps) * 100 + '%' }"
        ></div>
      </div>
      
      <!-- Step indicators -->
      <div class="flex justify-between mt-3">
        <div 
          v-for="step in totalSteps" 
          :key="step"
          class="flex items-center"
        >
          <div 
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200"
            :class="step <= currentStep 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'"
          >
            {{ step }}
          </div>
          <div 
            v-if="step < totalSteps"
            class="hidden sm:block w-full h-0.5 mx-2"
            :class="step < currentStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'"
          ></div>
        </div>
      </div>
    </div>

    <!-- Message de notification -->
    <div v-if="notification.show" 
         class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg shadow-lg transition-all duration-500 z-50"
         :class="notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'">
      {{ notification.message }}
    </div>

    <!-- Step 1: Questions générales (1-10) -->
    <div v-if="currentStep === 1" class="mb-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Informations générales (1/2)
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(question, index) in getQuestionsForStep(1)" :key="index" class="col-span-1">
          <div>
            <label class="font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
              {{ question.label }} 
              <span v-if="question.required" class="text-red-500">*</span>
            </label>

            <!-- Si checkbox multiple -->
            <div v-if="question.type === 'checkbox'">
              <div class="flex flex-col space-y-2">
                <label v-for="option in question.options" :key="option" class="inline-flex items-center">
                  <input
                    type="checkbox"
                    :value="option"
                    v-model="form.transversales[question.key]"
                    class="mr-2"
                    @blur="validateField(question.key, form.transversales[question.key])"
                  />
                  {{ option }}
                </label>
              </div>
            </div>
            <!-- Si longitude ou latitude -->
            <div v-else-if="question.type === 'longitude' || question.type === 'latitude'">
              <div class="flex items-center gap-2">
                <input
                  v-model="form.transversales[question.key]"
                  type="text"
                  class="input w-full"
                  :class="{'border-red-500': errors[question.key]}"
                  :placeholder="'Entrez ' + question.label"
                  readonly
                  @blur="validateField(question.key, form.transversales[question.key])"
                />
                <button
                  @click="fillCoordinates"
                  type="button"
                  class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Auto
                </button>
              </div>
            </div>
            <!-- Si radio -->
            <div v-else-if="question.type === 'radio'">
              <div class="flex flex-col space-y-2">
                <label v-for="option in question.options" :key="option" class="inline-flex items-center">
                  <input
                    type="radio"
                    :name="question.key"
                    :value="option"
                    v-model="form.transversales[question.key]"
                    class="mr-2"
                    @change="validateField(question.key, form.transversales[question.key])"
                  />
                  {{ option }}
                </label>
              </div>
            </div>
             <!-- Input number -->
            <div v-else-if="question.type === 'tel'">
              <input
                type="tel"
                v-model="form.transversales[question.key]"
                class="input w-full"
                :class="{'border-red-500': errors[question.key]}"
                @blur="validateField(question.key, form.transversales[question.key])"
              />
            </div>

            <div v-else-if="question.type === 'number'">
              <input
                type="number"
                min="0"
                v-model="form.transversales[question.key]"
                class="input w-full"
                :class="{'border-red-500': errors[question.key]}"
                @blur="validateField(question.key, form.transversales[question.key])"
              />
            </div>
            <!-- Input simple -->
            <div v-else>
              <input
                :type="getInputType(question.type || 'text')"
                v-model="form.transversales[question.key]"
                class="input w-full"
                :class="{'border-red-500': errors[question.key]}"
                @blur="validateField(question.key, form.transversales[question.key])"
              />
            </div>
            <!-- Affichage des erreurs -->
            <p v-if="errors[question.key]" class="text-red-500 text-sm mt-1">
              {{ errors[question.key] }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 2: Questions générales (11+) + Catégorie -->
    <div v-if="currentStep === 2" class="mb-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Informations générales (2/2) et Catégorie
      </h3>
      
      <!-- Questions générales restantes -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div v-for="(question, index) in getQuestionsForStep(2)" :key="index" class="col-span-1">
          <div>
            <label class="font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
              {{ question.label }} 
              <span v-if="question.required" class="text-red-500">*</span>
            </label>

            <!-- Si checkbox multiple -->
            <div v-if="question.type === 'checkbox'">
              <div class="flex flex-col space-y-2">
                <label v-for="option in question.options" :key="option" class="inline-flex items-center">
                  <input
                    type="checkbox"
                    :value="option"
                    v-model="form.transversales[question.key]"
                    class="mr-2"
                    @blur="validateField(question.key, form.transversales[question.key])"
                  />
                  {{ option }}
                </label>
              </div>
            </div>
            <!-- Si radio -->
            <div v-else-if="question.type === 'radio'">
              <div class="flex flex-col space-y-2">
                <label v-for="option in question.options" :key="option" class="inline-flex items-center">
                  <input
                    type="radio"
                    :name="question.key"
                    :value="option"
                    v-model="form.transversales[question.key]"
                    class="mr-2"
                    @change="validateField(question.key, form.transversales[question.key])"
                  />
                  {{ option }}
                </label>
              </div>
            </div>

            <!-- Input simple -->
            <div v-else>
              <input
                :type="getInputType(question.type || 'text')"
                v-model="form.transversales[question.key]"
                class="input w-full"
                :class="{'border-red-500': errors[question.key]}"
                @blur="validateField(question.key, form.transversales[question.key])"
              />
            </div>
            <!-- Affichage des erreurs -->
            <p v-if="errors[question.key]" class="text-red-500 text-sm mt-1">
              {{ errors[question.key] }}
            </p>
          </div>
        </div>
      </div>

      <!-- Catégorie -->
      <div class="mb-4">
        <label class="font-semibold text-gray-700 dark:text-gray-200">
          Catégorie de service 
          <span class="text-red-500">*</span>
        </label>
        <select 
          v-model="selectedCategory" 
          class="input mt-1 w-full"
          :class="{'border-red-500': errors.category}"
          @change="validateField('category', selectedCategory)"
        >
          <option value="">-- Sélectionner --</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
        <p v-if="errors.category" class="text-red-500 text-sm mt-1">
          {{ errors.category }}
        </p>
      </div>
    </div>

    <!-- Step 3+: Questions spécifiques -->
    <div v-if="currentStep >= 3 && selectedCategory" class="mb-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Questions spécifiques - {{ selectedCategory }} ({{ currentStep - 2 }}/{{ getSpecificStepsCount() }})
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(question, index) in getSpecificQuestionsForStep(currentStep - 2)" :key="index" class="col-span-1">
          <div>
            <label class="font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
              {{ question.label }}
              <span v-if="question.required" class="text-red-500">*</span>
            </label>

            <!-- Specific checkbox multiple -->
            <div v-if="question.type === 'checkbox'">
              <div class="flex flex-col space-y-2">
                <label v-for="option in question.options" :key="option.label" class="inline-flex items-center">
                  <input
                    type="checkbox"
                    :value="option.value"
                    v-model="form.specifiques[question.key]"
                    class="mr-2"
                    @change="validateField(question.key, form.specifiques[question.key])"
                  />
                  {{ option.label }}
                </label>
              </div>
            </div>

            <!-- Specific radio -->
            <div v-else-if="question.type === 'radio'">
              <div class="flex flex-col space-y-2">
                <label v-for="option in question.options" :key="option" class="inline-flex items-center">
                  <input
                    type="radio"
                    :name="'radio_' + question.key"
                    :value="option"
                    v-model="form.specifiques[question.key]"
                    class="mr-2"
                    @change="validateField(question.key, form.specifiques[question.key])"
                  />
                    {{ option }}
                </label>
              </div>
            </div>
            <div v-else-if="question.type === 'radioBol'">
              <div class="flex flex-col space-y-2">
                <div class="flex items-center gap-4">
                  <label class="inline-flex items-center">
                    <input 
                      type="radio" 
                      :name="'radio_' + question.key"
                      :value="true" 
                      v-model="form.specifiques[question.key]" 
                      class="mr-2 ml-2"
                    />
                    Oui
                  <!-- </label>
                  <label class="inline-flex items-center"> -->
                    <input 
                      type="radio" 
                      :name="'radio_' + question.key"
                      :value="false" 
                      v-model="form.specifiques[question.key]" 
                      class="mr-2 ml-2"
                    />
                    Non
                  </label>
                </div>
              </div>
            </div>
            <div v-else-if="question.type === 'homme_femme'" class="flex items-center gap-4">
              <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hommes
              </label>
              <input
                type="number" 
                min="0"
                v-model="form.specifiques[`${question.key}_hommes`]"
                class="input w-full"
                :class="{'border-red-500': errors[`${question.key}_hommes`]}"
                @blur="validateField(question.key, form.specifiques[`${question.key}_hommes`])"
              />
              </div>
              <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Femmes
              </label>
              <input
                type="number"
                v-model="form.specifiques[`${question.key}_femmes`]"
                class="input w-full"
                :class="{'border-red-500': errors[`${question.key}_femmes`]}"
                @blur="validateField(question.key, form.specifiques[`${question.key}_femmes`])"
              />
              </div>
            </div>
            <div v-else-if="question.type === 'number'">
              <input
                type="number"
                min="0"
                v-model="form.specifiques[question.key]"
                class="input w-full"
                :class="{'border-red-500': errors[question.key]}"
                @blur="validateField(question.key, form.specifiques[question.key])"
              />
            </div>

            <!-- Specific input simple -->
            <div v-else>
              <input
                :type="getInputType(question.type || 'text')"
                v-model="form.specifiques[question.key]"
                class="input w-full"
                :class="{'border-red-500': errors[question.key]}"
                @blur="validateField(question.key, form.specifiques[question.key])"
              />
            </div>
            <p v-if="errors[question.key]" class="text-red-500 text-sm mt-1">
              {{ errors[question.key] }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Message pour sélectionner une catégorie -->
    <div v-if="currentStep >= 3 && !selectedCategory" class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p class="text-yellow-800">
        Veuillez d'abord sélectionner une catégorie à l'étape précédente pour voir les questions spécifiques.
      </p>
    </div>

    <!-- Navigation buttons -->
    <div class="flex justify-between items-center mt-6">
      <!-- Bouton Précédent -->
      <button 
        v-if="currentStep > 1"
        @click="previousStep"
        class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
      >
        Précédent
      </button>
      <div v-else></div>

      <!-- Bouton Suivant ou Envoyer -->
      <div class="flex gap-2">
        <button 
          v-if="currentStep < totalSteps"
          @click="nextStep"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          :disabled="!canProceedToNextStep()"
          :class="{'opacity-50 cursor-not-allowed': !canProceedToNextStep()}"
        >
          Suivant
        </button>
        
        <button 
          v-if="currentStep === totalSteps"
          @click="submitForm"
          :disabled="isLoading" 
          class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
        >
          <span v-if="isLoading" class="mr-2">
            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ isLoading ? 'Envoi en cours...' : 'Envoyer' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ref, reactive, watch, computed } from 'vue';
import { specificQuestions, generalQuestions } from '~/constants/services'

const auth = useAuthStore();
const category_id = ref<number|null>(null);
const selectedCategory = ref<string>('');

// Multi-step logic
const currentStep = ref<number>(1);
const questionsPerStep = 10;


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
// Notification system
const notification = reactive({
  show: false,
  message: '',
  type: 'success',
  timeout: null as NodeJS.Timeout | null
});

const showNotification = (message: string, type: 'success' | 'error') => {
  if (notification.timeout) {
    clearTimeout(notification.timeout);
  }
  notification.message = message;
  notification.type = type;
  notification.show = true;
  notification.timeout = setTimeout(() => {
    notification.show = false;
  }, 3000);
};

// Type de base pour les questions
interface BaseQuestion {
  key: string;
  label: string;
  type?: string;
  required?: boolean;
  options?: string[];
}

// Type pour les questions spécifiques
type CategoryQuestions = {
  'Soins médicaux': BaseQuestion[];
  'Appui psychosocial': BaseQuestion[];
  'Police / Sécurité': BaseQuestion[];
  'Assistance juridique': BaseQuestion[];
  'Santé mentale': BaseQuestion[];
  'Réinsertion économique': BaseQuestion[];
  [key: string]: BaseQuestion[]; // Pour l'accès dynamique
};

// Type pour les réponses transversales
interface TransversalesForm {
  nom_structure: string;
  fonction_repondant: string;
  nom_repondant: string;
  telephone_repondant: string;
  longitude: number;
  latitude: number;
  email: string;
  site_web: string;
  langues_parlees: string[];
  jours_ouverture: string[];
  heures_ouverture: string;
  gratuit: string[];
  author: number | null;
  [key: string]: any; // Pour permettre l'accès dynamique aux propriétés
}

// Type pour les réponses spécifiques
interface SpecifiquesForm {
  medicaments_disponibles: string[];
  categorie: string;
  radioAnswers: Record<string, boolean>;
  [key: string]: any;
}

// Type pour le formulaire complet
interface FormData {
  transversales: TransversalesForm;
  specifiques: SpecifiquesForm;
  reponsesByCategory: Record<string, Record<string, any>>;
}

// Ajouter dans la partie script, avant la définition du formulaire
const radioAnswers = reactive<Record<string, boolean>>({});

const form = reactive<FormData>({
  transversales: {
    nom_structure: "",
    fonction_repondant: "",
    nom_repondant: "",
    telephone_repondant: "",
    longitude: 0,
    latitude: 0,
    email: "",
    site_web: "",
    langues_parlees: [],
    jours_ouverture: [],
    heures_ouverture: "",
    gratuit: [],
    author: user.value?.id ?? null
  },
  specifiques: {
    medicaments_disponibles: [],
    categorie: selectedCategory.value,
    radioAnswers: {},
  },
  reponsesByCategory: {}
});

// Conversion des questions importées
const typedSpecificQuestions = specificQuestions as CategoryQuestions;
const typedGeneralQuestions = generalQuestions as BaseQuestion[];

// Computed properties for multi-step
const totalSteps = computed(() => {
  let steps = 2; // Steps for general questions + category
  if (selectedCategory.value && typedSpecificQuestions[selectedCategory.value]) {
    const specificQuestionsCount = typedSpecificQuestions[selectedCategory.value].length;
    steps += Math.ceil(specificQuestionsCount / questionsPerStep);
  }
  return steps;
});

// Functions to get questions for each step
const getQuestionsForStep = (step: number): BaseQuestion[] => {
  let questions: BaseQuestion[] = [];
  if (step === 1) {
    questions = typedGeneralQuestions.slice(0, questionsPerStep);
  } else if (step === 2) {
    questions = typedGeneralQuestions.slice(questionsPerStep);
  }
  return questions;
};

const getSpecificQuestionsForStep = (specificStep: number): BaseQuestion[] => {
  if (!selectedCategory.value || !typedSpecificQuestions[selectedCategory.value]) {
    return [];
  }
  
  const allSpecificQuestions = typedSpecificQuestions[selectedCategory.value];
  const startIndex = (specificStep - 1) * questionsPerStep;
  const endIndex = startIndex + questionsPerStep;
  
  return allSpecificQuestions.slice(startIndex, endIndex);
};

const getSpecificStepsCount = (): number => {
  if (!selectedCategory.value || !typedSpecificQuestions[selectedCategory.value]) {
    return 0;
  }
  return Math.ceil(typedSpecificQuestions[selectedCategory.value].length / questionsPerStep);
};

// Navigation functions
const nextStep = () => {
  // Validate current step before proceeding
  let currentQuestions: BaseQuestion[] = [];

  if (currentStep.value === 1) {
    currentQuestions = getQuestionsForStep(1);
  } else if (currentStep.value === 2) {
    currentQuestions = getQuestionsForStep(2);
  } else if (currentStep.value >= 3 && selectedCategory.value) {
     // Only validate specific questions if a category is selected
    currentQuestions = getSpecificQuestionsForStep(currentStep.value - 2);
  }

  let isValidStep = true;
  // Clear errors for the current step before re-validating
  for (const question of currentQuestions) {
      delete errors[question.key];
  }
  // Clear category error for step 2
  if (currentStep.value === 2) {
      delete errors.category;
  }

  // Explicitly validate each required field in the current step
  for (const question of currentQuestions) {
    // Only validate required fields when navigating steps
    if (question.required) {
      let value;
      if (currentStep.value <= 2) {
        value = form.transversales[question.key];
      } else {
        value = form.specifiques[question.key];
      }
      // Use validateField to populate the global errors object
      if (!validateField(question.key, value)) {
        isValidStep = false;
      }
    }
  }

  // Also validate category selection for step 2
  if (currentStep.value === 2 && !selectedCategory.value) {
    errors.category = "Veuillez sélectionner une catégorie";
    isValidStep = false;
  }

  if (isValidStep) {
    currentStep.value++;
    // Clear errors related to the previous step after moving forward
    // This was already done at the beginning of the function for the current step's errors.
    // We only need to ensure category error is cleared if moving past step 2.
     if (currentStep.value === 3) {
        delete errors.category;
     }
  } else {
    // Show notification if there are validation errors
    showNotification('Veuillez corriger les erreurs dans le formulaire', 'error');
  }
};

const previousStep = () => {
  if (currentStep.value > 1) {
    // Clear errors when going back a step
    let currentQuestions: BaseQuestion[] = [];

    if (currentStep.value === 1) {
      currentQuestions = getQuestionsForStep(1);
    } else if (currentStep.value === 2) {
      currentQuestions = getQuestionsForStep(2);
    } else if (currentStep.value >= 3 && selectedCategory.value) {
       currentQuestions = getSpecificQuestionsForStep(currentStep.value - 2);
    }

    for (const question of currentQuestions) {
        delete errors[question.key];
    }
     // Clear category error if returning from specific questions step
     if (currentStep.value === 3) {
         delete errors.category;
     }

    currentStep.value--;
  }
};

const canProceedToNextStep = (): boolean => {
  // For step 2, check if category is selected
  if (currentStep.value === 2 && !selectedCategory.value) {
    return false;
  }
  
  // Validate current step questions
  let currentQuestions: BaseQuestion[] = [];
  
  if (currentStep.value === 1) {
    currentQuestions = getQuestionsForStep(1);
  } else if (currentStep.value === 2) {
    currentQuestions = getQuestionsForStep(2);
  } else if (currentStep.value >= 3) {
    currentQuestions = getSpecificQuestionsForStep(currentStep.value - 2);
  }
  
  // Check required fields for current step
  for (const question of currentQuestions) {
    if (question.required) {
      let value;
      if (currentStep.value <= 2) {
        value = form.transversales[question.key];
      } else {
        value = form.specifiques[question.key];
      }
      
      if (value === "" || value === null || value === undefined || 
          (Array.isArray(value) && value.length === 0)) {
        return false;
      }
    }
  }
  
  return true;
};

// Réinitialiser les spécifiques avec les valeurs par défaut
const getDefaultSpecifiques = (category: string): SpecifiquesForm => {
  const defaultValues: SpecifiquesForm = {
    medicaments_disponibles: [],
    categorie: category,
    radioAnswers: {},
  };

  // Initialiser toutes les questions spécifiques avec des valeurs par défaut
  if (category && typedSpecificQuestions[category]) {
    typedSpecificQuestions[category].forEach(question => {
      if (question.type === 'radioBol') {
        defaultValues[question.key] = false; // Initialiser à false par défaut
      }
    });
  }

  return defaultValues;
};

// Watch pour gérer le changement de catégorie
watch(selectedCategory, (newCategory, oldCategory) => {
  // if (oldCategory) {
  //   // Sauvegarder les réponses de l'ancienne catégorie
  //   form.reponsesByCategory[oldCategory] = { ...form.specifiques };
  // }
  
  // Réinitialiser les spécifiques avec les valeurs par défaut pour la nouvelle catégorie
  const defaultValues = getDefaultSpecifiques(newCategory);
  form.specifiques = defaultValues;

  // // Restaurer les réponses précédentes si elles existent (commenté car l'utilisateur souhaite vider les champs)
  // if (newCategory && form.reponsesByCategory[newCategory]) {
  //   form.specifiques = {
  //     ...defaultValues,
  //     ...form.reponsesByCategory[newCategory]
  //   };
  // } else {
  //   form.specifiques = defaultValues;
  // }
});

const fillCoordinates = () => {
  if (!navigator.geolocation) {
    showNotification('La géolocalisation n\'est pas prise en charge par votre navigateur.', 'error');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      form.transversales.longitude = parseFloat(position.coords.longitude.toFixed(6));
      form.transversales.latitude = parseFloat(position.coords.latitude.toFixed(6));
      validateField('longitude', form.transversales.longitude);
      validateField('latitude', form.transversales.latitude);
    },
    (error) => {
      showNotification('Impossible de récupérer les coordonnées : ' + error.message, 'error');
    }
  );
};

const isLoading = ref<boolean>(false);
const categories = ref<string[]>(['Soins médicaux', 'Appui psychosocial','Police / Sécurité','Assistance juridique','Santé mentale','Réinsertion économique']);

const getInputType = (type: string): string => {
  switch (type) {
    case 'text':
    case 'email':
    case 'number':
    case 'time':
    case 'date':
    case 'url':
      return type;
    case 'radio':
    case 'checkbox':
      return type;
    default:
      return 'text';
  }
};

const errors = reactive<Record<string, string>>({});

const validateField = (key: string, value: any): boolean => {
  delete errors[key];

  // Find the field in general or specific questions
  const field = [...typedGeneralQuestions, ...(typedSpecificQuestions[selectedCategory.value] || [])]
    .find(q => q.key === key);

  // Handle array values (checkboxes)
  if (Array.isArray(value)) {
    if (field?.required && value.length === 0) {
      errors[key] = "Au moins une option doit être sélectionnée";
      return false;
    }
    return true;
  }

  // Required field validation
  if (field?.required && (value === "" || value === null || value === undefined)) {
    errors[key] = "Ce champ est requis";
    return false;
  }

  // Skip further validation if field is empty and not required
  if (!value && !field?.required) {
    return true;
  }

  // Specific field validations
  switch (key) {
    case 'email':
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors[key] = "Veuillez entrer une adresse email valide";
        return false;
      }
      break;

    case 'telephone_repondant':
      // Allow both formats: 10 digits or international format
      // Removed specific format validation as requested
      // if (value && !/^(\+\d{1,3}\s?)?\d{10}$/.test(value.replace(/\s/g, ''))) {
      //   errors[key] = "Format invalide. Exemple: 0123456789 ou +225 0123456789";
      //   return false;
      // }
      break;

    case 'heures_ouverture':
      if (value && !/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
        errors[key] = "Format invalide. Exemple: 08:30";
        return false;
      }
      break;

    case 'longitude':
      const longValue = Number(value);
      if (value && (isNaN(longValue) || longValue < -180 || longValue > 180)) {
        errors[key] = "Longitude invalide (-180 à 180)";
        return false;
      }
      break;

    case 'latitude':
      const latValue = Number(value);
      if (value && (isNaN(latValue) || latValue < -90 || latValue > 90)) {
        errors[key] = "Latitude invalide (-90 à 90)";
        return false;
      }
      break;

    case 'site_web':
      if (value && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})[\/\w .-]*\/?$/i.test(value)) {
        errors[key] = "Format URL invalide. Exemple: www.example.com";
        return false;
      }
      break;
  }

  return true;
};

const validateForm = (): boolean => {
  let isValid = true;
  // This function will now primarily be used by submitForm for a full validation check.
  // Step validation is handled within nextStep.

  // Clear all errors before a full validation check
  Object.keys(errors).forEach(key => delete errors[key]);

  // Validate all required transversales
  const requiredTransversales = typedGeneralQuestions.filter(q => q.required);
  for (const question of requiredTransversales) {
    const value = form.transversales[question.key];
    if (!validateField(question.key, value)) {
      isValid = false;
    }
  }

  // Validate category
  if (!selectedCategory.value) {
    errors.category = "Veuillez sélectionner une catégorie";
    isValid = false;
  }

  // Validate required specifiques if category is selected
  if (selectedCategory.value) {
    const categoryQuestions = typedSpecificQuestions[selectedCategory.value] || [];
    for (const question of categoryQuestions) {
      // Check if the specific question's key exists in form.specifiques before validating
      if (question.required && !validateField(question.key, form.specifiques[question.key])) {
        isValid = false;
      }
    }
  }

  return isValid; // Return true only if no errors were found and isValid remained true
};

const submitForm = async () => {
  // Validate the entire form before submitting
  if (!validateForm()) {
     // validateForm will now populate the errors object
     showNotification('Veuillez corriger les erreurs dans le formulaire', 'error');
    return;
  }

  isLoading.value = true;
  try {
    const formData = {
      transversales: { ...form.transversales },
      specifiques: { ...form.specifiques },
      categorie: selectedCategory.value
    };

    // Ajouter les réponses sauvegardées de toutes les catégories
    Object.keys(form.reponsesByCategory).forEach(category => {
      if (category !== selectedCategory.value) {
        formData.specifiques = {
          ...formData.specifiques,
          ...form.reponsesByCategory[category]
        };
      }
    });

    console.log('Sending formData:', JSON.stringify(formData, null, 2)); // Log formData

    const response = await fetch('https://wilfriedtayou.pythonanywhere.com/api/submit-form/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const errorData = await response.json(); // Read the error response body
      console.error('Backend error response:', errorData); // Log the error response
      throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
    }

    showNotification('Formulaire envoyé avec succès!', 'success');
    resetForm();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
    showNotification(`Erreur lors de l'envoi du formulaire: ${errorMessage}`, 'error');
  } finally {
    isLoading.value = false;
  }
};

// Fonction pour réinitialiser le formulaire
const resetForm = () => {
      form.transversales = {
        nom_structure: "",
        fonction_repondant: "",
        nom_repondant: "",
        telephone_repondant: "",
        longitude: 0,
        latitude: 0,
        email: "",
        site_web: "",
        langues_parlees: [],
        jours_ouverture: [],
        heures_ouverture: "",
        gratuit: [],
    author: auth.user?.id ?? null
      };
      form.specifiques = {
        medicaments_disponibles: [],
        categorie: "",
    radioAnswers: {},
      };
  form.reponsesByCategory = {};
      selectedCategory.value = "";
  currentStep.value = 1; // Reset to first step
  Object.keys(errors).forEach(key => delete errors[key]);
};

// Fonction pour gérer le changement des boutons radio
const handleRadioChange = (questionKey: string, value: boolean) => {
  form.specifiques.radioAnswers[questionKey] = value;
};

</script>

<style scoped>
.input {
  border: 1px solid #ccc;
  padding: 0.5rem;
  border-radius: 4px;
  transition: border-color 0.2s ease-in-out;
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

@media (max-width: 640px) {
  .grid-cols-1 {
    grid-template-columns: 1fr;
  }
  
  .flex {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .flex.justify-between {
    flex-direction: row;
  }
}

@media (min-width: 1024px) {
  .w-full-screen {
    width: 100vw;
  }
}

/* Progress bar animation */
.transition-all {
  transition: all 0.3s ease-in-out;
}

/* Step indicators responsive */
@media (max-width: 640px) {
  .hidden.sm\:block {
    display: none !important;
  }
  
  .flex.justify-between {
    justify-content: space-around;
  }
}

/* Button hover effects */
button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

button:not(:disabled):active {
  transform: translateY(0);
}

/* Loading spinner animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Notification animation */
.fixed {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* Form section transitions */
.mb-6 {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive improvements */
@media (max-width: 768px) {
  .p-6 {
    padding: 1rem;
  }
  
  .grid-cols-1.sm\:grid-cols-2.lg\:grid-cols-3 {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .text-xl {
    font-size: 1.25rem;
  }
  
  .px-6 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Dark mode improvements */
@media (prefers-color-scheme: dark) {
  .input {
    background-color: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }
  
  .input:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
  }
}
</style>