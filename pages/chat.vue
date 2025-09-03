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
      <!-- En-tête du Chat avec Menu Mobile - FIXE sur mobile -->
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3 md:py-4 shadow-sm flex-shrink-0 mobile-header">
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

          <div class="flex items-center gap-2 md:gap-3">
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
            <!-- Settings Menu Trigger -->
            <div class="relative">
              <button
                @click="showSettingsMenu = !showSettingsMenu"
                class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                title="Paramètres"
              >
                <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0a1.724 1.724 0 002.573.98c.826-.48 1.86.254 1.55 1.15a1.724 1.724 0 001.11 2.2c.9.3.9 1.58 0 1.88a1.724 1.724 0 00-1.11 2.2c.31.896-.724 1.63-1.55 1.151a1.724 1.724 0 00-2.573.98c-.299.921-1.603.921-1.902 0a1.724 1.724 0 00-2.573-.98c-.826.479-1.86-.255-1.55-1.151a1.724 1.724 0 00-1.11-2.2c-.9-.3-.9-1.58 0-1.88a1.724 1.724 0 001.11-2.2c-.31-.896.724-1.63 1.55-1.15.98.57 2.214.03 2.573-.98zM12 8v4m0 4h.01"/>
                </svg>
              </button>
              <!-- Settings Dropdown -->
              <div v-if="showSettingsMenu" class="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 p-4">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100">Paramètres</h3>
                  <button @click="showSettingsMenu = false" class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
                <div class="space-y-4">
                  <div class="grid grid-cols-1 gap-3">
                    <label class="text-xs text-gray-500 dark:text-gray-400">Lecture automatique des réponses</label>
                    <button @click="toggleAutoRead" class="px-3 py-2 rounded-lg text-sm" :class="autoReadResponses ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'">{{ autoReadResponses ? 'Activée' : 'Désactivée' }}</button>
                  </div>
                  <div class="grid grid-cols-1 gap-3">
                    <label class="text-xs text-gray-500 dark:text-gray-400">Auto-envoi après dictée</label>
                    <button @click="autoSendOnFinal = !autoSendOnFinal; persistVoiceSettings()" class="px-3 py-2 rounded-lg text-sm" :class="autoSendOnFinal ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'">{{ autoSendOnFinal ? 'Activé' : 'Désactivé' }}</button>
                  </div>
                  <div v-if="isTtsSupported" class="grid grid-cols-1 gap-2">
                    <label class="text-xs text-gray-500 dark:text-gray-400">Voix</label>
                    <select v-model="selectedVoiceName" @change="persistVoiceSettings(); if (isReading) stopSpeaking()" class="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-gray-100">
                      <option v-for="v in filteredVoices" :key="v.name + v.lang" :value="v.name">{{ v.name }} ({{ v.lang }})</option>
                    </select>
                  </div>
                  <div v-if="isTtsSupported" class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="text-xs text-gray-500 dark:text-gray-400">Genre</label>
                      <select v-model="ttsGender" @change="persistVoiceSettings()" class="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-gray-100">
                        <option value="auto">Auto</option>
                        <option value="female">Féminine</option>
                        <option value="male">Masculine</option>
                      </select>
                    </div>
                    <div>
                      <label class="text-xs text-gray-500 dark:text-gray-400">Vitesse</label>
                      <input type="range" min="0.7" max="1.3" step="0.05" v-model.number="ttsRate" @change="persistVoiceSettings()" class="w-full" />
                      <div class="text-[10px] text-gray-500 dark:text-gray-400">{{ ttsRate.toFixed(2) }}</div>
                    </div>
                    <div>
                      <label class="text-xs text-gray-500 dark:text-gray-400">Tonalité</label>
                      <input type="range" min="0.8" max="1.2" step="0.05" v-model.number="ttsPitch" @change="persistVoiceSettings()" class="w-full" />
                      <div class="text-[10px] text-gray-500 dark:text-gray-400">{{ ttsPitch.toFixed(2) }}</div>
                    </div>
                  </div>
                  <div v-if="isTtsSupported" class="flex items-center gap-2">
                    <button @click="speakText('Bonjour, ceci est un test de voix.')" class="px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm">Tester</button>
                    <button v-if="isReading" @click="stopSpeaking" class="px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-sm">Arrêter</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="hidden md:flex items-center bg-green-100 dark:bg-green-900 px-4 py-1.5 rounded-full">
              <div class="w-2.5 h-2.5 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span class="text-sm font-medium text-green-700 dark:text-green-300">En ligne</span>
            </div>
            <!-- Stop speaking button shown while TTS is active -->
            <button
              v-if="isTtsSupported && isReading"
              @click="stopSpeaking"
              class="p-2 rounded-full bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              title="Arrêter la lecture"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 6h12v12H6z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Menu Mobile Amélioré avec Actions Directes -->
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
                class="p-4 rounded-xl transition-all border-l-4"
                :class="{ 
                  'bg-green-50 dark:bg-green-900/50 border-green-500': currentConversationId === conv.id,
                  'bg-white dark:bg-gray-800 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700': currentConversationId !== conv.id 
                }"
              >
                <!-- Zone cliquable pour sélectionner la conversation -->
                <div 
                  @click="() => { selectConversation(conv.id); showMobileMenu = false; }"
                  class="cursor-pointer mb-3"
                >
                  <h3 class="font-semibold text-gray-800 dark:text-gray-100 text-base">{{ conv.title || 'Nouvelle conversation' }}</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ formatDate(conv.created_at) }}</p>
                  <span v-if="conv.status === 'ephemere' && conv.expire_at" class="inline-block mt-2 px-2.5 py-1 text-xs rounded-full bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 font-semibold">
                    {{ getRemainingTime(conv.expire_at) }}
                  </span>
                </div>
                
                <!-- Actions directes toujours visibles sur mobile -->
                <div class="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <button 
                    @click="() => { currentConversationId !== conv.id ? selectConversation(conv.id) : null; openEphemereModal(); showMobileMenu = false; }"
                    class="flex-1 bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 dark:hover:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-3 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Éphémère
                  </button>
                  <button 
                    @click="() => { openDeleteModal(conv.id); showMobileMenu = false; }"
                    class="flex-1 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-800 dark:text-red-200 px-3 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 3h4a1 1 0 011 1v2H9V4a1 1 0 011-1z" />
                    </svg>
                    Supprimer
                  </button>
                </div>
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
              <div class="w-8 h-8 md:w-10 md:h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0 self-start">
                <svg class="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <div class="flex-1">
                <MarkdownMessage :markdown="message.content" @option-selected="handleOptionSelected" />
                <div class="flex items-center gap-1 mt-1 md:mt-2 whitespace-nowrap">
                  <button 
                    v-if="isTtsSupported"
                    @click="speakMessage(message.content)"
                    class="inline-flex items-center justify-center w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Lire ce message"
                  >
                    <svg class="w-3 h-3 align-middle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5l7 7-7 7V5z" />
                    </svg>
                  </button>
                  <span class="text-xs text-gray-400 dark:text-gray-500 leading-none align-middle">{{ formatTime(message.created_at) }}</span>
                </div>
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
      <div class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 md:p-6 flex-shrink-0 input-area" ref="inputArea">
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
              <div v-if="isSpeechSupported" class="absolute right-2 bottom-2 flex flex-col gap-1">
                <button
                  @click="toggleRecording"
                  class="p-2 md:p-2 rounded-full transition-all duration-200"
                  :class="isRecording ? 'bg-red-500 hover:bg-red-600 scale-110 animate-pulse' : 'bg-blue-500 hover:bg-blue-600 hover:scale-105'"
                  :title="isRecording ? 'Arrêter l\'enregistrement' : 'Commencer l\'enregistrement vocal'"
                >
                  <svg class="w-5 h-5 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="!isRecording" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5 a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <button
                  @click="autoSendOnFinal = !autoSendOnFinal"
                  class="p-1 rounded-full transition-all duration-200 text-xs"
                  :class="autoSendOnFinal ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'"
                  :title="autoSendOnFinal ? 'Envoi automatique activé' : 'Envoi automatique désactivé'"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
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
          <div v-if="isRecording" class="mt-2 flex items-center gap-2 text-sm text-red-500 dark:text-red-400 animate-pulse">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-red-500 rounded-full animate-bounce" style="animation-delay: 0.1s;"></div>
              <div class="w-2 h-2 bg-red-500 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
            </div>
            <span>🎤 Enregistrement en cours... Parlez maintenant</span>
          </div>
          <div v-if="autoSendOnFinal && isRecording" class="mt-1 text-xs text-green-600 dark:text-green-400 text-center md:text-left">
            ✓ Envoi automatique activé
          </div>
          <!-- TTS quick controls removed in favor of header settings menu -->
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
        
        <div class="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p class="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Durée minimale : 1 jour</strong><br>
            La conversation sera automatiquement supprimée après cette période.
          </p>
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
            <option value="jours">Jours</option>
            <option value="heures">Heures</option>
            <option value="minutes">Minutes</option>
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
//const API_BASE = 'http://localhost:8001/'

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
const autoSendOnFinal = ref(true)
// Text-to-Speech (TTS)
const isTtsSupported = ref(false)
const autoReadResponses = ref(true)
const isReading = ref(false)
const currentUtterance = ref(null)
const ttsVoices = ref([])
const showSettingsMenu = ref(false)
const selectedVoiceName = ref('')
const ttsGender = ref('auto') // 'auto' | 'female' | 'male'
const ttsRate = ref(1)
const ttsPitch = ref(1)

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

// -------- Text-to-Speech (TTS) --------
const setupSpeechSynthesis = () => {
  if (typeof window === 'undefined') return
  isTtsSupported.value = 'speechSynthesis' in window
  if (!isTtsSupported.value) return
  const synth = window.speechSynthesis

  const loadVoices = () => {
    ttsVoices.value = synth.getVoices()
  }
  loadVoices()
  if (typeof synth.onvoiceschanged !== 'undefined') {
    synth.onvoiceschanged = loadVoices
  }
}

const filteredVoices = computed(() => {
  if (!ttsVoices.value) return []
  let voices = ttsVoices.value
  // Filtrer par langue FR en priorité pour l'UX
  const french = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('fr'))
  voices = french.length ? french : voices
  // Filtrer par genre si possible (certains navigateurs n'exposent pas le genre)
  if (ttsGender.value !== 'auto') {
    voices = voices.filter(v => {
      const name = (v.name || '').toLowerCase()
      if (ttsGender.value === 'female') {
        return name.includes('fem') || name.includes('woman') || name.includes('female') || name.includes('amy') || name.includes('julie')
      }
      return name.includes('masc') || name.includes('man') || name.includes('male') || name.includes('paul') || name.includes('thomas')
    })
  }
  return voices
})

const getSelectedVoice = () => {
  if (!filteredVoices.value || filteredVoices.value.length === 0) return null
  if (selectedVoiceName.value) {
    const found = ttsVoices.value.find(v => v.name === selectedVoiceName.value)
    if (found) return found
  }
  return filteredVoices.value[0]
}

const speakText = (text) => {
  if (!isTtsSupported.value || !text) return
  try {
    // Arrêter l'audio en cours
    stopSpeaking()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'fr-FR'
    const voice = getSelectedVoice()
    if (voice) utterance.voice = voice
    utterance.rate = ttsRate.value || 1
    utterance.pitch = ttsPitch.value || 1
    utterance.onstart = () => { isReading.value = true }
    utterance.onend = () => { isReading.value = false; currentUtterance.value = null }
    utterance.onerror = () => { isReading.value = false; currentUtterance.value = null }
    currentUtterance.value = utterance
    window.speechSynthesis.speak(utterance)
  } catch (e) {
    console.error('TTS error:', e)
  }
}

const stopSpeaking = () => {
  try {
    if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
    }
  } catch {}
  isReading.value = false
  currentUtterance.value = null
}

const toggleAutoRead = () => {
  autoReadResponses.value = !autoReadResponses.value
  persistVoiceSettings()
}

const speakMessage = (content) => {
  if (!content) return
  if (isReading.value) {
    stopSpeaking()
  }
  speakText(content)
}

// ---------- Persistence ----------
const VOICE_SETTINGS_KEY = 'chat_tts_settings'
const persistVoiceSettings = () => {
  try {
    if (typeof window === 'undefined') return
    const payload = {
      autoReadResponses: autoReadResponses.value,
      autoSendOnFinal: autoSendOnFinal.value,
      selectedVoiceName: selectedVoiceName.value,
      ttsGender: ttsGender.value,
      ttsRate: ttsRate.value,
      ttsPitch: ttsPitch.value
    }
    localStorage.setItem(VOICE_SETTINGS_KEY, JSON.stringify(payload))
  } catch {}
}

const loadVoiceSettings = () => {
  try {
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem(VOICE_SETTINGS_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (typeof parsed.autoReadResponses === 'boolean') autoReadResponses.value = parsed.autoReadResponses
    if (typeof parsed.autoSendOnFinal === 'boolean') autoSendOnFinal.value = parsed.autoSendOnFinal
    if (typeof parsed.selectedVoiceName === 'string') selectedVoiceName.value = parsed.selectedVoiceName
    if (typeof parsed.ttsGender === 'string') ttsGender.value = parsed.ttsGender
    if (typeof parsed.ttsRate === 'number') ttsRate.value = parsed.ttsRate
    if (typeof parsed.ttsPitch === 'number') ttsPitch.value = parsed.ttsPitch
  } catch {}
}

// Demander les permissions du microphone
const requestMicrophonePermission = async () => {
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      console.log('✅ Permission microphone accordée')
      return true
    }
    return false
  } catch (error) {
    console.error('❌ Permission microphone refusée:', error)
    showToast('Permission microphone requise pour la reconnaissance vocale.')
    return false
  }
}

// Speech Recognition
const setupSpeechRecognition = () => {
  if (isSpeechSupported.value) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognition.value = new SpeechRecognition()
    recognition.value.lang = 'fr-FR'
    recognition.value.interimResults = true
    recognition.value.continuous = false
    recognition.value.maxAlternatives = 1

    recognition.value.onstart = () => {
      console.log('🎤 Reconnaissance vocale démarrée')
      isRecording.value = true
      showToast('🎤 Écoute en cours...')
    }

    recognition.value.onresult = (event) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      // Afficher le texte en temps réel
      newMessage.value = finalTranscript + interimTranscript
      adjustTextareaHeight()

      // Envoi automatique quand la phrase est finalisée
      if (finalTranscript.trim() && autoSendOnFinal.value) {
        console.log('📝 Phrase finalisée:', finalTranscript)
        // Petite pause pour laisser le texte final s'afficher
        setTimeout(() => {
          if (newMessage.value.trim()) {
            console.log('📤 Envoi automatique du message vocal')
            sendMessage()
          }
        }, 500)
      }
    }

    recognition.value.onend = () => {
      console.log('🎤 Reconnaissance vocale terminée')
      isRecording.value = false
      if (newMessage.value.trim() && !autoSendOnFinal.value) {
        showToast('Message vocal prêt. Cliquez sur Envoyer.')
      }
    }

    recognition.value.onerror = (event) => {
      console.error('❌ Erreur reconnaissance vocale:', event.error)
      isRecording.value = false
      
      let errorMessage = 'Erreur lors de l\'enregistrement vocal.'
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'Aucune parole détectée. Réessayez.'
          break
        case 'audio-capture':
          errorMessage = 'Microphone non accessible. Vérifiez les permissions.'
          break
        case 'not-allowed':
          errorMessage = 'Permission microphone refusée.'
          break
        case 'network':
          errorMessage = 'Erreur réseau. Vérifiez votre connexion.'
          break
        case 'language-not-supported':
          errorMessage = 'Langue française non supportée.'
          break
      }
      showToast(errorMessage)
    }

    recognition.value.onnomatch = () => {
      console.log('🎤 Aucune correspondance trouvée')
      showToast('Parole non reconnue. Réessayez.')
    }
  }
}

const toggleRecording = async () => {
  if (!isSpeechSupported.value) {
    showToast('Reconnaissance vocale non supportée sur ce navigateur.')
    return
  }
  
  if (isRecording.value) {
    console.log('🛑 Arrêt de l\'enregistrement')
    recognition.value.stop()
    isRecording.value = false
    if (newMessage.value.trim() && !autoSendOnFinal.value) {
      showToast('Message vocal prêt. Cliquez sur Envoyer.')
    }
  } else {
    console.log('🎤 Démarrage de l\'enregistrement')
    
    // Demander les permissions du microphone
    const hasPermission = await requestMicrophonePermission()
    if (!hasPermission) {
      return
    }
    
    try {
      newMessage.value = ''
      adjustTextareaHeight()
      recognition.value.start()
    } catch (error) {
      console.error('Erreur démarrage reconnaissance:', error)
      showToast('Erreur lors du démarrage de l\'enregistrement.')
      isRecording.value = false
    }
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
  setupSpeechSynthesis()
  loadVoiceSettings()

  // Raccourci clavier: Ctrl+Espace pour (dé)marquer l'enregistrement
  keyHandler = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.code === 'Space') {
      e.preventDefault()
      toggleRecording()
    }
    if (e.code === 'Escape' && isReading.value) {
      e.preventDefault()
      stopSpeaking()
    }
  }
  window.addEventListener('keydown', keyHandler)

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

// Variable pour stocker la référence du gestionnaire de clavier
let keyHandler = null

onUnmounted(() => {
  window.removeEventListener('resize', calculateInputHeight)
  // Retirer le raccourci clavier
  if (keyHandler) {
    window.removeEventListener('keydown', keyHandler)
  }
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
  // Protection contre les appels multiples
  if (isLoading.value) {
    console.log('Envoi déjà en cours, ignoré')
    return
  }
  
  // Extraction du message selon le type d'appareil
  let messageText = ''
  
  if (typeof messageInput === 'string') {
    // Cas des options (mobile et PC)
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
    // Sur ordinateur (messageInput est null) ou fallback mobile
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
  
  // Timeout de sécurité pour éviter les blocages
  const safetyTimeout = setTimeout(() => {
    if (isLoading.value) {
      console.warn('Timeout de sécurité: réinitialisation forcée')
      resetLoadingState()
      showToast('Problème de connexion détecté. Réessayez.')
    }
  }, 35000) // 35 secondes
  
  // Vider le message seulement après l'avoir extrait
  newMessage.value = ''
  
  // Ajuster la hauteur du textarea (fonctionne sur mobile et PC)
  if (messageInput && messageInput.value) {
    messageInput.value.style.height = 'auto'
    calculateInputHeight()
  }

  try {
    let response
    
    // Test de connectivité simple
    console.log('🔍 Test de connectivité vers:', API_BASE)
    try {
      const testResponse = await $fetch(`${API_BASE}`, {
        method: 'GET',
        credentials: 'include',
        timeout: 10000 // 10 secondes pour le test
      })
      console.log('✅ Connectivité OK')
    } catch (testError) {
      console.error('❌ Problème de connectivité:', testError)
      throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet.')
    }
    
    // Timeout plus long pour l'API qui peut être lente
    // Désactiver temporairement le timeout si l'API est lente
    const useTimeout = false // Mettre à true pour réactiver les timeouts
    const timeoutPromise = useTimeout ? new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout: La requête a pris trop de temps')), 60000) // 60 secondes
    }) : null
    
    if (currentConversationId.value) {
      // Conversation existante - Version simplifiée
      console.log('📤 Envoi vers conversation existante:', currentConversationId.value)
      response = useTimeout ? 
        await Promise.race([
          $fetch(`${API_BASE}/chat/conversations/${currentConversationId.value}/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ message: messageText }),
            credentials: 'include'
          }),
          timeoutPromise
        ]) :
        await $fetch(`${API_BASE}/chat/conversations/${currentConversationId.value}/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ message: messageText }),
          credentials: 'include'
        })
      console.log('✅ Réponse reçue:', response)
      
      // Ajouter le message de l'assistant si disponible
      if (response && (response.response || response.reply)) {
        const assistantMessage = response.response || response.reply
        messages.value.push({
          sender: 'assistant',
          content: assistantMessage,
          created_at: new Date().toISOString()
        })
        if (isTtsSupported.value && autoReadResponses.value) {
          speakText(assistantMessage)
        }
      }
    } else {
      // Nouvelle conversation - Version complète
      console.log('🆕 Création d\'une nouvelle conversation...')
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
      console.log('✅ Nouvelle conversation créée:', response)
      const convId = response.id || response.conversation_id
      currentConversationId.value = convId
      
      // Deuxième envoi pour avoir la réponse immédiate
      console.log('📤 Deuxième envoi pour réponse immédiate...')
      const secondResponse = await $fetch(`${API_BASE}/chat/conversations/${convId}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ message: messageText }),
        credentials: 'include'
      })
      console.log('✅ Réponse immédiate reçue:', secondResponse)
      
      // Ajouter le message de l'assistant si disponible
      if (secondResponse && (secondResponse.response || secondResponse.reply)) {
        const assistantMessage = secondResponse.response || secondResponse.reply
        console.log('📝 Ajout du message assistant:', assistantMessage)
        console.log('📊 Messages avant ajout:', messages.value.length)
        
        messages.value.push({
          sender: 'assistant',
          content: assistantMessage,
          created_at: new Date().toISOString()
        })
        if (isTtsSupported.value && autoReadResponses.value) {
          speakText(assistantMessage)
        }
        
        console.log('📊 Messages après ajout:', messages.value.length)
        console.log('📋 Contenu des messages:', messages.value)
      } else {
        console.log('❌ Pas de réponse assistant dans secondResponse:', secondResponse)
      }
      
      // Charger les conversations mises à jour
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
    console.error('❌ Erreur détaillée:', error)
    console.error('❌ Type d\'erreur:', typeof error)
    console.error('❌ Message d\'erreur:', error.message)
    console.error('❌ Status:', error.status)
    console.error('❌ Data:', error.data)
    
    messages.value.pop()
    let errorMessage = 'Erreur lors de l\'envoi du message.'
    
    if (error.message && error.message.includes('Timeout')) {
      errorMessage = 'L\'API prend trop de temps à répondre. Vérifiez votre connexion ou réessayez plus tard.'
    } else if (error.data?.detail) {
      errorMessage = error.data.detail
    } else if (error.status === 500) {
      errorMessage = 'Erreur interne du chatbot.'
    } else if (error.status === 401) {
      errorMessage = 'Session expirée.'
    } else if (error.status === 403) {
      errorMessage = 'Accès refusé.'
    } else if (error.status === 404) {
      errorMessage = 'Service non trouvé.'
    } else if (error.status === 0) {
      errorMessage = 'Erreur de connexion.'
    }
    
    messages.value.push({
      sender: 'assistant',
      content: `⚠️ ${errorMessage}`,
      created_at: new Date().toISOString()
    })
    
    newMessage.value = messageText
    showToast(errorMessage)
  } finally {
    clearTimeout(safetyTimeout)
    resetLoadingState()
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
  ephemereDuration.value = 1
  ephemereUnit.value = 'jours'
  showEphemereModal.value = true
}

const closeEphemereModal = () => {
  showEphemereModal.value = false
}

const confirmEphemere = async () => {
  let expire_in = ephemereDuration.value
  if (ephemereUnit.value === 'minutes') expire_in *= 1
  if (ephemereUnit.value === 'heures') expire_in *= 60
  if (ephemereUnit.value === 'jours') expire_in *= 60 * 24
  
  // Vérification de la durée minimale (1 jour = 1440 minutes)
  if (expire_in < 1440) {
    showToast('La durée minimale est de 1 jour.')
    return
  }
  
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

// Reset function for error recovery
const resetLoadingState = () => {
  isLoading.value = false
  if (messageInput.value) {
    messageInput.value.focus()
  }
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

/* Dark Mode */
.dark {
  color-scheme: dark;
}

/* Mobile Adjustments */
@media (max-width: 768px) {
  /* Navbar mobile fixe */
  .mobile-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 40;
    height: 70px;
    background: white;
    border-bottom: 1px solid #e5e7eb;
  }
  .dark .mobile-header {
    background: #1f2937;
    border-bottom: 1px solid #374151;
  }

  /* Ajuster la zone principale pour compenser la navbar fixe */
  .flex-1.flex.flex-col {
    margin-top: 70px;
    height: calc(100dvh - 70px);
  }

  .sidebar {
    position: fixed;
    top: 70px; /* Commencer après la navbar fixe */
    z-index: 40;
    width: 100vw;
    max-width: 100vw;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    height: calc(100vh - 70px);
  }

  .messages-container {
    height: calc(100dvh - 180px);
    max-height: calc(100dvh - 180px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-top: 1rem;
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
    appearance: none;
    border-radius: 12px;
  }
  html, body, #__nuxt, #__layout {
    height: 100dvh;
    overflow: hidden;
    overscroll-behavior: none;
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

  /* Amélioration des boutons d'action dans le menu mobile */
  .flex-1.bg-yellow-100,
  .flex-1.bg-red-100 {
    min-height: 44px;
    font-size: 14px;
  }

  /* Optimisation de l'affichage des conversations dans le menu mobile */
  .p-4.rounded-xl {
    margin-bottom: 0.75rem;
  }

  /* Amélioration de la lisibilité des actions */
  .pt-2.border-t {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
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
</style>