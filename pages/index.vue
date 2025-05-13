<script setup lang="ts">
useHead({
  title: 'VictiSafe - Home',
  meta: [
  { name: 'description', content: 'Plateforme d\'assistante au victime.' },
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/ico.png' }
  ],
})
</script>
<template>
    <div>
        <SectionsHomeHeroSection/>
        <SectionsAboutPodux/>
        <SectionsWhyUs/>
        <!-- <SectionsHomeLatestPodcast/> -->
        <SectionsHomePopularPodcasts/>
        <SectionsCallToAction/>
    </div>
</template>