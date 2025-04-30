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
  
      <!-- Questions spécifiques en fonction de la catégorie -->
      <div v-if="selectedCategory" class="mb-6 border-t pt-6">
        <div v-if="selectedCategory === 'soins_medicaux'">
          <h4 class="font-semibold mb-4 text-gray-700 dark:text-gray-200">Soins médicaux</h4>
          
          <div class="mb-4">
            <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">
              Disposez-vous d'un protocole de prise en charge médicale des cas de viol ?
            </label>
            <div class="flex items-center gap-4">
              <label class="inline-flex items-center">
                <input type="radio" name="protocole_viol" value="Oui" v-model="form.specifiques.protocole_viol" class="mr-2" />
                Oui
              </label>
              <label class="inline-flex items-center">
                <input type="radio" name="protocole_viol" value="Non" v-model="form.specifiques.protocole_viol" class="mr-2" />
                Non
              </label>
            </div>
          </div>
          
          <h5 class="font-medium mb-2 text-gray-700 dark:text-gray-200">Ressources humaines</h5>
          <div class="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label class="block text-sm">Catégorie</label>
            </div>
            <div>
              <label class="block text-sm">Hommes</label>
            </div>
            <div>
              <label class="block text-sm">Femmes</label>
            </div>
            
            <div>
              <label class="block text-sm">Infirmiers</label>
            </div>
            <div>
              <input v-model="form.specifiques.infirmiers_hommes" type="number" class="input w-full" />
            </div>
            <div>
              <input v-model="form.specifiques.infirmiers_femmes" type="number" class="input w-full" />
            </div>
            
            <div>
              <label class="block text-sm">Matrones</label>
            </div>
            <div>
              <input v-model="form.specifiques.matrones_hommes" type="number" class="input w-full" />
            </div>
            <div>
              <input v-model="form.specifiques.matrones_femmes" type="number" class="input w-full" />
            </div>
            
            <div>
              <label class="block text-sm">Sage-femmes</label>
            </div>
            <div>
              <input v-model="form.specifiques.sage_femmes_hommes" type="number" class="input w-full" />
            </div>
            <div>
              <input v-model="form.specifiques.sage_femmes_femmes" type="number" class="input w-full" />
            </div>
            
            <div>
              <label class="block text-sm">Médecins</label>
            </div>
            <div>
              <input v-model="form.specifiques.medecins_hommes" type="number" class="input w-full" />
            </div>
            <div>
              <input v-model="form.specifiques.medecins_femmes" type="number" class="input w-full" />
            </div>
            
            <div>
              <label class="block text-sm">Assistants de santé</label>
            </div>
            <div>
              <input v-model="form.specifiques.assistants_sante_hommes" type="number" class="input w-full" />
            </div>
            <div>
              <input v-model="form.specifiques.assistants_sante_femmes" type="number" class="input w-full" />
            </div>
            
            <div>
              <label class="block text-sm">Gynécologues</label>
            </div>
            <div>
              <input v-model="form.specifiques.gynecologues_hommes" type="number" class="input w-full" />
            </div>
            <div>
              <input v-model="form.specifiques.gynecologues_femmes" type="number" class="input w-full" />
            </div>
            
            <div>
              <label class="block text-sm">Autres agents</label>
            </div>
            <div>
              <input v-model="form.specifiques.autres_agents_hommes" type="number" class="input w-full" />
            </div>
            <div>
              <input v-model="form.specifiques.autres_agents_femmes" type="number" class="input w-full" />
            </div>
          </div>
          
          <h5 class="font-medium mb-2 text-gray-700 dark:text-gray-200">Infrastructures disponibles</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            <div v-for="infra in infrastructures_medicales" :key="infra.value">
              <label class="inline-flex items-center">
                <input type="checkbox" :value="infra.value" v-model="form.specifiques.infrastructures" class="mr-2" />
                {{ infra.label }}
              </label>
            </div>
          </div>
          
          <h5 class="font-medium mb-2 text-gray-700 dark:text-gray-200">Médicaments disponibles</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            <div v-for="med in medicaments" :key="med.value">
              <label class="inline-flex items-center">
                <input type="checkbox" :value="med.value" v-model="form.specifiques.medicaments" class="mr-2" />
                {{ med.label }}
              </label>
            </div>
          </div>
          
          <h5 class="font-medium mb-2 text-gray-700 dark:text-gray-200">Matériel disponible</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            <div v-for="mat in materiel_medical" :key="mat.value">
              <label class="inline-flex items-center">
                <input type="checkbox" :value="mat.value" v-model="form.specifiques.materiel" class="mr-2" />
                {{ mat.label }}
              </label>
            </div>
          </div>
          
          <h5 class="font-medium mb-2 text-gray-700 dark:text-gray-200">Fournitures administratives</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            <div v-for="four in fournitures_admin" :key="four.value">
              <label class="inline-flex items-center">
                <input type="checkbox" :value="four.value" v-model="form.specifiques.fournitures_admin" class="mr-2" />
                {{ four.label }}
              </label>
            </div>
          </div>
          
          <h5 class="font-medium mb-2 text-gray-700 dark:text-gray-200">Services SRMNE disponibles</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            <div v-for="serv in services_srmne" :key="serv.value">
              <label class="inline-flex items-center">
                <input type="checkbox" :value="serv.value" v-model="form.specifiques.services_srmne" class="mr-2" />
                {{ serv.label }}
              </label>
            </div>
          </div>
          <div v-if="form.specifiques.services_srmne && form.specifiques.services_srmne.includes('autres')">
            <input v-model="form.specifiques.services_srmne_autres" type="text" class="input w-full mt-2" placeholder="Précisez les autres services" />
          </div>
          
          <h5 class="font-medium mb-2 text-gray-700 dark:text-gray-200">Capacités des services</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            <div v-for="cap in capacites_services" :key="cap.value">
              <label class="inline-flex items-center">
                <input type="checkbox" :value="cap.value" v-model="form.specifiques.capacites_services" class="mr-2" />
                {{ cap.label }}
              </label>
            </div>
          </div>
          <div v-if="form.specifiques.capacites_services && form.specifiques.capacites_services.includes('autres')">
            <input v-model="form.specifiques.capacites_services_autres" type="text" class="input w-full mt-2" placeholder="Précisez les autres équipements" />
          </div>
          
          <h5 class="font-medium mb-2 text-gray-700 dark:text-gray-200">Formations reçues au cours des 12 derniers mois</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            <div v-for="form_med in formations_medicales" :key="form_med.value">
              <label class="inline-flex items-center">
                <input type="checkbox" :value="form_med.value" v-model="form.specifiques.formations_medicales" class="mr-2" />
                {{ form_med.label }}
              </label>
            </div>
          </div>
          <div v-if="form.specifiques.formations_medicales && form.specifiques.formations_medicales.includes('autres')">
            <input v-model="form.specifiques.formations_medicales_autres" type="text" class="input w-full mt-2" placeholder="Précisez les autres formations" />
          </div>
          
          <div class="mb-4">
            <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">
              Existe-t-il un kit de collecte des preuves médico-légales ?
            </label>
            <div class="flex items-center gap-4">
              <label class="inline-flex items-center">
                <input type="radio" name="kit_medico_legal" value="Oui" v-model="form.specifiques.kit_medico_legal" class="mr-2" />
                Oui
              </label>
              <label class="inline-flex items-center">
                <input type="radio" name="kit_medico_legal" value="Non" v-model="form.specifiques.kit_medico_legal" class="mr-2" />
                Non
              </label>
            </div>
          </div>
          
          <div class="mb-4">
            <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">
              Quelles sont les principales difficultés que vous rencontrez dans ce service ?
            </label>
            <textarea v-model="form.specifiques.difficultes_medicales" class="input w-full" rows="3"></textarea>
          </div>
        </div>
        
        <div v-else-if="selectedCategory === 'appui_psychosocial'">
  <h4 class="font-semibold mb-4 text-gray-700 dark:text-gray-200">Appui psychosocial / gestion de cas</h4>
  
  <h5 class="font-medium mb-2 text-gray-700 dark:text-gray-200">Soutien apporté</h5>
  <div class="mb-4">
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="soutien_emotionnel" v-model="form.specifiques.soutien_apporte" class="mr-2" />
        Apportez-vous un soutien émotionnel de base / premiers secours psychologique ?
      </label>
    </div>
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="appui_individuel" v-model="form.specifiques.soutien_apporte" class="mr-2" />
        Apportez-vous un appui psychosocial individuel ?
      </label>
    </div>
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="appui_groupe" v-model="form.specifiques.soutien_apporte" class="mr-2" />
        Apportez-vous un appui psychosocial de groupe ?
      </label>
    </div>
  </div>
  
  <h5 class="font-medium mb-2 text-gray-700 dark:text-gray-200">Type d'activités gérées</h5>
  <div class="mb-4">
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="gestion_cas_enfants" v-model="form.specifiques.activites_gerees" class="mr-2" />
        Gestion des cas de violences pour les survivants enfants
      </label>
    </div>
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="gestion_cas_adultes" v-model="form.specifiques.activites_gerees" class="mr-2" />
        Gestion des cas de VBG/EAS pour les survivants adultes
      </label>
    </div>
  </div>
  
  <div class="mb-4">
    <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">Kits de dignité</label>
    <div class="flex items-center gap-4">
      <label class="inline-flex items-center">
        <input type="radio" name="kits_dignite" value="Oui" v-model="form.specifiques.kits_dignite" class="mr-2" />
        Oui
      </label>
      <label class="inline-flex items-center">
        <input type="radio" name="kits_dignite" value="Non" v-model="form.specifiques.kits_dignite" class="mr-2" />
        Non
      </label>
    </div>
  </div>
  
  <div class="mb-4">
    <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">
      Assistance financière ponctuelle pour répondre aux besoins immédiats de la personne survivante
    </label>
    <div class="flex items-center gap-4">
      <label class="inline-flex items-center">
        <input type="radio" name="assistance_financiere" value="Oui" v-model="form.specifiques.assistance_financiere" class="mr-2" />
        Oui
      </label>
      <label class="inline-flex items-center">
        <input type="radio" name="assistance_financiere" value="Non" v-model="form.specifiques.assistance_financiere" class="mr-2" />
        Non
      </label>
    </div>
  </div>
  
  <div class="mb-4">
    <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">
      Autres appuis pour la gestion des cas non énumérés
    </label>
    <div class="flex items-center gap-4">
      <label class="inline-flex items-center">
        <input type="radio" name="autres_appuis" value="Oui" v-model="form.specifiques.autres_appuis" class="mr-2" />
        Oui
      </label>
      <label class="inline-flex items-center">
        <input type="radio" name="autres_appuis" value="Non" v-model="form.specifiques.autres_appuis" class="mr-2" />
        Non
      </label>
    </div>
    <div v-if="form.specifiques.autres_appuis === 'Oui'" class="mt-2">
      <input v-model="form.specifiques.autres_appuis_details" type="text" class="input w-full" placeholder="Citez-les" />
    </div>
  </div>
  
  <h5 class="font-medium mb-2 text-gray-700 dark:text-gray-200">Le service est-il gratuit ?</h5>
  <div class="mb-4">
    <div class="flex items-center gap-4">
      <label class="inline-flex items-center">
        <input type="radio" name="service_gratuit_ps" value="Oui" v-model="form.specifiques.service_gratuit" class="mr-2" />
        Oui
      </label>
      <label class="inline-flex items-center">
        <input type="radio" name="service_gratuit_ps" value="Non" v-model="form.specifiques.service_gratuit" class="mr-2" />
        Non
      </label>
    </div>
    <div v-if="form.specifiques.service_gratuit === 'Non'" class="mt-2">
      <input v-model="form.specifiques.cout_service" type="number" class="input w-full" placeholder="Coût estimatif du service (en FCFA)" />
    </div>
  </div>
  
  <h5 class="font-medium mb-2 text-gray-700 dark:text-gray-200">Personnel impliqué dans la gestion de cas</h5>
  <div class="grid grid-cols-3 gap-4 mb-4">
    <div>
      <label class="block text-sm">Fonction</label>
    </div>
    <div>
      <label class="block text-sm">Hommes</label>
    </div>
    <div>
      <label class="block text-sm">Femmes</label>
    </div>
    
    <div>
      <label class="block text-sm">Gestionnaires des cas de violences envers enfants</label>
    </div>
    <div>
      <input v-model="form.specifiques.gest_cas_enfants_h" type="number" class="input w-full" />
    </div>
    <div>
      <input v-model="form.specifiques.gest_cas_enfants_f" type="number" class="input w-full" />
    </div>
    
    <div>
      <label class="block text-sm">Gestionnaires des cas de VBG/EAS</label>
    </div>
    <div>
      <input v-model="form.specifiques.gest_cas_vbg_h" type="number" class="input w-full" />
    </div>
    <div>
      <input v-model="form.specifiques.gest_cas_vbg_f" type="number" class="input w-full" />
    </div>
    
    <div>
      <label class="block text-sm">Superviseurs de gestion des cas de VBG</label>
    </div>
    <div>
      <input v-model="form.specifiques.superviseurs_vbg_h" type="number" class="input w-full" />
    </div>
    <div>
      <input v-model="form.specifiques.superviseurs_vbg_f" type="number" class="input w-full" />
    </div>
    
    <div>
      <label class="block text-sm">Agents psychosociaux (APS)</label>
    </div>
    <div>
      <input v-model="form.specifiques.aps_h" type="number" class="input w-full" />
    </div>
    <div>
      <input v-model="form.specifiques.aps_f" type="number" class="input w-full" />
    </div>
    
    <div>
      <label class="block text-sm">Autres personnes travaillant dans le service</label>
    </div>
    <div>
      <input v-model="form.specifiques.autres_personnel_h" type="number" class="input w-full" />
    </div>
    <div>
      <input v-model="form.specifiques.autres_personnel_f" type="number" class="input w-full" />
    </div>
    
    <div>
      <label class="block text-sm">Agents formés en gestion des cas de violences envers enfants</label>
    </div>
    <div>
      <input v-model="form.specifiques.agents_formes_enfants_h" type="number" class="input w-full" />
    </div>
    <div>
      <input v-model="form.specifiques.agents_formes_enfants_f" type="number" class="input w-full" />
    </div>
    
    <div>
      <label class="block text-sm">Agents formés en gestion des cas de VBG/EAS</label>
    </div>
    <div>
      <input v-model="form.specifiques.agents_formes_vbg_h" type="number" class="input w-full" />
    </div>
    <div>
      <input v-model="form.specifiques.agents_formes_vbg_f" type="number" class="input w-full" />
    </div>
    
    <div>
      <label class="block text-sm">Agents formés en prévention des Exploitations et Abus sexuels (EAS)</label>
    </div>
    <div>
      <input v-model="form.specifiques.agents_formes_eas_h" type="number" class="input w-full" />
    </div>
    <div>
      <input v-model="form.specifiques.agents_formes_eas_f" type="number" class="input w-full" />
    </div>
    
    <div>
      <label class="block text-sm">Agents formés à l'accompagnement psychosocial des survivantes de VBG</label>
    </div>
    <div>
      <input v-model="form.specifiques.agents_formes_psy_h" type="number" class="input w-full" />
    </div>
    <div>
      <input v-model="form.specifiques.agents_formes_psy_f" type="number" class="input w-full" />
    </div>
  </div>
  
  <h5 class="font-medium mb-2 text-gray-700 dark:text-gray-200">Infrastructures et outils</h5>
  <div class="grid grid-cols-1 gap-2 mb-4">
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="salle_ecoute" v-model="form.specifiques.infrastructures_ps" class="mr-2" />
        Salle d'écoute confidentielle et confortable pour les survivants
      </label>
    </div>
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="espace_enfants" v-model="form.specifiques.infrastructures_ps" class="mr-2" />
        Espace sûr adapté pour les enfants
      </label>
    </div>
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="outils_gestion_cas" v-model="form.specifiques.infrastructures_ps" class="mr-2" />
        Outils de gestion de cas existants
      </label>
    </div>
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="equipements_securite" v-model="form.specifiques.infrastructures_ps" class="mr-2" />
        Équipements pour la sécurité des dossiers (codes, armoires, portes sécurisées, clés...)
      </label>
    </div>
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="activites_bienetre" v-model="form.specifiques.infrastructures_ps" class="mr-2" />
        Activités de bien-être pour le staff de gestion de cas
      </label>
    </div>
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="protocole_prise_charge" v-model="form.specifiques.infrastructures_ps" class="mr-2" />
        Protocole de prise en charge psychosociale et de gestion de cas
      </label>
    </div>
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="circuit_referencement" v-model="form.specifiques.infrastructures_ps" class="mr-2" />
        Circuit de référencement vers d'autres services
      </label>
    </div>
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="mecanisme_reponse_eas" v-model="form.specifiques.infrastructures_ps" class="mr-2" />
        Mécanisme de réponse aux cas d'EAS / harcèlement sexuel
      </label>
    </div>
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="autres_infrastructures" v-model="form.specifiques.infrastructures_ps" class="mr-2" />
        Autres infrastructures/équipements pour la gestion des cas de VBG
      </label>
    </div>
  </div>
  <div v-if="form.specifiques.infrastructures_ps && form.specifiques.infrastructures_ps.includes('autres_infrastructures')">
    <input v-model="form.specifiques.autres_infrastructures_details" type="text" class="input w-full mt-2" placeholder="Citez-les" />
  </div>
  
  <div class="mb-4">
    <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">
      Quelles sont les difficultés que vous rencontrez dans ce service ?
    </label>
    <textarea v-model="form.specifiques.difficultes_ps" class="input w-full" rows="3"></textarea>
  </div>
</div>

<div v-else-if="selectedCategory === 'sante_mentale'">
  <h4 class="font-semibold mb-4 text-gray-700 dark:text-gray-200">Soins de santé mentale aux survivants de violences</h4>
  
  <h5 class="font-medium mb-2 text-gray-700 dark:text-gray-200">Type d'appui pour la santé mentale</h5>
  <div class="grid grid-cols-1 gap-2 mb-4">
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="accompagnement_pharmacologique" v-model="form.specifiques.type_appui_sm" class="mr-2" />
        Accompagnement pharmacologique (Disponibilité de médicaments psychotropes)
      </label>
    </div>
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="accompagnement_psychologique" v-model="form.specifiques.type_appui_sm" class="mr-2" />
        Accompagnement psychologique (PM+, Gestion du stress et PSP, psychothérapie de soutien)
      </label>
    </div>
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="accompagnement_social" v-model="form.specifiques.type_appui_sm" class="mr-2" />
        Accompagnement social (aide à la restauration de la dignité de la personne)
      </label>
    </div>
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="autres_appuis_sm" v-model="form.specifiques.type_appui_sm" class="mr-2" />
        Autres appuis
      </label>
    </div>
  </div>
  <div v-if="form.specifiques.type_appui_sm && form.specifiques.type_appui_sm.includes('autres_appuis_sm')">
    <input v-model="form.specifiques.autres_appuis_sm_details" type="text" class="input w-full mt-2" placeholder="À préciser" />
  </div>
  
  <h5 class="font-medium mb-2 text-gray-700 dark:text-gray-200">Personnel</h5>
  <div class="mb-4">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm">Hommes</label>
        <input v-model="form.specifiques.personnel_sm_h" type="number" class="input w-full" />
      </div>
      <div>
        <label class="block text-sm">Femmes</label>
        <input v-model="form.specifiques.personnel_sm_f" type="number" class="input w-full" />
      </div>
    </div>
  </div>
  
  <h5 class="font-medium mb-2 text-gray-700 dark:text-gray-200">Spécialisation du personnel</h5>
  <div class="grid grid-cols-3 gap-4 mb-4">
    <div>
      <label class="block text-sm">Fonction</label>
    </div>
    <div>
      <label class="block text-sm">Hommes</label>
    </div>
    <div>
      <label class="block text-sm">Femmes</label>
    </div>
    
    <div>
      <label class="block text-sm">Psychiatres</label>
    </div>
    <div>
      <input v-model="form.specifiques.psychiatres_h" type="number" class="input w-full" />
    </div>
    <div>
      <input v-model="form.specifiques.psychiatres_f" type="number" class="input w-full" />
    </div>
    
    <div>
      <label class="block text-sm">Psychologues cliniciens</label>
    </div>
    <div>
      <input v-model="form.specifiques.psycho_cliniciens_h" type="number" class="input w-full" />
    </div>
    <div>
      <input v-model="form.specifiques.psycho_cliniciens_f" type="number" class="input w-full" />
    </div>
    
    <div>
      <label class="block text-sm">Infirmiers en santé mentale</label>
    </div>
    <div>
      <input v-model="form.specifiques.infirmiers_sm_h" type="number" class="input w-full" />
    </div>
    <div>
      <input v-model="form.specifiques.infirmiers_sm_f" type="number" class="input w-full" />
    </div>
    
    <div>
      <label class="block text-sm">Sociologues</label>
    </div>
    <div>
      <input v-model="form.specifiques.sociologues_h" type="number" class="input w-full" />
    </div>
    <div>
      <input v-model="form.specifiques.sociologues_f" type="number" class="input w-full" />
    </div>
    
    <div>
      <label class="block text-sm">Anthropologues</label>
    </div>
    <div>
      <input v-model="form.specifiques.anthropologues_h" type="number" class="input w-full" />
    </div>
    <div>
      <input v-model="form.specifiques.anthropologues_f" type="number" class="input w-full" />
    </div>
    
    <div>
      <label class="block text-sm">Médecins formés en santé mentale</label>
    </div>
    <div>
      <input v-model="form.specifiques.medecins_sm_h" type="number" class="input w-full" />
    </div>
    <div>
      <input v-model="form.specifiques.medecins_sm_f" type="number" class="input w-full" />
    </div>
    
    <div>
      <label class="block text-sm">Agents psychosociaux</label>
    </div>
    <div>
      <input v-model="form.specifiques.agents_psychosociaux_h" type="number" class="input w-full" />
    </div>
    <div>
      <input v-model="form.specifiques.agents_psychosociaux_f" type="number" class="input w-full" />
    </div>
    
    <div>
      <label class="block text-sm">Autres personnels offrant des soins en santé mentale</label>
    </div>
    <div>
      <input v-model="form.specifiques.autres_sm_h" type="number" class="input w-full" />
    </div>
    <div>
      <input v-model="form.specifiques.autres_sm_f" type="number" class="input w-full" />
    </div>
  </div>
  
  <h5 class="font-medium mb-2 text-gray-700 dark:text-gray-200">Infrastructures et fournitures / politiques pour la gestion de la santé mentale des cas de VBG</h5>
  <div class="grid grid-cols-1 gap-2 mb-4">
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="salle_ecoute_sm" v-model="form.specifiques.infrastructures_sm" class="mr-2" />
        Salle d'écoute et gestion de cas confidentielle et offrant un minimum de confort pour les survivants
      </label>
    </div>
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="espaces_surs_enfants" v-model="form.specifiques.infrastructures_sm" class="mr-2" />
        Présence d'espaces sûrs adaptés pour les enfants
      </label>
    </div>
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="equipements_securite_sm" v-model="form.specifiques.infrastructures_sm" class="mr-2" />
        Équipements pour la sécurité des dossiers des survivants
      </label>
    </div>
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="protocole_sm_vbg" v-model="form.specifiques.infrastructures_sm" class="mr-2" />
        Existence d'un protocole de prise en charge des besoins en santé mentale pour les cas de VBG
      </label>
    </div>
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="autres_infrastructures_sm" v-model="form.specifiques.infrastructures_sm" class="mr-2" />
        Autres
      </label>
    </div>
  </div>
  <div v-if="form.specifiques.infrastructures_sm && form.specifiques.infrastructures_sm.includes('autres_infrastructures_sm')">
    <input v-model="form.specifiques.autres_infrastructures_sm_details" type="text" class="input w-full mt-2" placeholder="Préciser" />
  </div>
  
  <h5 class="font-medium mb-2 text-gray-700 dark:text-gray-200">Formations du personnel</h5>
  <div class="grid grid-cols-3 gap-4 mb-4">
    <div>
      <label class="block text-sm">Formation</label>
    </div>
    <div>
      <label class="block text-sm">Hommes</label>
    </div>
    <div>
      <label class="block text-sm">Femmes</label>
    </div>
    
    <div>
      <label class="block text-sm">Personnel de santé mentale formé sur les violences envers les enfants</label>
    </div>
    <div>
      <input v-model="form.specifiques.formes_violences_enfants_h" type="number" class="input w-full" />
    </div>
    <div>
      <input v-model="form.specifiques.formes_violences_enfants_f" type="number" class="input w-full" />
    </div>
    
    <div>
      <label class="block text-sm">Personnel de santé mentale formé sur les VBG / EAS</label>
    </div>
    <div>
      <input v-model="form.specifiques.formes_vbg_eas_h" type="number" class="input w-full" />
    </div>
    <div>
      <input v-model="form.specifiques.formes_vbg_eas_f" type="number" class="input w-full" />
    </div>
    
    <div>
      <label class="block text-sm">Personnel médical formé sur le programme MhGAP</label>
    </div>
    <div>
      <input v-model="form.specifiques.formes_mhgap_h" type="number" class="input w-full" />
    </div>
    <div>
      <input v-model="form.specifiques.formes_mhgap_f" type="number" class="input w-full" />
    </div>
    
    <div>
      <label class="block text-sm">Personnel formé au Premier secours psychologique</label>
    </div>
    <div>
      <input v-model="form.specifiques.formes_psp_h" type="number" class="input w-full" />
    </div>
    <div>
      <input v-model="form.specifiques.formes_psp_f" type="number" class="input w-full" />
    </div>
    
    <div>
      <label class="block text-sm">Personnel formé à la gestion de cas</label>
    </div>
    <div>
      <input v-model="form.specifiques.formes_gestion_cas_h" type="number" class="input w-full" />
    </div>
    <div>
      <input v-model="form.specifiques.formes_gestion_cas_f" type="number" class="input w-full" />
    </div>
    
    <div>
      <label class="block text-sm">Personnel formé à la prévention des EAS / harcèlement sexuel</label>
    </div>
    <div>
      <input v-model="form.specifiques.formes_prevention_eas_h" type="number" class="input w-full" />
    </div>
    <div>
      <input v-model="form.specifiques.formes_prevention_eas_f" type="number" class="input w-full" />
    </div>
  </div>
  
  <div class="mb-4">
    <label class="block font-medium text-sm mb-2 text-gray-600 dark:text-gray-300">
      Quelles sont les difficultés que vous rencontrez dans ce service ?
    </label>
    <textarea v-model="form.specifiques.difficultes_sm" class="input w-full" rows="3"></textarea>
  </div>
</div>
<div v-else-if="selectedCategory === 'securite_police'">
  <h4 class="font-semibold mb-4 text-gray-700 dark:text-gray-200">Sécurité / Police</h4>
  
  <h5 class="font-medium mb-2 text-gray-700 dark:text-gray-200">Type d'appui</h5>
  <div class="grid grid-cols-1 gap-2 mb-4">
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="reception_plaintes" v-model="form.specifiques.type_appui_police" class="mr-2" />
        Réception et traitement des plaintes, y compris pour les VBG
      </label>
    </div>
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="enquete_arrestation" v-model="form.specifiques.type_appui_police" class="mr-2" />
        Enquête sur et arrestation des bourreaux
      </label>
    </div>
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="autres_appuis_police" v-model="form.specifiques.type_appui_police" class="mr-2" />
        Autres
      </label>
    </div>
  </div>
  <div v-if="form.specifiques.type_appui_police && form.specifiques.type_appui_police.includes('autres_appuis_police')">
    <input v-model="form.specifiques.autres_appuis_police_details" type="text" class="input w-full mt-2" placeholder="Préciser" />
  </div>
  
  <h5 class="font-medium mb-2 text-gray-700 dark:text-gray-200">Infrastructures, outils, politiques</h5>
  <div class="grid grid-cols-1 gap-2 mb-4">
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="salle_ecoute_police" v-model="form.specifiques.infrastructures_police" class="mr-2" />
        Salle/pratique d'écoute confidentielle des cas de VBG
      </label>
    </div>
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="espace_classement_securise" v-model="form.specifiques.infrastructures_police" class="mr-2" />
        Espace de classement sécurisé et verrouillé pour garder les dossiers confidentiels
      </label>
    </div>
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="ordinateur_protege" v-model="form.specifiques.infrastructures_police" class="mr-2" />
        Ordinateur protégé par mot de passe
      </label>
    </div>
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="fournitures_administratives" v-model="form.specifiques.infrastructures_police" class="mr-2" />
        Fournitures administratives (imprimante, papier, ram, etc.)
      </label>
    </div>
    <div>
      <label class="inline-flex items-center">
        <input type="checkbox" value="autres_infrastructures_police" v-model="form.specifiques.infrastructures_police" class="mr-2" />
        Autres
      </label>
    </div>
  </div>
  <div v-if="form.specifiques.infrastructures_police && form.specifiques.infrastructures_police.includes('autres_infrastructures_police')">
    <input v-model="form.specifiques.autres_infrastructures_police_details" type="text" class="input w-full mt-2" placeholder="Préciser" />
  </div>

  <h5 class="font-medium mb-2 text-gray-700 dark:text-gray-200">Effectifs du service</h5>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <div>
      <label class="block text-sm font-medium mb-1">Nombre d'éléments au sein de votre unité</label>
      <div class="flex gap-2">
        <div class="flex-1">
          <label class="text-xs mb-1">Hommes</label>
          <input type="number" v-model="form.specifiques.effectifs_hommes" class="input w-full" />
        </div>
        <div class="flex-1">
          <label class="text-xs mb-1">Femmes</label>
          <input type="number" v-model="form.specifiques.effectifs_femmes" class="input w-full" />
        </div>
      </div>
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Nombre d'OPJ</label>
      <div class="flex gap-2">
        <div class="flex-1">
          <label class="text-xs mb-1">Hommes</label>
          <input type="number" v-model="form.specifiques.opj_hommes" class="input w-full" />
        </div>
        <div class="flex-1">
          <label class="text-xs mb-1">Femmes</label>
          <input type="number" v-model="form.specifiques.opj_femmes" class="input w-full" />
        </div>
      </div>
    </div>
  </div>

  <h5 class="font-medium mb-2 text-gray-700 dark:text-gray-200">Formations du personnel</h5>
  <div class="mb-4">
    <table class="w-full border-collapse">
      <thead>
        <tr>
          <th class="text-left pb-2">Formation</th>
          <th class="w-20 text-center pb-2">Hommes</th>
          <th class="w-20 text-center pb-2">Femmes</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="py-1">Formés sur les violences envers les enfants et la gestion judiciaire des cas</td>
          <td><input type="number" v-model="form.specifiques.formation_violences_enfants_hommes" class="input w-full" /></td>
          <td><input type="number" v-model="form.specifiques.formation_violences_enfants_femmes" class="input w-full" /></td>
        </tr>
        <tr>
          <td class="py-1">Formés sur les VBG / EAS et la gestion judiciaire des cas</td>
          <td><input type="number" v-model="form.specifiques.formation_vbg_hommes" class="input w-full" /></td>
          <td><input type="number" v-model="form.specifiques.formation_vbg_femmes" class="input w-full" /></td>
        </tr>
      </tbody>
    </table>
  </div>

  <h5 class="font-medium mb-2 text-gray-700 dark:text-gray-200">Gratuité du service</h5>
  <div class="mb-4">
    <div class="flex items-center gap-4">
      <label class="inline-flex items-center">
        <input type="radio" v-model="form.specifiques.service_gratuit_police" value="oui" class="mr-2" />
        Oui
      </label>
      <label class="inline-flex items-center">
        <input type="radio" v-model="form.specifiques.service_gratuit_police" value="non" class="mr-2" />
        Non
      </label>
    </div>
  </div>
  
  <div v-if="form.specifiques.service_gratuit_police === 'non'" class="mb-4">
    <label class="block text-sm font-medium mb-1">Veuillez préciser les items payants par le bénéficiaire</label>
    <textarea v-model="form.specifiques.items_payants_police" class="textarea w-full" rows="3"></textarea>
  </div>

  <h5 class="font-medium mb-2 text-gray-700 dark:text-gray-200">Difficultés rencontrées</h5>
  <div class="mb-4">
    <label class="block text-sm font-medium mb-1">Quelles sont les difficultés que vous rencontrez dans ce service ?</label>
    <textarea v-model="form.specifiques.difficultes_police" class="textarea w-full" rows="3"></textarea>
  </div>
</div>