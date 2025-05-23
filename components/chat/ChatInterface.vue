<template>
     <div class="chat-page py-12 px-6 md:px-12"> <!--pour l'espace entre la navbar et le body -->
  <div class="chat-container" :class="{ 'dark-mode': isDarkMode }">
    <div 
      class="chat-sidebar" 
      :class="{ 'show': isSidebarVisible }"
    >
      <div class="sidebar-header">
        <button class="new-chat-btn" @click="startNewChat">
          <i class="fas fa-plus"></i>
          Nouvelle conversation
        </button>
      </div>

      <div class="conversations-list">
        <button 
          v-for="chat in conversations" 
          :key="chat.id"
          class="conversation-item"
          :class="{ 'active': currentChat?.id === chat.id }"
          @click="selectChat(chat)"
        >
          <i class="fas fa-comments"></i>
          <span class="conversation-title">{{ chat.title }}</span>
        </button>
      </div>

      <div class="sidebar-footer">
        <button class="theme-toggle" @click="toggleTheme">
          <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
          {{ isDarkMode ? 'Mode clair' : 'Mode sombre' }}
        </button>
      </div>
    </div>

    <div class="chat-main">
      <div class="chat-messages" ref="messagesContainer">
        <div 
          v-for="message in currentChat?.messages" 
          :key="message.id"
          class="message-wrapper"
          :class="{ 
            'user-message': message.sender === 'user',
            'urgent-message': message.isUrgent 
          }"
        >
          <div class="message">
            <div class="message-avatar">
              <i :class="message.sender === 'user' ? 'fas fa-user' : 'fas fa-robot'"></i>
            </div>
            <div class="message-content">
              <div class="message-text" v-html="formatMessage(message.text)"></div>
              <div class="message-footer">
                <div class="message-time">{{ formatTime(message.timestamp) }}</div>
                <div v-if="message.sender === 'assistant'" class="message-feedback">
                  <template v-if="!message.feedback">
                    <button 
                      class="feedback-btn"
                      @click="addFeedback(message.id, true)"
                    >
                      <i class="fas fa-thumbs-up"></i>
                    </button>
                    <button 
                      class="feedback-btn"
                      @click="addFeedback(message.id, false)"
                    >
                      <i class="fas fa-thumbs-down"></i>
                    </button>
                  </template>
                  <div v-else class="feedback-result">
                    <i :class="message.feedback.helpful ? 'fas fa-check text-green-500' : 'fas fa-times text-red-500'"></i>
                    <span class="feedback-text">{{ message.feedback.helpful ? 'Utile' : 'Pas utile' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="typing-indicator" v-if="isTyping">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>

      <!-- Alerte d'urgence -->
      <div 
        v-if="showEmergencyAlert"
        class="emergency-alert"
      >
        <div class="alert-content">
          <i class="fas fa-exclamation-triangle text-red-500"></i>
          <div class="alert-text">
            <h3>Situation d'urgence détectée</h3>
            <p>Nous avons détecté que votre situation pourrait nécessiter une intervention immédiate.</p>
            <div class="emergency-buttons">
              <a href="tel:17" class="emergency-btn">
                <i class="fas fa-phone"></i>
                Appeler la Police (17)
              </a>
              <a href="tel:15" class="emergency-btn">
                <i class="fas fa-ambulance"></i>
                Appeler le SAMU (15)
              </a>
              <button class="close-btn" @click="showEmergencyAlert = false">
                Fermer l'alerte
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-input">
        <div class="input-wrapper">
          <textarea
            v-model="newMessage"
            placeholder="Écrivez votre message..."
            @keydown.enter.prevent="handleEnterPress"
            @input="autoGrow"
            ref="messageInput"
            rows="1"
          ></textarea>
          <button 
            class="send-button"
            :disabled="!newMessage.trim() || isTyping"
            @click="sendMessage"
          >
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
        <div class="input-footer">
          Appuyez sur Entrée pour envoyer, Maj+Entrée pour un retour à la ligne
        </div>
      </div>
    </div>

    <button 
      class="mobile-menu-button" 
      @click="toggleSidebar"
      :class="{ 'active': isSidebarVisible }"
    >
      <i :class="isSidebarVisible ? 'fas fa-times' : 'fas fa-bars'"></i>
    </button>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, nextTick, computed, onUnmounted } from 'vue'
import { useStorage } from '@vueuse/core'

interface Message {
  id: string
  text: string
  sender: 'user' | 'assistant'
  timestamp: Date
  isUrgent?: boolean
  feedback?: {
    helpful: boolean
    comment?: string
  }
}

interface Chat {
  id: string
  title: string
  messages: Message[]
  isUrgent?: boolean
  lastSaved?: Date
}

// Constantes
const EMERGENCY_KEYWORDS = [
  'urgence', 'danger', 'suicide', 'mourir', 'tuer',
  'violence', 'menace', 'immédiat', 'secours', 'aide'
]

// État local
const isDarkMode = useStorage('chat-dark-mode', false)
const conversations = useStorage('saved-conversations', [] as Chat[])
const currentChat = ref<Chat | null>(null)
const newMessage = ref('')
const isTyping = ref(false)
const showEmergencyAlert = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const messageInput = ref<HTMLTextAreaElement | null>(null)
const isSidebarVisible = ref(true)

// Initialisation
onMounted(() => {
  if (conversations.value.length === 0) {
    startNewChat()
  }
  
  // Vérifier la taille de l'écran au montage
  if (typeof window !== 'undefined') {
    isSidebarVisible.value = window.innerWidth > 1024
    
    // Ajouter les écouteurs d'événements
    window.addEventListener('click', handleClickOutside)
    window.addEventListener('resize', handleResize)
  }
})

// Nettoyage
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', handleClickOutside)
    window.removeEventListener('resize', handleResize)
  }
})

// Fonctions
const startNewChat = () => {
  const newChat: Chat = {
    id: Date.now().toString(),
    title: 'Nouvelle conversation',
    messages: [{
      id: '1',
      text: 'Bonjour, je suis là pour vous aider. Comment puis-je vous assister aujourd\'hui ?',
      sender: 'assistant',
      timestamp: new Date()
    }]
  }
  conversations.value.unshift(newChat)
  currentChat.value = newChat
  newMessage.value = ''
}

const selectChat = (chat: Chat) => {
  currentChat.value = chat
  if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
    isSidebarVisible.value = false
  }
}

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
}

const formatMessage = (text: string) => {
  // Convertir les URLs en liens cliquables
  return text.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  )
}

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const autoGrow = () => {
  if (messageInput.value) {
    messageInput.value.style.height = 'auto'
    messageInput.value.style.height = messageInput.value.scrollHeight + 'px'
  }
}

const handleEnterPress = (event: KeyboardEvent) => {
  if (!event.shiftKey) {
    sendMessage()
  }
}

// Fonction pour détecter les situations d'urgence
const checkForEmergency = (text: string): boolean => {
  const lowercaseText = text.toLowerCase()
  return EMERGENCY_KEYWORDS.some(keyword => lowercaseText.includes(keyword))
}

// Fonction modifiée pour l'envoi de messages
const sendMessage = async () => {
  if (!newMessage.value.trim() || !currentChat.value || isTyping.value) return

  const isUrgent = checkForEmergency(newMessage.value)
  
  // Ajouter le message de l'utilisateur
  const userMessage: Message = {
    id: Date.now().toString(),
    text: newMessage.value,
    sender: 'user',
    timestamp: new Date(),
    isUrgent
  }
  
  currentChat.value.messages.push(userMessage)
  
  if (isUrgent && !currentChat.value.isUrgent) {
    currentChat.value.isUrgent = true
    showEmergencyAlert.value = true
  }

  const messageText = newMessage.value
  newMessage.value = ''
  if (messageInput.value) {
    messageInput.value.style.height = 'auto'
  }

  // Sauvegarder la conversation
  saveChat()

  // Simuler la réponse de l'assistant
  isTyping.value = true
  await scrollToBottom()
  
  // Si c'est urgent, répondre immédiatement avec les numéros d'urgence
  if (isUrgent) {
    await simulateTyping()
    currentChat.value.messages.push({
      id: Date.now().toString(),
      text: `⚠️ J'ai détecté que votre situation pourrait être urgente. Voici les numéros d'urgence :\n
      - Police : 17\n
      - SAMU : 15\n
      - Urgences : 112\n
      Voulez-vous que je vous mette en relation directe avec un intervenant d'urgence ?`,
      sender: 'assistant',
      timestamp: new Date(),
      isUrgent: true
    })
  } else {
    // Réponse normale
    await simulateTyping()
    // ... existing response logic ...
  }
}

// Nouvelle fonction pour la simulation de frappe
const simulateTyping = async () => {
  const typingDelay = Math.random() * 1000 + 500
  await new Promise(resolve => setTimeout(resolve, typingDelay))
}

// Nouvelle fonction pour sauvegarder la conversation
const saveChat = () => {
  if (!currentChat.value) return
  currentChat.value.lastSaved = new Date()
  // La sauvegarde est automatique grâce à useStorage
}

// Nouvelle fonction pour le feedback
const addFeedback = (messageId: string, helpful: boolean, comment?: string) => {
  if (!currentChat.value) return
  const message = currentChat.value.messages.find(m => m.id === messageId)
  if (message) {
    message.feedback = { helpful, comment }
    saveChat()
  }
}

// Observer les changements de messages pour scroll
watch(() => currentChat.value?.messages, () => {
  scrollToBottom()
}, { deep: true })

const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value
}

const handleClickOutside = (event: MouseEvent) => {
  if (typeof window === 'undefined') return
  
  const sidebar = document.querySelector('.chat-sidebar')
  const menuButton = document.querySelector('.mobile-menu-button')
  
  if (window.innerWidth <= 1024 && 
      sidebar && 
      !sidebar.contains(event.target as Node) && 
      menuButton && 
      !menuButton.contains(event.target as Node)) {
    isSidebarVisible.value = false
  }
}

const handleResize = () => {
  if (typeof window === 'undefined') return
  
  if (window.innerWidth > 1024) {
    isSidebarVisible.value = true
  }
}
</script>

<style scoped>
.chat-container {
  --bg-color: #ffffff;
  --text-color: #333333;
  --border-color: #e5e7eb;
  --button-bg: #28a745;
  --button-hover: #218838;
  --sidebar-bg: #f8f9fa;
  --message-bg: #f0f2f5;
  --user-message-bg: #dcf8c6;
  --urgent-color: #dc3545;
  --urgent-bg: #fff3f3;
  --success-color: #28a745;
  --warning-color: #ffc107;
  --navbar-height: 64px; /* Valeur par défaut */

  display: flex;
  height: calc(100vh - var(--navbar-height));
  background-color: var(--bg-color);
  color: var(--text-color);
  position: relative;
  margin-top: var(--navbar-height);
  overflow: hidden;
}

.chat-container.dark-mode {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
  --border-color: #2d2d2d;
  --button-bg: #2ea44f;
  --button-hover: #2c974b;
  --sidebar-bg: #2d2d2d;
  --message-bg: #2d2d2d;
  --user-message-bg: #1e4620;
  --urgent-color: #ff4d4d;
  --urgent-bg: #3d2929;
  --success-color: #3fb950;
  --warning-color: #d29922;
}

.chat-container:not(.dark-mode) {
  --bg-color: #ffffff;
  --text-color: #1a1a1a;
  --sidebar-bg: #f7f7f7;
  --message-bg: #f0f0f0;
  --user-message-bg: #e8f5e8;
  --border-color: #e0e0e0;
  --hover-color: #e9e9e9;
  --input-bg: #ffffff;
  --button-bg: #28a745;
  --button-hover: #218838;
  --link-color: #28a745;
}

/* Ajout d'un bouton de menu pour mobile */
.mobile-menu-button {
  display: none;
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 100;
  padding: 0.5rem;
  background-color: var(--button-bg);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.chat-sidebar {
  width: 300px;
  background-color: var(--sidebar-bg);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, width 0.3s ease;
  height: 100%;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.new-chat-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--button-bg);
  color: white;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.new-chat-btn:hover {
  background-color: var(--button-hover);
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.conversation-item {
  width: 100%;
  padding: 0.75rem;
  background: none;
  border: none;
  border-radius: 8px;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: left;
  margin-bottom: 0.5rem;
}

.conversation-item:hover,
.conversation-item.active {
  background-color: var(--hover-color);
}

.conversation-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
}

.theme-toggle {
  width: 100%;
  padding: 0.75rem;
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.theme-toggle:hover {
  background-color: var(--hover-color);
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: calc(100% - 300px);
  height: 100%;
  position: relative;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: calc(100% - 100px); /* Hauteur ajustée pour la zone de saisie */
}

.message-wrapper {
  display: flex;
  justify-content: flex-start;
  max-width: 80%;
  animation: slideIn 0.3s ease;
}

.message-wrapper.user-message {
  justify-content: flex-end;
  margin-left: auto;
}

.message {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--message-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-message .message-avatar {
  background-color: #28a745;
  color: white;
}

.message-content {
  background-color: var(--message-bg);
  padding: 1rem;
  border-radius: 12px;
  max-width: 100%;
}

.user-message .message-content {
  background-color: var(--user-message-bg);
}

.message-text {
  white-space: pre-wrap;
  word-break: break-word;
}

.message-text a {
  color: var(--link-color);
  text-decoration: none;
}

.message-text a:hover {
  text-decoration: underline;
}

.message-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.message-time {
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.7;
}

.message-feedback {
  display: flex;
  gap: 0.5rem;
}

.feedback-btn {
  padding: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.feedback-btn:hover {
  color: var(--button-bg);
}

.feedback-result {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.feedback-text {
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.7;
}

.typing-indicator {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background-color: var(--message-bg);
  border-radius: 12px;
  width: fit-content;
  animation: fadeIn 0.3s ease;
}

.typing-indicator .dot {
  width: 8px;
  height: 8px;
  background-color: var(--text-color);
  border-radius: 50%;
  opacity: 0.6;
  animation: typing 1s infinite;
}

.typing-indicator .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator .dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.chat-input {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-color);
  z-index: 10;
  margin-top: auto;
}

.input-wrapper {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
}

textarea {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--input-bg);
  color: var(--text-color);
  resize: none;
  min-height: 40px;
  max-height: 200px;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
}

textarea:focus {
  outline: none;
  border-color: var(--button-bg);
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.2);
}

.send-button {
  padding: 0.75rem;
  background-color: var(--button-bg);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-button:hover:not(:disabled) {
  background-color: var(--button-hover);
}

.send-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-footer {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.7;
  text-align: center;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .chat-container {
    --navbar-height: 64px;
  }

  .mobile-menu-button {
    display: flex;
    top: 1rem;
  }

  .chat-sidebar {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 99;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .chat-sidebar.show {
    transform: translateX(0);
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  }

  .chat-main {
    max-width: 100%;
    margin-left: 0;
  }
}

@media (max-width: 768px) {
  .chat-container {
    --navbar-height: 56px;
  }

  .chat-main {
    padding-top: 0;
  }

  .chat-messages {
    height: calc(100% - 120px);
  }

  .message-wrapper {
    max-width: 90%;
  }

  .chat-input {
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .chat-container {
    height: calc(100vh - var(--navbar-height, 56px));
    margin-top: var(--navbar-height, 56px);
  }

  .chat-messages {
    height: calc(100% - 100px);
    padding: 0.5rem;
  }

  .message-wrapper {
    max-width: 95%;
  }

  .chat-input {
    padding: 0.5rem;
  }
}

/* Ajout d'animations fluides */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
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

/* Amélioration de l'accessibilité */
.send-button:focus,
.new-chat-btn:focus,
.theme-toggle:focus,
.conversation-item:focus {
  outline: 2px solid var(--button-bg);
  outline-offset: 2px;
}

/* Amélioration du scrolling */
.chat-messages {
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: var(--border-color);
  border-radius: 3px;
}

/* Alerte d'urgence */
.emergency-alert {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.alert-content {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 80%;
  text-align: center;
}

.alert-text {
  margin-bottom: 2rem;
}

.alert-text h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.alert-text p {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.emergency-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.emergency-btn {
  padding: 0.75rem 1rem;
  background-color: var(--button-bg);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.emergency-btn:hover {
  background-color: var(--button-hover);
}

.close-btn {
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: var(--button-bg);
}

.urgent-message {
  background-color: var(--urgent-bg) !important;
  border-left: 4px solid var(--urgent-color) !important;
}

/* Overlay pour la sidebar mobile */
.chat-sidebar.show::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
  animation: fadeIn 0.3s ease;
}

/* Ajustement pour le thème */
:root {
  color-scheme: light dark;
}
</style> 