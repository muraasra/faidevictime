<script setup lang="ts">
import ThemeSwitcher from "~/components/elements/ThemeSwitcher.vue";
import { NAVIGATION_ITEMS } from "~/constants/index";
import { ref, computed, onMounted, onUnmounted } from "vue";

interface User {
  id: number
  username: string
}

const user = ref<User | null>(null)

// Fonction pour restaurer l'utilisateur
function restoreUser() {
  if (process.client) {
    const storedUser = sessionStorage.getItem('user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
      console.log('Session restaurée avec succès')
      return true
    }
  }
  return false
}

// Restaurer l'utilisateur au démarrage
if (process.client) {
  restoreUser()
}

// État du menu mobile
const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);
const lastScrollY = ref(0);
const isVisible = ref(true);

// Fonction pour basculer le menu mobile
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// Gestion du scroll avec animation fluide
const handleScroll = () => {
  const currentScrollY = window.scrollY;
  
  // Déterminer la direction du scroll
  if (currentScrollY > lastScrollY.value && currentScrollY > 100) {
    // Scroll vers le bas et pas tout en haut
    isVisible.value = false;
  } else {
    // Scroll vers le haut ou tout en haut
    isVisible.value = true;
  }
  
  lastScrollY.value = currentScrollY;
  isScrolled.value = currentScrollY > 50;
};

// Fonction de déconnexion
import { useAuthStore } from '~/stores/auth'
const auth = useAuthStore();
function handleLogout() {
  auth.logout()
}

// Computed pour le nom d'utilisateur formaté
const userInitials = computed(() => {
  const username = user.value?.username || '';
  // const username = auth.user?.username || '';
  return username.slice(0, 2).toUpperCase();
});

// Fermer le menu mobile lors du changement de route
const router = useRouter();
router.afterEach(() => {
  isMobileMenuOpen.value = false;
});

// Gestion du scroll avec debounce
let scrollTimeout: NodeJS.Timeout;
const debouncedScroll = () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(handleScroll, 10);
};

onMounted(() => {
  window.addEventListener('scroll', debouncedScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', debouncedScroll);
  clearTimeout(scrollTimeout);
});
</script>

<template>
  <header
    :class="[
      'fixed top-0 z-20 transition-all duration-300 ease-in-out',
      isVisible ? 'translate-y-0' : '-translate-y-full',
      'py-2 px-4 sm:px-6 flex items-center justify-between',
      'border-b dark:bg-zinc-900 dark:border-b-zinc-700 bg-white border-b-gray-200 shadow-sm',
      'md:left-[200px] md:w-[calc(100%-200px)]'
    ]"
  >
    <!-- Logo et bouton menu mobile -->
    <div class="flex items-center gap-x-4">
      <!-- Bouton menu hamburger pour mobile -->
      <button 
        @click="toggleMobileMenu"
        class="p-2 rounded-lg md:hidden hover:bg-gray-100 dark:hover:bg-zinc-800 focus:outline-none"
        aria-label="Menu"
      >
        <svg 
          class="w-6 h-6 text-gray-600 dark:text-gray-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            v-if="!isMobileMenuOpen" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M4 6h16M4 12h16M4 18h16"
          />
          <path 
            v-else 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center space-x-2">
        <span class="text-xl font-bold text-emerald-600">ChildSafe</span>
      </NuxtLink>
    </div>

    <!-- Navigation principale - visible sur desktop -->
    <nav class="hidden md:block">
      <MainNavBlock :NAVIGATION="NAVIGATION_ITEMS" />
      <SectionsCollectMainNavBlock :NAVIGATION="NAVIGATION_ITEMS"/>
    </nav>

    <!-- Section utilisateur et thème -->
    <div class="flex items-center gap-x-4">
      <ThemeSwitcher class="hidden sm:block" />
      
      <!-- Profil utilisateur -->
      <div class="flex items-center gap-x-3">
        <!-- Avatar avec initiales -->
        <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-medium">
          {{ userInitials }}
        </div>
        
        <!-- Info utilisateur -->
        <div class="hidden sm:flex flex-col">
          <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
            {{ user?.username }}
            <!-- {{ auth.user?.username }} -->
          </span>
          <span class="text-xs text-gray-500 dark:text-gray-400">
            <!-- {{ auth.user?.username ? 'Utilisateur' : 'Invité' }} -->
            {{ user?.username ? 'Utilisateur' : 'Invité' }}
          </span>
        </div>

        <!-- Bouton déconnexion -->
        <button 
          @click="handleLogout" 
          class="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm transition-colors flex items-center gap-x-1"
          title="Se déconnecter"
        >
          <span class="hidden sm:inline">Se déconnecter</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Menu mobile -->
    <div 
      v-show="isMobileMenuOpen"
      class="absolute top-full left-0 right-0 bg-white dark:bg-zinc-900 border-b dark:border-b-zinc-700 shadow-lg md:hidden transform transition-transform ease-in-out duration-300"
    >
      <div class="px-4 py-3 space-y-4">
        <!-- Profil utilisateur mobile -->
        <div class="flex items-center gap-x-3 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
          <div class="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center text-lg font-medium">
            {{ userInitials }}
          </div>
          <div class="flex flex-col">
            <span class="font-medium text-gray-900 dark:text-gray-100">{{ auth.user?.username }}</span>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ auth.user?.username ? 'Utilisateur' : 'Invité' }}</span>
          </div>
        </div>

        <!-- Navigation mobile -->
        <nav class="space-y-1">
          <ThemeSwitcher class="block sm:hidden mb-4" />
          <MobileNavigation />
          <SectionsCollectMobileNavigation/>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Amélioration du style de la barre de recherche */
input:focus {
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.5);
}

/* Animation du menu mobile */
.transform {
  transform-origin: top;
}

/* Optimisations pour les appareils mobiles */
@media (max-width: 640px) {
  .header-content {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Transitions fluides */
.transition-transform {
  transition-property: transform, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Animation de la barre de navigation */
.fixed {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

/* Ajout d'un espace pour compenser la barre de navigation fixe */
:deep(body) {
  padding-top: 4rem;
}

/* Ajustement pour le header sur desktop */
@media (min-width: 768px) {
  header {
    left: 200px;
    width: calc(100% - 200px);
  }
}
</style>