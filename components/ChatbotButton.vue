<template>
  <div 
    v-if="!isChatRoute"
    class="chatbot-container"
    :class="{ 'chatbot-banner': isFullscreen, 'chatbot-minimized': !isFullscreen }"
  >
    <div class="chatbot-content">
      <div v-if="isFullscreen" class="chatbot-header">
        <div class="header-content">
          <h3 class="text-xl font-semibold text-white mb-1">Bienvenue sur VictiSafe</h3>
          <p class="text-green-100 text-sm">Notre assistant virtuel est là pour vous accompagner et vous soutenir dans vos démarches</p>
          <p class="text-green-100 text-xs mt-1">Vous n'êtes pas seul(e), nous sommes là pour vous aider</p>
        </div>
        <button 
          @click="closeBanner"
          class="close-button"
          aria-label="Fermer la bannière"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
      <button 
        v-if="!isFullscreen"
        @click="openChat"
        class="chatbot-button group"
        aria-label="Ouvrir le chat d'assistance"
      >
        <div class="chatbot-icon-wrapper">
          <i class="fas fa-hands-helping text-xl"></i>
          <span class="notification-dot" v-if="hasNewMessage"></span>
        </div>
        <span class="chatbot-text">Besoin d'aide ?</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isFullscreen = ref(true)
const hasNewMessage = ref(false)

const isChatRoute = computed(() => {
  return route.path === '/chat'
})

onMounted(() => {
  // After 8 seconds, minimize the chatbot
  setTimeout(() => {
    isFullscreen.value = false
  }, 8000)
})

const closeBanner = () => {
  isFullscreen.value = false
}

const openChat = () => {
  router.push('/chat')
  hasNewMessage.value = false
}
</script>

<style scoped>
.chatbot-container {
  position: fixed;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chatbot-banner {
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #1a5f3c 0%, #2d8659 100%);
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.5s ease-out;
}

.chatbot-minimized {
  bottom: 2rem;
  right: 2rem;
  transform: scale(1);
}

.chatbot-content {
  text-align: center;
  padding: 1rem 2rem;
  border-radius: 0;
  animation: fadeIn 0.4s ease-out;
}

.chatbot-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.5rem 0;
}

.header-content {
  text-align: left;
  flex: 1;
}

.close-button {
  background: transparent;
  border: none;
  color: white;
  padding: 0.5rem;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
  margin-left: 1rem;
}

.close-button:hover {
  opacity: 1;
}

.chatbot-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: white;
  color: #1a5f3c;
  padding: 0.875rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chatbot-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background-color: #f8fafc;
}

.chatbot-button:active {
  transform: translateY(0);
}

.chatbot-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background-color: #ef4444;
  border-radius: 50%;
  border: 2px solid white;
}

.chatbot-text {
  font-size: 0.9375rem;
  white-space: nowrap;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes minimizeChat {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.95);
    opacity: 0.95;
  }
}

.chatbot-minimized .chatbot-content {
  animation: minimizeChat 0.3s ease-out forwards;
}

/* Dark mode support */
:global(.dark) .chatbot-button {
  background-color: #1f2937;
  color: #2d8659;
}

:global(.dark) .chatbot-button:hover {
  background-color: #374151;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .chatbot-content {
    padding: 0.75rem 1rem;
  }

  .chatbot-header {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .header-content {
    text-align: center;
  }

  .close-button {
    margin-left: 0;
    margin-top: 0.5rem;
  }
}

@media (max-width: 640px) {
  .chatbot-minimized {
    bottom: 1.25rem;
    right: 1.25rem;
  }

  .chatbot-button {
    padding: 0.75rem;
  }

  .chatbot-text {
    display: none;
  }
}

/* Animation for notification dot */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.notification-dot {
  animation: pulse 2s infinite;
}
</style> 