<script setup lang="ts">
import SectionsCollectSidebar from "~/components/sections/collect/Sidebar.vue";
import SectionsCollectMainHeader from "~/components/sections/collect/MainHeader.vue";

</script>

<template>
  <div class="flex min-h-screen">
    <main class="w-full flex h-full">
      <SectionsCollectSidebar />
      <div class="flex-1 h-full pl-0 md:pl-[200px] pb-10">
        <SectionsCollectMainHeader />

        <slot />
        
      </div>
    </main>

  </div>
  <footer>
    <!--<AppFooter />-->
  </footer>
</template>
