<template>
  <div class="p-6 bg-white dark:bg-zinc-900 rounded shadow w-full max-w-full lg:max-w-none">
    <h2 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">Formulaire de service</h2>

    <!-- Message de notification -->
    <div v-if="notification.show" 
         class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg shadow-lg transition-all duration-500 z-50"
         :class="notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'">
      {{ notification.message }}
    </div>

    <!-- Questions transversales -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Informations générales</h3>
      <div class="mb-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(question, index) in generalQuestions" :key="index" class="col-span-1">
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

            <!-- Input simple -->
            <div v-else>
              <input
                :type="getInputType(question.type)"
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

    <!-- Questions spécifiques -->
    <div v-if="selectedCategory" class="mb-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Questions spécifiques - {{ selectedCategory }}
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(question, index) in specificQuestions[selectedCategory]" :key="index" class="col-span-1">
          <div>
            <label class="font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
              {{ question.label }}
              <span v-if="question.required" class="text-red-500">*</span>
            </label>

            <!-- Specific checkbox multiple -->
            <div v-if="question.type === 'checkbox'">
              <div class="flex flex-col space-y-2">
                <label v-for="option in question.options" :key="option" class="inline-flex items-center">
                  <input
                    type="checkbox"
                    :value="option"
                    v-model="form.specifiques[question.key]"
                    class="mr-2"
                    @change="validateField(question.key, form.specifiques[question.key])"
                  />
                  {{ option }}
                </label>
              </div>
            </div>

            <!-- Specific radio -->
            <div v-else-if="question.type === 'radio'">
              <div class="flex flex-col space-y-2">
                <label v-for="option in question.options" :key="option" class="inline-flex items-center">
                  <input
                    type="radio"
                    :name="question.key"
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
                      :name="form.specifiques[question.key]" 
                      value="1" 
                      v-model="form.specifiques[question.key]" 
                      class="mr-2"
                      @change="validateField(question.key, form.specifiques[question.key])"
                    />
                    Oui
                  </label>
                  <label class="inline-flex items-center">
                    <input 
                      type="radio" 
                      :name="form.specifiques[question.key]" 
                      value="0" 
                      v-model="form.specifiques[question.key]" 
                      class="mr-2"
                      @change="validateField(question.key, form.specifiques[question.key])"
                    />
                    Non
                  </label>
                </div>
              </div>
            </div>

            <!-- Specific input simple -->
            <div v-else>
              <input
                :type="getInputType(question.type)"
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

    <!-- Bouton envoyer -->
    <div class="flex justify-end mt-6">
      <button 
        @click="submitForm"
        :disabled="isLoading" 
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
  <pre> {{ form }} // {{ jso }}</pre>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { data } from 'autoprefixer';
import { ref, reactive, watch } from 'vue';
import { specificQuestions, generalQuestions } from '~/constants/services'

const auth = useAuthStore();
const category_id = ref<number|null>(null);
const selectedCategory = ref<string>('');

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

// Formulaire réactif
const form = reactive({
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
    author: auth.user?.id
  },
  specifiques: {
    medicaments_disponibles: [],
    categorie: selectedCategory,
  },
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
const categories = ref<string[]>(['Soins médicaux', 'Appui psychosocial','Police / Sécurité','Assistance juridique','Hébergement','Réinsertion économique']);

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

  // Skip validation for non-required fields
  const field = [...generalQuestions, ...Object.values(specificQuestions).flat()]
    .find(q => q.key === key);
  if (field && !field.required) {
    return true;
  }

  if (value === "" || value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
    errors[key] = `Ce champ est requis`;
    return false;
  }

  switch (key) {
    case 'email':
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors[key] = "Veuillez entrer une adresse email valide";
        return false;
      }
      break;
    case 'telephone_repondant':
      if (!/^\d{10}$/.test(value)) {
        errors[key] = "Le numéro doit contenir 10 chiffres";
        return false;
      }
      break;
    case 'heures_ouverture':
      if (!/^\d{2}:\d{2}$/.test(value)) {
        errors[key] = "Format requis: HH:mm";
        return false;
      }
      break;
    case 'longitude':
      if (isNaN(Number(value)) || Number(value) < -180 || Number(value) > 180) {
        errors[key] = "Longitude invalide (-180 à 180)";
        return false;
      }
      break;
    case 'latitude':
      if (isNaN(Number(value)) || Number(value) < -90 || Number(value) > 90) {
        errors[key] = "Latitude invalide (-90 à 90)";
        return false;
      }
      break;
  }

  return true;
};

const validateForm = (): boolean => {
  let isValid = true;

  // Validate required transversales
  for (const [key, value] of Object.entries(form.transversales)) {
    const field = generalQuestions.find(q => q.key === key);
    if (field?.required && !validateField(key, value)) {
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
    for (const [key, value] of Object.entries(form.specifiques)) {
      const field = specificQuestions[selectedCategory.value]?.find(q => q.key === key);
      if (field?.required && !validateField(key, value)) {
        isValid = false;
      }
    }
  }

  if (!isValid) {
    showNotification('Veuillez corriger les erreurs dans le formulaire', 'error');
  }

  return isValid;
};

const submitForm = async (): Promise<void> => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;
  let jso= JSON.stringify(form)

  try {
    const response = await useApi('http://localhost:8000/api/submit-form/', {
      method: 'POST',
      body: JSON.stringify(form), 
    });

    if (response?.data) {
      showNotification('Formulaire soumis avec succès! Votre service a bien été enregistré.', 'success');
      // Reset form
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
        author: auth.user?.id
      };
      form.specifiques = {
        medicaments_disponibles: [],
        categorie: "",
      };
      selectedCategory.value = "";
    } else {
      throw new Error(response?.error?.value?.message || 'Une erreur est survenue');
    }
  } catch (error) {
    showNotification(error instanceof Error ? error.message : 'Erreur de connexion au serveur', 'error');
  } finally {
    isLoading.value = false;
  }
};

</script>

<style scoped>
.input {
  border: 1px solid #ccc;
  padding: 0.5rem;
  border-radius: 4px;
}

@media (min-width: 1024px) {
  .w-full-screen {
    width: 100vw;
  }
}
</style>