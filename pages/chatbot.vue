<script setup lang="ts">
// L'ancien formulaire d'admission a été remplacé par la conversation directe avec Avina :
// une victime ne doit pas remplir un formulaire de 7 champs avant de pouvoir parler.
definePageMeta({ layout: false })
await navigateTo('/chat', { redirectCode: 301 })
</script>

<template>
  <div />
</template>
