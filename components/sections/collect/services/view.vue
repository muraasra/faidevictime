<template>
  <div class="max-w-5xl mx-auto p-6">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">Détails de la structure</h1>

    <div v-if="service" class="space-y-6 text-sm text-gray-700 dark:text-gray-300">
      <div>
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Informations générales</h2>
        <p><strong>Nom de la structure :</strong> {{ service.nom_structure }}</p>
        <p><strong>Fonction du répondant :</strong> {{ service.fonction_repondant }}</p>
        <p><strong>Nom du répondant :</strong> {{ service.nom_repondant }}</p>
        <p><strong>Téléphone :</strong> {{ service.telephone_repondant }}</p>
        <p><strong>Email :</strong> {{ service.email }}</p>
        <p><strong>Site web :</strong> {{ service.site_web }}</p>
        <p><strong>Coordonnées :</strong> {{ service.latitude }}, {{ service.longitude }}</p>
      </div>

      <div v-if="service.soins_medicaux">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Soins médicaux</h2>
        <p><strong>Protocole viol :</strong> {{ service.soins_medicaux.protocole_viol ? 'Oui' : 'Non' }}</p>
        <p><strong>Infirmiers hommes :</strong> {{ service.soins_medicaux.infirmiers_hommes }}</p>
        <p><strong>Infirmiers femmes :</strong> {{ service.soins_medicaux.infirmiers_femmes }}</p>
        <p><strong>Matrones hommes :</strong> {{ service.soins_medicaux.matrones_hommes }}</p>
        <p><strong>Matrones femmes :</strong> {{ service.soins_medicaux.matrones_femmes }}</p>
        <p><strong>Salle privée :</strong> {{ service.soins_medicaux.salle_privee ? 'Oui' : 'Non' }}</p>
        <p><strong>Table d'examen :</strong> {{ service.soins_medicaux.table_examen ? 'Oui' : 'Non' }}</p>
        <!-- Ajoutez d'autres champs ici selon vos besoins -->
      </div>

      <div v-if="service.appui_psychosocial">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Appui psychosocial</h2>
        <p>{{ service.appui_psychosocial }}</p>
      </div>

      <!-- Ajoutez d'autres sections pour police_securite, assistance_juridique, etc. -->
    </div>

    <div v-else class="text-center text-gray-500 dark:text-gray-400">Chargement en cours...</div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

type SoinsMedicaux = {
  protocole_viol: boolean
  infirmiers_hommes: number
  infirmiers_femmes: number
  matrones_hommes: number
  matrones_femmes: number
  salle_privee: boolean
  table_examen: boolean
  // Ajoutez d'autres champs ici
}

type Service = {
  id: number
  soins_medicaux: SoinsMedicaux | null
  appui_psychosocial: string | null
  police_securite: string | null
  assistance_juridique: string | null
  sante_mentale: string | null
  reinsertion_economique: string | null
  nom_structure: string
  fonction_repondant: string
  nom_repondant: string
  telephone_repondant: string
  longitude: string
  latitude: string
  email: string
  site_web: string
  // Ajoutez d'autres champs ici
}

const route = useRoute()
const id = route.params.id

const { data: service } = await useApi<Service>(`https://wilfriedtayou.pythonanywhere.com/api/question-transversale/${id}/`, {
  server: false
})
</script>