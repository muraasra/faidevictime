<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
    <!-- Hero Section avec animation -->
    <div class="relative bg-gradient-to-r from-green-800 to-green-700 text-white py-24 overflow-hidden">
      <div class="absolute inset-0 bg-black opacity-20"></div>
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10"></div>
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="text-center space-y-6 animate-fade-in">
          <h1 class="text-5xl md:text-6xl font-bold mb-4 tracking-tight">Qui Sommes Nous</h1>
          <div class="w-32 h-1 bg-green-400 mx-auto rounded-full"></div>
          <p class="text-xl text-green-100 max-w-3xl mx-auto mt-6">
            Une organisation engagée pour un avenir durable et équitable
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Notre Identité -->
      <section class="mb-24 transform hover:scale-[1.02] transition-transform duration-300">
        <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
          <h2 class="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <span class="w-12 h-1 bg-green-600 mr-4 rounded-full"></span>
            Notre Identité
          </h2>
          <div class="space-y-6">
            <p class="text-xl text-gray-700 mb-8">
              Nous sommes:
            </p>
            <ul class="space-y-6">
              <li v-for="(item, index) in identiteItems" :key="index" 
                  class="flex items-start group hover:bg-green-50 p-4 rounded-lg transition-colors duration-300">
                <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors duration-300">
                  <i class="fas fa-check-circle text-green-600"></i>
                </div>
                <span class="text-lg text-gray-700">{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Notre Mission -->
      <section class="mb-24 transform hover:scale-[1.02] transition-transform duration-300">
        <div class="bg-gradient-to-br from-green-800 to-green-700 rounded-2xl shadow-xl p-8 md:p-12 text-white">
          <h2 class="text-3xl font-bold mb-8 flex items-center">
            <span class="w-12 h-1 bg-green-400 mr-4 rounded-full"></span>
            Notre Mission
          </h2>
          <p class="text-xl leading-relaxed">
            Nous avons pour mission d'œuvrer pour la promotion de la création en contribuant à la transformation des structures sociales et au renforcement des capacités pratiques et stratégiques des populations défavorisées pour la prise en main de leur destin.
          </p>
        </div>
      </section>

      <!-- Notre Objectif -->
      <section class="mb-24 transform hover:scale-[1.02] transition-transform duration-300">
        <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
          <h2 class="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <span class="w-12 h-1 bg-green-600 mr-4 rounded-full"></span>
            Notre Objectif de Développement
          </h2>
          <p class="text-xl text-gray-700 leading-relaxed">
            Le CIPCRE, dans les zones d'intervention, contribue à l'éradication de la pauvreté et de la faim, à la promotion des droits de l'enfant et de la femme et à l'avènement d'une société pacifique dans laquelle les populations œuvrent pour réduire leur vulnérabilité aux changements climatiques.
          </p>
        </div>
      </section>

      <!-- Nos Valeurs -->
      <section class="mb-24">
        <h2 class="text-3xl font-bold text-gray-900 mb-12 flex items-center">
          <span class="w-12 h-1 bg-green-600 mr-4 rounded-full"></span>
          Nos Valeurs
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(valeur, index) in valeurs" :key="index" 
               class="group bg-white rounded-2xl shadow-xl p-8 border border-gray-100 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div class="text-green-600 text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
              <i :class="valeur.icon"></i>
            </div>
            <h3 class="text-2xl font-semibold text-gray-900 mb-4">{{ valeur.titre }}</h3>
            <p class="text-gray-700 leading-relaxed">{{ valeur.description }}</p>
          </div>
        </div>
      </section>

      <!-- Notre Profession de Foi -->
      <section class="mb-24 transform hover:scale-[1.02] transition-transform duration-300">
        <div class="bg-gradient-to-br from-green-800 to-green-700 rounded-2xl shadow-xl p-8 md:p-12 text-white">
          <h2 class="text-3xl font-bold mb-8 flex items-center">
            <span class="w-12 h-1 bg-green-400 mr-4 rounded-full"></span>
            Notre Profession de Foi
          </h2>
          <p class="text-xl leading-relaxed">
            Nous voulons laisser à la génération qui vient, une Afrique 
            <span class="font-bold text-green-300">écologiquement</span> saine, 
            <span class="font-bold text-green-300">économiquement</span> viable, 
            <span class="font-bold text-green-300">politiquement</span> apaisée, 
            <span class="font-bold text-green-300">socialement</span> intégrée, 
            <span class="font-bold text-green-300">moralement</span> équilibrée et 
            <span class="font-bold text-green-300">spirituellement</span> engagée.
          </p>
        </div>
      </section>

      <!-- Contact Information -->
      <section>
        <h2 class="text-3xl font-bold text-gray-900 mb-12 flex items-center">
          <span class="w-12 h-1 bg-green-600 mr-4 rounded-full"></span>
          Nos Coordonnées
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(contact, index) in contacts" :key="index"
               class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <h3 class="text-2xl font-semibold text-gray-900 mb-6">{{ contact.titre }}</h3>
            <div class="space-y-4">
              <p class="text-gray-700 flex items-center">
                <i class="fas fa-map-marker-alt text-green-600 w-6"></i>
                {{ contact.adresse }}
              </p>
              <p class="text-gray-700 flex items-center">
                <i class="fas fa-phone text-green-600 w-6"></i>
                {{ contact.telephone }}
              </p>
              <p class="text-gray-700 flex items-center">
                <i class="fas fa-envelope text-green-600 w-6"></i>
                {{ contact.email }}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
const identiteItems = [
  'Le Cercle International pour la Promotion de la Création',
  'Une Organisation Non Gouvernementale (ONG) de droit camerounais créée en 1990',
  'Une ONG d\'écologie et de développement holistique',
  'Un espace de promotion du dialogue social, œcuménique et interreligieux',
  'Un outil de promotion des droits humains et de la démocratie'
]

const valeurs = [
  {
    titre: 'La Paix',
    icon: 'fas fa-dove',
    description: 'Promouvoir la paix et la coexistence pacifique dans toutes nos actions.'
  },
  {
    titre: 'La Justice',
    icon: 'fas fa-balance-scale',
    description: 'Œuvrer pour une justice équitable et accessible à tous.'
  },
  {
    titre: 'La Transparence',
    icon: 'fas fa-eye',
    description: 'Maintenir une transparence totale dans nos actions et notre gestion.'
  },
  {
    titre: 'La Démocratie',
    icon: 'fas fa-vote-yea',
    description: 'Promouvoir les valeurs démocratiques et la participation citoyenne.'
  },
  {
    titre: 'Le Respect de la Dignité Humaine',
    icon: 'fas fa-user-shield',
    description: 'Respecter et défendre la dignité de chaque être humain.'
  },
  {
    titre: 'Le Militantisme Écologique',
    icon: 'fas fa-leaf',
    description: 'S\'engager activement pour la protection de l\'environnement.'
  },
  {
    titre: 'La Solidarité',
    icon: 'fas fa-hands-helping',
    description: 'Promouvoir la solidarité et l\'entraide entre les communautés.'
  }
]

const contacts = [
  {
    titre: 'Direction Générale',
    adresse: 'B.P. 1256 Bafoussam',
    telephone: '+237 6 94 03 30 42',
    email: 'cipcre_dg@cipcre.org'
  },
  {
    titre: 'CIPCRE-Cameroun',
    adresse: 'B.P. 1256 Bafoussam, Cameroun',
    telephone: '+237 6 94 02 14 74',
    email: 'cipcre_cameroun@cipcre.org'
  },
  {
    titre: 'CIPCRE-Bénin',
    adresse: 'B.P. 287 Porto-Novo, Bénin',
    telephone: '+229 97 63 77 87',
    email: 'cipcre-benin@cipcre.org'
  }
]
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Ajout d'un effet de survol sur les sections */
section {
  transition: all 0.3s ease;
}

/* Amélioration de la lisibilité du texte */
.text-gray-700 {
  line-height: 1.8;
}

/* Effet de survol sur les cartes de contact */
.contact-card:hover {
  transform: translateY(-5px);
}
</style>