import { defineStore } from 'pinia'

export interface ChatMessage {
  id: number | string
  role: 'user' | 'assistant'
  content: string
  created_at: string
  pending?: boolean
}

export interface Conversation {
  id: string
  title: string | null
  created_at: string
  updated_at: string
  messages?: ChatMessage[]
}

const CLIENT_ID_KEY = 'avina_client_id'

function getClientId(): string {
  if (typeof localStorage === 'undefined') return ''
  let id = localStorage.getItem(CLIENT_ID_KEY)
  if (!id) {
    id = (crypto.randomUUID ? crypto.randomUUID() : `web-${Date.now()}-${Math.random().toString(36).slice(2)}`)
    localStorage.setItem(CLIENT_ID_KEY, id)
  }
  return id
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    clientId: '' as string,
    conversations: [] as Conversation[],
    currentConversationId: null as string | null,
    messages: [] as ChatMessage[],
    isSending: false,
    isLoadingConversations: false,
    error: null as string | null,
    // Position optionnelle du navigateur (geolocation), demandee explicitement
    // via le bouton "Utiliser ma position" — jamais collectee silencieusement.
    coords: null as { latitude: number; longitude: number } | null,
  }),

  getters: {
    currentConversation(state): Conversation | undefined {
      return state.conversations.find(c => c.id === state.currentConversationId)
    },
  },

  actions: {
    apiBase(): string {
      return useRuntimeConfig().public.ragApiBase as string
    },

    init() {
      if (!this.clientId) this.clientId = getClientId()
    },

    async loadConversations() {
      this.init()
      this.isLoadingConversations = true
      try {
        const data = await $fetch<Conversation[]>(`${this.apiBase()}/api/conversations/`, {
          query: { client_id: this.clientId },
        })
        this.conversations = data
      } catch {
        // Silencieux : pas de conversations n'est pas une erreur bloquante
        this.conversations = []
      } finally {
        this.isLoadingConversations = false
      }
    },

    async selectConversation(conversationId: string) {
      this.init()
      this.currentConversationId = conversationId
      const local = this.conversations.find(c => c.id === conversationId)
      if (local?.messages) {
        this.messages = local.messages
        return
      }
      try {
        const data = await $fetch<Conversation>(
          `${this.apiBase()}/api/conversations/${conversationId}/`,
          { query: { client_id: this.clientId } }
        )
        this.messages = data.messages || []
      } catch {
        this.messages = []
      }
    },

    startNewConversation() {
      this.currentConversationId = null
      this.messages = []
      this.error = null
    },

    async sendMessage(question: string) {
      this.init()
      const text = question.trim()
      if (!text || this.isSending) return

      this.error = null
      this.isSending = true

      // Affichage optimiste du message utilisateur
      this.messages.push({
        id: `local-${Date.now()}`,
        role: 'user',
        content: text,
        created_at: new Date().toISOString(),
      })

      try {
        const data = await $fetch<{ conversation_id: string; answer: string; message_id: number }>(
          `${this.apiBase()}/api/chat/`,
          {
            method: 'POST',
            body: {
              client_id: this.clientId,
              question: text,
              conversation_id: this.currentConversationId || undefined,
              latitude: this.coords?.latitude,
              longitude: this.coords?.longitude,
            },
          }
        )

        const isNew = !this.currentConversationId
        this.currentConversationId = data.conversation_id
        this.messages.push({
          id: data.message_id,
          role: 'assistant',
          content: data.answer,
          created_at: new Date().toISOString(),
        })

        if (isNew) this.loadConversations()
      } catch {
        this.error = "Impossible de joindre Avina pour le moment. Vérifie ta connexion et réessaie."
      } finally {
        this.isSending = false
      }
    },

    /** Demande la position au navigateur (déclenché uniquement par un clic explicite
     * de l'utilisateur). Une fois accordée, elle est jointe aux messages suivants. */
    requestLocation(): Promise<void> {
      return new Promise((resolve, reject) => {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
          reject(new Error('Géolocalisation non disponible sur cet appareil.'))
          return
        }
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.coords = { latitude: position.coords.latitude, longitude: position.coords.longitude }
            resolve()
          },
          () => reject(new Error("Position refusée ou indisponible.")),
          { enableHighAccuracy: true, timeout: 8000 }
        )
      })
    },

    async deleteConversation(conversationId: string) {
      this.init()
      try {
        await $fetch(`${this.apiBase()}/api/conversations/${conversationId}/delete/`, {
          method: 'DELETE',
          body: { client_id: this.clientId },
        })
      } catch {
        // On retire quand même localement : l'utilisateur veut la voir disparaître
      }
      this.conversations = this.conversations.filter(c => c.id !== conversationId)
      if (this.currentConversationId === conversationId) this.startNewConversation()
    },
  },
})
