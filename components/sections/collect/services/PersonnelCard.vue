# Create PersonnelCard component
<template>
  <div class="bg-gray-50 dark:bg-zinc-700 p-3 rounded">
    <h4 class="font-medium mb-2">{{ title }}</h4>
    <div class="flex justify-between">
      <div class="flex items-center">
        <span class="text-blue-600 dark:text-blue-400 mr-2">♂</span>
        <span>{{ hommes || 0 }}</span>
      </div>
      <div class="flex items-center">
        <span class="text-pink-600 dark:text-pink-400 mr-2">♀</span>
        <span>{{ femmes || 0 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  hommes: number
  femmes: number
}>()
</script> 