<script setup lang="ts">
defineProps<{ warehouses: { name: string }[] }>();
</script>

<template>
  <div class="mt-3 pl-5 border-l border-gray-300 dark:border-gray-600">
    <div v-for="warehouse in warehouses" :key="warehouse.name" class="py-2">
      <span class="font-medium text-gray-700 dark:text-gray-300">{{ warehouse.name }}</span>
    </div>
  </div>
</template>