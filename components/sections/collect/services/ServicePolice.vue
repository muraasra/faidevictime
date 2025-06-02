<template>
  <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden">
    <div class="bg-gray-50 dark:bg-zinc-700 px-4 py-3 border-b dark:border-zinc-600">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
        <span class="mr-2">Police et sécurité</span>
        <span v-if="!service.soins_medicaux && !service.appui_psychosocial" class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full">Catégorie principale</span>
      </h2>
    </div>
    
    <div class="p-4">
      <!-- Content will be added based on requirements -->
      <!-- Personnel -->
      <div class="p-4">
        <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Personnel</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <PersonnelCard title="Effectif Hommes" :hommes="service.police_securite.effectif_hommes" :femmes="service.police_securite.effectif_femmes" />
          <PersonnelCard title="OPJ Hommes" :hommes="service.police_securite.opj_hommes" :femmes="service.police_securite.opj_femmes" />
        </div>

        <!-- Infrastructures -->
        <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Infrastructures</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-6">
          <StatusItem label="Salle confidentielle" :value="service.police_securite.salle_confidentielle" />
          <StatusItem label="Classement sécurisé" :value="service.police_securite.classement_securise" />
          <StatusItem label="Ordinateur protégé" :value="service.police_securite.ordinateur_protege" />
          <StatusItem label="Fournitures administratives" :value="service.police_securite.fournitures_admin" />
          <StatusItem label="Autres infrastructures" :value="service.police_securite.autres_infrastructures" />
        </div>

        <!-- Médicaments disponibles -->
        <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Médicaments disponibles</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-4 mb-6">
          <StatusItem
            v-for="medicament in service.police_securite.medicaments_disponibles"
            :key="medicament.value"
            :label="medicament.label"
            :value="true"
          />
        </div>

        <!-- Formations -->
        <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Formations</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
          <StatusItem label="Formation sur les enfants survivants (Hommes)" :value="service.police_securite.form_enfants_hommes" />
          <StatusItem label="Formation sur les enfants survivants (Femmes)" :value="service.police_securite.form_enfants_femmes" />
          <StatusItem label="Formation sur les violences basées sur le genre (Hommes)" :value="service.police_securite.form_vbg_hommes" />
          <StatusItem label="Formation sur les violences basées sur le genre (Femmes)" :value="service.police_securite.form_vbg_femmes" />
        </div>

        <!-- Services -->
        <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Services</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
          <StatusItem label="Service gratuit" :value="service.police_securite.service_gratuit" />
          <StatusItem label="Items payants" :value="service.police_securite.items_payants" />
          <StatusItem label="Difficultés du service" :value="service.police_securite.difficultes_service" />
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