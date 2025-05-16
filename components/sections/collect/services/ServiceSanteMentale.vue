<template>
  <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden">
    <div class="bg-gray-50 dark:bg-zinc-700 px-4 py-3 border-b dark:border-zinc-600">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
        <span class="mr-2">Santé mentale</span>
        <span v-if="!service.soins_medicaux && !service.appui_psychosocial && !service.police_securite && !service.assistance_juridique" class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full">Catégorie principale</span>
      </h2>
    </div>
    
    <div class="p-4">
      <!-- Content will be added based on requirements -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Service } from '~/components/sections/collect/services/viewAdmin.vue'

defineProps<{
  service: Service
}>()
</script> 