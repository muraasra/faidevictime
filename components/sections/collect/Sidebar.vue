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
    class="hidden z-10 md:block w-[200px] h-auto py-5 px-3 border-r dark:border-r-gray-600 border-r-gray-200 transition-all duration-300"
  >
    <!-- Logo -->
    <div class="flex items-center justify-center">
      <NuxtLink href="/" class="text-2xl font-extrabold text-emerald-500">
        Victi<span class="text-gray-800 dark:text-white">Safe</span>
      </NuxtLink>
    </div>

    <!-- Navigation -->
    <nav class="space-y-4">
      <div
        v-for="navigation in NAVIGATION_ITEMS"
        class="space-y-1 pb-3 border-b last:border-b-0 dark:border-gray-600 border-gray-200 dark:text-white"
      >
        <NuxtLink
          v-for="nav in navigation"
          :key="nav.link"
          :href="nav.link"
          active-class="bg-emerald-500 text-white"
          class="flex items-center gap-x-3 cursor-pointer px-4 py-2 rounded-md hover:bg-emerald-500 hover:text-white transition-all duration-200"
        >
          <UIcon :name="nav.icon" class="w-5 h-5" />
          <span class="text-sm font-medium">{{ nav.name }}</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.sidebar {
  transition: all 0.3s ease-in-out;
}
</style>