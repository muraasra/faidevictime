<template>
  <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden">
    <div class="bg-gray-50 dark:bg-zinc-700 px-4 py-3 border-b dark:border-zinc-600">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
        <span class="mr-2">Santé mentale</span>
        <span v-if="!service.soins_medicaux && !service.appui_psychosocial && !service.police_securite && !service.assistance_juridique" class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full">Catégorie principale</span>
      </h2>
    </div>
    
    <div class="p-4">
      <!-- Personnel -->
      <div class="mb-6">
        <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Personnel</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <PersonnelCard title="Psychiatres" :hommes="service.sante_mentale.psychiatres_hommes || 0" :femmes="service.sante_mentale.psychiatres_femmes || 0" />
          <PersonnelCard title="Psychologues" :hommes="service.sante_mentale.psychologues_hommes || 0" :femmes="service.sante_mentale.psychologues_femmes || 0" />
          <PersonnelCard title="Infirmiers psychiatriques" :hommes="service.sante_mentale.infirmiers_psy_hommes || 0" :femmes="service.sante_mentale.infirmiers_psy_femmes || 0" />
          <PersonnelCard title="Sociologues" :hommes="service.sante_mentale.sociologues_hommes || 0" :femmes="service.sante_mentale.sociologues_femmes || 0" />
          <PersonnelCard title="Anthropologues" :hommes="service.sante_mentale.anthropologues_hommes || 0" :femmes="service.sante_mentale.anthropologues_femmes || 0" />
          <PersonnelCard title="Médecins psychiatriques" :hommes="service.sante_mentale.medecins_psy_hommes || 0" :femmes="service.sante_mentale.medecins_psy_femmes || 0" />
          <PersonnelCard title="Agents psychosociaux (APS)" :hommes="service.sante_mentale.aps_hommes || 0" :femmes="service.sante_mentale.aps_femmes || 0" />
          <PersonnelCard title="Autres personnels" :hommes="service.sante_mentale.autres_personnel_hommes || 0" :femmes="service.sante_mentale.autres_personnel_femmes || 0" />
        </div>

        <!-- Total personnel -->
        <div class="p-3 bg-gray-50 dark:bg-zinc-700 rounded-lg">
          <div class="flex justify-between items-center">
            <span class="font-medium text-gray-800 dark:text-white">Total personnel</span>
            <div class="flex space-x-4">
              <span class="text-sm text-gray-600 dark:text-gray-300">
                <span class="font-medium">Hommes:</span> {{ service.sante_mentale.nb_hommes || 0 }}
              </span>
              <span class="text-sm text-gray-600 dark:text-gray-300">
                <span class="font-medium">Femmes:</span> {{ service.sante_mentale.nb_femmes || 0 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Appuis -->
      <div class="mb-6">
        <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Appuis</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
          <StatusItem label="Appui pharmaceutique" :value="service.sante_mentale.appui_pharma || false" />
          <StatusItem label="Appui psychologique" :value="service.sante_mentale.appui_psy || false" />
          <StatusItem label="Appui social" :value="service.sante_mentale.appui_social || false" />
          <StatusItem label="Autres appuis" :value="service.sante_mentale.autres_appuis || 'Non spécifié'" />
        </div>
      </div>

      <!-- Équipements -->
      <div class="mb-6">
        <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Équipements</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
          <StatusItem label="Salle d'écoute confidentielle" :value="service.sante_mentale.salle_ecoute_confidentielle || false" />
          <StatusItem label="Espace pour enfants" :value="service.sante_mentale.espace_enfants || false" />
          <StatusItem label="Salle de thérapie de groupe" :value="service.sante_mentale.salle_therapie_groupe || false" />
          <StatusItem label="Sécurité des dossiers" :value="service.sante_mentale.securite_dossiers || false" />
          <StatusItem label="Protocole de prise en charge" :value="service.sante_mentale.protocole_prise_en_charge || false" />
          <StatusItem label="Autres équipements" :value="service.sante_mentale.autres_equipements || 'Non spécifié'" />
        </div>
      </div>

      <!-- Formations -->
      <div class="mb-6">
        <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Formations</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PersonnelCard title="Formation enfants" :hommes="service.sante_mentale.form_enfants_hommes || 0" :femmes="service.sante_mentale.form_enfants_femmes || 0" />
          <PersonnelCard title="Formation VBG" :hommes="service.sante_mentale.form_vbg_hommes || 0" :femmes="service.sante_mentale.form_vbg_femmes || 0" />
          <PersonnelCard title="Formation MHGAP" :hommes="service.sante_mentale.form_mhgap_hommes || 0" :femmes="service.sante_mentale.form_mhgap_femmes || 0" />
          <PersonnelCard title="Formation PSP" :hommes="service.sante_mentale.form_psp_hommes || 0" :femmes="service.sante_mentale.form_psp_femmes || 0" />
          <PersonnelCard title="Formation gestion de cas" :hommes="service.sante_mentale.form_gestion_cas_hommes || 0" :femmes="service.sante_mentale.form_gestion_cas_femmes || 0" />
          <PersonnelCard title="Formation EAS" :hommes="service.sante_mentale.form_eas_hommes || 0" :femmes="service.sante_mentale.form_eas_femmes || 0" />
        </div>
      </div>

      <!-- Difficultés et questions transversales -->
      <div class="space-y-4">
        <div v-if="service.sante_mentale.difficultes_service" class="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <h4 class="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Difficultés du service</h4>
          <p class="text-yellow-700 dark:text-yellow-300 text-sm">{{ service.sante_mentale.difficultes_service }}</p>
        </div>
        
        <div v-if="service.sante_mentale.question_transversale" class="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 class="font-medium text-blue-800 dark:text-blue-200 mb-2">Question transversale</h4>
          <p class="text-blue-700 dark:text-blue-300 text-sm">ID: {{ service.sante_mentale.question_transversale }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Service } from '~/components/sections/collect/services/viewAdmin.vue'
import PersonnelCard from './PersonnelCard.vue'
import StatusItem from './StatusItem.vue'

defineProps<{
  service: Service
}>()
</script> 