<template>
  <div class="services-page bg-gray-50 dark:bg-zinc-900">
    <!-- ===== Barre de recherche flottante ===== -->
    <div class="search-overlay">
      <div class="bg-white/95 dark:bg-zinc-800/95 backdrop-blur rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-700 p-3 space-y-2.5">
        <div class="flex gap-2">
          <div class="relative flex-1">
            <input
              v-model="searchQuery"
              type="search"
              aria-label="Rechercher un service par nom"
              placeholder="Nom d'un service…"
              class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-shadow"
            />
            <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            v-model="selectedArrondissement"
            aria-label="Filtrer par arrondissement"
            class="w-40 md:w-56 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="">📍 Les 9 arrondissements</option>
            <option v-for="zone in zoneOptions" :key="zone.name" :value="zone.name">
              {{ zone.name }} ({{ zone.count }})
            </option>
          </select>
        </div>

        <!-- Chips catégories avec compteurs live -->
        <div class="flex gap-1.5 overflow-x-auto pb-1 -mb-1 category-scroll">
          <button
            v-for="cat in categoriesWithCounts"
            :key="cat.value"
            @click="toggleCategory(cat.value)"
            :class="[
              'chip flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border',
              currentCategory === cat.value
                ? 'text-white border-transparent shadow-md scale-105'
                : 'bg-white dark:bg-zinc-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-zinc-600 hover:border-gray-300',
            ]"
            :style="currentCategory === cat.value ? { backgroundColor: cat.color } : {}"
          >
            <i :class="cat.icon" class="text-[11px]" :style="currentCategory !== cat.value ? { color: cat.color } : {}" />
            {{ cat.label }}
            <span
              class="px-1.5 py-0.5 rounded-full text-[10px] font-bold tabular-nums"
              :class="currentCategory === cat.value ? 'bg-white/25' : 'bg-gray-100 dark:bg-zinc-600'"
            >{{ cat.count }}</span>
          </button>
        </div>

        <!-- Filtres rapides + compteur animé + géoloc -->
        <div class="flex items-center gap-2 text-xs px-0.5 flex-wrap">
          <button
            @click="onlyOpenToday = !onlyOpenToday"
            :class="['chip px-2.5 py-1 rounded-full font-semibold border',
              onlyOpenToday
                ? 'bg-emerald-600 text-white border-transparent shadow-sm'
                : 'bg-white dark:bg-zinc-700 text-gray-500 dark:text-gray-300 border-gray-200 dark:border-zinc-600']"
          >
            🕐 Ouvert aujourd'hui
          </button>
          <button
            @click="onlyFree = !onlyFree"
            :class="['chip px-2.5 py-1 rounded-full font-semibold border',
              onlyFree
                ? 'bg-emerald-600 text-white border-transparent shadow-sm'
                : 'bg-white dark:bg-zinc-700 text-gray-500 dark:text-gray-300 border-gray-200 dark:border-zinc-600']"
          >
            💚 Gratuit
          </button>

          <span class="flex-1" />

          <transition name="fade">
            <button
              v-if="hasActiveFilters"
              @click="resetFilters"
              class="chip text-gray-400 hover:text-red-500 font-medium underline decoration-dotted"
            >
              Réinitialiser
            </button>
          </transition>

          <span class="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {{ animatedCount }} service{{ animatedCount > 1 ? 's' : '' }}
          </span>

          <button
            v-if="!userPosition"
            @click="locate"
            :disabled="isLocating"
            class="chip flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold disabled:opacity-50"
          >
            <svg class="w-3.5 h-3.5" :class="{ 'animate-spin': isLocating }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {{ isLocating ? '…' : 'Me localiser' }}
          </button>
          <span v-else class="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Position
          </span>
        </div>
      </div>
    </div>

    <!-- ===== Carte plein écran ===== -->
    <div id="map" class="map-container" />

    <!-- État vide -->
    <transition name="pop">
      <div v-if="!loading && !filteredServices.length" class="empty-state dark:bg-zinc-800">
        <span class="text-4xl mb-2">🔎</span>
        <p class="font-semibold text-gray-700 dark:text-gray-200 mb-1">Aucun service trouvé</p>
        <p class="text-sm text-gray-400 mb-4">Essaie d'élargir tes critères.</p>
        <button @click="resetFilters" class="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition active:scale-95">
          Tout afficher
        </button>
      </div>
    </transition>

    <!-- Chargement -->
    <div v-if="loading" class="absolute inset-0 z-[500] flex items-center justify-center bg-white/70 dark:bg-zinc-900/70">
      <div class="flex flex-col items-center gap-3">
        <div class="animate-spin rounded-full h-9 w-9 border-[3px] border-emerald-500 border-t-transparent" />
        <p class="text-sm text-gray-600 dark:text-gray-300">Chargement des services…</p>
      </div>
    </div>

    <!-- Erreur -->
    <div v-if="error" class="absolute top-44 left-1/2 -translate-x-1/2 z-[500] bg-red-50 dark:bg-red-900/60 text-red-700 dark:text-red-200 text-sm px-4 py-2.5 rounded-xl shadow">
      {{ error }}
    </div>

    <!-- ===== Bouton liste (mobile) ===== -->
    <button v-if="!selectedService && filteredServices.length" @click="showList = true" class="list-fab md:hidden">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
      Liste ({{ filteredServices.length }})
    </button>

    <!-- ===== Panneau liste ===== -->
    <transition name="sheet">
      <div v-if="showList" class="list-panel bg-white dark:bg-zinc-800" @click.self="showList = false">
        <div class="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-100 dark:border-zinc-700">
          <div class="sheet-handle md:hidden" />
          <h2 class="font-semibold text-gray-800 dark:text-white text-sm">
            {{ filteredServices.length }} service{{ filteredServices.length > 1 ? 's' : '' }}
            <span v-if="selectedArrondissement"> — {{ selectedArrondissement }}</span>
            <span v-if="isRoutingLoading" class="ml-2 text-[11px] font-medium text-blue-500 animate-pulse">
              🛣 calcul des trajets…
            </span>
          </h2>
          <button @click="showList = false" class="p-2 text-gray-400 hover:text-gray-600" aria-label="Fermer la liste">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="overflow-y-auto flex-1 divide-y divide-gray-50 dark:divide-zinc-700">
          <p v-if="!sortedServices.length" class="p-6 text-center text-sm text-gray-400">
            Aucun service ne correspond à ces critères.
          </p>
          <button
            v-for="(service, index) in sortedServices"
            :key="service.id"
            @click="selectService(service); showList = false"
            class="list-item w-full text-left px-4 py-3.5 hover:bg-emerald-50/50 dark:hover:bg-zinc-700/50 transition group"
            :style="{ animationDelay: `${Math.min(index * 30, 300)}ms` }"
          >
            <div class="flex items-start justify-between gap-2">
              <h3 class="font-medium text-gray-800 dark:text-white text-sm leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                {{ service.nom_structure }}
              </h3>
              <span v-if="effectiveDistance(service) !== undefined" class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold whitespace-nowrap text-right">
                <template v-if="roadInfo[service.id]">
                  🛣 {{ formatDistance(roadInfo[service.id].km) }}
                  <span class="block text-[10px] font-medium text-gray-400">≈ {{ formatDuration(roadInfo[service.id].min) }}</span>
                </template>
                <template v-else>{{ formatDistance(effectiveDistance(service)!) }}</template>
              </span>
            </div>
            <div class="flex flex-wrap items-center gap-1.5 mt-1.5">
              <span
                v-for="cat in serviceCategories(service)"
                :key="cat.value"
                class="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full"
                :style="{ backgroundColor: cat.color + '18', color: cat.color }"
              >
                <i :class="cat.icon" class="text-[9px]" />{{ cat.label }}
              </span>
              <span v-if="isOpenToday(service)" class="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300">
                Ouvert auj.
              </span>
              <span v-if="!service.statut" class="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300">
                À confirmer
              </span>
              <span v-if="service.arrondissement" class="text-[11px] text-gray-400">📍 {{ service.arrondissement }}</span>
            </div>
          </button>
        </div>
      </div>
    </transition>

    <!-- ===== Fiche service ===== -->
    <transition name="sheet">
      <div v-if="selectedService" class="service-sheet bg-white dark:bg-zinc-800">
        <div class="sheet-handle mx-auto mt-2.5 md:hidden" />
        <div class="px-5 pt-3 pb-5 overflow-y-auto">
          <div class="flex items-start justify-between gap-3 mb-1">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white leading-snug">
              {{ selectedService.nom_structure }}
            </h2>
            <button @click="selectedService = null" class="p-1.5 -mr-1.5 text-gray-400 hover:text-gray-600 flex-shrink-0" aria-label="Fermer">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="flex flex-wrap items-center gap-1.5 mb-4">
            <span
              v-for="cat in serviceCategories(selectedService)"
              :key="cat.value"
              class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
              :style="{ backgroundColor: cat.color + '18', color: cat.color }"
            >
              <i :class="cat.icon" class="text-[10px]" />{{ cat.label }}
            </span>
            <span v-if="isFree(selectedService)" class="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
              Gratuit
            </span>
            <span v-if="isOpenToday(selectedService)" class="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
              🕐 Ouvert aujourd'hui
            </span>
            <span v-if="!selectedService.statut" class="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
              ⚠️ Disponibilité à confirmer
            </span>
            <span v-if="roadInfo[selectedService.id]" class="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              🛣 {{ formatDistance(roadInfo[selectedService.id].km) }} par la route · ≈ {{ formatDuration(roadInfo[selectedService.id].min) }}
            </span>
            <span v-else-if="selectedService.distance !== undefined" class="text-xs text-gray-500 dark:text-gray-400">
              à {{ formatDistance(selectedService.distance) }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-3 mb-4">
            <a
              v-if="selectedService.telephone_repondant"
              :href="`tel:${cleanPhone(selectedService.telephone_repondant)}`"
              class="action-btn bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Appeler
            </a>
            <a
              :href="`https://www.google.com/maps/dir//${selectedService.latitude},${selectedService.longitude}`"
              target="_blank"
              rel="noopener"
              class="action-btn bg-blue-600 hover:bg-blue-700 text-white"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.293 2.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 8H5a1 1 0 110-2h9.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" transform="rotate(45 10 10)" />
              </svg>
              Itinéraire
            </a>
          </div>

          <dl class="space-y-2.5 text-sm">
            <div v-if="selectedService.telephone_repondant" class="detail-row">
              <dt>Téléphone</dt>
              <dd class="font-semibold">{{ selectedService.telephone_repondant }}</dd>
            </div>
            <div v-if="openingLabel(selectedService)" class="detail-row">
              <dt>Horaires</dt>
              <dd>{{ openingLabel(selectedService) }}</dd>
            </div>
            <div v-if="selectedService.arrondissement || selectedService.region" class="detail-row">
              <dt>Zone</dt>
              <dd>{{ [selectedService.arrondissement, selectedService.region].filter(Boolean).join(', ') }}</dd>
            </div>
            <div v-if="selectedService.langues_parlees?.length" class="detail-row">
              <dt>Langues</dt>
              <dd>{{ selectedService.langues_parlees.join(', ') }}</dd>
            </div>
            <div v-if="selectedService.nom_repondant" class="detail-row">
              <dt>Contact</dt>
              <dd>{{ [selectedService.fonction_repondant, selectedService.nom_repondant].filter(Boolean).join(' — ') }}</dd>
            </div>
            <div v-if="selectedService.email" class="detail-row">
              <dt>Email</dt>
              <dd><a :href="`mailto:${selectedService.email}`" class="text-emerald-600 dark:text-emerald-400 underline">{{ selectedService.email }}</a></dd>
            </div>
          </dl>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import arrondissementMap from '~/assets/data/arrondissements.json'
// Instantané des services embarqué dans le bundle (voir tools/update_services_snapshot.mjs) :
// les services changent rarement, donc pas besoin d'attendre un aller-retour réseau vers
// l'API (parfois lente, parfois carrément indisponible) avant le premier rendu de la carte.
import servicesSnapshot from '~/assets/data/services-snapshot.json'
import { SITE_URL, SITE_DEFAULT_OG_IMAGE } from '~/utils/site'

useHead({
  title: 'Trouver un service — childsafe',
  meta: [
    { name: 'description', content: 'Carte interactive des services d\'aide aux victimes au Cameroun : soutien psychologique, soins médicaux, aide juridique, hébergement d\'urgence, sécurité, santé mentale, réinsertion économique — filtrable par zone et catégorie.' },
    { property: 'og:title', content: 'Trouver un service — childsafe' },
    { property: 'og:description', content: 'Carte interactive des services d\'aide aux victimes, filtrable par zone et catégorie.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `${SITE_URL}/services` },
    { property: 'og:image', content: SITE_DEFAULT_OG_IMAGE },
  ],
  link: [{ rel: 'canonical', href: `${SITE_URL}/services` }],
})

interface Service {
  id: number
  nom_structure: string
  latitude: string | number
  longitude: string | number
  statut: boolean
  soins_medicaux: unknown
  appui_psychosocial: unknown
  police_securite: unknown
  assistance_juridique: unknown
  sante_mentale: unknown
  reinsertion_economique: unknown
  hebergement: unknown
  telephone_repondant: string
  nom_repondant: string
  fonction_repondant?: string | null
  email?: string | null
  site_web?: string | null
  langues_parlees?: string[] | null
  jours_ouverture?: string[] | null
  heures_ouverture?: string | null
  gratuit?: string | boolean | null
  region?: string | null
  departement?: string | null
  arrondissement?: string | null
  distance?: number
}

const API_URL = 'https://wilfriedtayou.pythonanywhere.com/api/question-transversale/'
const CACHE_KEY = 'services_cache_v3'
// Les services changent rarement (mises à jour manuelles occasionnelles) : un cache
// de quelques heures évite de re-télécharger 300+ services à chaque visite sans
// risquer d'afficher des données très périmées.
const CACHE_DURATION = 6 * 60 * 60 * 1000

// Les 9 arrondissements couverts par la plateforme
const ZONES = [
  'Bafoussam 1', 'Bafoussam 2', 'Bafoussam 3',
  'Foumbot', 'Foumban', 'Koutaba',
  'Ngaoundere 1', 'Ngaoundere 2', 'Ngaoundere 3',
]

const categories = [
  { value: 'soins_medicaux', label: 'Soins médicaux', color: '#dc2626', icon: 'fas fa-hospital' },
  { value: 'appui_psychosocial', label: 'Appui psychosocial', color: '#ca8a04', icon: 'fas fa-hands-helping' },
  { value: 'police_securite', label: 'Police / Sécurité', color: '#16a34a', icon: 'fas fa-shield-alt' },
  { value: 'assistance_juridique', label: 'Aide juridique', color: '#2563eb', icon: 'fas fa-balance-scale' },
  { value: 'sante_mentale', label: 'Santé mentale', color: '#7c3aed', icon: 'fas fa-brain' },
  { value: 'reinsertion_economique', label: 'Réinsertion', color: '#ea580c', icon: 'fas fa-briefcase' },
  { value: 'hebergement', label: 'Hébergement', color: '#db2777', icon: 'fas fa-house-user' },
] as const

const DAY_NAMES = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']

const loading = ref(true)
const error = ref<string | null>(null)
const services = ref<Service[]>([])
const selectedService = ref<Service | null>(null)
const currentCategory = ref('')
const searchQuery = ref('')
const debouncedSearchQuery = ref('')
let searchDebounce: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, (value) => {
  if (searchDebounce) clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => { debouncedSearchQuery.value = value }, 250)
})
const selectedArrondissement = ref('')
const onlyOpenToday = ref(false)
const onlyFree = ref(false)
const userPosition = ref<[number, number] | null>(null)
const isLocating = ref(false)
const showList = ref(false)
const animatedCount = ref(0)

let map: any = null
let clusterGroup: any = null
let leaflet: any = null
let userMarker: any = null
const serviceIdToMarker = new Map<number, any>()

/* ---------- Utilitaires données ---------- */

const normalizeCache = new Map<string, string>()
function normalize(text: string): string {
  const key = text || ''
  const cached = normalizeCache.get(key)
  if (cached !== undefined) return cached
  const result = key.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
  normalizeCache.set(key, result)
  return result
}

function cleanPhone(phone: string): string {
  return (phone || '').replace(/[^\d+]/g, '')
}

function coordsOf(service: Service): [number, number] | null {
  const lat = parseFloat(service.latitude as string)
  const lng = parseFloat(service.longitude as string)
  if (isNaN(lat) || isNaN(lng)) return null
  // Coordonnées hors du Cameroun = donnée erronée
  if (lat < 1.5 || lat > 13.5 || lng < 8 || lng > 16.5) return null
  return [lat, lng]
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function formatDistance(distance: number): string {
  return distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  return `${hours} h ${String(minutes % 60).padStart(2, '0')}`
}

/** Retire les doublons (même nom normalisé à moins de 500 m). */
function dedupe(list: Service[]): Service[] {
  const kept: Service[] = []
  for (const service of list) {
    const point = coordsOf(service)
    const isDuplicate = kept.some(other => {
      if (normalize(other.nom_structure) !== normalize(service.nom_structure)) return false
      const otherPoint = coordsOf(other)
      if (!point || !otherPoint) return true
      return haversine(point[0], point[1], otherPoint[0], otherPoint[1]) < 0.5
    })
    if (!isDuplicate) kept.push(service)
  }
  return kept
}

/** Complète l'arrondissement manquant via le mapping géocodé embarqué. */
function enrichArrondissement(service: Service): Service {
  const corrected = (arrondissementMap as Record<string, string>)[String(service.id)]
  if (corrected && !(service.arrondissement || '').trim()) {
    service.arrondissement = corrected
  }
  return service
}

function serviceCategories(service: Service) {
  return categories.filter(cat => (service as any)[cat.value])
}

function isFree(service: Service): boolean {
  const value = service.gratuit
  if (typeof value === 'boolean') return value
  return normalize(String(value ?? '')).includes('gratuit')
}

function isOpenToday(service: Service): boolean {
  const days = service.jours_ouverture
  if (!days?.length) return false
  const today = DAY_NAMES[new Date().getDay()]
  return days.some(day => normalize(day) === today)
}

function openingLabel(service: Service): string {
  const days = service.jours_ouverture?.length ? service.jours_ouverture.join(', ') : ''
  const hours = service.heures_ouverture && service.heures_ouverture !== '00:00:00'
    ? `à partir de ${service.heures_ouverture.slice(0, 5)}` : ''
  return [days, hours].filter(Boolean).join(' — ')
}

/* ---------- Filtres ---------- */

function matchesStaticFilters(service: Service, ignoreCategory = false): boolean {
  if (!ignoreCategory && currentCategory.value && !(service as any)[currentCategory.value]) return false
  if (selectedArrondissement.value && normalize(service.arrondissement || '') !== normalize(selectedArrondissement.value)) return false
  if (onlyOpenToday.value && !isOpenToday(service)) return false
  if (onlyFree.value && !isFree(service)) return false
  if (debouncedSearchQuery.value.trim()) {
    const query = normalize(debouncedSearchQuery.value)
    const matches = normalize(service.nom_structure).includes(query)
      || normalize(service.arrondissement || '').includes(query)
      || serviceCategories(service).some(cat => normalize(cat.label).includes(query))
    if (!matches) return false
  }
  return true
}

const filteredServices = computed(() => services.value.filter(s => matchesStaticFilters(s)))

const categoriesWithCounts = computed(() =>
  categories.map(cat => ({
    ...cat,
    count: services.value.filter(s => (s as any)[cat.value] && matchesStaticFilters(s, true)).length,
  }))
)

const zoneOptions = computed(() =>
  ZONES.map(name => ({
    name,
    count: services.value.filter(s => normalize(s.arrondissement || '') === normalize(name)).length,
  })).filter(zone => zone.count > 0)
)

/* ---------- Distances routières (OSRM) ---------- */

// Distances par la route calculées via OSRM : id service → { km, min }
const roadInfo = ref<Record<number, { km: number; min: number }>>({})
const isRoutingLoading = ref(false)
let routingRequestId = 0

/** Distance effective : par la route si connue, sinon à vol d'oiseau. */
function effectiveDistance(service: Service): number | undefined {
  return roadInfo.value[service.id]?.km ?? service.distance
}

/** Calcule les distances routières des 24 services les plus proches (à vol
 * d'oiseau) via l'API table d'OSRM, en une seule requête. Repli silencieux
 * sur le vol d'oiseau si le serveur ne répond pas. */
async function fetchRoadDistances() {
  if (!userPosition.value) return
  const [userLat, userLng] = userPosition.value

  const nearest = [...filteredServices.value]
    .filter(s => s.distance !== undefined && coordsOf(s))
    .sort((a, b) => a.distance! - b.distance!)
    .slice(0, 24)
  if (!nearest.length) return

  const requestId = ++routingRequestId
  isRoutingLoading.value = true
  try {
    const coordinates = [`${userLng},${userLat}`]
    for (const service of nearest) {
      const [lat, lng] = coordsOf(service)!
      coordinates.push(`${lng},${lat}`)
    }
    const url = `https://router.project-osrm.org/table/v1/driving/${coordinates.join(';')}`
      + '?sources=0&annotations=distance,duration'
    const response = await fetch(url)
    if (!response.ok) throw new Error(`OSRM ${response.status}`)
    const data = await response.json()
    if (requestId !== routingRequestId) return   // une requête plus récente a pris le relais

    const updated: Record<number, { km: number; min: number }> = {}
    nearest.forEach((service, index) => {
      const meters = data.distances?.[0]?.[index + 1]
      const seconds = data.durations?.[0]?.[index + 1]
      if (typeof meters === 'number' && meters > 0) {
        updated[service.id] = { km: meters / 1000, min: Math.max(1, Math.round((seconds || 0) / 60)) }
      }
    })
    roadInfo.value = updated
  } catch {
    // OSRM indisponible : on garde le tri à vol d'oiseau, sans bruit pour l'utilisateur
  } finally {
    if (requestId === routingRequestId) isRoutingLoading.value = false
  }
}

// Recalcule (débouncé) quand la position ou les filtres changent
let routingDebounce: ReturnType<typeof setTimeout> | null = null
watch([userPosition, filteredServices], () => {
  if (!userPosition.value) return
  if (routingDebounce) clearTimeout(routingDebounce)
  routingDebounce = setTimeout(fetchRoadDistances, 600)
})

const sortedServices = computed(() => {
  if (!userPosition.value) return filteredServices.value
  return [...filteredServices.value].sort(
    (a, b) => (effectiveDistance(a) ?? Infinity) - (effectiveDistance(b) ?? Infinity)
  )
})

const hasActiveFilters = computed(() =>
  Boolean(currentCategory.value || selectedArrondissement.value || debouncedSearchQuery.value || onlyOpenToday.value || onlyFree.value)
)

function toggleCategory(value: string) {
  currentCategory.value = currentCategory.value === value ? '' : value
}

function resetFilters() {
  currentCategory.value = ''
  selectedArrondissement.value = ''
  searchQuery.value = ''
  debouncedSearchQuery.value = ''
  onlyOpenToday.value = false
  onlyFree.value = false
}

/* Compteur animé (ease-out cubique) */
watch(filteredServices, (list) => {
  const target = list.length
  const start = animatedCount.value
  if (start === target) return
  const startTime = performance.now()
  const duration = 450
  function tick(now: number) {
    const progress = Math.min((now - startTime) / duration, 1)
    animatedCount.value = Math.round(start + (target - start) * (1 - (1 - progress) ** 3))
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})

/* ---------- Carte ---------- */

// Zoom à partir duquel les noms des services s'affichent sous les épingles
const LABEL_ZOOM = 14

// WCAG 2.3.3 : pas d'animations pour qui les désactive dans son système
const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function flyDuration(base: number): number {
  return prefersReducedMotion() ? 0 : base
}

function labelText(service: Service): string {
  const name = service.nom_structure.trim()
  return name.length > 26 ? `${name.slice(0, 24)}…` : name
}

/** Étiquette permanente (pattern Google Maps POI) : nom sous l'épingle,
 * masquée en dessous de LABEL_ZOOM via la classe CSS labels-hidden. */
function bindLabel(marker: any, service: Service, active = false) {
  marker.unbindTooltip()
  marker.bindTooltip(labelText(service), {
    permanent: true,
    direction: 'bottom',
    offset: [0, 2],
    className: `marker-label${active ? ' marker-label-active' : ''}`,
    opacity: 1,
  })
}

function updateLabelVisibility() {
  if (!map) return
  map.getContainer().classList.toggle('labels-hidden', map.getZoom() < LABEL_ZOOM)
}

function markerIcon(service: Service, highlighted = false) {
  const primary = serviceCategories(service)[0]
  const color = primary?.color || '#4b5563'
  const icon = primary?.icon || 'fas fa-map-marker-alt'
  return leaflet.divIcon({
    className: 'custom-marker',
    html: `<div class="marker-pin marker-drop ${highlighted ? 'marker-active' : ''}" style="background:${color}"><i class="${icon}"></i></div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
  })
}

function rebuildMarkers() {
  if (!map || !clusterGroup) return
  clusterGroup.clearLayers()
  serviceIdToMarker.clear()

  filteredServices.value.forEach(service => {
    const point = coordsOf(service)
    if (!point) return
    const marker = leaflet.marker(point, {
      icon: markerIcon(service),
      alt: service.nom_structure,   // texte alternatif pour lecteurs d'écran
    })
    bindLabel(marker, service)
    marker.on('click', () => selectService(service))
    clusterGroup.addLayer(marker)
    serviceIdToMarker.set(service.id, marker)
  })

  if (filteredServices.value.length && hasActiveFilters.value) {
    const bounds = clusterGroup.getBounds()
    if (bounds.isValid()) map.flyToBounds(bounds, { padding: [70, 70], maxZoom: 13, duration: flyDuration(0.8) })
  }
}

watch([currentCategory, selectedArrondissement, debouncedSearchQuery, onlyOpenToday, onlyFree], () => {
  selectedService.value = null
  rebuildMarkers()
})

function selectService(service: Service) {
  // Remet le marqueur précédemment sélectionné à la normale
  if (selectedService.value) {
    const previous = serviceIdToMarker.get(selectedService.value.id)
    if (previous) {
      previous.setIcon(markerIcon(selectedService.value))
      bindLabel(previous, selectedService.value)
    }
  }
  selectedService.value = service
  const point = coordsOf(service)
  if (!point || !map) return
  const marker = serviceIdToMarker.get(service.id)
  if (marker) {
    marker.setIcon(markerIcon(service, true))
    bindLabel(marker, service, true)   // étiquette toujours visible pour la sélection
  }
  if (marker && clusterGroup?.zoomToShowLayer) {
    clusterGroup.zoomToShowLayer(marker, () => map.flyTo(point, Math.max(map.getZoom(), 15), { duration: flyDuration(0.7) }))
  } else {
    map.flyTo(point, 15, { duration: flyDuration(0.7) })
  }
}

/* ---------- Géolocalisation ---------- */

async function locate() {
  if (!('geolocation' in navigator)) return
  isLocating.value = true
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 8000 })
    )
    const { latitude, longitude } = position.coords
    userPosition.value = [latitude, longitude]

    services.value = services.value.map(service => {
      const point = coordsOf(service)
      return point ? { ...service, distance: haversine(latitude, longitude, point[0], point[1]) } : service
    })

    // Déduit l'arrondissement le plus proche et pré-remplit le filtre
    const nearest = services.value
      .filter(s => s.arrondissement?.trim() && s.distance !== undefined)
      .sort((a, b) => a.distance! - b.distance!)[0]
    if (nearest?.arrondissement && !selectedArrondissement.value) {
      selectedArrondissement.value = ZONES.find(z => normalize(z) === normalize(nearest.arrondissement!)) || ''
    }

    if (map) {
      if (userMarker) map.removeLayer(userMarker)
      userMarker = leaflet.marker([latitude, longitude], {
        icon: leaflet.divIcon({ className: 'user-location-marker', html: '<div class="ping"></div>', iconSize: [20, 20] }),
      }).addTo(map)
      map.flyTo([latitude, longitude], 13, { duration: flyDuration(0.8) })
    }
  } catch {
    error.value = "Position indisponible. Vérifie l'autorisation de géolocalisation."
    setTimeout(() => { error.value = null }, 4000)
  } finally {
    isLocating.value = false
  }
}

/* ---------- Chargement ---------- */

function readCache(): Service[] | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null
    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp > CACHE_DURATION) return null
    return data
  } catch { return null }
}

// TOUS les services (actifs comme à confirmer), sans entrées de test, dédupliqués,
// arrondissements complétés par le géocodage embarqué — appliqué uniformément que
// la donnée vienne de l'instantané statique embarqué ou d'un fetch live de l'API.
function processServices(raw: unknown): Service[] {
  return dedupe(
    (Array.isArray(raw) ? raw : [])
      .filter((s: Service) => !normalize(s.nom_structure).includes('test'))
      .map(enrichArrondissement)
  )
}

/** Rafraîchit les données depuis l'API en arrière-plan, sans bloquer le rendu déjà
 * affiché (instantané statique ou cache localStorage) : les services changeant
 * rarement, un échec silencieux ici (API lente/indisponible) n'est pas grave — on
 * garde simplement ce qui est déjà affiché plutôt que de faire attendre l'utilisateur
 * ou d'afficher une erreur pour une donnée déjà utilisable. */
async function refreshServicesInBackground() {
  try {
    const response = await fetch(API_URL, { headers: { Accept: 'application/json' } })
    const data = await response.json()
    services.value = processServices(data)
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data: services.value, timestamp: Date.now() })) } catch {}
    if (map && clusterGroup) rebuildMarkers()
  } catch (err) {
    console.error('Rafraîchissement des services en arrière-plan échoué, données déjà affichées conservées :', err)
  }
}

onMounted(async () => {
  // Pré-filtre depuis la page d'accueil (/services?cat=hebergement)
  const requestedCategory = useRoute().query.cat as string | undefined
  if (requestedCategory && categories.some(c => c.value === requestedCategory)) {
    currentCategory.value = requestedCategory
  }

  try {
    // Rendu instantané avec le cache localStorage si encore valide, sinon avec
    // l'instantané statique embarqué (assets/data/services-snapshot.json) — dans
    // les deux cas, zéro attente réseau avant le premier affichage de la carte.
    const cached = readCache()
    services.value = cached ?? processServices(servicesSnapshot)
    animatedCount.value = services.value.length

    const L = await import('leaflet')
    leaflet = L.default ?? L
    await import('leaflet/dist/leaflet.css' as any)
    await import('leaflet.markercluster' as any)
    await import('leaflet.markercluster/dist/MarkerCluster.css' as any)
    await import('leaflet.markercluster/dist/MarkerCluster.Default.css' as any)
    await nextTick()

    map = leaflet.map('map', {
      center: [6.4, 11.5],
      zoom: 7,
      minZoom: 5,
      maxZoom: 18,
      zoomControl: false,
      preferCanvas: true,
    })
    leaflet.control.zoom({
      position: 'bottomright',
      zoomInTitle: 'Zoomer',
      zoomOutTitle: 'Dézoomer',
    }).addTo(map)

    // Échelle graphique — norme cartographique de base
    leaflet.control.scale({ metric: true, imperial: false, position: 'bottomleft' }).addTo(map)

    // Légende repliable — consultable à tout moment (norme d'accessibilité)
    const LegendControl = leaflet.Control.extend({
      onAdd() {
        const container = leaflet.DomUtil.create('div', 'legend-control leaflet-bar')
        container.innerHTML = `
          <button class="legend-toggle" aria-label="Afficher la légende" aria-expanded="false">
            <i class="fas fa-list-ul"></i>
          </button>
          <div class="legend-body" hidden>
            <p class="legend-title">Types de services</p>
            ${categories.map(cat => `
              <div class="legend-row">
                <span class="legend-dot" style="background:${cat.color}"><i class="${cat.icon}"></i></span>
                ${cat.label}
              </div>`).join('')}
          </div>`
        leaflet.DomEvent.disableClickPropagation(container)
        const toggle = container.querySelector('.legend-toggle') as HTMLButtonElement
        const body = container.querySelector('.legend-body') as HTMLElement
        toggle.addEventListener('click', () => {
          const isOpen = !body.hidden
          body.hidden = isOpen
          toggle.setAttribute('aria-expanded', String(!isOpen))
        })
        return container
      },
    })
    new LegendControl({ position: 'bottomright' }).addTo(map)

    leaflet.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 18,
    }).addTo(map)

    clusterGroup = (leaflet as any).markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      disableClusteringAtZoom: LABEL_ZOOM,   // dès que les noms s'affichent, plus de clusters
      chunkedLoading: true,
      maxClusterRadius: 55,
    })
    clusterGroup.addTo(map)

    map.on('zoomend', updateLabelVisibility)
    updateLabelVisibility()

    rebuildMarkers()
    const bounds = clusterGroup.getBounds()
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 })

    // Cache expiré ou absent : on va chercher des données à jour en arrière-plan,
    // sans faire attendre l'utilisateur (la carte est déjà utilisable).
    if (!cached) refreshServicesInBackground()
  } catch (err) {
    console.error(err)
    error.value = 'Impossible de charger les services. Réessaie plus tard.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.services-page {
  position: relative;
  height: calc(100dvh - 64px);
  margin-top: 64px;
  overflow: hidden;
}

.map-container {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.search-overlay {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  z-index: 600;
  max-width: 580px;
  margin: 0 auto;
}

.category-scroll { scrollbar-width: none; }
.category-scroll::-webkit-scrollbar { display: none; }

/* Micro-interactions génériques */
.chip {
  transition: all 0.16s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.chip:active { transform: scale(0.92); }

/* État vide */
.empty-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -30%);
  z-index: 550;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: 1.5rem;
  padding: 2rem 2.5rem;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.list-fab {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #111827;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.65rem 1.3rem;
  border-radius: 9999px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  transition: transform 0.15s;
}
.list-fab:active { transform: translateX(-50%) scale(0.94); }

.list-panel {
  position: absolute;
  z-index: 700;
  display: flex;
  flex-direction: column;
  inset: auto 0 0 0;
  height: 65dvh;
  border-radius: 1.25rem 1.25rem 0 0;
  box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.15);
}

@media (min-width: 768px) {
  .list-panel {
    inset: 12px auto 12px 12px;
    width: 360px;
    height: auto;
    border-radius: 1rem;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
}

/* Apparition en cascade des items de liste */
.list-item {
  animation: list-in 0.35s both cubic-bezier(0.21, 1.02, 0.73, 1);
}
@keyframes list-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.service-sheet {
  position: absolute;
  z-index: 800;
  inset: auto 0 0 0;
  max-height: 70dvh;
  display: flex;
  flex-direction: column;
  border-radius: 1.25rem 1.25rem 0 0;
  box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.18);
}

@media (min-width: 768px) {
  .service-sheet {
    inset: auto 16px 16px auto;
    width: 400px;
    border-radius: 1rem;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
}

.sheet-handle {
  width: 42px;
  height: 4px;
  border-radius: 9999px;
  background: #d1d5db;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem;
  border-radius: 0.9rem;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.15s;
}
.action-btn:active { transform: scale(0.97); }

.detail-row { display: flex; gap: 0.75rem; }
.detail-row dt { width: 84px; flex-shrink: 0; color: #9ca3af; }
.detail-row dd { color: #1f2937; }
:global(.dark) .detail-row dd { color: #e5e7eb; }

.sheet-enter-active, .sheet-leave-active { transition: all 0.28s cubic-bezier(0.32, 0.72, 0, 1); }
.sheet-enter-from, .sheet-leave-to { transform: translateY(100%); opacity: 0.5; }
@media (min-width: 768px) {
  .sheet-enter-from, .sheet-leave-to { transform: translateY(16px); opacity: 0; }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.pop-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.pop-leave-active { transition: all 0.15s; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: translate(-50%, -30%) scale(0.8); }
</style>

<style>
/* Styles globaux Leaflet (non scopés) */
.custom-marker { background: none; border: none; }

.marker-pin {
  width: 38px;
  height: 38px;
  border-radius: 50% 50% 50% 4px;
  transform: rotate(-45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: 2.5px solid white;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}
.marker-pin:hover {
  transform: rotate(-45deg) scale(1.15);
  box-shadow: 0 5px 14px rgba(0, 0, 0, 0.4);
}
.marker-pin i {
  transform: rotate(45deg);
  font-size: 0.95rem;
}

/* Apparition des marqueurs */
.marker-drop {
  animation: marker-drop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes marker-drop {
  from { transform: rotate(-45deg) scale(0); opacity: 0; }
  to { transform: rotate(-45deg) scale(1); opacity: 1; }
}

/* Marqueur sélectionné : pulsation */
.marker-active {
  transform: rotate(-45deg) scale(1.25);
  animation: marker-pulse 1.6s infinite;
}
@keyframes marker-pulse {
  0%, 100% { box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.35), 0 6px 16px rgba(0, 0, 0, 0.4); }
  50% { box-shadow: 0 0 0 9px rgba(16, 185, 129, 0.12), 0 6px 16px rgba(0, 0, 0, 0.4); }
}

/* Étiquettes de nom sous les épingles (pattern Google Maps POI) */
.marker-label {
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 9999px;
  padding: 2px 9px;
  font-size: 11px;
  font-weight: 600;
  color: #1f2937;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.25);
  white-space: nowrap;
  pointer-events: none;
}
.marker-label::before { display: none; }   /* pas de flèche de tooltip */

.marker-label-active {
  background: #059669;
  color: white;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(5, 150, 105, 0.5);
}

/* En dessous du zoom seuil, seules les étiquettes du service sélectionné restent */
.labels-hidden .marker-label:not(.marker-label-active) { display: none; }

.dark .marker-label {
  background: rgba(39, 39, 42, 0.95);
  color: #e5e7eb;
}
.dark .marker-label-active {
  background: #059669;
  color: white;
}

.user-location-marker { position: relative; }
.user-location-marker .ping {
  width: 18px;
  height: 18px;
  background: #3b82f6;
  border: 3px solid white;
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
}
.user-location-marker .ping::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: #3b82f6;
  animation: user-ping 1.6s ease-out infinite;
  z-index: -1;
}
@keyframes user-ping {
  0% { transform: scale(1); opacity: 0.7; }
  100% { transform: scale(2.6); opacity: 0; }
}

/* Légende repliable (norme cartographique) */
.legend-control {
  background: white;
  border-radius: 12px !important;
  border: none !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}
.legend-toggle {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
  font-size: 0.85rem;
  cursor: pointer;
}
.legend-body {
  padding: 10px 14px 12px;
  min-width: 175px;
}
.legend-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #6b7280;
  margin: 0 0 8px;
}
.legend-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #1f2937;
  padding: 3px 0;
}
.legend-dot {
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 9px;
  flex-shrink: 0;
}
.dark .legend-control { background: #27272a; }
.dark .legend-toggle { color: #d4d4d8; }
.dark .legend-title { color: #a1a1aa; }
.dark .legend-row { color: #e5e7eb; }

/* WCAG 2.3.3 — animations coupées si l'utilisateur les refuse */
@media (prefers-reduced-motion: reduce) {
  .marker-drop { animation: none; }
  .marker-active { animation: none; }
  .user-location-marker .ping::after { animation: none; }
}

.dark .leaflet-container { background: #18181b; }
.dark .empty-state { background: #27272a; }
</style>
