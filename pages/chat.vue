<template>
  <ChatInterface />
</template>

<script setup lang="ts">
import ChatInterface from '~/components/chat/ChatInterface.vue'
</script>

<style>
/* Styles globaux pour le chat */
:root {
  --primary-color: #28a745;
  --primary-hover: #218838;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
</style> 