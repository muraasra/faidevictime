<template>
  <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden">
    <div class="bg-gray-50 dark:bg-zinc-700 px-4 py-3 border-b dark:border-zinc-600">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
        <span class="mr-2">Assistance juridique</span>
        <span v-if="!service.soins_medicaux && !service.appui_psychosocial && !service.police_securite" class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full">Catégorie principale</span>
      </h2>
    </div>
    
    <div class="p-4">
      <!-- Content will be added based on requirements -->
      <!-- Personnel -->
      <div class="p-4">
        <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Personnel juridique</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <PersonnelCard title="Juristes" :hommes="service.assistance_juridique.juristes_hommes" :femmes="service.assistance_juridique.juristes_femmes" />
          <PersonnelCard title="Para-juristes" :hommes="service.assistance_juridique.para_juristes_hommes" :femmes="service.assistance_juridique.para_juristes_femmes" />
        </div>

        <!-- Protocoles et infrastructures -->
        <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Protocoles et infrastructures</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-6">
          <StatusItem label="Protocole juridique" :value="service.assistance_juridique.protocole_juridique" />
          <StatusItem label="Formulaire de consentement" :value="service.assistance_juridique.formulaire_consentement" />
          <StatusItem label="Espace confidentiel" :value="service.assistance_juridique.espace_confidentiel" />
          <StatusItem label="Classement sécurisé" :value="service.assistance_juridique.classement_securise" />
          <StatusItem label="Fournitures administratives" :value="service.assistance_juridique.fournitures_admin" />
          <StatusItem label="Mécanisme EAS" :value="service.assistance_juridique.mecanisme_eas" />
        </div>

        <!-- Collaborations -->
        <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Collaborations</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-6">
          <StatusItem label="Collaboration avec la police" :value="service.assistance_juridique.collab_police" />
          <StatusItem label="Nombre de policiers collaborant" :value="service.assistance_juridique.nb_policiers_collab" />
          <StatusItem label="Collaboration avec les tribunaux" :value="service.assistance_juridique.collab_tribunaux" />
        </div>

        <!-- Formations -->
        <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Formations</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-6">
          <StatusItem label="Formation sur les enfants survivants" :value="service.assistance_juridique.form_enfants_hommes + service.assistance_juridique.form_enfants_femmes" />
          <StatusItem label="Formation sur les violences basées sur le genre" :value="service.assistance_juridique.form_vbg_hommes + service.assistance_juridique.form_vbg_femmes" />
        </div>

        <!-- Services -->
        <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Services juridiques</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-6">
          <StatusItem label="Conseils juridiques" :value="service.assistance_juridique.conseils_juridiques" />
          <StatusItem label="Assistance juridique" :value="service.assistance_juridique.assistance_juridique" />
          <StatusItem label="Représentation légale" :value="service.assistance_juridique.representation_legale" />
          <StatusItem label="Référencement légal" :value="service.assistance_juridique.referencement_legale" />
          <StatusItem label="Autres appuis" :value="service.assistance_juridique.autres_appuis" />
        </div>

        <!-- Accessibilité -->
        <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Accessibilité</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
          <StatusItem label="Service gratuit" :value="service.assistance_juridique.service_gratuit" />
          <StatusItem label="Items payants" :value="service.assistance_juridique.items_payants" />
          <StatusItem label="Difficultés du service" :value="service.assistance_juridique.difficultes_service" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Service } from './viewAdmin.vue'
import PersonnelCard from './PersonnelCard.vue'
import StatusItem from './StatusItem.vue'
defineProps<{
  service: Service
}>()
</script> 