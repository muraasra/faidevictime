import { defineStore } from 'pinia'

interface ChatState {
  currentConversationId: string | null
  initialMessage: string | null
  situationType: string | null
  firstName: string | null
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    currentConversationId: null,
    initialMessage: null,
    situationType: null,
    firstName: null
  }),

  actions: {
    setConversationData(data: {
      conversationId: string
      initialMessage: string
      situationType: string
      firstName: string
    }) {
      this.currentConversationId = data.conversationId
      this.initialMessage = data.initialMessage
      this.situationType = data.situationType
      this.firstName = data.firstName
    },

    clearConversationData() {
      this.currentConversationId = null
      this.initialMessage = null
      this.situationType = null
      this.firstName = null
    }
  }
}) 