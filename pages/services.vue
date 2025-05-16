<template>
  <div class="service-page py-12 px-6 md:px-12">
    <div class="title">
      <AtomsContainer class="relative pt-12">
        <AtomsTitle texte="Serives d'assistance aux personnes victimes repertoriés dans differents département" />
        <div class="maincontainer flex flex-col md:flex-row justify-between gap-12 mx-auto max-w-screen-xl mt-6">
          <div class="leftsection localisation flex-1 max-w-lg">
            <div id="map" style="height: 80vh; width: 100%"></div>
          </div>
          <div class="rightsection listservices p-4 bg-gray-100 flex-1 max-w-lg rounded-xl shadow-lg dark:bg-box-bg">
            <h1 class="text text-white bg-primary p-8 text-center m-2">Liste des services</h1>
            <div class="listcontainer flex flex-col md:flex-row justify-between gap-12 mx-auto max-w-screen-xl mt-6">
              <div class="left-section flex-1 dark:text-white">
                <ul>
                    <li 
                      v-for="(service, index) in services" 
                      :key="index"
                      class="p-2 border-b border-gray-300"
                    >
                      <span class="font-semibold">{{ service.nom }}</span> – 
                      <span :style="{ color: getTextColor(service.categorie), fontWeight: 'bold' }">
                        {{ service.categorie }}
                      </span>
                    </li>
                    </ul>
              </div>
              <div class="right-section flex-1 max-w-lg rounded-xl shadow-lg">
                <div class="carte1 bg-gray-300 p-8 m-2 rounded-xl cursor-pointer" @click="goToNoun">
                  <p class="text text-primary text-center p-9 mb-3">Noun</p>
                </div>
                <div class="carte2 bg-gray-300 p-8 m-2 rounded-xl cursor-pointer" @click="goToAdamaoua">
                  <p class="text text-primary text-center p-9">Adamaoua</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AtomsContainer>
    </div>
  </div>
</template>

  
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios' 

interface Service {
  id: number;
  nom: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
  categorie: string;
  departement: string;
}

const services = ref<Service[]>([])
let map: google.maps.Map

const loadMap = () => {
  return new Promise((resolve) => {
    if (window.google) return resolve(window.google)
    const script = document.createElement('script')
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAazbj-8wVdE5oyRPcYd1BLk8B463YW-i8&callback=initMap'
    script.async = true
    window.initMap = resolve
    document.head.appendChild(script)
  })
}

onMounted(async () => {
  await loadMap()

  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    center: { lat: 7.3697, lng: 12.3547 },
    zoom: 6,
  })

  // Récupération des services 
  try {
    const response = await axios.get('http://localhost:8000/api/question-transversale/{id}/')
    services.value = response.data.filter((s: Service) => s.is_active)

    services.value.forEach((service) => {
      const marker = new google.maps.Marker({
        position: { lat: service.latitude, lng: service.longitude },
        map,
        title: service.nom,
        icon: {
          url: getMarkerColor(service.categorie),
        }
      })

      const infoWindow = new google.maps.InfoWindow({
        content: `<strong>${service.nom}</strong><br>${service.departement}<br>${service.categorie}`
      })

      marker.addListener("click", () => {
        infoWindow.open(map, marker)
      })
    })
  } catch (error) {
    console.error("Erreur de chargement des services :", error)
  }
})

const goToNoun = () => {
  map.setCenter({ lat: 5.4638, lng: 10.8000 })
  map.setZoom(10)
}

const goToAdamaoua = () => {
  map.setCenter({ lat: 6.9182, lng: 12.8055 })
  map.setZoom(10)
}

function getTextColor(categorie: string): string {
  switch (categorie.toLowerCase()) {
    case "soins medicaux": return "red"
    case "appui psychosocial": return "goldenrod"
    case "police securite": return "green"
    case "assistance juridique": return "blue"
    case "sante mentale": return "black"
    case "reinsertion economique": return "brown"
    default: return "purple"
  }
}

function getMarkerColor(categorie: string): string {
  switch (categorie.toLowerCase()) {
    case "soins medicaux":
      return "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
    case "appui psychosocial":
      return "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
    case "police securite":
      return "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
    case "assistance juridique":
      return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
    case "sante mentale":
      return "http://maps.google.com/mapfiles/ms/icons/black-dot.png"
    case "reinsertion economique":
      return "http://maps.google.com/mapfiles/ms/icons/brown-dot.png"
    default:
      return "http://maps.google.com/mapfiles/ms/icons/purple-dot.png"
  }
}
</script>
