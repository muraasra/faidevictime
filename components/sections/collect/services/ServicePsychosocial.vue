<template>
  <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden">
    <div class="bg-gray-50 dark:bg-zinc-700 px-4 py-3 border-b dark:border-zinc-600">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
        <span class="mr-2">Appui psychosocial</span>
        <span v-if="!service.soins_medicaux" class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full">Catégorie principale</span>
      </h2>
    </div>
    
    <div class="p-4">
      <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Types de soutien</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-6">
        <StatusItem label="Soutien émotionnel de base / premiers secours psychologique" :value="service.appui_psychosocial.soutien_psy_base" />
        <StatusItem label="Appui psychosocial individuel" :value="service.appui_psychosocial.appui_individuel" />
        <StatusItem label="Appui psychosocial de groupe" :value="service.appui_psychosocial.appui_groupe" />
      </div>
      
      <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Personnel impliqué</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <PersonnelCard title="Gestionnaires des cas (enfants)" :hommes="service.appui_psychosocial.gest_enfant_hommes" :femmes="service.appui_psychosocial.gest_enfant_femmes" />
        <PersonnelCard title="Gestionnaires des cas (VBG/EAS)" :hommes="service.appui_psychosocial.gest_vbg_hommes" :femmes="service.appui_psychosocial.gest_vbg_femmes" />
      </div>
      
      <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Infrastructures et outils</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
        <StatusItem label="Salle d'écoute confidentielle" :value="service.appui_psychosocial.salle_ecoute" />
        <StatusItem label="Espace sûr adapté pour les enfants" :value="service.appui_psychosocial.espace_enfants" />
        <StatusItem label="Outils de gestion de cas existants" :value="service.appui_psychosocial.outils_gestion_cas" />
        <StatusItem label="Équipements pour la sécurité des dossiers" :value="service.appui_psychosocial.securite_dossiers" />
        <StatusItem label="Protocole de prise en charge psychosociale" :value="service.appui_psychosocial.protocole_gestion" />
        <StatusItem label="Circuit de référencement vers d'autres services" :value="service.appui_psychosocial.referencement" />
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