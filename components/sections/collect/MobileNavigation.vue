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
      <div class="flex items-center justify-between p-4 border-b dark:border-zinc-700">
        <NuxtLink 
          href="/" 
          class="flex items-center gap-2"
          @click="isOpen = false"
        >
          <img src="/ico.png" width="32" alt="logo" class="w-8 h-8 rounded-full">
          <span class="text-lg font-bold text-gray-900 dark:text-white">VictiSafe</span>
        </NuxtLink>
        <UButton
          color="gray"
          variant="ghost"
          size="sm"
          icon="i-heroicons-x-mark-20-solid"
          class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          square
          padded
          @click="isOpen = false"
        />
      </div>

      <!-- Navigation -->
      <div class="flex-1 overflow-y-auto">
        <div class="p-4 space-y-6">
          <div
            v-for="(group, index) in NAVIGATION_ITEMS"
            :key="index"
            class="space-y-1"
          >
            <!-- Titre du groupe si nécessaire -->
            <h3 
              v-if="group.length > 0 && group[0].group" 
              class="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              {{ group[0].group }}
            </h3>

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
                    ? 'bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
                ]"
              >
                <UIcon 
                  :name="nav.icon" 
                  class="w-5 h-5"
                  :class="[
                    $route.path === nav.link 
                      ? 'text-emerald-500 dark:text-emerald-400' 
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
      <div class="p-4 border-t dark:border-zinc-700">
        <div class="flex items-center justify-between">
          <ElementsThemeSwitcher />
          <UButton
            color="red"
            variant="ghost"
            size="sm"
            class="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
            @click="isOpen = false"
          >
            <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5 mr-2" />
            Déconnexion
          </UButton>
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