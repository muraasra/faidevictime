<template>
  <div class="map-section">
    <h2 class="map-title">Trouver un service près de chez vous</h2>
    <div class="map-toolbar">
      <input
        v-model="search"
        @input="onSearchInput"
        class="map-search"
        :placeholder="'Rechercher un service, une région...'"
        aria-label="Recherche de service"
      />
      <div class="map-legend" aria-label="Légende des catégories">
        <div v-for="cat in categories" :key="cat.value" class="legend-item">
          <span :style="{ background: cat.color }" class="legend-color" :aria-label="cat.label"></span>
          <span>{{ cat.label }}</span>
        </div>
      </div>
    </div>
    <div ref="mapContainer" class="leaflet-map" aria-live="polite" tabindex="0" />
    <transition name="slide-fade">
      <aside v-if="selected" class="service-details" tabindex="0" aria-modal="true" role="dialog">
        <button class="close-btn" @click="selected = null" aria-label="Fermer les détails">&times;</button>
        <h2>{{ selected.nom_structure }}</h2>
        <p><strong>Catégorie :</strong> {{ getCategoryLabel(selected) }}</p>
        <p><strong>Département :</strong> {{ selected.departement }}</p>
        <p><strong>Contact :</strong> {{ selected.telephone_repondant }}</p>
        <p><strong>Répondant :</strong> {{ selected.nom_repondant }}</p>
        <p v-if="selected.distance !== undefined"><strong>Distance :</strong> {{ formatDistance(selected.distance) }}</p>
      </aside>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import 'leaflet/dist/leaflet.css'

const mapContainer = ref<HTMLElement | null>(null)
const map = ref<any>(null)
const markers = ref<any[]>([])
const selected = ref<any>(null)
const search = ref('')
const isDark = ref(false)

const categories = [
  { value: 'soins_medicaux', label: 'Soins médicaux', color: '#dc2626' },
  { value: 'appui_psychosocial', label: 'Appui psychosocial', color: '#ca8a04' },
  { value: 'police_securite', label: 'Police / Sécurité', color: '#16a34a' },
  { value: 'assistance_juridique', label: 'Assistance juridique', color: '#2563eb' },
  { value: 'sante_mentale', label: 'Santé mentale', color: '#7c3aed' },
  { value: 'reinsertion_economique', label: 'Réinsertion économique', color: '#ea580c' }
]

const services = ref<any[]>([])
const filteredServices = computed(() => {
  if (!search.value) return services.value
  const q = search.value.toLowerCase()
  return services.value.filter(s =>
    s.nom_structure.toLowerCase().includes(q) ||
    s.departement?.toLowerCase().includes(q) ||
    getCategoryLabel(s).toLowerCase().includes(q)
  )
})

let searchTimeout: any = null
function onSearchInput() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    updateMarkers()
  }, 300)
}

function getCategoryLabel(service: any) {
  const cat = categories.find(c => service[c.value])
  return cat ? cat.label : 'Non spécifié'
}
function getCategoryColor(service: any) {
  const cat = categories.find(c => service[c.value])
  return cat ? cat.color : '#4b5563'
}
function formatDistance(distance: number) {
  if (distance < 1) return `${Math.round(distance * 1000)} m`
  return `${Math.round(distance)} km`
}

onMounted(async () => {
  isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    isDark.value = e.matches
    updateTileLayer()
  })

  const L = await import('leaflet')
  map.value = L.map(mapContainer.value!, {
    center: [7.3697, 12.3547],
    zoom: 6,
    zoomControl: true,
    attributionControl: true
  })

  updateTileLayer()
  L.control.scale({ position: 'bottomleft', imperial: false }).addTo(map.value)

  try {
    const res = await fetch('https://wilfriedtayou.pythonanywhere.com/api/question-transversale/')
    const data = await res.json()
    services.value = Array.isArray(data) ? data.filter((s: any) => s.statut) : []
    updateMarkers()
  } catch (e) {}
})

function updateTileLayer() {
  if (!map.value) return
  map.value.eachLayer((layer: any) => {
    if (layer instanceof (window as any).L.TileLayer) map.value.removeLayer(layer)
  })
  const url = isDark.value
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
  const attribution = '© OpenStreetMap, © Carto'
  const L = (window as any).L
  L.tileLayer(url, { attribution, maxZoom: 18, minZoom: 5 }).addTo(map.value)
}

function updateMarkers() {
  if (!map.value) return
  markers.value.forEach(m => map.value.removeLayer(m))
  markers.value = []
  const L = (window as any).L
  filteredServices.value.forEach(service => {
    if (!service.latitude || !service.longitude) return
    const lat = parseFloat(service.latitude)
    const lng = parseFloat(service.longitude)
    if (isNaN(lat) || isNaN(lng)) return
    const marker = L.circleMarker([lat, lng], {
      radius: 10,
      color: getCategoryColor(service),
      fillColor: getCategoryColor(service),
      fillOpacity: 0.85,
      weight: 2,
      className: 'service-marker',
      keyboard: true,
      title: service.nom_structure
    })
    marker.on('click keypress', (e: any) => {
      if (e.type === 'click' || (e.type === 'keypress' && (e.originalEvent.key === 'Enter' || e.originalEvent.key === ' '))) {
        selected.value = service
      }
    })
    marker.bindTooltip(service.nom_structure, { direction: 'top', offset: [0, -10], className: 'marker-tooltip' })
    marker.addTo(map.value)
    markers.value.push(marker)
  })
}

watch(search, () => onSearchInput())
watch(isDark, () => updateTileLayer())
</script>

<style scoped>
/* ... (styles identiques à la version précédente) ... */
</style> 