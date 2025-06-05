<template>
  <header class="fixed top-0 right-0 left-[200px] z-20 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700">
    <div class="flex items-center justify-between px-6 py-4">
      <!-- Titre de la page -->
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white">
        {{ title }}
      </h1>

      <!-- Actions -->
      <div class="flex items-center gap-4">
        <!-- Thème -->
        <ElementsThemeSwitcher />

        <!-- Profil -->
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-700 dark:text-gray-300">{{ username }}</span>
          <UButton
            color="red"
            variant="ghost"
            size="sm"
            class="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
            @click="logout"
          >
            <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5 mr-2" />
            Déconnexion
          </UButton>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const username = computed(() => auth.user?.username || 'Utilisateur')
const title = ref('Tableau de bord')

function logout() {
  auth.logout()
  navigateTo('/login')
}
</script>

<style scoped>
header {
  height: 64px;
  margin-left: 200px;
  width: calc(100% - 200px);
}
</style> 