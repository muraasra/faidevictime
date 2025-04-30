<template>
    <div v-if="show" class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div class="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{ show: boolean }>()
  </script>