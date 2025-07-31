<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row transition-colors duration-300">
    <!-- Sidebar Desktop -->
    <div class="hidden md:flex md:w-80 bg-white dark:bg-gray-800 shadow-xl flex-col sidebar">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <svg class="w-7 h-7 mr-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          Soutien Moral
        </h1>
      </div>
      
      <div class="flex-1 overflow-y-auto p-6">
        <button 
          @click="startNewChat" 
          class="w-full mb-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Nouvelle Conversation
        </button>
        
        <div class="space-y-4">
          <div v-if="isLoadingConversations" class="space-y-3">
            <div v-for="n in 3" :key="n" class="animate-pulse">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
          <div v-else-if="conversations && conversations.length === 0" class="text-center py-6">
            <p class="text-sm text-gray-500 dark:text-gray-400">Aucune conversation</p>
          </div>
          <div 
            v-for="conv in sortedConversations" 
            :key="conv.id"
            @click="selectConversation(conv.id)"
            :class="[
              'p-4 rounded-xl cursor-pointer transition-all duration-300 border-l-4 hover:shadow-lg flex items-center justify-between group',
              { 'fade-out': conv.id === removedConversationId },
              currentConversationId === conv.id ? 'bg-green-50 dark:bg-green-900/50 border-green-500 shadow-md' : 'bg-white dark:bg-gray-800 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300'
            ]"
          >
            <div class="flex-1 min-w-0 flex items-center gap-3">
              <h3 class="font-semibold text-gray-800 dark:text-gray-100 text-base truncate">{{ conv.title || 'Nouvelle conversation' }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ formatDate(conv.created_at) }}</p>
              <span v-if="conv.status === 'ephemere' && conv.expire_at" class="ml-2 px-2.5 py-1 text-xs rounded-full bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 font-semibold">
                {{ getRemainingTime(conv.expire_at) }}
              </span>
            </div>
            <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                @click.stop="() => { currentConversationId !== conv.id ? selectConversation(conv.id) : null; openEphemereModal(); }"
                class="text-yellow-500 dark:text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-300 p-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
                title="Rendre éphémère"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button 
                @click.stop="openDeleteModal(conv.id)"
                class="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 p-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                title="Supprimer"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 3h4a1 1 0 011 1v2H9V4a1 1 0 011-1z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Zone de Chat Principale -->
    <div class="flex-1 flex flex-col bg-white dark:bg-gray-800 h-screen">
      <!-- En-tête du Chat avec Menu Mobile -->
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3 md:py-4 shadow-sm flex-shrink-0">
        <div class="flex items-center justify-between">
          <button 
            @click="showMobileMenu = !showMobileMenu"
            class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 touch-manipulation"
          >
            <svg class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

          <button @click="$router.push('/')" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 mr-2 md:mr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation" title="Retour au site principal">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7m-9 2v6m0 0h4m-4 0a2 2 0 01-2-2v-4a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2z" />
            </svg>
          </button>
          <div class="flex-1 ml-2 md:ml-0 min-w-0">
            <h2 class="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2 truncate">
              {{ currentConversationId ? getCurrentConversationTitle() : 'Nouvelle Conversation' }}
              <span v-if="currentConversationId && conversations.find(c => c.id === currentConversationId && c.status === 'ephemere')" class="ml-2 px-2 py-1 text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full flex-shrink-0">éphémère</span>
            </h2>
            <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
              {{ currentConversationId ? `${messages.length} messages` : 'Commencez une nouvelle conversation' }}
            </p>
          </div>

          <div v-if="currentConversationId" class="flex items-center gap-2 md:gap-3">
            <button 
              @click="openDeleteModal(currentConversationId)"
              class="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 touch-manipulation"
              title="Supprimer la conversation"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 3h4a1 1 0 011 1v2H9V4a1 1 0 011-1z" />
              </svg>
            </button>
            <button 
              @click="openEphemereModal"
              class="bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 dark:hover:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-3 py-1.5 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-yellow-500 touch-manipulation"
              title="Rendre éphémère"
            >
              <span class="hidden md:inline">Rendre éphémère</span>
              <span class="md:hidden">Éphémère</span>
            </button>
            <button 
              @click="toggleDarkMode"
              class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 touch-manipulation"
              title="Basculer le mode sombre"
            >
              <svg v-if="isDarkMode" class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
            <div class="hidden md:flex items-center bg-green-100 dark:bg-green-900 px-4 py-1.5 rounded-full">
              <div class="w-2.5 h-2.5 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span class="text-sm font-medium text-green-700 dark:text-green-300">En ligne</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Menu Mobile -->
      <div 
        v-if="showMobileMenu" 
        class="md:hidden fixed inset-0 z-50 flex"
      >
        <div class="fixed inset-0 bg-black bg-opacity-60" @click="showMobileMenu = false"></div>
        <div class="relative w-80 bg-white dark:bg-gray-800 shadow-2xl max-w-[85vw] flex flex-col">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h1 class="text-lg font-bold text-gray-800 dark:text-gray-100">Soutien Moral</h1>
            <button @click="showMobileMenu = false" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500">
              <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="flex-1 overflow-y-auto p-6">
            <button 
              @click="() => { startNewChat(); showMobileMenu = false; }" 
              class="w-full mb-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Nouvelle Conversation
            </button>
          
            <div class="space-y-4">
              <div v-if="isLoadingConversations" class="space-y-3">
                <div v-for="n in 3" :key="n" class="animate-pulse">
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
              <div v-else-if="conversations && conversations.length === 0" class="text-center py-6">
                <p class="text-sm text-gray-500 dark:text-gray-400">Aucune conversation</p>
              </div>
              <div 
                v-for="conv in sortedConversations" 
                :key="conv.id"
                @click="() => { selectConversation(conv.id); showMobileMenu = false; }"
                class="p-4 rounded-xl cursor-pointer transition-all border-l-4"
                :class="{ 
                  'bg-green-50 dark:bg-green-900/50 border-green-500': currentConversationId === conv.id,
                  'bg-white dark:bg-gray-800 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700': currentConversationId !== conv.id 
                }"
              >
                <h3 class="font-semibold text-gray-800 dark:text-gray-100 text-base">{{ conv.title || 'Nouvelle conversation' }}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ formatDate(conv.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Zone des Messages -->
      <div 
        ref="messagesContainer"
        class="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900 messages-container"
        @scroll="handleScroll"
      >
        <!-- Message de Bienvenue -->
        <div v-if="messages && messages.length === 0" class="flex items-center justify-center h-full">
          <div class="text-center py-8 md:py-10 px-4">
            <div class="max-w-md mx-auto">
              <div class="w-16 h-16 md:w-20 md:h-20 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <svg class="w-8 h-8 md:w-10 md:h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <h3 class="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3 md:mb-4">Bonjour ! 👋</h3>
              <p class="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Je suis votre assistant de soutien moral. N'hésitez pas à partager ce qui vous préoccupe, 
                je suis là pour vous écouter et vous accompagner.
              </p>
              <div class="mt-6 md:mt-8">
                <button 
                  @click="messageInput?.focus()"
                  class="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 md:px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                >
                  Démarrer une conversation
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Messages -->
        <div v-else class="space-y-4 md:space-y-6">
          <div 
            v-for="(message, index) in messages" 
            :key="message.id || index"
            class="flex"
            :class="message.sender === 'user' ? 'justify-end' : 'justify-start'"
          >
            <!-- Message du Bot -->
            <div 
              v-if="message.sender === 'assistant'"
              class="flex items-start space-x-2 md:space-x-3 max-w-[85%] md:max-w-[80%]"
            >
              <div class="w-8 h-8 md:w-10 md:h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <div class="flex-1">
                <MarkdownMessage :markdown="message.content" @option-selected="handleOptionSelected" />
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1 md:mt-2">{{ formatTime(message.created_at) }}</p>
              </div>
            </div>

            <!-- Message de l'Utilisateur -->
            <div 
              v-else
              class="flex items-start space-x-2 md:space-x-3 max-w-[85%] md:max-w-[80%]"
            >
              <div class="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-2xl px-3 md:px-4 py-2 md:py-3 shadow-md">
                <p class="text-white leading-relaxed whitespace-pre-wrap text-sm md:text-base">{{ message.content }}</p>
                <p class="text-green-100 text-xs mt-1 md:mt-2 text-right">{{ formatTime(message.created_at) }}</p>
              </div>
              <div class="w-8 h-8 md:w-10 md:h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 md:w-5 md:h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Animation de Chargement -->
        <div v-if="isLoading" class="flex justify-start mt-4 md:mt-6">
          <div class="flex items-start space-x-2 md:space-x-3 max-w-2xl">
            <div class="w-8 h-8 md:w-10 md:h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-2xl px-3 md:px-4 py-2 md:py-3 shadow-md border border-gray-100 dark:border-gray-700">
              <div class="flex space-x-2">
                <div class="w-2 h-2 md:w-2.5 md:h-2.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 md:w-2.5 md:h-2.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.1s;"></div>
                <div class="w-2 h-2 md:w-2.5 md:h-2.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bouton Scroll to Bottom -->
        <button 
          v-if="showScrollButton" 
          @click="scrollToBottom" 
          class="fixed bottom-20 md:bottom-24 right-4 md:right-6 lg:right-8 p-3 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 touch-manipulation"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </button>
      </div>

      <!-- Zone de Saisie -->
      <div class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 md:p-6 flex-shrink-0" ref="inputArea">
        <div class="max-w-4xl mx-auto">
          <div class="flex items-end space-x-2 md:space-x-3">
            <div class="flex-1 relative">
              <textarea
                v-model="newMessage"
                @keydown.enter.prevent="handleEnterKey"
                @focus="handleMobileKeyboard"
                placeholder="Tapez votre message ici..."
                rows="1"
                class="w-full px-4 py-3 md:py-3 border border-gray-300 dark:border-gray-600 rounded-xl md:rounded-xl resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 text-base md:text-base"
                :disabled="isLoading || isRecording"
                ref="messageInput"
                @input="adjustTextareaHeight"
              ></textarea>
              <button
                v-if="isSpeechSupported"
                @click="toggleRecording"
                class="absolute right-2 bottom-2 p-2 md:p-2 rounded-full transition-all duration-200"
                :class="isRecording ? 'bg-red-500 hover:bg-red-600 scale-110' : 'bg-blue-500 hover:bg-blue-600 hover:scale-105'"
                title="Enregistrement vocal"
              >
                <svg class="w-5 h-5 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="!isRecording" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5 a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <button
              @click="sendMessage"
              :disabled="!newMessage.trim() || isLoading || isRecording"
              class="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-3 md:px-5 md:py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 min-w-[60px] md:min-w-[80px] justify-center"
            >
              <span v-if="!isLoading" class="hidden md:inline">Envoyer</span>
              <span v-else class="hidden md:inline">Envoi...</span>
              <svg v-if="!isLoading" class="w-5 h-5 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              <svg v-else class="w-5 h-5 md:w-5 md:h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </div>
          <p v-if="isRecording" class="text-sm text-red-500 dark:text-red-400 mt-2 animate-pulse text-center md:text-left">🎤 Enregistrement en cours...</p>
        </div>
      </div>
    </div>

    <!-- Modal Éphémère -->
    <div v-if="showEphemereModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm shadow-2xl animate-modal-pop">
        <div class="flex items-center mb-4">
          <svg class="w-8 h-8 text-yellow-400 dark:text-yellow-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Durée d'éphémérité</h3>
        </div>
        <div class="flex items-center gap-3 mb-6">
          <input 
            type="number" 
            v-model="ephemereDuration" 
            min="1" 
            class="w-20 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100" 
          />
          <select 
            v-model="ephemereUnit" 
            class="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
          >
            <option value="minutes">Minutes</option>
            <option value="heures">Heures</option>
            <option value="jours">Jours</option>
          </select>
        </div>
        <div class="flex gap-3 justify-end">
          <button 
            @click="closeEphemereModal" 
            class="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 transition focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Annuler
          </button>
          <button 
            @click="confirmEphemere" 
            class="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Valider
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm shadow-2xl animate-modal-pop">
        <div class="flex items-center mb-4">
          <svg class="w-8 h-8 text-red-500 dark:text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <h3 class="text-xl font-semibold text-red-600 dark:text-red-400">Supprimer la conversation ?</h3>
        </div>
        <p class="text-gray-600 dark:text-gray-300 mb-6">Cette action est irréversible. Voulez-vous vraiment supprimer cette conversation ?</p>
        <div class="flex gap-3 justify-end">
          <button 
            @click="closeDeleteModal" 
            class="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 transition focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Annuler
          </button>
          <button 
            @click="confirmDelete" 
            class="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div v-if="toastMessage" class="fixed bottom-4 right-4 z-50">
      <div class="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-toast-in">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>{{ toastMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useChatStore } from '~/stores/chat'
import MarkdownMessage from '~/components/chat/MarkdownMessage.vue'

definePageMeta({ layout: 'chat' })

// Configuration
const API_BASE = 'https://wilfriedtayou.pythonanywhere.com/'

// État réactif
const conversations = ref([])
const currentConversationId = ref(null)
const messages = ref([])
const newMessage = ref('')
const isLoading = ref(false)
const isLoadingConversations = ref(false)
const showMobileMenu = ref(false)
const messagesContainer = ref(null)
const messageInput = ref(null)
const inputArea = ref(null)
const showScrollButton = ref(false)
const showEphemereModal = ref(false)
const ephemereDuration = ref(60)
const ephemereUnit = ref('minutes')
const showDeleteModal = ref(false)
const conversationToDelete = ref(null)
const removedConversationId = ref(null)
const toastMessage = ref(null)
const isDarkMode = ref(false)
if (typeof window !== 'undefined') {
  isDarkMode.value = localStorage.getItem('theme') === 'dark'
}
const isSpeechSupported = ref(false)
if (typeof window !== 'undefined') {
  isSpeechSupported.value = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
}
const isRecording = ref(false)
const recognition = ref(null)

// Mapping des catégories attendues par le backend
const cat_map = {
  'juridique': 'assistance_juridique',
  'assistance juridique': 'assistance_juridique',
  'hébergement': 'hebergement',
  'hebergement': 'hebergement',
  'psychologique': 'sante_mentale',
  'santé mentale': 'sante_mentale',
  'sante mentale': 'sante_mentale',
  'santé': 'soins_medicaux',
  'sante': 'soins_medicaux',
  'médical': 'soins_medicaux',
  'medical': 'soins_medicaux',
  'soins médicaux': 'soins_medicaux',
  'soins medicaux': 'soins_medicaux',
  'police': 'police_securite',
  'sécurité': 'police_securite',
  'securite': 'police_securite',
  'appui psychosocial': 'appui_psychosocial',
  'réinsertion économique': 'reinsertion_economique',
  'reinsertion economique': 'reinsertion_economique'
}

const chatStore = useChatStore()

// Computed
const sortedConversations = computed(() => {
  const now = new Date()
  return [...conversations.value]
    .filter(conv => !conv.expire_at || new Date(conv.expire_at) > now)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

// Dark Mode
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
  }
  document.documentElement.classList.toggle('dark', isDarkMode.value)
}

// Speech Recognition
const setupSpeechRecognition = () => {
  if (isSpeechSupported.value) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognition.value = new SpeechRecognition()
    recognition.value.lang = 'fr-FR'
    recognition.value.interimResults = true
    recognition.value.continuous = false

    recognition.value.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('')
      newMessage.value = transcript
      adjustTextareaHeight()
    }

    recognition.value.onend = () => {
      if (isRecording.value) {
        recognition.value.start()
      }
    }

    recognition.value.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      showToast('Erreur lors de l\'enregistrement vocal.')
      isRecording.value = false
    }
  }
}

const toggleRecording = () => {
  if (!isSpeechSupported.value) return
  if (isRecording.value) {
    recognition.value.stop()
    isRecording.value = false
    if (newMessage.value.trim()) {
      sendMessage()
    }
  } else {
    recognition.value.start()
    isRecording.value = true
    newMessage.value = ''
    adjustTextareaHeight()
  }
}

// Mobile Keyboard Handling
const handleMobileKeyboard = () => {
  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    // Délai pour laisser le clavier se déployer
    setTimeout(() => {
      scrollToBottom()
    }, 300)
  }
}

// Lifecycle Hooks
onMounted(async () => {
  if (typeof window !== 'undefined') {
    isDarkMode.value = localStorage.getItem('theme') === 'dark'
    isSpeechSupported.value = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  }
  document.documentElement.classList.toggle('dark', isDarkMode.value)
  await loadConversations()
  calculateInputHeight()
  window.addEventListener('resize', calculateInputHeight)
  setupSpeechRecognition()

  // Focus automatique sur mobile
  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    nextTick(() => {
      messageInput.value?.focus()
    })
  }

  if (chatStore.currentConversationId) {
    currentConversationId.value = chatStore.currentConversationId
    if (chatStore.initialMessage) {
      messages.value.push({
        id: Date.now().toString(),
        sender: 'user',
        content: chatStore.initialMessage,
        created_at: new Date().toISOString()
      })
      isLoading.value = true
      scrollToBottom()
      try {
        const response = await $fetch(`${API_BASE}/chat/conversations/${currentConversationId.value}/`, {
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
    chatStore.clearConversationData()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateInputHeight)
  if (recognition.value) {
    recognition.value.stop()
  }
})

// Scroll Handling
const handleScroll = () => {
  if (messagesContainer.value) {
    const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value
    showScrollButton.value = scrollTop < scrollHeight - clientHeight - 100
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTo({
        top: messagesContainer.value.scrollHeight,
        behavior: 'smooth'
      })
      showScrollButton.value = false
    }
  })
}

const calculateInputHeight = () => {
  nextTick(() => {
    if (inputArea.value) {
      inputArea.value.style.height = 'auto'
      inputArea.value.style.height = inputArea.value.scrollHeight + 'px'
    }
  })
}

const adjustTextareaHeight = () => {
  nextTick(() => {
    if (messageInput.value) {
      messageInput.value.style.height = 'auto'
      const maxHeight = window.innerWidth <= 768 ? 100 : 120 // Hauteur maximale réduite sur mobile
      messageInput.value.style.height = Math.min(messageInput.value.scrollHeight, maxHeight) + 'px'
      calculateInputHeight()
    }
  })
}

// Utility Functions
const cleanInvalidMessages = (messagesArray) => {
  if (!Array.isArray(messagesArray)) return []
  return messagesArray.filter(msg => {
    // Vérifier que le message a une structure valide
    if (!msg || typeof msg !== 'object') {
      console.warn('Message invalide (pas un objet):', msg)
      return false
    }
    if (typeof msg.content !== 'string') {
      console.warn('Message invalide (content pas une string):', msg)
      return false
    }
    return true
  })
}

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

const getCurrentConversationTitle = () => {
  const current = conversations.value.find(c => c.id === currentConversationId.value)
  return current ? current.title : 'Conversation'
}

const getRemainingTime = (expireAt) => {
  const now = new Date()
  const expire = new Date(expireAt)
  let diff = Math.max(0, Math.floor((expire - now) / 1000))
  if (diff <= 0) return 'Expiré'
  const days = Math.floor(diff / 86400)
  diff %= 86400
  const hours = Math.floor(diff / 3600)
  diff %= 3600
  const minutes = Math.floor(diff / 60)
  if (days > 0) return `${days}j ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}min`
  return `${minutes} min`
}

// API Functions
const loadConversations = async () => {
  isLoadingConversations.value = true
  try {
    const response = await $fetch(`${API_BASE}/chat/conversations/`, {
      credentials: 'include'
    })
    conversations.value = Array.isArray(response) ? response :
                         Array.isArray(response.data) ? response.data :
                         Array.isArray(response.conversations) ? response.conversations : []
    conversations.value = cleanInvalidMessages(conversations.value)
  } catch (error) {
    console.error('Erreur chargement conversations:', error)
    conversations.value = []
    showToast('Erreur lors du chargement des conversations.')
  } finally {
    isLoadingConversations.value = false
  }
}

const loadConversation = async (id) => {
  isLoading.value = true
  try {
    const data = await $fetch(`${API_BASE}/chat/conversations/${id}/`, {
      credentials: 'include'
    })
    messages.value = cleanInvalidMessages(Array.isArray(data.messages) ? data.messages : [])
    if (messages.value.length > 1) {
      messages.value.splice(1, 1)
    }
    scrollToBottom()
  } catch (error) {
    console.error('Erreur chargement conversation:', error)
    messages.value = []
    showToast('Erreur lors du chargement de la conversation.')
  } finally {
    isLoading.value = false
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
  showToast('Nouvelle conversation démarrée.')
}

const selectConversation = async (id) => {
  if (currentConversationId.value === id) return
  currentConversationId.value = id
  await loadConversation(id)
}

const sendMessage = async (messageInput = null) => {
  // Extraction du message selon le type d'appareil
  let messageText = ''
  
  if (typeof messageInput === 'string') {
    messageText = messageInput.trim()
  } else if (messageInput && typeof messageInput === 'object') {
    // Sur mobile, l'événement peut avoir une structure différente
    if (messageInput.target && messageInput.target.value) {
      messageText = messageInput.target.value.trim()
    } else if (messageInput.detail && typeof messageInput.detail === 'string') {
      messageText = messageInput.detail.trim()
    } else {
      messageText = newMessage.value.trim()
    }
  } else {
    messageText = newMessage.value.trim()
  }
  
  // Validation basique du message
  if (!messageText || typeof messageText !== 'string' || isLoading.value || isRecording.value) {
    if (typeof messageText !== 'string') {
      console.error('Type de message invalide:', typeof messageText, messageText)
      showToast('Erreur: type de message invalide')
    }
    return
  }

  const userMessage = {
    sender: 'user',
    content: messageText,
    created_at: new Date().toISOString()
  }
  
  messages.value.push(userMessage)
  scrollToBottom()
  isLoading.value = true
  newMessage.value = ''
  
  if (messageInput.value) {
    messageInput.value.style.height = 'auto'
    calculateInputHeight()
  }

  try {
    let response
    if (currentConversationId.value) {
      response = await $fetch(`${API_BASE}/chat/conversations/${currentConversationId.value}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ message: messageText }),
        credentials: 'include'
      })
      const updatedConv = await $fetch(`${API_BASE}/chat/conversations/${currentConversationId.value}/`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      })
      messages.value = cleanInvalidMessages(Array.isArray(updatedConv.messages) ? updatedConv.messages : [])
    } else {
      response = await $fetch(`${API_BASE}/chat/conversations/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ 
          message: messageText,
          situation_type: chatStore.situationType,
          first_name: chatStore.firstName
        }),
        credentials: 'include'
      })
      const convId = response.id || response.conversation_id
      currentConversationId.value = convId
      await $fetch(`${API_BASE}/chat/conversations/${convId}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ message: messageText }),
        credentials: 'include'
      })
      await loadConversation(convId)
      await loadConversations()
      nextTick(() => {
        if (!conversations.value.find(c => c.id === currentConversationId.value) && conversations.value.length > 0) {
          currentConversationId.value = conversations.value[0].id
        } else {
          currentConversationId.value = convId
        }
      })
    }
    scrollToBottom()
    showToast('Message envoyé.')
  } catch (error) {
    console.error('Erreur envoi message:', error)
    messages.value.pop()
    let errorMessage = 'Erreur lors de l\'envoi du message.'
    if (error.data?.detail) errorMessage = error.data.detail
    else if (error.status === 500) errorMessage = 'Erreur interne du chatbot.'
    else if (error.status === 401) errorMessage = 'Session expirée.'
    else if (error.status === 403) errorMessage = 'Accès refusé.'
    else if (error.status === 404) errorMessage = 'Service non trouvé.'
    else if (error.status === 0) errorMessage = 'Erreur de connexion.'
    
    messages.value.push({
      sender: 'assistant',
      content: `⚠️ ${errorMessage}`,
      created_at: new Date().toISOString()
    })
    
    newMessage.value = messageText
    showToast(errorMessage)
  } finally {
    isLoading.value = false
    nextTick(() => messageInput.value?.focus())
  }
}

const deleteConversation = async (id) => {
  if (!id || id === 'null' || id === null) return
  try {
    await $fetch(`${API_BASE}/chat/conversations/${id}/`, {
      method: 'DELETE',
      credentials: 'include'
    })
    if (currentConversationId.value === id) {
      currentConversationId.value = null
      messages.value = []
    }
    await loadConversations()
    showToast('Conversation supprimée.')
  } catch (error) {
    showToast('Erreur lors de la suppression.')
  }
}

const makeEphemere = async (id, expire_in) => {
  try {
    await $fetch(`${API_BASE}/chat/conversations/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ephemere', expire_in }),
      credentials: 'include'
    })
    await loadConversation(id)
    await loadConversations()
    showToast('Conversation rendue éphémère.')
  } catch (error) {
    showToast('Erreur lors du passage en éphémère.')
  }
}

const openEphemereModal = () => {
  ephemereDuration.value = 60
  ephemereUnit.value = 'minutes'
  showEphemereModal.value = true
}

const closeEphemereModal = () => {
  showEphemereModal.value = false
}

const confirmEphemere = async () => {
  let expire_in = ephemereDuration.value
  if (ephemereUnit.value === 'heures') expire_in *= 60
  if (ephemereUnit.value === 'jours') expire_in *= 60 * 24
  removedConversationId.value = currentConversationId.value
  await new Promise(resolve => setTimeout(resolve, 350))
  await makeEphemere(currentConversationId.value, expire_in)
  closeEphemereModal()
  removedConversationId.value = null
}

const openDeleteModal = (id) => {
  conversationToDelete.value = id
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  conversationToDelete.value = null
}

const confirmDelete = async () => {
  if (!conversationToDelete.value) return
  const id = conversationToDelete.value
  if (!id || id === 'null' || id === null) return
  removedConversationId.value = id
  closeDeleteModal()
  await new Promise(resolve => setTimeout(resolve, 350))
  await deleteConversation(id)
  removedConversationId.value = null
}

const showToast = (message) => {
  toastMessage.value = message
  setTimeout(() => {
    toastMessage.value = null
  }, 3000)
}

const handleEnterKey = (event) => {
  if (event.shiftKey) return
  event.preventDefault()
  // S'assurer qu'on n'envoie que le contenu du message, pas l'événement
  sendMessage()
}

async function handleOptionSelected(value) {
  // Validation basique de la valeur
  if (!value || typeof value !== 'string') {
    console.error('Valeur d\'option invalide:', typeof value, value)
    showToast('Erreur: option invalide')
    return
  }
  
  let messageText = value
  const regions = ['Adamaoua', 'Ouest']
  const categories = Object.keys(cat_map)
  
  if (regions.includes(value)) {
    messageText = `Je suis dans la région de : ${value}`
  } else if (categories.includes(value)) {
    // Utilise la valeur attendue par le backend
    const backendCat = cat_map[value]
    messageText = `Je souhaite signaler une situation de : ${backendCat}`
  }

  // Utiliser la fonction sendMessage existante avec la chaîne de caractères
  await sendMessage(messageText)
}
</script>

<style scoped>
/* Animations */
@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.animate-bounce {
  animation: bounce 1.4s infinite ease-in-out;
}

@keyframes modal-pop {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.animate-modal-pop {
  animation: modal-pop 0.2s cubic-bezier(0.4,0,0.2,1);
}

@keyframes toast-in {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

.animate-toast-in {
  animation: toast-in 0.3s ease-out forwards;
}

@keyframes fadeOutScale {
  to {
    opacity: 0;
    transform: scale(0.9);
    height: 0;
    margin: 0;
    padding: 0;
  }
}

.fade-out {
  animation: fadeOutScale 0.35s forwards;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}
.dark ::-webkit-scrollbar-track {
  background: #1f2937;
}

::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Sidebar */
.sidebar {
  overflow-y: auto;
  max-height: 100vh;
}

/* Mobile Adjustments */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    z-index: 40;
    width: 100vw;
    max-width: 100vw;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .messages-container {
    height: calc(100vh - 180px);
    max-height: calc(100vh - 180px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .input-area {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    padding: 1rem;
    border-top: 1px solid #e5e7eb;
    z-index: 30;
  }
  .dark .input-area {
    background: #1f2937;
    border-top: 1px solid #374151;
  }

  input, textarea {
    font-size: 16px !important;
    -webkit-appearance: none;
    border-radius: 12px;
  }

  /* Amélioration des boutons tactiles */
  button {
    min-height: 44px;
    touch-action: manipulation;
  }

  /* Optimisation du scroll */
  .messages-container::-webkit-scrollbar {
    width: 4px;
  }

  .messages-container::-webkit-scrollbar-track {
    background: transparent;
  }

  .messages-container::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.5);
    border-radius: 2px;
  }

  /* Amélioration de l'espacement des messages */
  .space-y-4 > * + * {
    margin-top: 1rem;
  }

  /* Optimisation des modales */
  .animate-modal-pop {
    animation: modal-pop 0.15s cubic-bezier(0.4,0,0.2,1);
  }
}

/* Améliorations tactiles générales */
.touch-manipulation {
  touch-action: manipulation;
}

/* Optimisation des transitions sur mobile */
@media (max-width: 768px) {
  * {
    transition-duration: 0.15s !important;
  }
  
  .transition-all {
    transition-duration: 0.15s !important;
  }
}

/* Dark Mode */
.dark {
  color-scheme: dark;
}
</style>