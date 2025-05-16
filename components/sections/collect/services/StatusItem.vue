<template>
  <div class="flex items-center justify-between">
    <span>{{ props.label }}</span>
    <span :class="props.value ? 'text-green-600 dark:text-green-400 font-medium' : 'text-red-600 dark:text-red-400 font-medium'">
      {{ props.value ? 'Oui' : 'Non' }}
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
  value: boolean
}>()
</script> 