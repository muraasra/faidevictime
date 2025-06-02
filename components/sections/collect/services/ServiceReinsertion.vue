<template>
  <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden">
    <div class="bg-gray-50 dark:bg-zinc-700 px-4 py-3 border-b dark:border-zinc-600">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
        <span class="mr-2">Réinsertion économique</span>
        <span v-if="!service.soins_medicaux && !service.appui_psychosocial && !service.police_securite && !service.assistance_juridique && !service.sante_mentale" class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full">Catégorie principale</span>
      </h2>
    </div>
    
    <div class="p-4">
      <!-- Content will be added based on requirements -->
      <!-- Personnel -->
      <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Personnel</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <PersonnelCard title="Agents de formation" :hommes="service.reinsertion_economique.agents_formation_hommes" :femmes="service.reinsertion_economique.agents_formation_femmes" />
        <PersonnelCard title="APS" :hommes="service.reinsertion_economique.aps_hommes" :femmes="service.reinsertion_economique.aps_femmes" />
        <PersonnelCard title="Agents des services financiers" :hommes="service.reinsertion_economique.agents_services_financiers_hommes" :femmes="service.reinsertion_economique.agents_services_financiers_femmes" />
        <PersonnelCard title="Volontaires" :hommes="service.reinsertion_economique.volontaires_hommes" :femmes="service.reinsertion_economique.volontaires_femmes" />
        <PersonnelCard title="Agents d'autonomisation" :hommes="service.reinsertion_economique.agents_autonomisation_hommes" :femmes="service.reinsertion_economique.agents_autonomisation_femmes" />
        <PersonnelCard title="Agronomes" :hommes="service.reinsertion_economique.agronomes_hommes" :femmes="service.reinsertion_economique.agronomes_femmes" />
      </div>

      <!-- Formations -->
      <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Formations</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-6">
        <StatusItem label="Formation métier" :value="service.reinsertion_economique.formation_metier" />
        <StatusItem label="Formation enfants (hommes)" :value="service.reinsertion_economique.formes_enfants_hommes" />
        <StatusItem label="Formation enfants (femmes)" :value="service.reinsertion_economique.formes_enfants_femmes" />
        <StatusItem label="Formation VBG (hommes)" :value="service.reinsertion_economique.formes_vbg_hommes" />
        <StatusItem label="Formation VBG (femmes)" :value="service.reinsertion_economique.formes_vbg_femmes" />
        <StatusItem label="Formation spécifique (hommes)" :value="service.reinsertion_economique.formes_formation_hommes" />
        <StatusItem label="Formation spécifique (femmes)" :value="service.reinsertion_economique.formes_formation_femmes" />
        <StatusItem label="Formation entreprenariat (hommes)" :value="service.reinsertion_economique.formes_entreprenariat_hommes" />
        <StatusItem label="Formation entreprenariat (femmes)" :value="service.reinsertion_economique.formes_entreprenariat_femmes" />
        <StatusItem label="Formation comptabilité (hommes)" :value="service.reinsertion_economique.formes_compta_hommes" />
        <StatusItem label="Formation comptabilité (femmes)" :value="service.reinsertion_economique.formes_compta_femmes" />
      </div>

      <!-- Services et mécanismes -->
      <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Services et mécanismes</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-6">
        <StatusItem label="Aide en espèces" :value="service.reinsertion_economique.aide_especes" />
        <StatusItem label="Référencement au travail" :value="service.reinsertion_economique.referencement_travail" />
        <StatusItem label="Alphabetisation" :value="service.reinsertion_economique.alphabetisation" />
        <StatusItem label="Mécanisme EAS" :value="service.reinsertion_economique.mecanisme_eas" />
        <StatusItem label="Service gratuit" :value="service.reinsertion_economique.service_gratuit" />
      </div>

      <!-- Autres informations -->
      <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Autres informations</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
        <StatusItem label="Autres appuis" :value="service.reinsertion_economique.autres_appuis" />
        <StatusItem label="Items payants" :value="service.reinsertion_economique.items_payants" />
        <StatusItem label="Difficultés du service" :value="service.reinsertion_economique.difficultes_service" />
        <StatusItem label="Question transversale" :value="service.reinsertion_economique.question_transversale" />
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