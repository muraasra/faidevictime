<script setup lang="ts">
useHead({
  title: 'ChildSafe - Assistance aux Victimes | Soutien et Protection',
  meta: [
    { name: 'description', content: 'ChildSafe est une plateforme d\'assistance aux victimes offrant un soutien confidentiel, des conseils juridiques et un accompagnement personnalisé pour les personnes en situation de détresse.' },
    { name: 'keywords', content: 'assistance victimes, soutien victimes, protection victimes, aide juridique, accompagnement victimes, soutien psychologique' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'ChildSafe - Assistance aux Victimes | Soutien et Protection' },
    { property: 'og:description', content: 'ChildSafe est une plateforme d\'assistance aux victimes offrant un soutien confidentiel, des conseils juridiques et un accompagnement personnalisé pour les personnes en situation de détresse.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://vicitisafe.com' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'ChildSafe - Assistance aux Victimes | Soutien et Protection' },
    { name: 'twitter:description', content: 'ChildSafe est une plateforme d\'assistance aux victimes offrant un soutien confidentiel, des conseils juridiques et un accompagnement personnalisé pour les personnes en situation de détresse.' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { charset: 'utf-8' }
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/ico.png' },
    { rel: 'canonical', href: 'https://vicitisafe.com' }
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