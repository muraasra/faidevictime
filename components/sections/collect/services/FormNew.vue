<template>
    <div class="p-6 bg-white dark:bg-zinc-900 rounded shadow w-full max-w-full lg:max-w-none">
      <h2 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">Formulaire de service</h2>
  
      <!-- Questions transversales -->
      <div class="mb-6 border-b pb-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">1. QUESTIONS TRANSVERSALES</h3>
        
        <!-- Consentement -->
        <div class="mb-4">
          <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">
            Vous avez lu le formulaire de consentement avec le répondant, et il/elle a signé ?
          </label>
          <div class="flex items-center gap-4">
            <label class="inline-flex items-center">
              <input type="radio" name="consentement" value="Oui" v-model="form.transversales.consentement" class="mr-2" />
              Oui
            </label>
            <label class="inline-flex items-center">
              <input type="radio" name="consentement" value="Non" v-model="form.transversales.consentement" class="mr-2" />
              Non
            </label>
          </div>
        </div>
        
        <!-- Date de collecte -->
        <div class="mb-4">
          <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">Date de collecte de données</label>
          <input v-model="form.transversales.date_collecte" type="date" class="input w-full" />
        </div>
  
        <!-- Identification du répondant -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">Fonction du répondant</label>
            <input v-model="form.transversales.fonction_repondant" type="text" class="input w-full" />
          </div>
          <div>
            <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">Nom du répondant</label>
            <input v-model="form.transversales.nom_repondant" type="text" class="input w-full" />
          </div>
          <div>
            <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">Téléphone</label>
            <input v-model="form.transversales.telephone_repondant" type="text" class="input w-full" />
          </div>
          <div>
            <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">Email</label>
            <input v-model="form.transversales.email_repondant" type="email" class="input w-full" />
          </div>
        </div>
  
        <!-- Identification de la structure -->
        <h4 class="font-semibold mb-3 text-gray-700 dark:text-gray-200">Identification de la structure</h4>
        
        <div class="mb-4">
          <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">Nom de la structure</label>
          <input v-model="form.transversales.nom_structure" type="text" class="input w-full" />
        </div>
        
        <div class="mb-4">
          <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">Type d'organisation</label>
          <select v-model="form.transversales.type_organisation" class="input w-full">
            <option value="">-- Sélectionner --</option>
            <option value="Gouvernemental">Gouvernemental</option>
            <option value="ONG internationale">ONG internationale</option>
            <option value="ONG nationale">ONG nationale</option>
            <option value="Nations Unies">Nations Unies</option>
            <option value="Organisation à base communautaire">Organisation à base communautaire</option>
            <option value="Structure privée">Structure privée</option>
            <option value="Organisation féministe">Organisation féministe</option>
            <option value="Mouvement Croix-Rouge et du Croissant-Rouge">Mouvement Croix-Rouge et du Croissant-Rouge</option>
            <option value="Université">Université</option>
            <option value="Autre">Autre</option>
          </select>
          <input v-if="form.transversales.type_organisation === 'Autre'" 
                 v-model="form.transversales.type_organisation_autre" 
                 type="text" 
                 class="input w-full mt-2" 
                 placeholder="Préciser" />
        </div>
  
        <!-- Localisation -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">Région</label>
            <select v-model="form.transversales.region" class="input w-full">
              <option value="">-- Sélectionner --</option>
              <option value="Adamaoua">Adamaoua</option>
              <option value="Ouest">Ouest</option>
            </select>
          </div>
          <div>
            <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">Département</label>
            <select v-model="form.transversales.departement" class="input w-full">
              <option value="">-- Sélectionner --</option>
              <option value="Vina" v-if="form.transversales.region === 'Adamaoua'">Vina</option>
              <option value="Noun" v-if="form.transversales.region === 'Ouest'">Noun</option>
            </select>
          </div>
          <div>
            <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">Arrondissement</label>
            <select v-model="form.transversales.arrondissement" class="input w-full">
              <option value="">-- Sélectionner --</option>
              <template v-if="form.transversales.departement === 'Vina'">
                <option value="Ngaoundéré 1">Ngaoundéré 1</option>
                <option value="Ngaoundéré 2">Ngaoundéré 2</option>
                <option value="Ngaoundéré 3">Ngaoundéré 3</option>
              </template>
              <template v-if="form.transversales.departement === 'Noun'">
                <option value="Foumban">Foumban</option>
                <option value="Koutaba">Koutaba</option>
                <option value="Foumbot">Foumbot</option>
              </template>
            </select>
          </div>
        </div>
  
        <!-- Accès au service -->
        <h4 class="font-semibold mb-3 text-gray-700 dark:text-gray-200">Accès au service</h4>
        
        <div class="mb-4">
          <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">Jours d'ouverture</label>
          <div class="flex flex-wrap gap-4">
            <label v-for="jour in jours" :key="jour" class="inline-flex items-center">
              <input type="checkbox" :value="jour" v-model="form.transversales.jours_ouverture" class="mr-2" />
              {{ jour }}
            </label>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">Heure d'ouverture</label>
            <input v-model="form.transversales.heure_ouverture" type="time" class="input w-full" />
          </div>
          <div>
            <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">Heure de fermeture</label>
            <input v-model="form.transversales.heure_fermeture" type="time" class="input w-full" />
          </div>
        </div>
        
        <div class="mb-4">
          <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">Le service est-il gratuit ?</label>
          <div class="flex items-center gap-4">
            <label class="inline-flex items-center">
              <input type="radio" name="service_gratuit" value="Oui" v-model="form.transversales.service_gratuit" class="mr-2" />
              Oui, gratuit
            </label>
            <label class="inline-flex items-center">
              <input type="radio" name="service_gratuit" value="Non" v-model="form.transversales.service_gratuit" class="mr-2" />
              Non, payant
            </label>
          </div>
        </div>
  
        <!-- Bénéficiaires et financement -->
        <h4 class="font-semibold mb-3 text-gray-700 dark:text-gray-200">Bénéficiaires et financement</h4>
        
        <div class="mb-4">
          <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">
            Combien de survivants avez-vous assistés au cours des 12 derniers mois ?
          </label>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm mb-1">Femmes ≥ 18 ans</label>
              <input v-model="form.transversales.femmes_adultes" type="number" class="input w-full" />
            </div>
            <div>
              <label class="block text-sm mb-1">Hommes ≥ 18 ans</label>
              <input v-model="form.transversales.hommes_adultes" type="number" class="input w-full" />
            </div>
            <div>
              <label class="block text-sm mb-1">Filles < 18 ans</label>
              <input v-model="form.transversales.filles_mineures" type="number" class="input w-full" />
            </div>
            <div>
              <label class="block text-sm mb-1">Garçons < 18 ans</label>
              <input v-model="form.transversales.garcons_mineurs" type="number" class="input w-full" />
            </div>
            <div class="col-span-2">
              <label class="block text-sm mb-1">Survivants avec handicap (ventiler par genre)</label>
              <input v-model="form.transversales.survivants_handicap" type="text" class="input w-full" />
            </div>
          </div>
        </div>
        
        <div class="mb-4">
          <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">
            Quelle est la source de financement de vos activités ?
          </label>
          <textarea v-model="form.transversales.source_financement" class="input w-full" rows="2"></textarea>
        </div>
        
        <div class="mb-4">
          <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">
            Quelle est la date de fin du financement ?
          </label>
          <input v-model="form.transversales.date_fin_financement" type="date" class="input w-full" />
        </div>
  
        <!-- Coordonnées géographiques -->
        <h4 class="font-semibold mb-3 text-gray-700 dark:text-gray-200">Coordonnées géographiques</h4>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">Latitude</label>
            <input v-model="form.transversales.latitude" type="text" class="input w-full" />
          </div>
          <div>
            <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">Longitude</label>
            <input v-model="form.transversales.longitude" type="text" class="input w-full" />
          </div>
          <div>
            <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">Altitude</label>
            <input v-model="form.transversales.altitude" type="text" class="input w-full" />
          </div>
        </div>
      </div>
  
      <!-- Catégorie de service -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">2. QUESTIONS SPÉCIFIQUES PAR TYPE DE SERVICE</h3>
        <div class="mb-4">
          <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">Sélectionnez la catégorie de service</label>
          <select v-model="selectedCategory" class="input w-full">
            <option value="">-- Sélectionner --</option>
            <option v-for="cat in categories" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
          </select>
        </div>
      </div>
      </div>
      </template>
  <script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  
  // Définition des types pour le formulaire
  interface FormTransversales {
    consentement: 'Oui' | 'Non' | '';
    date_collecte: string;
    fonction_repondant: string;
    nom_repondant: string;
    telephone_repondant: string;
    email_repondant: string;
    nom_structure: string;
    type_organisation: string;
    type_organisation_autre?: string;
    region: string;
    departement: string;
    arrondissement: string;
    jours_ouverture: string[];
    heure_ouverture: string;
    heure_fermeture: string;
    service_gratuit: 'Oui' | 'Non' | '';
    femmes_adultes: number | null;
    hommes_adultes: number | null;
    filles_mineures: number | null;
    garcons_mineurs: number | null;
    survivants_handicap: string;
    source_financement: string;
    date_fin_financement: string;
    latitude: string;
    longitude: string;
    altitude: string;
  }
  
  interface ServiceForm {
    transversales: FormTransversales;
    // Ces propriétés seront définies en fonction du type de service sélectionné
    sante?: any;
    psychosocial?: any;
    juridique?: any;
    securite?: any;
    accueil?: any;
    economique?: any;
    education?: any;
  }
  
  // Définition des catégories de services disponibles
  interface ServiceCategory {
    value: string;
    label: string;
  }
  
  // Liste des jours de la semaine pour les checkboxes
  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  
  // Liste des catégories de services
  const categories = ref<ServiceCategory[]>([
    { value: 'sante', label: 'Services de santé' },
    { value: 'psychosocial', label: 'Services psychosociaux' },
    { value: 'juridique', label: 'Services juridiques' },
    { value: 'securite', label: 'Services de sécurité' },
    { value: 'accueil', label: 'Services d\'accueil et d\'hébergement' },
    { value: 'economique', label: 'Services de soutien économique' },
    { value: 'education', label: 'Services éducatifs' },
  ]);
  
  // Catégorie de service sélectionnée
  const selectedCategory = ref('');
  
  // Initialisation du formulaire
  const form = reactive<ServiceForm>({
    transversales: {
      consentement: '',
      date_collecte: new Date().toISOString().split('T')[0], // Date du jour par défaut
      fonction_repondant: '',
      nom_repondant: '',
      telephone_repondant: '',
      email_repondant: '',
      nom_structure: '',
      type_organisation: '',
      region: '',
      departement: '',
      arrondissement: '',
      jours_ouverture: [],
      heure_ouverture: '',
      heure_fermeture: '',
      service_gratuit: '',
      femmes_adultes: null,
      hommes_adultes: null,
      filles_mineures: null,
      garcons_mineurs: null,
      survivants_handicap: '',
      source_financement: '',
      date_fin_financement: '',
      latitude: '',
      longitude: '',
      altitude: '',
    }
  });
  
  // Fonction pour valider le formulaire
  const validateForm = (): boolean => {
    // Validation des champs obligatoires
    if (form.transversales.consentement !== 'Oui') {
      alert('Le consentement est obligatoire pour continuer.');
      return false;
    }
    
    if (!form.transversales.date_collecte) {
      alert('La date de collecte est obligatoire.');
      return false;
    }
    
    if (!form.transversales.nom_structure) {
      alert('Le nom de la structure est obligatoire.');
      return false;
    }
    
    // Validation du type d'organisation avec champ "Autre"
    if (form.transversales.type_organisation === 'Autre' && !form.transversales.type_organisation_autre) {
      alert('Veuillez préciser le type d\'organisation.');
      return false;
    }
    
    // Validation de la sélection d'une catégorie de service
    if (!selectedCategory.value) {
      alert('Veuillez sélectionner une catégorie de service.');
      return false;
    }
    
    return true;
  };
  
  // Fonction pour soumettre le formulaire
  const submitForm = () => {
    // Validation du formulaire
    if (!validateForm()) {
      return;
    }
    
    // Soumission des données
    console.log('Formulaire soumis:', form);
    // Ici vous pourriez implémenter l'envoi des données à une API
  };
  
  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    // Réinitialisation des données du formulaire
    form.transversales = {
      consentement: '',
      date_collecte: new Date().toISOString().split('T')[0],
      fonction_repondant: '',
      nom_repondant: '',
      telephone_repondant: '',
      email_repondant: '',
      nom_structure: '',
      type_organisation: '',
      region: '',
      departement: '',
      arrondissement: '',
      jours_ouverture: [],
      heure_ouverture: '',
      heure_fermeture: '',
      service_gratuit: '',
      femmes_adultes: null,
      hommes_adultes: null,
      filles_mineures: null,
      garcons_mineurs: null,
      survivants_handicap: '',
      source_financement: '',
      date_fin_financement: '',
      latitude: '',
      longitude: '',
      altitude: '',
    };
    selectedCategory.value = '';
  };
  
  // Observer les changements de région pour mettre à jour les départements
  watch(() => form.transversales.region, () => {
    // Réinitialiser le département si la région change
    form.transversales.departement = '';
    form.transversales.arrondissement = '';
  });
  
  // Observer les changements de département pour mettre à jour les arrondissements
  watch(() => form.transversales.departement, () => {
    // Réinitialiser l'arrondissement si le département change
    form.transversales.arrondissement = '';
  });
  </script>