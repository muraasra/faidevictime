<script setup lang="ts">
definePageMeta({layout: "root"});

// pages/profil.vue

import { ref } from "vue";
import { DASHBOARD_CARDS_DATA } from "~/constants";


</script>

<template>

  <div class="py-6 px-4 md:px-10 text-gray-800 dark:text-white">
    <h1 class="text-3xl font-bold text-emerald-500 mb-4">Gestion des services </h1>
    <div class="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
     
     
    </div>
    <br>
    <SectionsCollectServicesForm/>
  
  </div>
</template>