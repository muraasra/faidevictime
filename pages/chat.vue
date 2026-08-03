<template>
  <div class="chat-app bg-gray-50 dark:bg-zinc-900">
    <!-- ===== Tiroir des conversations (mobile) / Sidebar (desktop) ===== -->
    <transition name="fade">
      <div
        v-if="showDrawer"
        class="fixed inset-0 bg-black/40 z-40 md:hidden"
        @click="showDrawer = false"
      />
    </transition>

    <aside
      :class="[
        'conversations-panel bg-white dark:bg-zinc-800 border-r border-gray-100 dark:border-zinc-700',
        showDrawer ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      ]"
    >
      <div class="p-4 flex items-center justify-between border-b border-gray-100 dark:border-zinc-700">
        <NuxtLink to="/" class="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-emerald-600 text-sm">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Accueil
        </NuxtLink>
        <button class="md:hidden p-2 text-gray-400" @click="showDrawer = false" aria-label="Fermer">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-4">
        <button
          @click="onNewConversation"
          class="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-medium px-4 py-3 rounded-2xl transition"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle conversation
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        <p v-if="chat.isLoadingConversations" class="text-sm text-gray-400 px-2 py-4 text-center">Chargement…</p>
        <p v-else-if="!chat.conversations.length" class="text-sm text-gray-400 px-2 py-4 text-center">
          Aucune conversation pour l'instant
        </p>
        <button
          v-for="conv in chat.conversations"
          :key="conv.id"
          @click="onSelectConversation(conv.id)"
          :class="[
            'w-full text-left px-3 py-3 rounded-xl transition group flex items-center gap-2',
            conv.id === chat.currentConversationId
              ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200'
              : 'hover:bg-gray-50 dark:hover:bg-zinc-700/50 text-gray-700 dark:text-gray-300',
          ]"
        >
          <span class="flex-1 truncate text-sm">{{ conv.title || 'Conversation' }}</span>
          <span
            role="button"
            tabindex="0"
            @click.stop="confirmDelete(conv.id)"
            @keydown.enter.stop="confirmDelete(conv.id)"
            class="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-gray-400 hover:text-red-500 transition"
            aria-label="Supprimer la conversation"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16M10 3h4a1 1 0 011 1v3H9V4a1 1 0 011-1z" />
            </svg>
          </span>
        </button>
      </div>

      <div class="p-4 border-t border-gray-100 dark:border-zinc-700">
        <p class="text-[11px] leading-relaxed text-gray-400 dark:text-gray-500 flex items-start gap-1.5">
          <svg class="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
          </svg>
          Échanges anonymes et confidentiels. Aucun compte requis.
        </p>
      </div>
    </aside>

    <!-- ===== Zone principale ===== -->
    <main class="chat-main">
      <!-- En-tête -->
      <header class="flex items-center gap-3 px-4 py-3 bg-white dark:bg-zinc-800 border-b border-gray-100 dark:border-zinc-700 flex-shrink-0">
        <button class="md:hidden p-2 -ml-2 text-gray-500 dark:text-gray-300" @click="showDrawer = true" aria-label="Conversations">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <AvinaMark :size="38" />
        <div class="flex-1 min-w-0">
          <h1 class="font-semibold text-gray-800 dark:text-white leading-tight">Avina</h1>
          <p class="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            À ton écoute
          </p>
        </div>

        <!-- Position : trouver les services les plus proches sans nommer sa zone -->
        <button
          v-if="!chat.coords"
          @click="onUseLocation"
          :disabled="locatingUser"
          class="hidden sm:flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 px-3 py-2 rounded-full text-sm font-semibold transition disabled:opacity-50"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {{ locatingUser ? '…' : 'Ma position' }}
        </button>
        <span v-else class="hidden sm:flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Position active
        </span>

        <!-- Bouton urgence, toujours visible -->
        <button
          @click="showEmergency = !showEmergency"
          class="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/60 px-3 py-2 rounded-full text-sm font-semibold transition"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          Urgence
        </button>
      </header>

      <!-- Bandeau urgence dépliable -->
      <transition name="slide-down">
        <div v-if="showEmergency" class="bg-red-50 dark:bg-red-900/30 border-b border-red-100 dark:border-red-900 px-4 py-3 flex-shrink-0">
          <p class="text-sm text-red-800 dark:text-red-200 font-medium mb-2">En danger immédiat ? Appelle maintenant :</p>
          <div class="flex flex-wrap gap-2">
            <a href="tel:117" class="emergency-chip">🚔 Police — 117</a>
            <a href="tel:119" class="emergency-chip">🚒 Pompiers — 119</a>
            <a href="tel:1510" class="emergency-chip">💜 SOS Violences — 1510</a>
          </div>
        </div>
      </transition>

      <!-- Messages -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto px-4 py-6">
        <!-- État d'accueil -->
        <div v-if="!chat.messages.length" class="max-w-md mx-auto text-center pt-8 md:pt-16">
          <AvinaMark :size="64" class="mx-auto mb-4" />
          <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Bonjour, je suis Avina 🌸</h2>
          <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
            Je suis là pour t'écouter, sans jugement, et t'aider à trouver des services
            près de chez toi. Tout ce que tu me dis reste confidentiel.
          </p>
          <div class="grid gap-2.5">
            <button
              v-for="suggestion in suggestions"
              :key="suggestion.text"
              @click="sendSuggestion(suggestion.text)"
              class="suggestion-chip"
            >
              <span class="text-lg">{{ suggestion.emoji }}</span>
              <span>{{ suggestion.text }}</span>
            </button>
            <button
              @click="onUseLocation"
              :disabled="locatingUser"
              class="suggestion-chip location-chip"
            >
              <span class="text-lg">📍</span>
              <span>{{ locatingUser ? 'Localisation en cours…' : 'Utiliser ma position pour trouver un service proche' }}</span>
            </button>
          </div>
        </div>

        <!-- Fil de messages : colonne centrée façon ChatGPT -->
        <div v-else class="max-w-[46rem] mx-auto w-full space-y-6">
          <template v-for="message in chat.messages" :key="message.id">
            <!-- Message utilisateur : bulle alignée à droite -->
            <div v-if="message.role === 'user'" class="flex justify-end">
              <div class="bubble bubble-user">{{ message.content }}</div>
            </div>
            <!-- Message Avina : texte plein, pas de bulle, avec action copier au survol -->
            <div v-else class="group flex items-start gap-3">
              <AvinaMark :size="28" class="flex-shrink-0 mt-0.5" />
              <div class="min-w-0 flex-1">
                <div class="prose-avina text-gray-800 dark:text-gray-100 text-[15px] leading-relaxed" v-html="renderMarkdown(message.content)" />
                <button
                  @click="copyMessage(message)"
                  class="copy-btn opacity-0 group-hover:opacity-100 focus:opacity-100"
                  :aria-label="copiedId === message.id ? 'Copié' : 'Copier la réponse'"
                >
                  <svg v-if="copiedId !== message.id" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <svg v-else class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ copiedId === message.id ? 'Copié' : 'Copier' }}
                </button>
              </div>
            </div>
          </template>

          <!-- Indicateur "Avina écrit..." -->
          <div v-if="chat.isSending" class="flex items-start gap-3">
            <AvinaMark :size="28" class="flex-shrink-0 mt-0.5" />
            <div class="typing"><span /><span /><span /></div>
          </div>

          <!-- Erreur -->
          <div v-if="chat.error" class="text-center">
            <p class="inline-block text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-xl px-4 py-3">
              {{ chat.error }}
              <button @click="retryLast" class="underline font-medium ml-1">Réessayer</button>
            </p>
          </div>
        </div>
      </div>

      <!-- Zone de saisie -->
      <footer class="px-4 pb-4 pt-2 bg-gradient-to-t from-gray-50 dark:from-zinc-900 flex-shrink-0">
        <!-- Sélecteur guidé type d'aide + zone : évite les malentendus du texte libre -->
        <div
          v-if="showServicePicker"
          class="max-w-[46rem] mx-auto mb-3 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-2xl p-4 shadow-lg"
        >
          <div class="flex items-center justify-between mb-3">
            <p class="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {{ pickerCategory ? `${pickerCategory} — dans quelle zone ?` : "Quel type d'aide cherches-tu ?" }}
            </p>
            <button @click="closePicker" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1" aria-label="Fermer le sélecteur">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="!pickerCategory" class="flex flex-wrap gap-2">
            <button v-for="cat in pickerCategories" :key="cat" @click="pickCategory(cat)" class="picker-chip">
              {{ cat }}
            </button>
          </div>
          <div v-else class="flex flex-wrap gap-2">
            <button @click="pickerCategory = null" class="picker-chip picker-chip-back" aria-label="Revenir au choix du type d'aide">
              ←
            </button>
            <button v-for="zone in pickerZones" :key="zone" @click="pickZone(zone)" class="picker-chip">
              {{ zone }}
            </button>
          </div>
        </div>

        <div class="max-w-[46rem] mx-auto mb-2 flex justify-center">
          <button @click="showServicePicker = !showServicePicker" class="picker-toggle">
            🎯 Choisir précisément un type d'aide + une zone
          </button>
        </div>

        <form
          @submit.prevent="onSend"
          class="max-w-[46rem] mx-auto flex items-end gap-2 bg-white dark:bg-zinc-800 rounded-3xl shadow-lg shadow-gray-200/60 dark:shadow-none border border-gray-100 dark:border-zinc-700 px-4 py-2"
        >
          <textarea
            ref="inputEl"
            v-model="draft"
            rows="1"
            placeholder="Écris ton message…"
            class="flex-1 resize-none bg-transparent border-0 focus:ring-0 focus:outline-none text-gray-800 dark:text-white placeholder-gray-400 py-2.5 max-h-32 text-[15px]"
            @keydown.enter.exact.prevent="onSend"
            @input="autoGrow"
          />
          <button
            type="submit"
            :disabled="!draft.trim() || chat.isSending"
            class="send-btn"
            aria-label="Envoyer"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
        <p class="text-[11px] text-gray-400 dark:text-gray-500 text-center mt-2">
          Avina est une IA d'écoute et d'orientation — en cas d'urgence, utilise le bouton rouge ci-dessus.
        </p>
      </footer>
    </main>

    <!-- Modale suppression -->
    <transition name="fade">
      <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6" @click.self="deleteTarget = null">
        <div class="bg-white dark:bg-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-xl">
          <h3 class="font-semibold text-gray-800 dark:text-white mb-2">Supprimer cette conversation ?</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">Tous les messages seront définitivement effacés.</p>
          <div class="flex gap-3">
            <button @click="deleteTarget = null" class="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 font-medium">
              Annuler
            </button>
            <button @click="onDelete" class="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted } from 'vue'
import { marked } from 'marked'
import { useChatStore } from '~/stores/chat'
import { SITE_URL, SITE_DEFAULT_OG_IMAGE } from '~/utils/site'

definePageMeta({ layout: false })
useHead({
  title: 'Avina — Écoute et orientation | childsafe',
  meta: [
    { name: 'description', content: 'Parlez à Avina, l\'assistant IA gratuit et anonyme de childsafe : écoute, soutien et orientation vers un service d\'aide adapté à votre situation, sans compte requis.' },
    { property: 'og:title', content: 'Avina — Écoute et orientation | childsafe' },
    { property: 'og:description', content: 'Assistant IA gratuit et anonyme : écoute, soutien et orientation vers un service d\'aide adapté.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `${SITE_URL}/chat` },
    { property: 'og:image', content: SITE_DEFAULT_OG_IMAGE },
  ],
  link: [{ rel: 'canonical', href: `${SITE_URL}/chat` }],
})

const chat = useChatStore()
const draft = ref('')
const showDrawer = ref(false)
const showEmergency = ref(false)
const deleteTarget = ref<string | null>(null)
const messagesContainer = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLTextAreaElement | null>(null)
const copiedId = ref<number | string | null>(null)
const locatingUser = ref(false)
let lastQuestion = ''

const suggestions = [
  { emoji: '💬', text: "J'ai besoin de parler à quelqu'un" },
  { emoji: '🧭', text: 'Je cherche un service près de chez moi' },
  { emoji: '⚖️', text: "J'ai besoin d'une aide juridique" },
  { emoji: '🏠', text: "Je cherche un hébergement d'urgence" },
]

// Sélecteur guidé (type d'aide + zone) : en texte libre, une phrase qui décrit à la
// fois la situation vécue et le service demandé peut être mal comprise (ex: mélange
// "violence" et "juridique"), et une zone mal orthographiée ou hors liste n'est pas
// reconnue. Les boutons envoient des libellés exacts qui matchent toujours les
// catégories/zones connues côté backend (rag_service.py), donc pas d'ambiguïté possible.
const showServicePicker = ref(false)
const pickerCategory = ref<string | null>(null)
const pickerCategories = [
  'Soutien psychologique', 'Soins médicaux', 'Aide juridique',
  "Hébergement d'urgence", 'Police / Sécurité', 'Santé mentale', 'Réinsertion économique',
]
const pickerZones = [
  'Bafoussam 1', 'Bafoussam 2', 'Bafoussam 3', 'Foumbot', 'Koutaba',
  'Foumban', 'Ngaoundéré 1', 'Ngaoundéré 2', 'Ngaoundéré 3',
]

function pickCategory(category: string) {
  pickerCategory.value = category
}

function pickZone(zone: string) {
  if (!pickerCategory.value) return
  const text = `Je cherche un service : ${pickerCategory.value}, à ${zone}.`
  closePicker()
  sendSuggestion(text)
}

function closePicker() {
  showServicePicker.value = false
  pickerCategory.value = null
}

// Demande la position au navigateur (stockée dans le store) puis jointe automatiquement
// aux prochains messages par chat.sendMessage — le backend trie alors les services par
// vraie distance GPS (voir rag_service._find_nearest_documents) plutôt que par ville devinée.
async function onUseLocation() {
  if (locatingUser.value) return
  locatingUser.value = true
  try {
    await chat.requestLocation()
    if (!chat.messages.length) {
      sendSuggestion('Je cherche un service près de ma position actuelle.')
    }
  } catch (err: any) {
    chat.error = err?.message || "Position indisponible. Vérifie l'autorisation de géolocalisation de ton navigateur."
  } finally {
    locatingUser.value = false
  }
}

marked.setOptions({ breaks: true })

function renderMarkdown(content: string): string {
  return marked.parse(content) as string
}

function scrollToBottom() {
  nextTick(() => {
    messagesContainer.value?.scrollTo({ top: messagesContainer.value.scrollHeight, behavior: 'smooth' })
  })
}

watch(() => chat.messages.length, scrollToBottom)
watch(() => chat.isSending, scrollToBottom)

function autoGrow() {
  const el = inputEl.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 128)}px`
}

async function onSend() {
  const text = draft.value.trim()
  if (!text || chat.isSending) return
  lastQuestion = text
  draft.value = ''
  autoGrow()
  await chat.sendMessage(text)
}

async function copyMessage(message: { id: number | string; content: string }) {
  try {
    await navigator.clipboard.writeText(message.content)
    copiedId.value = message.id
    setTimeout(() => { if (copiedId.value === message.id) copiedId.value = null }, 1500)
  } catch {
    // Presse-papiers indisponible (permission refusée) : on ignore silencieusement
  }
}

function sendSuggestion(text: string) {
  lastQuestion = text
  chat.sendMessage(text)
}

function retryLast() {
  chat.error = null
  if (lastQuestion) {
    // Retire le doublon du message utilisateur resté sans réponse
    const last = chat.messages[chat.messages.length - 1]
    if (last?.role === 'user' && last.content === lastQuestion) chat.messages.pop()
    chat.sendMessage(lastQuestion)
  }
}

function onNewConversation() {
  chat.startNewConversation()
  showDrawer.value = false
}

async function onSelectConversation(id: string) {
  await chat.selectConversation(id)
  showDrawer.value = false
  scrollToBottom()
}

function confirmDelete(id: string) {
  deleteTarget.value = id
}

async function onDelete() {
  if (deleteTarget.value) await chat.deleteConversation(deleteTarget.value)
  deleteTarget.value = null
}

onMounted(() => {
  chat.init()
  chat.loadConversations()
})
</script>

<style scoped>
.chat-app {
  height: 100dvh;
  display: flex;
  overflow: hidden;
}

.conversations-panel {
  position: fixed;
  inset: 0 auto 0 0;
  width: 300px;
  max-width: 85vw;
  z-index: 50;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease;
}

@media (min-width: 768px) {
  .conversations-panel {
    position: relative;
    z-index: auto;
    width: 320px;
    max-width: none;
  }
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100dvh;
}

/* Bulles */
.bubble {
  max-width: min(80%, 560px);
  padding: 0.7rem 1rem;
  border-radius: 1.25rem;
  font-size: 0.95rem;
  line-height: 1.55;
  word-break: break-word;
}
.bubble-user {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border-bottom-right-radius: 0.375rem;
  white-space: pre-wrap;
}

/* Action "copier" sous les réponses Avina, façon ChatGPT */
.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #9ca3af;
  transition: all 0.15s;
}
.copy-btn:hover { color: #059669; background: #ecfdf5; }
:global(.dark) .copy-btn:hover { background: rgba(16, 185, 129, 0.12); }

/* Contenu markdown des réponses Avina */
.prose-avina :deep(p) { margin: 0 0 0.5em; }
.prose-avina :deep(p:last-child) { margin-bottom: 0; }
.prose-avina :deep(a) { color: #059669; text-decoration: underline; font-weight: 500; }
.prose-avina :deep(strong) { font-weight: 700; }
.prose-avina :deep(ul), .prose-avina :deep(ol) { padding-left: 1.2em; margin: 0.4em 0; }
.prose-avina :deep(li) { margin: 0.2em 0; }
.prose-avina :deep(table) { font-size: 0.85em; border-collapse: collapse; margin: 0.5em 0; display: block; overflow-x: auto; }
.prose-avina :deep(th), .prose-avina :deep(td) { border: 1px solid #e5e7eb; padding: 0.35em 0.6em; text-align: left; }
:global(.dark) .prose-avina :deep(th), :global(.dark) .prose-avina :deep(td) { border-color: #3f3f46; }
.prose-avina :deep(h1), .prose-avina :deep(h2), .prose-avina :deep(h3) { font-size: 1em; font-weight: 700; margin: 0.6em 0 0.3em; }
.prose-avina :deep(hr) { border-color: #e5e7eb; margin: 0.6em 0; }

/* Indicateur de frappe */
.typing {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 38px;
}
.typing span {
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background: #9ca3af;
  animation: bounce-dot 1.2s infinite ease-in-out;
}
.typing span:nth-child(2) { animation-delay: 0.15s; }
.typing span:nth-child(3) { animation-delay: 0.3s; }
@keyframes bounce-dot {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30% { transform: translateY(-5px); opacity: 1; }
}

/* Suggestions d'accueil */
.suggestion-chip {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.1rem;
  border-radius: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  color: #374151;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;
  transition: all 0.15s;
}
.suggestion-chip:hover {
  border-color: #10b981;
  background: #ecfdf5;
  transform: translateY(-1px);
}
:global(.dark) .suggestion-chip {
  background: #27272a;
  border-color: #3f3f46;
  color: #d4d4d8;
}
:global(.dark) .suggestion-chip:hover {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.location-chip {
  border-style: dashed;
}
.location-chip:disabled {
  opacity: 0.6;
  cursor: default;
  transform: none;
}

/* Sélecteur guidé type d'aide + zone */
.picker-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  background: white;
  border: 1px dashed #d1d5db;
  color: #6b7280;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.15s;
}
.picker-toggle:hover {
  border-color: #10b981;
  color: #059669;
}
:global(.dark) .picker-toggle {
  background: #27272a;
  border-color: #52525b;
  color: #a1a1aa;
}
:global(.dark) .picker-toggle:hover {
  border-color: #10b981;
  color: #34d399;
}

.picker-chip {
  padding: 0.5rem 0.9rem;
  border-radius: 9999px;
  background: #f3f4f6;
  border: 1px solid transparent;
  color: #374151;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.15s;
}
.picker-chip:hover {
  background: #d1fae5;
  color: #047857;
}
:global(.dark) .picker-chip {
  background: #3f3f46;
  color: #e4e4e7;
}
:global(.dark) .picker-chip:hover {
  background: rgba(16, 185, 129, 0.2);
  color: #6ee7b7;
}
.picker-chip-back {
  font-weight: 700;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

/* Numéros d'urgence */
.emergency-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: white;
  color: #dc2626;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 0.5rem 0.9rem;
  border-radius: 9999px;
  border: 1px solid #fecaca;
  transition: all 0.15s;
}
.emergency-chip:hover { background: #fef2f2; transform: scale(1.03); }
:global(.dark) .emergency-chip {
  background: #3f1d1d;
  color: #fca5a5;
  border-color: #7f1d1d;
}

/* Bouton envoyer */
.send-btn {
  width: 42px;
  height: 42px;
  border-radius: 9999px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
  margin-bottom: 2px;
}
.send-btn:disabled { opacity: 0.4; }
.send-btn:not(:disabled):hover { transform: scale(1.06); }
.send-btn:not(:disabled):active { transform: scale(0.95); }

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
