<script setup lang="ts">
useHead({
  title: 'Compta-ka - Home',
  meta: [
    { name: 'description', content: 'Podux Podcast landing page website.' },
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/ico.png' }
  ],
})
</script>
<template>
    <div>
        <SectionsHomeHeroSection/>
        <SectionsHomeLatestPodcast/>
        <SectionsHomePopularPodcasts/>
        <SectionsAboutPodux/>
        <SectionsWhyUs/>
        <SectionsCallToAction/>
    </div>
</template>