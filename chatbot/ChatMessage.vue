<template>
  <div class="message-container" :class="{ 'user-message': isUser }">
    <div class="avatar" v-if="!isUser">
      <i class="fas fa-headset"></i>
    </div>
    <div class="message-content">
      <div class="message-bubble">
        <p class="message-text">{{ message.text }}</p>
        <span class="message-time">{{ formattedTime }}</span>
      </div>
    </div>
    <div class="avatar user-avatar" v-if="isUser">
      <i class="fas fa-user"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const props = defineProps<{
  message: Message
}>()

const isUser = computed(() => props.message.sender === 'user')

const formattedTime = computed(() => {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(props.message.timestamp)
})
</script>

<style scoped>
.message-container {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  animation: fadeIn 0.3s ease-in-out;
  gap: 0.5rem;
}

.user-message {
  flex-direction: row-reverse;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #4a9eff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
}

.user-avatar {
  background: #6366f1;
}

.message-content {
  max-width: calc(100% - 80px);
}

.message-bubble {
  padding: 0.75rem 1rem;
  border-radius: 16px;
  position: relative;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e4e8;
}

.user-message .message-bubble {
  background-color: #4a9eff;
  color: white;
  border: none;
}

.message-text {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.4;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.message-time {
  display: block;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  opacity: 0.8;
  text-align: right;
}

.user-message .message-time {
  color: rgba(255, 255, 255, 0.9);
}

/* Animation d'apparition */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Flèche de bulle pour les messages du bot */
.message-bubble::before {
  content: '';
  position: absolute;
  bottom: 8px;
  left: -6px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 6px 6px 6px 0;
  border-color: transparent #f0f2f5 transparent transparent;
}

/* Flèche de bulle pour les messages de l'utilisateur */
.user-message .message-bubble::before {
  left: auto;
  right: -6px;
  border-width: 6px 0 6px 6px;
  border-color: transparent transparent transparent #4a9eff;
}
</style> 