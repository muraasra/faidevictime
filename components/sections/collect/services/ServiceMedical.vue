<template>
  <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden">
    <div class="bg-gray-50 dark:bg-zinc-700 px-4 py-3 border-b dark:border-zinc-600">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
        <span class="mr-2">Soins médicaux</span>
        <span class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full">Catégorie principale</span>
      </h2>
    </div>
    
    <!-- Personnel -->
    <div class="p-4">
      <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Personnel médical</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <PersonnelCard title="Infirmiers" :hommes="service.soins_medicaux.infirmiers_hommes" :femmes="service.soins_medicaux.infirmiers_femmes" />
        <PersonnelCard title="Matrones" :hommes="service.soins_medicaux.matrones_hommes" :femmes="service.soins_medicaux.matrones_femmes" />
        <PersonnelCard title="Sages-femmes" :hommes="service.soins_medicaux.sagefemmes_hommes" :femmes="service.soins_medicaux.sagefemmes_femmes" />
        <PersonnelCard title="Médecins" :hommes="service.soins_medicaux.medecins_hommes" :femmes="service.soins_medicaux.medecins_femmes" />
      </div>
      
      <!-- Protocoles et infrastructures -->
      <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Protocoles et infrastructures</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-6">
        <StatusItem label="Protocole de prise en charge des cas de viol" :value="service.soins_medicaux.protocole_viol" />
        <StatusItem label="Salle privée avec rideau" :value="service.soins_medicaux.salle_privee" />
        <StatusItem label="Table d'examen" :value="service.soins_medicaux.table_examen" />
        <StatusItem label="Kit de collecte des preuves médico-légales" :value="service.soins_medicaux.kit_preuve_medico" />
        <StatusItem label="Éclairage fixe" :value="service.soins_medicaux.eclairage_fixe" />
        <StatusItem label="Autoclave" :value="service.soins_medicaux.autoclave" />
      </div>
      
      <!-- Médicaments disponibles -->
      <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Médicaments disponibles</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-4 mb-6">
        <StatusItem label="Kit IST" :value="service.soins_medicaux.kit_ist" />
        <StatusItem label="PEP VIH" :value="service.soins_medicaux.pep_vih" />
        <StatusItem label="Contraceptifs d'urgence" :value="service.soins_medicaux.contraceptifs_urgence" />
        <StatusItem label="Anatoxine tétanique" :value="service.soins_medicaux.anatoxine" />
        <StatusItem label="Vaccin hépatite B" :value="service.soins_medicaux.vaccin_hepatiteb" />
        <StatusItem label="Antalgiques" :value="service.soins_medicaux.antalgiques" />
        <StatusItem label="Anesthésiques locaux" :value="service.soins_medicaux.anesthesiques" />
        <StatusItem label="Antibiotiques / Antiseptiques" :value="service.soins_medicaux.antibiotiques" />
      </div>
      
      <!-- Formations -->
      <h3 class="font-medium text-gray-800 dark:text-white mb-3 border-b dark:border-zinc-700 pb-2">Formations</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
        <StatusItem label="Formation sur la gestion clinique du viol" :value="service.soins_medicaux.formation_viol" />
        <StatusItem label="Formation sur les violences conjugales" :value="service.soins_medicaux.formation_conjugale" />
        <StatusItem label="Formation sur les enfants survivants" :value="service.soins_medicaux.formation_enfants" />
        <StatusItem label="Formation sur les principes directeurs" :value="service.soins_medicaux.principes_directeurs" />
        <StatusItem label="Formation sur la prévention EAS/HS" :value="service.soins_medicaux.formation_eas" />
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