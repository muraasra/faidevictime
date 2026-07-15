<template>
  <!-- ===== Verrou d'accès (page publique, protégée par un code côté frontend) ===== -->
  <div v-if="!unlocked" class="lock-screen bg-gray-50 dark:bg-zinc-900">
    <form @submit.prevent="unlock" class="lock-card">
      <div class="lock-icon"><i class="fas fa-lock" /></div>
      <h1 class="font-bold text-gray-800 dark:text-white text-lg mb-1">Accès administration</h1>
      <p class="text-sm text-gray-400 mb-5">Entre le code d'accès pour modifier les services.</p>
      <input
        v-model="codeInput"
        type="password"
        autofocus
        placeholder="Code d'accès"
        class="input w-full text-center tracking-widest"
        :class="{ 'border-red-400': codeError }"
        @input="codeError = false"
      />
      <p v-if="codeError" class="text-xs text-red-500 mt-2">Code incorrect, réessaie.</p>
      <button type="submit" class="unlock-btn">Déverrouiller</button>
    </form>
  </div>

  <div v-else class="admin-page bg-gray-50 dark:bg-zinc-900">
    <!-- ===== Liste des services ===== -->
    <aside
      :class="[
        'services-list bg-white dark:bg-zinc-800 border-r border-gray-100 dark:border-zinc-700',
        showList ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      ]"
    >
      <div class="p-4 border-b border-gray-100 dark:border-zinc-700">
        <div class="flex items-center justify-between mb-3">
          <h1 class="font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <i class="fas fa-sliders-h text-emerald-600" />
            Administration
          </h1>
          <button class="md:hidden p-1.5 text-gray-400" @click="showList = false" aria-label="Fermer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div class="relative">
          <input
            v-model="search"
            type="search"
            placeholder="Rechercher un service…"
            class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <p class="text-xs text-gray-400 mt-2">{{ filteredList.length }} / {{ services.length }} services</p>
      </div>

      <div class="overflow-y-auto flex-1">
        <p v-if="loadingList" class="p-4 text-sm text-gray-400 text-center">Chargement…</p>
        <button
          v-for="(service, index) in filteredList"
          :key="service.id"
          @click="selectService(service)"
          :class="[
            'w-full text-left px-4 py-3 border-b border-gray-50 dark:border-zinc-700/50 transition flex items-start gap-2.5',
            selectedId === service.id ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'hover:bg-gray-50 dark:hover:bg-zinc-700/40',
          ]"
        >
          <span class="w-6 flex-shrink-0 text-xs font-semibold text-gray-400 mt-1 text-right">{{ index + 1 }}.</span>
          <span
            class="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
            :class="service.statut ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-zinc-600'"
            :title="service.statut ? 'Actif' : 'Inactif'"
          />
          <span class="flex-1 min-w-0">
            <span class="block text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{{ service.nom_structure }}</span>
            <span class="block text-xs text-gray-400 truncate">{{ categoriesOf(service).map(c => c.short).join(', ') || 'Aucune catégorie' }}</span>
          </span>
          <span v-if="dirtyIds.has(service.id)" class="text-[10px] text-amber-500 font-bold mt-0.5" title="Modifié">●</span>
        </button>
      </div>
    </aside>

    <!-- ===== Éditeur ===== -->
    <main class="editor">
      <!-- Barre supérieure -->
      <header class="editor-header bg-white dark:bg-zinc-800 border-b border-gray-100 dark:border-zinc-700">
        <button class="md:hidden p-2 -ml-1 text-gray-500 dark:text-gray-300" @click="showList = true" aria-label="Liste">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <div class="flex-1 min-w-0">
          <h2 v-if="form" class="font-semibold text-gray-800 dark:text-white truncate">{{ form.nom_structure || 'Sans nom' }}</h2>
          <p v-else class="text-gray-400 text-sm">Sélectionnez un service à modifier</p>
        </div>
        <NuxtLink to="/services" class="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 mr-2">
          <i class="fas fa-map" /> Voir la carte
        </NuxtLink>
        <button
          v-if="form"
          @click="save"
          :disabled="isSaving || !isDirty"
          class="save-btn"
          :class="isDirty ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-gray-100 dark:bg-zinc-700 text-gray-400 cursor-not-allowed'"
        >
          <i v-if="isSaving" class="fas fa-spinner fa-spin" />
          <i v-else class="fas fa-save" />
          {{ isSaving ? 'Enregistrement…' : 'Enregistrer' }}
        </button>
      </header>

      <!-- Corps -->
      <div v-if="form" class="editor-body">
        <!-- Statut actif/inactif -->
        <section class="card">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="section-title">Statut du service</h3>
              <p class="text-xs text-gray-400">Un service inactif reste visible mais marqué « à confirmer ».</p>
            </div>
            <button
              @click="form.statut = !form.statut"
              :class="['toggle', form.statut ? 'toggle-on' : 'toggle-off']"
              role="switch"
              :aria-checked="form.statut"
            >
              <span class="toggle-knob" />
            </button>
          </div>
          <p class="text-sm font-semibold mt-2" :class="form.statut ? 'text-emerald-600' : 'text-gray-400'">
            {{ form.statut ? '● Actif' : '○ Inactif' }}
          </p>
        </section>

        <!-- Informations générales -->
        <section class="card">
          <h3 class="section-title">Informations générales</h3>
          <div class="grid sm:grid-cols-2 gap-4">
            <label class="field sm:col-span-2">
              <span>Nom de la structure *</span>
              <input v-model="form.nom_structure" type="text" class="input" />
            </label>
            <label class="field">
              <span>Fonction du répondant</span>
              <input v-model="form.fonction_repondant" type="text" class="input" />
            </label>
            <label class="field">
              <span>Nom du répondant</span>
              <input v-model="form.nom_repondant" type="text" class="input" />
            </label>
            <label class="field">
              <span>Téléphone</span>
              <input v-model="form.telephone_repondant" type="tel" class="input" />
            </label>
            <label class="field">
              <span>Email</span>
              <input v-model="form.email" type="email" class="input" />
            </label>
            <label class="field sm:col-span-2">
              <span>Site web</span>
              <input v-model="form.site_web" type="text" class="input" placeholder="https://…" />
            </label>
          </div>
        </section>

        <!-- Types de service -->
        <section class="card">
          <h3 class="section-title">Types de service</h3>
          <p class="text-xs text-gray-400 mb-3">Activez les catégories correspondant à ce service.</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="cat in categoryMeta"
              :key="cat.key"
              @click="toggleCategory(cat.key)"
              :class="[
                'cat-chip',
                form.categories[cat.key] ? 'text-white border-transparent shadow-sm' : 'bg-white dark:bg-zinc-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-zinc-600',
              ]"
              :style="form.categories[cat.key] ? { backgroundColor: cat.color } : {}"
            >
              <i :class="cat.icon" :style="!form.categories[cat.key] ? { color: cat.color } : {}" />
              {{ cat.label }}
            </button>
          </div>
        </section>

        <!-- Services liés -->
        <section class="card">
          <h3 class="section-title">Services liés</h3>
          <p class="text-xs text-gray-400 mb-3">Rattachez ce service à un ou plusieurs autres services (ex. doublons, structures partenaires).</p>

          <div v-if="form.linkedIds.length" class="flex flex-wrap gap-2 mb-3">
            <span
              v-for="id in form.linkedIds"
              :key="id"
              class="link-chip"
            >
              {{ linkedServiceName(id) }}
              <button type="button" @click="removeLink(id)" aria-label="Retirer le lien">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </span>
          </div>

          <div class="relative">
            <input
              v-model="linkSearch"
              type="search"
              placeholder="Rechercher un service à lier…"
              class="input w-full"
            />
            <ul v-if="linkResults.length" class="link-results">
              <li v-for="s in linkResults" :key="s.id">
                <button type="button" @click="addLink(s.id)">{{ s.nom_structure }}</button>
              </li>
            </ul>
          </div>
        </section>

        <!-- Disponibilité -->
        <section class="card">
          <h3 class="section-title">Disponibilité</h3>
          <div class="grid sm:grid-cols-2 gap-4">
            <div class="field sm:col-span-2">
              <span>Jours d'ouverture</span>
              <div class="flex flex-wrap gap-1.5 mt-1">
                <button
                  v-for="day in DAYS"
                  :key="day"
                  @click="toggleInArray(form.jours_ouverture, day)"
                  :class="['day-chip', form.jours_ouverture.includes(day) ? 'bg-emerald-600 text-white border-transparent' : 'bg-white dark:bg-zinc-700 text-gray-500 dark:text-gray-300 border-gray-200 dark:border-zinc-600']"
                >
                  {{ day.slice(0, 3) }}
                </button>
              </div>
            </div>
            <label class="field">
              <span>Heure d'ouverture</span>
              <input v-model="form.heures_ouverture" type="time" class="input" />
            </label>
            <label class="field">
              <span>Coût</span>
              <select v-model="form.gratuit" class="input">
                <option value="Gratuit">Gratuit</option>
                <option value="Payant">Payant</option>
              </select>
            </label>
            <div class="field sm:col-span-2">
              <span>Langues parlées</span>
              <div class="flex flex-wrap gap-1.5 mt-1">
                <button
                  v-for="lang in LANGUAGES"
                  :key="lang"
                  @click="toggleInArray(form.langues_parlees, lang)"
                  :class="['day-chip', form.langues_parlees.includes(lang) ? 'bg-emerald-600 text-white border-transparent' : 'bg-white dark:bg-zinc-700 text-gray-500 dark:text-gray-300 border-gray-200 dark:border-zinc-600']"
                >
                  {{ lang }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Position sur la carte -->
        <section class="card">
          <h3 class="section-title">Position géographique</h3>
          <p class="text-xs text-gray-400 mb-3">
            <i class="fas fa-hand-pointer" /> Cliquez sur la carte ou déplacez le marqueur pour définir la position.
          </p>
          <div id="admin-map" class="admin-map" />
          <div class="grid grid-cols-2 gap-3 mt-3">
            <label class="field">
              <span>Latitude</span>
              <input v-model.number="form.latitude" type="number" step="0.000001" class="input" @change="syncMarkerFromInputs" />
            </label>
            <label class="field">
              <span>Longitude</span>
              <input v-model.number="form.longitude" type="number" step="0.000001" class="input" @change="syncMarkerFromInputs" />
            </label>
          </div>
        </section>

        <div class="h-20" />
      </div>

      <div v-else class="flex-1 flex flex-col items-center justify-center text-gray-300 dark:text-zinc-600 p-8">
        <i class="fas fa-hand-pointer text-5xl mb-4" />
        <p class="text-sm">Choisissez un service dans la liste pour commencer.</p>
      </div>
    </main>

    <!-- Toast -->
    <transition name="toast">
      <div
        v-if="toast"
        :class="['toast', toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600']"
      >
        <i :class="toast.type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle'" />
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'

definePageMeta({ layout: false })
useHead({ title: 'Administration des services' })

const API_BASE = useRuntimeConfig().public.adminApiBase as string

/* ---------- Verrou d'accès ---------- */
// Page volontairement publique (pas de login) mais protégée par un code côté
// frontend, mémorisé dans ce navigateur une fois saisi correctement.
const ACCESS_CODE = 'Avina2026'
const ACCESS_STORAGE_KEY = 'admin_services_access_ok'
const unlocked = ref(false)
const codeInput = ref('')
const codeError = ref(false)

function unlock() {
  if (codeInput.value.trim() !== ACCESS_CODE) {
    codeError.value = true
    return
  }
  unlocked.value = true
  try { localStorage.setItem(ACCESS_STORAGE_KEY, '1') } catch {}
  loadServices()
}

interface ServiceCategory { id: number }
interface LinkedService { id: number; nom_structure: string }
interface Service {
  id: number
  nom_structure: string
  fonction_repondant: string
  nom_repondant: string
  telephone_repondant: string
  email: string | null
  site_web: string | null
  latitude: string | number | null
  longitude: string | number | null
  langues_parlees: string[]
  jours_ouverture: string[]
  heures_ouverture: string | null
  gratuit: string | string[] | null
  statut: boolean
  soins_medicaux: ServiceCategory | null
  appui_psychosocial: ServiceCategory | null
  police_securite: ServiceCategory | null
  assistance_juridique: ServiceCategory | null
  sante_mentale: ServiceCategory | null
  reinsertion_economique: ServiceCategory | null
  linked_services: LinkedService[]
  [key: string]: unknown
}

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const LANGUAGES = ['Français', 'Anglais', 'Autres']

// key = champ dans la réponse API ; endpoint = route DRF du sous-modèle
const categoryMeta = [
  { key: 'soins_medicaux', endpoint: 'soins-medicaux', label: 'Soins médicaux', short: 'Soins', color: '#dc2626', icon: 'fas fa-hospital' },
  { key: 'appui_psychosocial', endpoint: 'appui-psychosocial', label: 'Appui psychosocial', short: 'Psychosocial', color: '#ca8a04', icon: 'fas fa-hands-helping' },
  { key: 'police_securite', endpoint: 'police-security', label: 'Police / Sécurité', short: 'Police', color: '#16a34a', icon: 'fas fa-shield-alt' },
  { key: 'assistance_juridique', endpoint: 'assistance-juridique', label: 'Aide juridique', short: 'Juridique', color: '#2563eb', icon: 'fas fa-balance-scale' },
  { key: 'sante_mentale', endpoint: 'sante-mentale', label: 'Santé mentale', short: 'Santé mentale', color: '#7c3aed', icon: 'fas fa-brain' },
  { key: 'reinsertion_economique', endpoint: 'reinsertion-economique', label: 'Réinsertion', short: 'Réinsertion', color: '#ea580c', icon: 'fas fa-briefcase' },
] as const

const services = ref<Service[]>([])
const loadingList = ref(true)
const search = ref('')
const selectedId = ref<number | null>(null)
const showList = ref(true)
const isSaving = ref(false)
const dirtyIds = ref(new Set<number>())
const toast = ref<{ type: 'ok' | 'error'; message: string } | null>(null)

interface FormState {
  nom_structure: string
  fonction_repondant: string
  nom_repondant: string
  telephone_repondant: string
  email: string
  site_web: string
  latitude: number | null
  longitude: number | null
  langues_parlees: string[]
  jours_ouverture: string[]
  heures_ouverture: string
  gratuit: string
  statut: boolean
  categories: Record<string, boolean>
  linkedIds: number[]
}
const form = ref<FormState | null>(null)
let original: FormState | null = null

const linkSearch = ref('')

let map: any = null
let leaflet: any = null
let marker: any = null

/* ---------- Chargement ---------- */

const filteredList = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return services.value
  return services.value.filter(s => s.nom_structure?.toLowerCase().includes(query))
})

function categoriesOf(service: Service) {
  return categoryMeta.filter(cat => service[cat.key])
}

async function loadServices() {
  loadingList.value = true
  try {
    const data = await $fetch<Service[]>(`${API_BASE}/api/question-transversale/`)
    services.value = [...data].sort((a, b) => a.nom_structure.localeCompare(b.nom_structure))
  } catch {
    showToast('error', 'Impossible de charger les services. Le backend est-il lancé sur ' + API_BASE + ' ?')
  } finally {
    loadingList.value = false
  }
}

/* ---------- Sélection & formulaire ---------- */

function toGratuit(value: string | string[] | null): string {
  if (Array.isArray(value)) return value.includes('Payant') ? 'Payant' : 'Gratuit'
  return value === 'Payant' ? 'Payant' : 'Gratuit'
}

function buildForm(service: Service): FormState {
  return {
    nom_structure: service.nom_structure || '',
    fonction_repondant: service.fonction_repondant || '',
    nom_repondant: service.nom_repondant || '',
    telephone_repondant: service.telephone_repondant || '',
    email: service.email || '',
    site_web: service.site_web || '',
    latitude: service.latitude != null ? Number(service.latitude) : null,
    longitude: service.longitude != null ? Number(service.longitude) : null,
    langues_parlees: [...(service.langues_parlees || [])],
    jours_ouverture: [...(service.jours_ouverture || [])],
    heures_ouverture: (service.heures_ouverture || '').slice(0, 5),
    gratuit: toGratuit(service.gratuit),
    statut: Boolean(service.statut),
    categories: Object.fromEntries(categoryMeta.map(cat => [cat.key, Boolean(service[cat.key])])),
    linkedIds: (service.linked_services || []).map(l => l.id),
  }
}

async function selectService(service: Service) {
  if (isDirty.value && !confirm('Des modifications non enregistrées seront perdues. Continuer ?')) return
  selectedId.value = service.id
  form.value = buildForm(service)
  original = JSON.parse(JSON.stringify(form.value))
  showList.value = false
  linkSearch.value = ''
  await nextTick()
  setupMap()
}

/* ---------- Services liés ---------- */

const linkResults = computed(() => {
  if (!form.value || selectedId.value == null) return []
  const query = linkSearch.value.trim().toLowerCase()
  if (!query) return []
  return services.value
    .filter(s => s.id !== selectedId.value && !form.value!.linkedIds.includes(s.id))
    .filter(s => s.nom_structure?.toLowerCase().includes(query))
    .slice(0, 8)
})

function linkedServiceName(id: number): string {
  return services.value.find(s => s.id === id)?.nom_structure || `#${id}`
}

function addLink(id: number) {
  if (!form.value) return
  if (!form.value.linkedIds.includes(id)) form.value.linkedIds.push(id)
  linkSearch.value = ''
}

function removeLink(id: number) {
  if (!form.value) return
  form.value.linkedIds = form.value.linkedIds.filter(i => i !== id)
}

const isDirty = computed(() => {
  if (!form.value || !original) return false
  return JSON.stringify(form.value) !== JSON.stringify(original)
})

/* ---------- Carte ---------- */

const DEFAULT_CENTER: [number, number] = [5.4764, 10.4176]  // Bafoussam

async function setupMap() {
  if (!leaflet) {
    const L = await import('leaflet')
    leaflet = L.default ?? L
    await import('leaflet/dist/leaflet.css' as any)
  }
  const lat = form.value?.latitude ?? DEFAULT_CENTER[0]
  const lng = form.value?.longitude ?? DEFAULT_CENTER[1]

  if (!map) {
    map = leaflet.map('admin-map').setView([lat, lng], 14)
    leaflet.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap', maxZoom: 19,
    }).addTo(map)
    map.on('click', (e: any) => setPosition(e.latlng.lat, e.latlng.lng))
  } else {
    map.setView([lat, lng], 14)
    setTimeout(() => map.invalidateSize(), 100)
  }

  if (marker) map.removeLayer(marker)
  marker = leaflet.marker([lat, lng], { draggable: true }).addTo(map)
  marker.on('dragend', () => {
    const pos = marker.getLatLng()
    setPosition(pos.lat, pos.lng)
  })
  setTimeout(() => map.invalidateSize(), 150)
}

function setPosition(lat: number, lng: number) {
  if (!form.value) return
  form.value.latitude = Number(lat.toFixed(6))
  form.value.longitude = Number(lng.toFixed(6))
  if (marker) marker.setLatLng([lat, lng])
}

function syncMarkerFromInputs() {
  if (!form.value?.latitude || !form.value?.longitude || !map) return
  const pos: [number, number] = [form.value.latitude, form.value.longitude]
  if (marker) marker.setLatLng(pos)
  map.setView(pos, map.getZoom())
}

/* ---------- Édition ---------- */

function toggleInArray(arr: string[], value: string) {
  const index = arr.indexOf(value)
  if (index === -1) arr.push(value)
  else arr.splice(index, 1)
}

function toggleCategory(key: string) {
  if (!form.value) return
  form.value.categories[key] = !form.value.categories[key]
}

/* ---------- Sauvegarde ---------- */

async function save() {
  if (!form.value || selectedId.value == null || !original) return
  isSaving.value = true
  const id = selectedId.value
  try {
    // 1) Champs de la structure (PATCH partiel)
    const payload: Record<string, unknown> = {
      nom_structure: form.value.nom_structure,
      fonction_repondant: form.value.fonction_repondant,
      nom_repondant: form.value.nom_repondant,
      telephone_repondant: form.value.telephone_repondant,
      email: form.value.email || null,
      site_web: form.value.site_web || null,
      latitude: form.value.latitude,
      longitude: form.value.longitude,
      langues_parlees: form.value.langues_parlees,
      jours_ouverture: form.value.jours_ouverture,
      heures_ouverture: form.value.heures_ouverture ? `${form.value.heures_ouverture}:00` : null,
      gratuit: form.value.gratuit,
      statut: form.value.statut,
      linked_service_ids: form.value.linkedIds,
    }
    const updated = await $fetch<Service>(`${API_BASE}/api/question-transversale/${id}/`, {
      method: 'PATCH', body: payload,
    })

    // 2) Catégories : créer/supprimer les sous-enregistrements qui ont changé
    for (const cat of categoryMeta) {
      const wanted = form.value.categories[cat.key]
      const had = original.categories[cat.key]
      if (wanted === had) continue
      if (wanted) {
        await $fetch(`${API_BASE}/api/${cat.endpoint}/`, {
          method: 'POST', body: { question_transversale: id },
        })
      } else {
        const existing = services.value.find(s => s.id === id)?.[cat.key] as ServiceCategory | null
        if (existing?.id != null) {
          await $fetch(`${API_BASE}/api/${cat.endpoint}/${existing.id}/`, { method: 'DELETE' })
        }
      }
    }

    // 3) Rafraîchir l'entrée locale depuis la réponse serveur + recharger les catégories
    const fresh = await $fetch<Service>(`${API_BASE}/api/question-transversale/${id}/`)
    const index = services.value.findIndex(s => s.id === id)
    if (index !== -1) services.value[index] = fresh
    original = JSON.parse(JSON.stringify(form.value))
    dirtyIds.value.delete(id)
    showToast('ok', 'Service enregistré avec succès.')
  } catch (err: any) {
    const detail = err?.data ? JSON.stringify(err.data).slice(0, 120) : (err?.message || '')
    showToast('error', `Échec de l'enregistrement. ${detail}`)
  } finally {
    isSaving.value = false
  }
}

watch(isDirty, (dirty) => {
  if (selectedId.value == null) return
  if (dirty) dirtyIds.value.add(selectedId.value)
})

function showToast(type: 'ok' | 'error', message: string) {
  toast.value = { type, message }
  setTimeout(() => { toast.value = null }, type === 'error' ? 6000 : 3000)
}

onMounted(() => {
  try {
    if (localStorage.getItem(ACCESS_STORAGE_KEY) === '1') {
      unlocked.value = true
      loadServices()
    }
  } catch {}
})
</script>

<style scoped>
.lock-screen {
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}
.lock-card {
  width: 100%;
  max-width: 340px;
  text-align: center;
  background: white;
  border: 1px solid #f3f4f6;
  border-radius: 1.25rem;
  padding: 2rem 1.75rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}
:global(.dark) .lock-card { background: #27272a; border-color: #3f3f46; }
.lock-icon {
  width: 52px; height: 52px; margin: 0 auto 1rem;
  border-radius: 9999px;
  background: #ecfdf5; color: #059669;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.25rem;
}
:global(.dark) .lock-icon { background: rgba(16, 185, 129, 0.12); }
.unlock-btn {
  width: 100%;
  margin-top: 1rem;
  padding: 0.7rem;
  border-radius: 0.75rem;
  background: #059669;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.15s;
}
.unlock-btn:hover { background: #047857; }
.unlock-btn:active { transform: scale(0.98); }

.admin-page {
  height: 100dvh;
  display: flex;
  overflow: hidden;
}

.services-list {
  position: fixed;
  inset: 0 auto 0 0;
  width: 320px;
  max-width: 88vw;
  z-index: 40;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease;
}
@media (min-width: 768px) {
  .services-list { position: relative; z-index: auto; }
}

.editor {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100dvh;
}

.editor-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  flex-shrink: 0;
}

.save-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.15s;
}

.editor-body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  max-width: 780px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card {
  background: white;
  border: 1px solid #f3f4f6;
  border-radius: 1rem;
  padding: 1.25rem;
}
:global(.dark) .card { background: #27272a; border-color: #3f3f46; }

.section-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.75rem;
}
:global(.dark) .section-title { color: #f4f4f5; }

.field { display: flex; flex-direction: column; gap: 0.35rem; }
.field > span { font-size: 0.8rem; font-weight: 500; color: #6b7280; }
:global(.dark) .field > span { color: #a1a1aa; }

.input {
  padding: 0.6rem 0.8rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.6rem;
  font-size: 0.9rem;
  background: #f9fafb;
  color: #111827;
  transition: all 0.15s;
}
.input:focus { outline: none; border-color: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.12); }
:global(.dark) .input { background: #18181b; border-color: #3f3f46; color: #f4f4f5; }

.toggle {
  width: 48px; height: 28px; border-radius: 9999px; position: relative;
  transition: background 0.2s; flex-shrink: 0;
}
.toggle-on { background: #10b981; }
.toggle-off { background: #d1d5db; }
:global(.dark) .toggle-off { background: #52525b; }
.toggle-knob {
  position: absolute; top: 3px; left: 3px; width: 22px; height: 22px;
  background: white; border-radius: 9999px; transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}
.toggle-on .toggle-knob { transform: translateX(20px); }

.cat-chip, .day-chip {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.5rem 0.85rem; border-radius: 9999px;
  font-size: 0.8rem; font-weight: 600; border: 1px solid;
  transition: all 0.15s; cursor: pointer;
}
.cat-chip:active, .day-chip:active { transform: scale(0.94); }
.day-chip { padding: 0.4rem 0.7rem; }

.link-chip {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.4rem 0.7rem; border-radius: 9999px;
  font-size: 0.8rem; font-weight: 600;
  background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0;
}
.link-chip button {
  display: inline-flex; color: #047857; opacity: 0.7;
}
.link-chip button:hover { opacity: 1; }
:global(.dark) .link-chip { background: #052e22; color: #6ee7b7; border-color: #065f46; }

.link-results {
  position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 20;
  background: white; border: 1px solid #e5e7eb; border-radius: 0.6rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12); overflow: hidden; max-height: 220px; overflow-y: auto;
}
:global(.dark) .link-results { background: #18181b; border-color: #3f3f46; }
.link-results li button {
  display: block; width: 100%; text-align: left; padding: 0.6rem 0.8rem;
  font-size: 0.85rem; color: #1f2937;
}
.link-results li button:hover { background: #f3f4f6; }
:global(.dark) .link-results li button { color: #f4f4f5; }
:global(.dark) .link-results li button:hover { background: #27272a; }

.admin-map {
  height: 320px;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  z-index: 0;
}
:global(.dark) .admin-map { border-color: #3f3f46; }

.toast {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  z-index: 900; display: flex; align-items: center; gap: 0.5rem;
  color: white; font-weight: 600; font-size: 0.9rem;
  padding: 0.8rem 1.4rem; border-radius: 9999px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25); max-width: 90vw;
}
.toast-enter-active, .toast-leave-active { transition: all 0.3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 12px); }
</style>
