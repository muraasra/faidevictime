<template>
  <div class="p-6 bg-white dark:bg-zinc-900 rounded shadow w-full max-w-full lg:max-w-none">
    <h2 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">Formulaire de service</h2>

    <!-- Questions transversales -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Informations générales</h3>
      <div class="mb-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(question, index) in generalQuestions" :key="index" class="col-span-1">
          <div>
            <label class="font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
              {{ question.label }}
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
                  :placeholder="'Entrez ' + question.label"
                  readonly
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
          <div>
            <label class="font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
              {{ question.label }}
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
                  />
                  {{ option }}
                </label>
              </div>
            </div>
            <div v-else-if="question.type === 'radioBol'">
              <div class="flex flex-col space-y-2">
                <div class="flex items-center gap-4">
            <label class="inline-flex items-center">
              <input type="radio" :name="form.specifiques[question.key]" value="1" v-model="form.specifiques[question.key]" class="mr-2" />
              Oui
            </label>
            <label class="inline-flex items-center">
              <input type="radio" :name="form.specifiques[question.key]" value="0" v-model="form.specifiques[question.key]" class="mr-2" />
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bouton envoyer -->
    <button @click="submitForm" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
      Envoyer
    </button>

    <!-- Debug form -->
    <pre>{{ JSON.stringify(form, null, 2) }}</pre>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ref, reactive, watch } from 'vue';
import { specificQuestions, generalQuestions } from '~/constants/services'
const auth = useAuthStore();
// Liste des catégories et leurs IDs

const category_id=ref<number|null>(null);
// Watcher pour mettre à jour l'ID de la catégorie sélectionnée
// Catégorie sélectionnée
const selectedCategory = ref<string>('');
// Mettre à jour `category_id` lorsque `selectedCategory` change

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

// Fonction pour remplir automatiquement les coordonnées
const fillCoordinates = () => {
  if (!navigator.geolocation) {
    alert('La géolocalisation n’est pas prise en charge par votre navigateur.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      form.transversales.longitude = parseFloat(position.coords.longitude.toFixed(6));
      form.transversales.latitude = parseFloat(position.coords.latitude.toFixed(6));
    },
    (error) => {
      alert('Impossible de récupérer les coordonnées : ' + error.message);
    }
  );
};

// Chargement et statut
const isLoading = ref<boolean>(false);
const submitStatus = ref<{ success: boolean; message: string } | null>(null);

// Catégories de service
const categories = ref<string[]>(['Soins médicaux', 'Appui psychosocial','Police / Sécurité','Assistance juridique','Hébergement','Réinsertion économique']);

// Retourne le type d'input HTML
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

// Valider le formulaire avant soumission
const validateForm = (): boolean => {
  // Réinitialiser les erreurs
  Object.keys(errors).forEach((key) => (errors[key] = ""));

  let isValid = true;

  // Valider les champs transversaux
  for (const [key, value] of Object.entries(form.transversales)) {
    if (value === "" || value === null || value === undefined) {
      errors[key] = `Le champ "${key}" est requis.`;
      isValid = false;
    }

    // Validation spécifique au type
    if (key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string)) {
      errors[key] = "Veuillez entrer une adresse email valide.";
      isValid = false;
    }

    // Validation spécifique au type
    if (key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string)) {
      errors[key] = "Veuillez entrer une adresse email valide.";
      isValid = false;
    }

    if ((key === "longitude" || key === "latitude") && isNaN(Number(value))) {
      errors[key] = `Le champ "${key}" doit être un nombre valide.`;
      isValid = false;
    }

    if (key === "telephone_repondant" && !/^\d{10}$/.test(value as string)) {
      errors[key] = "Veuillez entrer un numéro de téléphone valide (10 chiffres).";
      isValid = false;
    }

    if (key === "heures_ouverture" && !/^\d{2}:\d{2}$/.test(value as string)) {
      errors[key] = `Le champ "${key}" doit être une heure valide au format HH:mm.`;
      isValid = false;
    }
  }

  return isValid;
};
 

// Soumettre le formulaire
const submitForm = async (): Promise<void> => {
  if (!validateForm()) {
    return;
  }

  console.log("Formulaire soumis :", form);
  alert("Formulaire soumis avec succès !");

  isLoading.value = true;
  submitStatus.value = null;

  try {
    const response = await useApi('http://localhost:8000/api/submit-form/', {
      method: 'POST',
      body: JSON.stringify(form),
      credentials: 'include',
    });

    const data = response.data;

    if (response?.data) {
      submitStatus.value = { success: true, message: 'Formulaire soumis avec succès!' };
    } else {
      submitStatus.value = { success: false, message: response?.error?.value?.message || 'Une erreur est survenue' };
    }
  } catch (error) {
    submitStatus.value = { success: false, message: 'Erreur de connexion au serveur' };
  } finally {
    isLoading.value = false;
  }
};

// Récupérer CSstyleken
// const getCookie = (name: string): string => {
//   const value = ; ${document.cookie};
//   const parts = value.split(; ${name}=);
//   if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
//   return '';
// };
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