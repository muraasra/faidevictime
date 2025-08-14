<template>
  <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden">
    <div class="bg-gray-50 dark:bg-zinc-700 px-4 py-3 border-b dark:border-zinc-600">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
        <span class="mr-2">Hébergement</span>
        <span v-if="!service.soins_medicaux && !service.appui_psychosocial && !service.police_securite && !service.assistance_juridique && !service.sante_mentale && !service.reinsertion_economique" class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full">Catégorie principale</span>
      </h2>
    </div>

    <div class="p-4">
      <!-- Appuis et services -->
      <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Services et appuis</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-6">
        <StatusItem label="Hébergement sûr" :value="service.hebergement.hebergement_sur" />
        <StatusItem label="Aide en espèces" :value="service.hebergement.aide_especes" />
        <StatusItem label="Refuge communautaire" :value="service.hebergement.refuge_communautaire" />
        <StatusItem label="Prise en charge alimentaire" :value="service.hebergement.prise_charge_alimentaire" />
        <StatusItem label="Appui non vivres" :value="service.hebergement.appui_non_vivres" />
        <StatusItem label="Autres appuis" :value="service.hebergement.autres_appuis" />
        <StatusItem label="Appuis additionnels" :value="service.hebergement.appuis_additionnels" />
        <StatusItem label="Détails appui" :value="service.hebergement.details_appui" />
      </div>

      <!-- Personnel -->
      <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Personnel</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <PersonnelCard title="Personnel civil" :hommes="service.hebergement.pers_civil_homme || 0" :femmes="service.hebergement.pers_civil_femme || 0" />
        <PersonnelCard title="Leaders religieux" :hommes="service.hebergement.leaders_religieux_homme || 0" :femmes="service.hebergement.leaders_religieux_femme || 0" />
        <PersonnelCard title="Membres OBC" :hommes="service.hebergement.membres_obc_homme || 0" :femmes="service.hebergement.membres_obc_femme || 0" />
        <PersonnelCard title="Agents de sécurité" :hommes="service.hebergement.agents_securite_homme || 0" :femmes="service.hebergement.agents_securite_femme || 0" />
        <PersonnelCard title="Volontaires" :hommes="service.hebergement.volontaires_homme || 0" :femmes="service.hebergement.volontaires_femme || 0" />
        <PersonnelCard title="Personnel juridique" :hommes="service.hebergement.pers_juridique_homme || 0" :femmes="service.hebergement.pers_juridique_femme || 0" />
        <PersonnelCard title="Personnes formées en protection" :hommes="service.hebergement.pers_forme_protection_homme || 0" :femmes="service.hebergement.pers_forme_protection_femme || 0" />
      </div>

      <!-- Mécanismes de protection et gestion -->
      <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Mécanismes et gestion</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-6">
        <StatusItem label="Mécanisme de protection" :value="service.hebergement.mecanisme_protection" />
        <StatusItem label="Code de conduite" :value="service.hebergement.code_conduite" />
        <StatusItem label="Point focal" :value="service.hebergement.point_focal" />
        <StatusItem label="Autres mécanismes" :value="service.hebergement.autres_mecanismes" />
      </div>

      <!-- Tarification et difficultés -->
      <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Tarification et difficultés</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
        <StatusItem label="Service gratuit" :value="service.hebergement.service_gratuit" />
        <StatusItem label="Items payants" :value="service.hebergement.items_payants" />
        <StatusItem label="Difficultés du service" :value="service.hebergement.difficultes_service" />
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