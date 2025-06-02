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
      <div class="p-4">
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

        <!-- Appuis -->
        <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Appuis</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-6">
          <StatusItem label="Appui pharmaceutique" :value="service.sante_mentale.appui_pharma || false" />
          <StatusItem label="Appui psychologique" :value="service.sante_mentale.appui_psy || false" />
          <StatusItem label="Appui social" :value="service.sante_mentale.appui_social || false" />
          <StatusItem label="Autres appuis" :value="service.sante_mentale.autres_appuis || 'Non spécifié'" />
        </div>

        <!-- Équipements -->
        <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Équipements</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-6">
          <StatusItem label="Salle d'écoute confidentielle" :value="service.sante_mentale.salle_ecoute_confidentielle || false" />
          <StatusItem label="Espace pour enfants" :value="service.sante_mentale.espace_enfants || false" />
          <StatusItem label="Salle de thérapie de groupe" :value="service.sante_mentale.salle_therapie_groupe || false" />
          <StatusItem label="Autres équipements" :value="service.sante_mentale.autres_equipements || 'Non spécifié'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Service } from '~/components/sections/collect/services/viewAdmin.vue'

defineProps<{
  service: Service
}>()
</script> 