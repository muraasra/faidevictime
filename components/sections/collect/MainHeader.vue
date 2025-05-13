<script setup lang="ts">


import ThemeSwitcher from "~/components/elements/ThemeSwitcher.vue";
import { NAVIGATION_ITEMS } from "~/constants/index";
import { ref, computed } from "vue";
// État de la recherche et de l'authentification
// const isDropdownOpen = ref(false);


// Fonction de déconnexion
import { useAuthStore } from '~/stores/auth'
const auth = useAuthStore();
function handleLogout() {
  auth.logout()
}

</script>

<template>
  <header
    class="sticky top-0 z-20 py-2 px-6 w-full flex items-center justify-between border-b dark:bg-black dark:border-b-gray-600 bg-white border-b-gray-200 shadow-sm"
  >
    <div class="block md:hidden">
      <MobileNavigation />
      <SectionsCollectMobileNavigation/>
    </div>

    Barre de recherche
    <MainNavBlock :NAVIGATION="NAVIGATION_ITEMS" />
    <SectionsCollectMainNavBlock :NAVIGATION="NAVIGATION_ITEMS"/>

    <!-- Section utilisateur -->
    <div class="flex items-center gap-x-5">
      <div class="relative">
        
         
      </div>
      
      <ThemeSwitcher />
        <div
          class="flex items-center gap-x-2 cursor-pointer"
        >
          <div class="hidden md:flex flex-col">
            <span>{{ auth.user?.username }}</span>
            <span class="text-xs text-gray-500">Role</span>
          </div>

        <!-- Menu déroulant utilisateur -->
        
          <ul>
            <li
              class="px-4 py-2 hover:bg-red-500 hover:text-white cursor-pointer"
              
            >
            <button @click="handleLogout" class="bg-red-500 text-white px-4 py-2 rounded">
    Se déconnecter
  </button>
            </li>
          </ul>
        
      </div>

      <!-- Si non connecté -->
      
    </div>
  </header>
</template>

<style scoped>
/* Amélioration du style de la barre de recherche */
input:focus {
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.5);
}
</style>