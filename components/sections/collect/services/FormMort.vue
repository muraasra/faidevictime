<template>
  <div class="p-6 bg-white dark:bg-zinc-900 rounded shadow w-full max-w-full lg:max-w-none">
    <h2 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">Formulaire de service</h2>

    <!-- Questions transversales -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Informations générales</h3>
      <div class="mb-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(question, index) in generalQuestions" :key="index" class="col-span-1">
          <component
            :is="getInputComponent(question.type)"
            :question="question"
            v-model="form.transversales[question.key]"
            @fill-coordinates="fillCoordinates"
          />
        </div>
      </div>
    </div>

    <!-- Catégorie -->
    <div class="mb-4">
      <label class="font-semibold text-gray-700 dark:text-gray-200">Catégorie de service</label>
      <select v-model="selectedCategory" class="input mt-1 w-full">
        <option value="">-- Sélectionner --</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <!-- Questions spécifiques -->
    <div v-if="selectedCategory" class="mb-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Questions spécifiques - {{ selectedCategory }}
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(question, index) in specificQuestions[selectedCategory]" :key="index" class="col-span-1">
          <component
            :is="getInputComponent(question.type)"
            :question="question"
            v-model="form.specifiques[question.key]"
          />
        </div>
      </div>
    </div>

    <button @click="submitForm" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
      Envoyer
    </button>
    <pre>{{ JSON.stringify(form, null, 2) }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { specificQuestions } from '~/constants/services'



// État du formulaire
const form = reactive({
  transversales: {
    nom_structure: '',
    fonction_repondant: '',
    nom_repondant: '',
    telephone_repondant: '',
    latitude: null,
    longitude: null,
    email: '',
    site_web: '',
    langues_parlees: [],
    jours_ouverture: [],
    heures_ouverture: '',
    gratuit: [],
  },
  specifiques: {},
});

// Catégorie sélectionnée
const selectedCategory = ref<string>('');

// Indicateurs de chargement et de soumission
const isLoading = ref<boolean>(false);
const submitStatus = ref<{ success: boolean; message: string } | null>(null);

// Liste des catégories et questions spécifiques
const categories = ref<string[]>(['Soins médicaux', 'Appui psychosocial']);


// Méthodes
const getInputComponent = (type: string) => {
  switch (type) {
    case 'radio':
      return 'RadioInput';
    case 'checkbox':
      return 'CheckboxInput';
    case 'number':
      return 'NumberInput';
    case 'text':
    default:
      return 'TextInput';
  }
};

const validateForm = (): boolean => {
  if (!form.transversales.nom_structure) {
    submitStatus.value = { success: false, message: 'Le nom de la structure est requis' };
    return false;
  }
  if (!selectedCategory.value) {
    submitStatus.value = { success: false, message: 'Veuillez sélectionner une catégorie' };
    return false;
  }
  return true;
};

const submitForm = async (): Promise<void> => {
  if (!validateForm()) return;

  isLoading.value = true;
  submitStatus.value = null;

  try {
    const response = await fetch('http://votre-backend-django/api/submit-form/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify(form),
      credentials: 'include',
    });

    const data: ApiResponse = await response.json();

    if (response.ok) {
      submitStatus.value = { success: true, message: 'Formulaire soumis avec succès!' };
    } else {
      submitStatus.value = { success: false, message: data.message || 'Une erreur est survenue' };
    }
  } catch (error) {
    submitStatus.value = { success: false, message: 'Erreur de connexion au serveur' };
  } finally {
    isLoading.value = false;
  }
};

const getCookie = (name: string): string => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
  return '';
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
