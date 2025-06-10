<script setup lang="ts">
import { NAVIGATION_ITEMS } from "~/constants";

const isOpen = ref(false);
</script>

<template>
  <UButton 
    label="Menu" 
    @click="isOpen = true"
    class="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400"
    variant="ghost"
    size="sm"
  >
    <UIcon name="i-heroicons-bars-3" class="w-5 h-5" />
  </UButton>

  <USlideover v-model="isOpen">
    <div class="flex flex-col h-full bg-white dark:bg-zinc-900">
      <!-- En-tête -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
        <!-- <UButton
          color="gray"
          variant="ghost"
          size="sm"
          icon="i-heroicons-x-mark-20-solid"
          class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          square
          padded
          @click="isOpen = false"
        /> -->
      </div>

      <!-- Navigation -->
      <div class="flex-1 overflow-y-auto">
        <div class="p-6 space-y-8">
          <div
            v-for="(group, index) in NAVIGATION_ITEMS"
            :key="index"
            class="space-y-2 pb-4 border-b border-gray-200 last:border-b-0 dark:border-zinc-700"
            >
            <!-- Liens de navigation -->
            <div class="space-y-1">
              <NuxtLink
                v-for="nav in group"
                :key="nav.link"
                :href="nav.link"
                @click="isOpen = false"
                class="flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-colors"
                :class="[
                  $route.path === nav.link 
                    ? 'bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-white font-semibold' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                ]"
              >
                <UIcon 
                  :name="nav.icon" 
                  class="w-5 h-5"
                  :class="[
                    $route.path === nav.link 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-gray-400 dark:text-gray-500'
                  ]"
                />
                <span>{{ nav.name }}</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Pied de page -->
      <div class="p-4 border-t border-gray-200 dark:border-zinc-700">
        <div class="flex items-center justify-between">
        </div>
      </div>
    </div>
  </USlideover>
</template>

<style scoped>
/* Styles pour la scrollbar */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 3px;
}

/* Styles pour le mode sombre */
:deep(.dark) .overflow-y-auto {
  scrollbar-color: #374151 transparent;
}

:deep(.dark) .overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #374151;
}
</style>