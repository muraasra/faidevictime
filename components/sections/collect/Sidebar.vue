<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { NAVIGATION_ITEMS } from "~/constants";



// État pour gérer la position de la sidebar
const isFixed = ref(true);

// Gestion du comportement au scroll
const handleScroll = () => {
  const footer = document.querySelector("footer");
  const sidebar = document.querySelector(".sidebar");

  if (footer && sidebar) {
    const footerTop = footer.getBoundingClientRect().top;
    const sidebarHeight = (sidebar as HTMLElement).offsetHeight;
    // Condition : lorsque la sidebar atteint le footer
    isFixed.value = footerTop > sidebarHeight;
  }
};


</script>

<template>
  <div
    :class="['sidebar', isFixed ? 'fixed top-0' : 'absolute bottom-0']"
    class="hidden z-10 md:block w-[200px] h-screen py-6 px-4 border-r dark:border-r-gray-700 border-r-gray-200 transition-all duration-300 bg-gray-50 dark:bg-zinc-800"
  >
    <!-- Logo -->
    <div class="flex items-center justify-center mb-8">
      <NuxtLink href="/" class="text-2xl font-extrabold text-emerald-600">
        Safe<span class="text-gray-800 dark:text-white">Place</span>
      </NuxtLink>
    </div>

    <!-- Navigation -->
    <nav class="space-y-6">
      <div
        v-for="navigation in NAVIGATION_ITEMS"
        class="space-y-2 pb-4 border-b last:border-b-0 dark:border-gray-700 border-gray-200"
      >
        <NuxtLink
          v-for="nav in navigation"
          :key="nav.link"
          :href="nav.link"
          active-class="bg-emerald-100 text-emerald-800 dark:bg-emerald-700 dark:text-white font-semibold"
          class="flex items-center gap-x-3 cursor-pointer px-3 py-2 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-700/30 hover:text-emerald-700 dark:hover:text-emerald-200 transition-colors duration-200 text-gray-700 dark:text-gray-300"
        >
          <UIcon :name="nav.icon" class="w-5 h-5" />
          <span class="text-sm">{{ nav.name }}</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.sidebar {
  transition: all 0.3s ease-in-out;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}
</style>