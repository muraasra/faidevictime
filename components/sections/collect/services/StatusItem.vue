<template>
  <div class="flex items-center justify-between">
    <span>{{ props.label }}</span>
    <span :class="valueClass">{{ displayValue }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  value: boolean | string | number | null | undefined
}>()

const isBoolean = computed(() => typeof props.value === 'boolean')

const displayValue = computed(() => {
  if (isBoolean.value) {
    return props.value ? 'Oui' : 'Non'
  }
  if (props.value === null || props.value === undefined) {
    return 'Non spécifié'
  }
  const text = String(props.value).trim()
  return text.length > 0 ? text : 'Non spécifié'
})

const valueClass = computed(() => {
  if (isBoolean.value) {
    return props.value ? 'text-green-600 dark:text-green-400 font-medium' : 'text-red-600 dark:text-red-400 font-medium'
  }
  return 'text-gray-700 dark:text-gray-300'
})
</script> 