<template>
  <div class="service-page py-12 px-6 md:px-12">
    <div class="title">
      <AtomsContainer class="relative pt-12">
        <AtomsTitle texte="Services d'assistance aux personnes victimes" />
        
        <!-- Message d'erreur -->
        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {{ error }}
        </div>

        <!-- Indicateur de chargement -->
        <div v-if="loading" class="text-center py-4">
          <p class="text-gray-600 dark:text-gray-400">Chargement des services...</p>
        </div>

        <div class="maincontainer flex flex-col lg:flex-row justify-between gap-8 mx-auto max-w-screen-xl mt-6">
          <!-- Carte et détails -->
          <div class="leftsection flex-1">
            <!-- Carte -->
            <div class="bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden">
              <div id="map" style="height: 70vh; width: 100%; z-index: 1;" class="rounded-lg"></div>
            </div>

            <!-- Détails du service sélectionné -->
            <div v-if="selectedService" class="mt-6 bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6">
              <div class="flex justify-between items-start mb-6">
                <div>
                  <h2 class="text-2xl font-bold text-gray-800 dark:text-white">{{ selectedService.nom_structure }}</h2>
                  <p class="text-lg mt-1" :style="{ color: getTextColor(getServiceCategory(selectedService)) }">
                    {{ getServiceCategory(selectedService) }}
                  </p>
                  <p v-if="selectedService.distance !== undefined" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    À {{ formatDistance(selectedService.distance) }} de votre position
                  </p>
                </div>
                <span 
                  :class="selectedService.statut ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="px-3 py-1 rounded-full text-sm"
                >
                  {{ selectedService.statut ? 'Actif' : 'Inactif' }}
                </span>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-gray-600 dark:text-gray-400">Catégorie:</p>
                  <p class="font-medium" :style="{ color: getTextColor(getServiceCategory(selectedService)) }">
                    {{ getServiceCategory(selectedService) }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-600 dark:text-gray-400">Département:</p>
                  <p class="font-medium text-gray-800 dark:text-white">{{ selectedService.departement }}</p>
                </div>
                <div>
                  <p class="text-gray-600 dark:text-gray-400">Contact:</p>
                  <p class="font-medium text-gray-800 dark:text-white">{{ selectedService.telephone_repondant }}</p>
                </div>
                <div>
                  <p class="text-gray-600 dark:text-gray-400">Répondant:</p>
                  <p class="font-medium text-gray-800 dark:text-white">{{ selectedService.nom_repondant }}</p>
                </div>
              </div>

              <div class="mt-4 flex gap-3">
                <a 
                  :href="'https://www.google.com/maps/dir//' + selectedService.latitude + ',' + selectedService.longitude" 
                  target="_blank"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <span>Itinéraire</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </a>
                <button 
                  @click="selectedService = null"
                  class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>

          <!-- Liste des services -->
          <div class="rightsection w-full lg:w-96">
            <div class="bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden">
              <div class="p-4 bg-gray-50 dark:bg-zinc-700 border-b dark:border-zinc-600">
                <h2 class="text-lg font-semibold text-gray-800 dark:text-white flex items-center justify-between">
                  <span>Services disponibles</span>
                  <button 
                    @click="getUserLocation"
                    class="text-sm flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{{ userPosition ? 'Actualiser position' : 'Ma position' }}</span>
                  </button>
                </h2>
              </div>
              
              <!-- Barre de recherche principale -->
              <div class="flex flex-col gap-4 mb-6">
                <!-- Barre de recherche principale -->
                <div class="relative">
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Rechercher un service par nom, département ou type d'assistance..."
                    class="w-full px-4 py-3 rounded-lg border dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                      </span>
                </div>

                <!-- Filtres rapides avec icônes -->
                <div class="flex flex-wrap gap-2">
                  <button 
                    v-for="category in categories" 
                    :key="category.value"
                    @click="filterByCategory(category.value)"
                    :class="[
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
                      currentCategory === category.value 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    ]"
                  >
                    <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: getMarkerColor(category.label) }"></span>
                    {{ category.label }}
                  </button>
                </div>
              </div>

              <div class="overflow-y-auto" style="max-height: 60vh;">
                <div v-if="filteredServices.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
                  Aucun service actif trouvé
                </div>
                <div v-else class="divide-y dark:divide-zinc-600">
                  <div 
                    v-for="service in sortedServices" 
                    :key="service.id"
                    @click="selectService(service)"
                    class="p-4 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
                    :class="{'bg-emerald-50 dark:bg-emerald-900/20': selectedService?.id === service.id}"
                  >
                    <div class="flex justify-between items-start">
                      <h3 class="font-medium text-gray-800 dark:text-white">{{ service.nom_structure }}</h3>
                      <div class="flex flex-col items-end gap-1">
                        <span 
                          :class="service.statut ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                          class="px-2 py-0.5 rounded-full text-xs"
                        >
                          {{ service.statut ? 'Actif' : 'Inactif' }}
                        </span>
                        <span v-if="service.distance !== undefined" class="text-sm text-gray-500 dark:text-gray-400">
                          {{ formatDistance(service.distance) }}
                        </span>
                      </div>
                    </div>
                    <p class="text-sm mt-1" :style="{ color: getTextColor(getServiceCategory(service)) }">
                      {{ getServiceCategory(service) }}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {{ service.departement }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AtomsContainer>
    </div>

    <!-- Bouton de géolocalisation -->
    <button 
      @click="getUserLocation"
      class="fixed bottom-4 right-4 bg-white dark:bg-zinc-800 p-3 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors z-20"
      title="Utiliser ma position"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </button>
  </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref, computed, nextTick, watch } from 'vue'
import axios from 'axios' 
import { useAuthStore } from '@/stores/auth'

const loading = ref(true)
const error = ref<string | null>(null)
const mapInitialized = ref(false)
const selectedService = ref<Service | null>(null)
const currentCategory = ref('')
const searchQuery = ref('')
const userPosition = ref<[number, number] | null>(null)
const userMarker = ref<any>(null)
const userCircle = ref<any>(null)

interface Service {
  id: number;
  nom_structure: string;
  latitude: string | number;
  longitude: string | number;
  statut: boolean;
  soins_medicaux: any | null;
  appui_psychosocial: any | null;
  police_securite: any | null;
  assistance_juridique: any | null;
  sante_mentale: any | null;
  reinsertion_economique: any | null;
  departement: string;
  is_active: boolean;
  telephone_repondant: string;
  nom_repondant: string;
  distance?: number;
}

const categories = [
  { value: '', label: 'Tous' },
  { value: 'soins_medicaux', label: 'Soins médicaux' },
  { value: 'appui_psychosocial', label: 'Appui psychosocial' },
  { value: 'police_securite', label: 'Police / Sécurité' },
  { value: 'assistance_juridique', label: 'Assistance juridique' },
  { value: 'sante_mentale', label: 'Santé mentale' },
  { value: 'reinsertion_economique', label: 'Réinsertion économique' }
]

const services = ref<Service[]>([])
let map: any
let markers: any[] = []
const auth = useAuthStore()

// Modifier le computed filteredServices
const filteredServices = computed(() => {
  let filtered = services.value

  // Filtre par catégorie
  if (currentCategory.value) {
    filtered = filtered.filter(service => service[currentCategory.value as keyof Service])
  }

  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(service => 
      service.nom_structure.toLowerCase().includes(query) ||
      (service.departement && service.departement.toLowerCase().includes(query)) ||
      getServiceCategory(service).toLowerCase().includes(query)
    )
  }

  return filtered
})

// Ajouter un computed pour trier les services par distance
const sortedServices = computed(() => {
  if (!userPosition.value) return filteredServices.value

  return [...filteredServices.value].sort((a, b) => {
    if (a.distance === undefined || b.distance === undefined) return 0
    return a.distance - b.distance
  })
})

// Ajouter le watcher pour les filtres
watch([currentCategory, searchQuery], () => {
  if (!map) return

  // Réinitialiser la vue de la carte si aucun service n'est sélectionné
  if (!selectedService.value) {
    map.setView([7.3697, 12.3547], 6)
  }

  // Mettre à jour la visibilité des marqueurs
  markers.forEach(marker => {
    const service = services.value.find(s => 
      s.latitude === marker.getLatLng().lat && 
      s.longitude === marker.getLatLng().lng
    )
    
    if (service) {
      const isVisible = filteredServices.value.some(s => s.id === service.id)
      if (isVisible) {
        marker.setStyle({ opacity: 1, fillOpacity: 0.8 })
      } else {
        marker.setStyle({ opacity: 0.3, fillOpacity: 0.3 })
      }
    }
  })
})

function filterByCategory(category: string) {
  currentCategory.value = currentCategory.value === category ? '' : category
}

function selectService(service: Service) {
  selectedService.value = service
  if (map && service.latitude && service.longitude) {
    const lat = parseFloat(service.latitude as string)
    const lng = parseFloat(service.longitude as string)
    map.setView([lat, lng], 13)

    // Calculer et ajouter la distance si la position de l'utilisateur est disponible
    if (userPosition.value) {
      const distance = calculateDistance(
        userPosition.value[0],
        userPosition.value[1],
        lat,
        lng
      )
      selectedService.value = {
        ...service,
        distance,
        departement: getDepartement(lat, lng)
      }
    }
  }
}

function getServiceCategory(service: Service): string {
  if (!service) return 'Non spécifié';
  if (service.soins_medicaux) return 'Soins médicaux';
  if (service.appui_psychosocial) return 'Appui psychosocial';
  if (service.police_securite) return 'Police / Sécurité';
  if (service.assistance_juridique) return 'Assistance juridique';
  if (service.sante_mentale) return 'Santé mentale';
  if (service.reinsertion_economique) return 'Réinsertion économique';
  return 'Non spécifié';
}

function getMarkerColor(categorie: string): string {
  switch (categorie.toLowerCase()) {
    case "soins médicaux": return '#dc2626'
    case "appui psychosocial": return '#ca8a04'
    case "police / sécurité": return '#16a34a'
    case "assistance juridique": return '#2563eb'
    case "santé mentale": return '#7c3aed'
    case "réinsertion économique": return '#ea580c'
    default: return '#4b5563'
  }
}

function getTextColor(categorie: string): string {
  switch (categorie.toLowerCase()) {
    case "soins médicaux": return "#dc2626"
    case "appui psychosocial": return "#ca8a04"
    case "police / sécurité": return "#16a34a"
    case "assistance juridique": return "#2563eb"
    case "santé mentale": return "#7c3aed"
    case "réinsertion économique": return "#ea580c"
    default: return "#4b5563"
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`
  }
  return `${Math.round(distance)} km`
}

const departements = {
  Adamaoua: {
    bounds: [[6.5, 11.5], [8.0, 15.0]],
    center: [7.25, 13.25]
  },
  Centre: {
    bounds: [[3.5, 10.5], [6.0, 13.0]],
    center: [4.75, 11.75]
  },
  Est: {
    bounds: [[2.0, 13.0], [6.0, 16.0]],
    center: [4.0, 14.5]
  },
  "Extrême-Nord": {
    bounds: [[10.0, 13.5], [13.0, 15.5]],
    center: [11.5, 14.5]
  },
  Littoral: {
    bounds: [[3.5, 9.5], [5.0, 10.5]],
    center: [4.25, 10.0]
  },
  Nord: {
    bounds: [[8.0, 13.0], [10.0, 15.5]],
    center: [9.0, 14.25]
  },
  "Nord-Ouest": {
    bounds: [[5.7, 9.8], [7.0, 11.2]],
    center: [6.35, 10.5]
  },
  Ouest: {
    bounds: [[5.0, 9.8], [6.0, 11.2]],
    center: [5.5, 10.5]
  },
  Sud: {
    bounds: [[2.0, 10.0], [3.5, 12.0]],
    center: [2.75, 11.0]
  },
  "Sud-Ouest": {
    bounds: [[4.0, 8.5], [6.5, 10.0]],
    center: [5.25, 9.25]
  }
}

function getDepartement(lat: number, lon: number): string {
  for (const [nom, coords] of Object.entries(departements)) {
    const [[minLat, minLon], [maxLat, maxLon]] = coords.bounds
    if (lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon) {
      return nom
    }
  }
  return "Non déterminé"
}

// Modifier la fonction getUserLocation pour mettre à jour l'interface
async function getUserLocation() {
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      })
    })

    const { latitude, longitude } = position.coords
    userPosition.value = [latitude, longitude]

    if (map) {
      // Supprimer les anciens marqueurs si ils existent
      if (userMarker.value) map.removeLayer(userMarker.value)
      if (userCircle.value) map.removeLayer(userCircle.value)

      // Ajouter le marqueur de position
      const L = await import('leaflet')
      userMarker.value = L.default.marker([latitude, longitude], {
        icon: L.default.divIcon({
          className: 'user-location-marker',
          html: '<div class="ping"></div>',
          iconSize: [20, 20]
        })
      }).addTo(map)

      // Ajouter un cercle pour montrer la précision
      userCircle.value = L.default.circle([latitude, longitude], {
        radius: 1000, // 1km de rayon
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        weight: 1
      }).addTo(map)

      // Centrer la carte sur la position avec un zoom approprié
      map.setView([latitude, longitude], 13)

      // Mettre à jour les distances pour tous les services
      services.value = services.value.map(service => {
        if (!service.latitude || !service.longitude) return service

        const lat = parseFloat(service.latitude as string)
        const lng = parseFloat(service.longitude as string)
        
        if (isNaN(lat) || isNaN(lng)) return service

        return {
          ...service,
          distance: calculateDistance(latitude, longitude, lat, lng),
          departement: getDepartement(lat, lng)
        }
      })
    }
  } catch (error) {
    console.error('Erreur de géolocalisation:', error)
    alert('Impossible d\'obtenir votre position. Veuillez vérifier que vous avez autorisé l\'accès à la géolocalisation.')
  }
}

// Ajouter un watcher pour mettre à jour les distances quand la position change
watch(userPosition, () => {
  if (!userPosition.value) return

  const [latitude, longitude] = userPosition.value
  services.value = services.value.map(service => {
    if (!service.latitude || !service.longitude) return service

    const lat = parseFloat(service.latitude as string)
    const lng = parseFloat(service.longitude as string)
    
    if (isNaN(lat) || isNaN(lng)) return service

    return {
      ...service,
      distance: calculateDistance(latitude, longitude, lat, lng),
      departement: getDepartement(lat, lng)
    }
  })
})

onMounted(async () => {
  try {
    loading.value = true
    error.value = null

    // Import Leaflet dynamiquement côté client
    const L = await import('leaflet')
    // Import du CSS de Leaflet
    await import('leaflet/dist/leaflet.css')
    
    // Vérification du token
    if (!auth.token) {
      error.value = 'Erreur d\'authentification. Veuillez vous reconnecter.'
      return
    }

    // Attendre que le DOM soit prêt
    await nextTick()
    
    // Vérifier si le conteneur de la carte existe
    const mapContainer = document.getElementById('map')
    if (!mapContainer) {
      console.error('Le conteneur de la carte n\'existe pas encore')
      error.value = 'Erreur lors de l\'initialisation de la carte'
      return
    }
    
    interface TileProvider {
      url: string;
      options: {
        attribution: string;
        subdomains?: string[];
      };
    }

    // Configuration des tuiles avec plusieurs fournisseurs pour la redondance
    const tileProviders: TileProvider[] = [
      {
        url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        options: {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          subdomains: ['a', 'b', 'c']
        }
      },
      {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        options: {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          subdomains: ['a', 'b', 'c']
        }
      },
      {
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        options: {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
      },
      {
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        options: {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, © <a href="https://carto.com/attribution">CARTO</a>',
          subdomains: ['a', 'b', 'c', 'd']
        }
      }
    ]

    let currentProviderIndex = 0
    let retryCount = 0
    const maxRetries = 3
    const retryDelay = 1000 // 1 seconde

    // Fonction pour créer une couche de tuiles avec gestion des erreurs
    function createTileLayer(providerIndex: number) {
      const provider = tileProviders[providerIndex]
      const layer = L.default.tileLayer(provider.url, {
        ...provider.options,
        crossOrigin: true,
        maxZoom: 18,
        minZoom: 5,
        errorTileUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        className: 'map-tiles',
        keepBuffer: 4,
        updateWhenIdle: true,
        updateWhenZooming: false,
        maxNativeZoom: 18,
        tileSize: 256
      })

      layer.on('tileerror', async () => {
        console.warn(`Erreur de chargement de tuile avec le fournisseur ${providerIndex}, tentative ${retryCount + 1}/${maxRetries}`)
        
        if (retryCount < maxRetries) {
          retryCount++
          // Attendre avant de réessayer
          await new Promise(resolve => setTimeout(resolve, retryDelay))
          
          // Essayer le prochain fournisseur
          currentProviderIndex = (currentProviderIndex + 1) % tileProviders.length
          const newLayer = createTileLayer(currentProviderIndex)
          
          if (map.hasLayer(layer)) {
            map.removeLayer(layer)
            newLayer.addTo(map)
          }
        } else {
          console.error('Échec du chargement des tuiles après plusieurs tentatives')
          // Afficher un message d'erreur à l'utilisateur
          error.value = 'Problème de chargement de la carte. Certaines tuiles peuvent ne pas s\'afficher correctement.'
        }
      })

      layer.on('load', () => {
        // Réinitialiser le compteur de tentatives si le chargement réussit
        retryCount = 0
      })

      return layer
    }

    // Initialisation de la carte avec options avancées
    map = L.default.map('map', {
      center: [7.3697, 12.3547],
    zoom: 6,
      minZoom: 5,
      maxZoom: 18,
      zoomControl: true,
      attributionControl: true,
      // Ajouter des options pour améliorer les performances
      preferCanvas: true,
      renderer: L.default.canvas(),
      fadeAnimation: false,
      zoomAnimation: true,
      markerZoomAnimation: true
    })

    // Création et ajout de la couche de tuiles initiale
    createTileLayer(currentProviderIndex).addTo(map)

    // Récupération des services actifs
    const response = await axios.get('http://localhost:8000/api/question-transversale/', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
    
    if (!response.data) {
      error.value = 'Pas de données reçues de l\'API'
      return
    }

    // Filtrer les services actifs en utilisant uniquement le champ statut
    services.value = Array.isArray(response.data) 
      ? response.data.filter((s: Service) => s.statut)
      : []

    if (services.value.length === 0) {
      error.value = 'Aucun service actif trouvé'
      return
    }

    // Création d'un groupe de marqueurs pour une meilleure performance
    const markersGroup = L.default.featureGroup()

    // Ajout des marqueurs pour chaque service
    services.value.forEach((service) => {
      if (!service.latitude || !service.longitude) {
        console.warn(`Service sans coordonnées: ${service.nom_structure}`)
        return
      }

      const lat = parseFloat(service.latitude as string)
      const lng = parseFloat(service.longitude as string)
      
      if (isNaN(lat) || isNaN(lng)) {
        console.warn(`Coordonnées invalides pour le service ${service.nom_structure}`)
        return
      }

      const categorie = getServiceCategory(service)
      const marker = L.default.circleMarker([lat, lng], {
        radius: 8,
        fillColor: getMarkerColor(categorie),
        color: '#fff',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      })

      marker.bindTooltip(service.nom_structure, {
        permanent: false,
        direction: 'top',
        className: 'custom-tooltip'
      })

      marker.on('click', () => {
        selectService(service)
      })

      markersGroup.addLayer(marker)
      markers.push(marker)
    })

    // Ajout du groupe de marqueurs à la carte
    markersGroup.addTo(map)

    // Ajuster la vue pour montrer tous les marqueurs
    if (markers.length > 0) {
      map.fitBounds(markersGroup.getBounds(), {
        padding: [50, 50],
        maxZoom: 12
      })
    }

    mapInitialized.value = true
  } catch (err) {
    console.error("Erreur lors du chargement des services:", err)
    error.value = 'Une erreur est survenue lors du chargement des services.'
  } finally {
    loading.value = false
  }
})
</script>

<style>
.leaflet-container {
  font-family: inherit;
  background-color: #f8fafc;
}

.dark .leaflet-container {
  background-color: #18181b;
}

.map-tiles {
  filter: brightness(1.02) contrast(1.02);
}

.dark .map-tiles {
  filter: brightness(0.8) contrast(1.1) saturate(1.2);
}

.custom-tooltip {
  background-color: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.dark .custom-tooltip {
  background-color: rgba(24, 24, 27, 0.95);
  color: #fff;
}

.leaflet-control-zoom {
  border: none !important;
  border-radius: 0.5rem !important;
  overflow: hidden;
}

.leaflet-control-zoom a {
  background-color: white !important;
  color: #374151 !important;
  border: 1px solid #e5e7eb !important;
}

.dark .leaflet-control-zoom a {
  background-color: #27272a !important;
  color: #e5e7eb !important;
  border: 1px solid #3f3f46 !important;
}

.leaflet-control-zoom a:hover {
  background-color: #f3f4f6 !important;
}

.dark .leaflet-control-zoom a:hover {
  background-color: #3f3f46 !important;
}

/* Animation de chargement des tuiles */
.leaflet-tile-loading {
  animation: tileLoading 1s infinite;
  background-color: rgba(0, 0, 0, 0.05);
}

.dark .leaflet-tile-loading {
  background-color: rgba(255, 255, 255, 0.05);
}

@keyframes tileLoading {
  0% { opacity: 0.6; }
  50% { opacity: 0.8; }
  100% { opacity: 0.6; }
}

.user-location-marker {
  position: relative;
  z-index: 1000;
}

.ping {
  width: 20px;
  height: 20px;
  background-color: #3b82f6;
  border: 2px solid white;
  border-radius: 50%;
  position: relative;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.ping::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  background-color: #3b82f6;
  animation: ping 1.5s ease-in-out infinite;
  z-index: -1;
}

@keyframes ping {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  80%, 100% {
    transform: scale(2.5);
    opacity: 0;
  }
}
</style>
