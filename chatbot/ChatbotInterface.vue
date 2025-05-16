<template>
  <div class="chatbot-container">
    <div class="chat-window">
      <!-- En-tête du chat -->
      <div class="chat-header">
        <div class="header-info">
          <div class="bot-avatar">
            <i class="fas fa-headset"></i>
          </div>
          <div class="bot-info">
            <h3>Assistant en ligne</h3>
            <span class="status-indicator">
              <span class="status-dot"></span>
              En ligne
            </span>
          </div>
        </div>
        <button class="minimize-button">
          <i class="fas fa-minus"></i>
        </button>
      </div>

      <!-- Zone des messages -->
      <div class="messages-container" ref="messagesContainer">
        <ChatMessage
          v-for="message in messages"
          :key="message.id"
          :message="message"
        />
        <div class="typing-indicator" v-if="isTyping">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div ref="messagesEnd"></div>
      </div>

      <!-- Suggestions rapides -->
      <div class="quick-suggestions" v-if="showSuggestions">
        <button 
          v-for="suggestion in suggestions" 
          :key="suggestion"
          class="suggestion-button"
          @click="handleSuggestionClick(suggestion)"
        >
          {{ suggestion }}
        </button>
      </div>

      <!-- Zone de saisie -->
      <div class="input-container">
        <button class="attachment-button">
          <i class="fas fa-paperclip"></i>
        </button>
        <textarea
          v-model="newMessage"
          class="message-input"
          placeholder="Écrivez votre message ici..."
          @keydown.enter.prevent="handleEnterPress"
          @input="autoGrow"
          ref="messageInput"
          rows="1"
        ></textarea>
        <button
          class="send-button"
          :disabled="!newMessage.trim()"
          @click="handleSendMessage"
        >
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import ChatMessage from './ChatMessage.vue'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const messages = ref<Message[]>([
  {
    id: '1',
    text: 'Bonjour, je suis là pour vous aider. Comment puis-je vous assister aujourd\'hui ?',
    sender: 'bot',
    timestamp: new Date(),
  },
])

const suggestions = [
  'Comment déclarer un sinistre ?',
  'Je souhaite être contacté',
  'Consulter mes documents',
]

const newMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const messagesEnd = ref<HTMLElement | null>(null)
const messageInput = ref<HTMLTextAreaElement | null>(null)
const isTyping = ref(false)
const showSuggestions = ref(true)

const scrollToBottom = async () => {
  await nextTick()
  if (messagesEnd.value) {
    messagesEnd.value.scrollIntoView({ behavior: 'smooth' })
  }
}

const autoGrow = () => {
  if (messageInput.value) {
    messageInput.value.style.height = 'auto'
    messageInput.value.style.height = messageInput.value.scrollHeight + 'px'
  }
}

watch(messages, () => {
  scrollToBottom()
}, { deep: true })

const handleSuggestionClick = (suggestion: string) => {
  newMessage.value = suggestion
  handleSendMessage()
  showSuggestions.value = false
}

const handleSendMessage = async () => {
  if (!newMessage.value.trim()) return

  const userMessage: Message = {
    id: Date.now().toString(),
    text: newMessage.value,
    sender: 'user',
    timestamp: new Date(),
  }

  messages.value.push(userMessage)
  newMessage.value = ''
  if (messageInput.value) {
    messageInput.value.style.height = 'auto'
  }

  // Simuler la réponse du bot
  isTyping.value = true
  setTimeout(() => {
    isTyping.value = false
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: 'Je comprends votre situation. Comment puis-je vous aider davantage ?',
      sender: 'bot',
      timestamp: new Date(),
    }
    messages.value.push(botMessage)
  }, 2000)
}

const handleEnterPress = (event: KeyboardEvent) => {
  if (!event.shiftKey) {
    handleSendMessage()
  }
}
</script>

<style scoped>
.chatbot-container {
  max-width: 400px;
  margin: 2rem;
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 1000;
}

.chat-window {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  height: 600px;
  display: flex;
  flex-direction: column;
  border: 1px solid #e1e4e8;
}

.chat-header {
  padding: 1rem;
  background: #4a9eff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.bot-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.bot-info h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  opacity: 0.9;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #4ade80;
  border-radius: 50%;
}

.minimize-button {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.minimize-button:hover {
  opacity: 1;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background-color: #f8f9fa;
}

.quick-suggestions {
  padding: 0.75rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  border-top: 1px solid #e9ecef;
  background: white;
}

.suggestion-button {
  padding: 0.5rem 1rem;
  background: #e9ecef;
  border: none;
  border-radius: 16px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.suggestion-button:hover {
  background: #dee2e6;
}

.input-container {
  padding: 1rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 0.5rem;
  background: white;
  align-items: flex-end;
}

.message-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  resize: none;
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.5;
  max-height: 120px;
  min-height: 40px;
}

.message-input:focus {
  outline: none;
  border-color: #4a9eff;
}

.attachment-button,
.send-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: #f8f9fa;
  color: #4a9eff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.send-button {
  background-color: #4a9eff;
  color: white;
}

.send-button:hover:not(:disabled) {
  background-color: #3182ce;
}

.send-button:disabled {
  background-color: #cbd5e0;
  cursor: not-allowed;
}

.attachment-button:hover {
  background-color: #e9ecef;
}

/* Indicateur de frappe */
.typing-indicator {
  padding: 0.5rem;
  display: flex;
  gap: 0.25rem;
  align-items: center;
  margin-bottom: 1rem;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #4a9eff;
  border-radius: 50%;
  display: inline-block;
  animation: typing 1s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
</style> 