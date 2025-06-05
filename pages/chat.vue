<!-- <template>
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
</style>  -->
<template>
  <div class="min-h-screen bg-gray-100 flex flex-col md:flex-row">
    <!-- Sidebar Desktop -->
    <div class="hidden md:flex md:w-72 bg-white shadow-lg flex-col sidebar">
      <div class="p-4 border-b border-gray-200">
        <h1 class="text-xl font-bold text-gray-800 flex items-center">
          <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          Soutien Moral
        </h1>
      </div>
      
      <div class="flex-1 overflow-y-auto p-4">
        <button 
          @click="startNewChat" 
          class="w-full mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Nouvelle Conversation
        </button>
        
        <div class="space-y-3">
          <div v-if="conversations.length === 0 && !isLoading" class="text-center py-4">
            <p class="text-sm text-gray-500">Aucune conversation</p>
          </div>
          <div 
            v-for="conv in conversations" 
            :key="conv.id"
            @click="selectConversation(conv.id)"
            class="p-3 rounded-lg cursor-pointer transition-all duration-200 border-l-4 hover:shadow-md"
            :class="{ 
              'bg-green-50 border-green-500 shadow-md': currentConversationId === conv.id,
              'bg-white border-transparent hover:bg-gray-50 hover:border-gray-300': currentConversationId !== conv.id 
            }"
          >
            <h3 class="font-medium text-gray-800 text-sm">{{ conv.title || 'Nouvelle conversation' }}</h3>
            <p class="text-xs text-gray-500 mt-1">{{ formatDate(conv.created_at) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Zone de Chat Principale -->
    <div class="flex-1 flex flex-col bg-white h-screen">
      <!-- En-tête du Chat avec Menu Mobile -->
      <div class="bg-white border-b border-gray-200 px-4 py-4 shadow-sm flex-shrink-0">
        <div class="flex items-center justify-between">
          <!-- Menu Mobile -->
      <button 
        @click="showMobileMenu = !showMobileMenu"
            class="md:hidden p-2 rounded-lg hover:bg-gray-100"
      >
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

          <div class="flex-1 ml-4 md:ml-0">
            <h2 class="text-lg font-semibold text-gray-800">
              {{ currentConversationId ? getCurrentConversationTitle() : 'Nouvelle Conversation' }}
            </h2>
            <p class="text-sm text-gray-500 mt-1">
              {{ currentConversationId ? `${messages.length} messages` : 'Commencez une nouvelle conversation' }}
            </p>
          </div>

          <div v-if="currentConversationId" class="hidden md:flex items-center bg-green-100 px-3 py-1 rounded-full">
            <div class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span class="text-sm font-medium text-green-700">En ligne</span>
          </div>
        </div>
    </div>

      <!-- Menu Mobile -->
    <div 
      v-if="showMobileMenu" 
        class="md:hidden fixed inset-0 z-50 flex"
    >
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="showMobileMenu = false"></div>
      <div class="relative w-80 bg-white shadow-xl max-w-[85vw] flex flex-col">
        <div class="p-4 border-b border-gray-200 flex items-center justify-between">
          <h1 class="text-lg font-bold text-gray-800">Soutien Moral</h1>
          <button @click="showMobileMenu = false" class="p-2 hover:bg-gray-100 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="flex-1 overflow-y-auto p-4">
            <button 
              @click="() => { startNewChat(); showMobileMenu = false; }" 
              class="w-full mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Nouvelle Conversation
            </button>
          
          <div class="space-y-3">
            <div v-if="conversations.length === 0 && !isLoading" class="text-center py-4">
              <p class="text-sm text-gray-500">Aucune conversation</p>
            </div>
            <div 
              v-for="conv in conversations" 
              :key="conv.id"
                @click="() => { selectConversation(conv.id); showMobileMenu = false; }"
              class="p-3 rounded-lg cursor-pointer transition-all border-l-4"
              :class="{ 
                'bg-green-50 border-green-500': currentConversationId === conv.id,
                'bg-white border-transparent hover:bg-gray-50': currentConversationId !== conv.id 
              }"
            >
              <h3 class="font-medium text-gray-800 text-sm">{{ conv.title || 'Nouvelle conversation' }}</h3>
              <p class="text-xs text-gray-500 mt-1">{{ formatDate(conv.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

      <!-- Zone des Messages -->
      <div 
        ref="messagesContainer"
        class="flex-1 overflow-y-auto p-4 bg-gray-50"
        @scroll="handleScroll"
      >
        <!-- Message de Bienvenue -->
        <div v-if="messages.length === 0" class="flex items-center justify-center h-full">
          <div class="text-center py-8">
            <div class="max-w-md mx-auto">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-3">Bonjour ! 👋</h3>
              <p class="text-gray-600 leading-relaxed">
                Je suis votre assistant de soutien moral. N'hésitez pas à partager ce qui vous préoccupe, 
                je suis là pour vous écouter et vous accompagner.
              </p>
              <div class="mt-6">
                <button 
                  @click="messageInput?.focus()"
                  class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Démarrer une conversation
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Messages -->
        <div v-else class="space-y-4">
          <div 
            v-for="(message, index) in messages" 
            :key="message.id || index"
            class="flex"
            :class="message.sender === 'user' ? 'justify-end' : 'justify-start'"
          >
            <!-- Message du Bot -->
            <div 
              v-if="message.sender === 'assistant'"
              class="flex items-start space-x-2 max-w-[85%]"
            >
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <div class="bg-white rounded-2xl px-3 py-2 shadow-md border border-gray-100">
                <p class="text-gray-800 leading-relaxed whitespace-pre-wrap">{{ message.content }}</p>
                <p class="text-xs text-gray-400 mt-2">{{ formatTime(message.created_at) }}</p>
              </div>
            </div>

            <!-- Message de l'Utilisateur -->
            <div 
              v-else
              class="flex items-start space-x-2 max-w-[85%]"
            >
              <div class="bg-green-600 rounded-2xl px-3 py-2 shadow-md">
                <p class="text-white leading-relaxed whitespace-pre-wrap">{{ message.content }}</p>
                <p class="text-green-100 text-xs mt-2 text-right">{{ formatTime(message.created_at) }}</p>
              </div>
              <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Animation de Chargement -->
        <div v-if="isLoading" class="flex justify-start mt-4">
          <div class="flex items-start space-x-2 max-w-2xl">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <div class="bg-white rounded-2xl px-3 py-2 shadow-md border border-gray-100">
              <div class="flex space-x-2">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s;"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Zone de Saisie -->
      <div class="bg-white border-t border-gray-200 p-4 flex-shrink-0" ref="inputArea">
        <div class="max-w-4xl mx-auto">
          <div class="flex items-end space-x-2">
            <div class="flex-1">
              <textarea
                v-model="newMessage"
                @keydown.enter.prevent="handleEnterKey"
                placeholder="Tapez votre message ici..."
                rows="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-800 placeholder-gray-500"
                :disabled="isLoading"
                ref="messageInput"
                @input="adjustTextareaHeight"
              ></textarea>
            </div>
            <button
              @click="sendMessage"
              :disabled="!newMessage.trim() || isLoading"
              class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
            >
              <span v-if="!isLoading">Envoyer</span>
              <span v-else>Envoi...</span>
              <svg v-if="!isLoading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useChatStore } from '~/stores/chat'

// Configuration
const API_BASE = 'https://wilfriedtayou.pythonanywhere.com/chatbot'

// État réactif
const conversations = ref([])
const currentConversationId = ref(null)
const messages = ref([])
const newMessage = ref('')
const isLoading = ref(false)
const showMobileMenu = ref(false)
const messagesContainer = ref(null)
const messageInput = ref(null)
const inputArea = ref(null)
const inputHeight = ref(160)
const showScrollButton = ref(false)

const chatStore = useChatStore()

// Charger les conversations au démarrage
onMounted(async () => {
  await loadConversations()
  calculateInputHeight()
  window.addEventListener('resize', calculateInputHeight)

  // Si nous avons des données dans le store, les utiliser
  if (chatStore.currentConversationId) {
    currentConversationId.value = chatStore.currentConversationId
    if (chatStore.initialMessage) {
      // Ajouter le message initial à l'affichage uniquement
      messages.value.push({
        id: Date.now().toString(),
        sender: 'user',
        content: chatStore.initialMessage,
        created_at: new Date().toISOString()
      })
      // Afficher l'indicateur de chargement
      isLoading.value = true
      scrollToBottom()
      
      // Attendre la réponse de l'assistant
      try {
        const response = await $fetch(`${API_BASE}/chat/${currentConversationId.value}/`, {
          credentials: 'include'
        })
        
        if (Array.isArray(response.messages)) {
          messages.value = response.messages
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la réponse:', error)
      } finally {
        isLoading.value = false
        scrollToBottom()
      }
    }
    // Nettoyer le store
    chatStore.clearConversationData()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateInputHeight)
})

// Gérer le scroll pour afficher/masquer le bouton
const handleScroll = () => {
  if (messagesContainer.value) {
    const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value
    showScrollButton.value = scrollTop < scrollHeight - clientHeight - 100
  }
}

// Calculer la hauteur de la zone de saisie pour le responsive
const calculateInputHeight = () => {
  nextTick(() => {
    if (inputArea.value) {
      inputHeight.value = inputArea.value.offsetHeight + 80 // +80 pour l'en-tête
    }
  })
}

// Ajuster la hauteur du textarea automatiquement
const adjustTextareaHeight = () => {
  nextTick(() => {
    if (messageInput.value) {
      messageInput.value.style.height = 'auto'
      messageInput.value.style.height = Math.min(messageInput.value.scrollHeight, 120) + 'px'
      calculateInputHeight()
    }
  })
}

// Fonctions utilitaires
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'À l\'instant'
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Maintenant'
  }
}

const formatTime = (dateString) => {
  try {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return ''
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      showScrollButton.value = false
    }
  })
}

const getCurrentConversationTitle = () => {
  const current = conversations.value.find(c => c.id === currentConversationId.value)
  return current ? current.title : 'Conversation'
}

// Gestion du textarea
const handleEnterKey = (event) => {
  if (event.shiftKey) {
    // Shift + Enter = nouvelle ligne
    return;
  }
  
  // Empêcher le comportement par défaut
  event.preventDefault();
  
  // Envoyer le message
  sendMessage(newMessage.value.trim(), event);
}

// Fonctions API
const loadConversations = async () => {
  try {
    const response = await $fetch(`${API_BASE}/chat/`, {
      credentials: 'include'
    })
    // Gérer différents formats de réponse de l'API
    if (Array.isArray(response)) {
      conversations.value = response
    } else if (response && Array.isArray(response.data)) {
      conversations.value = response.data
    } else if (response && response.conversations) {
      conversations.value = Array.isArray(response.conversations) ? response.conversations : []
    } else {
      conversations.value = []
    }
    console.log('Conversations chargées:', conversations.value)
  } catch (error) {
    console.error('Erreur chargement conversations:', error)
    conversations.value = []
  }
}

const loadConversation = async (id) => {
  try {
    const data = await $fetch(`${API_BASE}/chat/${id}/`, {
      credentials: 'include'
    })
    messages.value = Array.isArray(data.messages) ? data.messages : []
    scrollToBottom()
  } catch (error) {
    console.error('Erreur chargement conversation:', error)
    messages.value = []
    alert('Erreur lors du chargement de la conversation')
  }
}

const startNewChat = () => {
  currentConversationId.value = null
  messages.value = []
  newMessage.value = ''
  if (messageInput.value) {
    messageInput.value.style.height = 'auto'
    calculateInputHeight()
  }
}

const selectConversation = async (id) => {
  if (currentConversationId.value === id) return
  currentConversationId.value = id
  await loadConversation(id)
}

const sendMessage = async (messageText = newMessage.value.trim(), event = null) => {
  // Empêcher le comportement par défaut si c'est un événement
  if (event && event.preventDefault) {
    event.preventDefault();
  }

  if (!messageText || isLoading.value) return;

  // Afficher immédiatement le message utilisateur
  const userMessage = {
    sender: 'user',
    content: messageText,
    created_at: new Date().toISOString()
  }
  messages.value.push(userMessage)
  scrollToBottom()

  isLoading.value = true
  newMessage.value = ''
  
  // Réinitialiser la hauteur du textarea
  if (messageInput.value) {
    messageInput.value.style.height = 'auto'
    calculateInputHeight()
  }

  try {
    let response;

    if (currentConversationId.value) {
      // Ajouter à conversation existante
      response = await $fetch(`${API_BASE}/chat/${currentConversationId.value}/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ message: messageText }),
        credentials: 'include'
      });

      // Recharger la conversation pour avoir tous les messages
      const updatedConv = await $fetch(`${API_BASE}/chat/${currentConversationId.value}/`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      messages.value = Array.isArray(updatedConv.messages) ? updatedConv.messages : [];
    } else {
      // Créer nouvelle conversation
      response = await $fetch(`${API_BASE}/chat/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          message: messageText,
          situation_type: chatStore.situationType,
          first_name: chatStore.firstName
        }),
        credentials: 'include'
      });
      
      // Définir l'ID de la conversation courante
      if (response.id) {
        currentConversationId.value = response.id;
      } else if (response.conversation_id) {
        currentConversationId.value = response.conversation_id;
      }

      // Mettre à jour les messages
      if (Array.isArray(response.messages)) {
        messages.value = response.messages;
      }

      // Recharger TOUTES les conversations pour mettre à jour la sidebar
      await loadConversations();
    }

    scrollToBottom();

  } catch (error) {
    console.error('Erreur envoi message:', error);

    // Retirer le message utilisateur en cas d'erreur
    messages.value.pop();

    let errorMessage = 'Erreur lors de l\'envoi du message.';
    
    // Gestion plus détaillée des erreurs
    if (error.data?.detail) {
      errorMessage = error.data.detail;
    } else if (error.status === 500) {
      errorMessage = 'Erreur interne du chatbot. Veuillez réessayer dans quelques instants.';
    } else if (error.status === 401) {
      errorMessage = 'Session expirée. Veuillez vous reconnecter.';
    } else if (error.status === 403) {
      errorMessage = 'Accès refusé. Veuillez vérifier vos permissions.';
    } else if (error.status === 404) {
      errorMessage = 'Service non trouvé. Veuillez réessayer.';
    } else if (error.status === 0) {
      errorMessage = 'Erreur de connexion. Veuillez vérifier votre connexion internet.';
    }

    // Afficher l'erreur dans l'interface plutôt qu'une alerte
    messages.value.push({
      sender: 'assistant',
      content: `⚠️ ${errorMessage}`,
      created_at: new Date().toISOString()
    });

    newMessage.value = messageText; // Restaurer le message
  } finally {
    isLoading.value = false;

    // Remettre le focus sur l'input
    nextTick(() => {
      if (messageInput.value) {
        messageInput.value.focus();
      }
    });
  }
}
</script>

<style scoped>
/* Animations */
@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.animate-bounce {
  animation: bounce 1.4s infinite ease-in-out;
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Ajout du scroll pour la sidebar */
.sidebar {
  overflow-y: auto;
  max-height: 100vh;
}

/* Ajustements pour mobile */
@media (max-width: 768px) {
  .max-w-85 {
    max-width: 85%;
  }
  
  /* Ajuster la hauteur de la zone de messages pour éviter le chevauchement avec le clavier */
  .messages-container {
    height: calc(100vh - 180px);
  }
  
  /* Ajuster la zone de saisie pour mobile */
  .input-area {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    padding: 1rem;
    border-top: 1px solid #e5e7eb;
  }
}

/* Empêcher le zoom sur les inputs sur mobile */
@media screen and (max-width: 768px) {
  input, textarea {
    font-size: 16px !important;
  }
}
</style>