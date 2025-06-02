<script setup lang="ts">
import ChatbotButton from '~/components/ChatbotButton.vue'
</script>

<template>
  <div>
    <AppHeader/>
    <slot/>
    <AppFooter/>
    <ChatbotButton />
  </div>  
</template>