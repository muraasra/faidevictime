<template>
  <div class="min-h-screen bg-gray-50 dark:bg-zinc-900 pt-28 pb-16 px-4">
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-10">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">Guide d'utilisation</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          Comment utiliser childsafe pour trouver de l'aide, étape par étape.
        </p>
      </div>

      <div class="grid gap-4 mb-10">
        <div class="guide-card">
          <div class="guide-num">1</div>
          <div class="flex-1">
            <h2 class="font-semibold text-gray-800 dark:text-white mb-1">Décrivez votre besoin</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Deux façons de commencer : parler librement à <NuxtLink to="/chat" class="text-emerald-600 dark:text-emerald-400 underline">Avina</NuxtLink>
              (même sans savoir exactement ce que vous cherchez), ou choisir directement une catégorie
              (soutien psychologique, soins médicaux, aide juridique, hébergement, sécurité, santé mentale, réinsertion économique)
              sur la <NuxtLink to="/" class="text-emerald-600 dark:text-emerald-400 underline">page d'accueil</NuxtLink>.
            </p>
          </div>
        </div>

        <div class="guide-card">
          <div class="guide-num">2</div>
          <div class="flex-1">
            <h2 class="font-semibold text-gray-800 dark:text-white mb-1">Discutez avec Avina</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Avina peut simplement vous écouter, ou vous aider à trouver un service — elle s'adapte à ce que vous exprimez, sans vous forcer.
              Si vous cherchez un service, elle vous demandera votre situation puis votre zone, pour vous proposer les structures correspondantes
              (nom, téléphone, lien vers la carte, horaires).
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
              <strong>Pas sûr·e que votre message soit assez clair ?</strong> Dans le chat, le bouton
              <em>« 🎯 Choisir précisément un type d'aide + une zone »</em> affiche des boutons pour sélectionner
              exactement le type d'aide puis la zone recherchés — plus fiable qu'une phrase écrite librement,
              qui peut parfois être mal comprise si elle mélange votre situation et le service demandé.
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              La base ne couvre pas encore toutes les villes : si votre zone n'est pas reconnue, Avina vous le dira honnêtement plutôt que d'inventer un service.
            </p>
          </div>
        </div>

        <div class="guide-card">
          <div class="guide-num">3</div>
          <div class="flex-1">
            <h2 class="font-semibold text-gray-800 dark:text-white mb-1">Ou explorez directement la carte</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Sur <NuxtLink to="/services" class="text-emerald-600 dark:text-emerald-400 underline">la carte des services</NuxtLink>,
              filtrez par catégorie et par zone, puis touchez un marqueur pour voir les coordonnées d'un service et son itinéraire.
              Utile si vous savez déjà précisément ce que vous cherchez.
            </p>
          </div>
        </div>

        <div class="guide-card">
          <div class="guide-num">4</div>
          <div class="flex-1">
            <h2 class="font-semibold text-gray-800 dark:text-white mb-1">Utilisez votre position (facultatif)</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Le bouton <em>« Ma position »</em>, dans le chat ou sur la carte, trie les services par distance réelle
              depuis l'endroit où vous êtes — pratique si vous ne connaissez pas le nom exact de votre zone.
              Votre position n'est utilisée que pour ce tri, elle n'est pas enregistrée.
            </p>
          </div>
        </div>

        <div class="guide-card">
          <div class="guide-num">5</div>
          <div class="flex-1">
            <h2 class="font-semibold text-gray-800 dark:text-white mb-1">Entrez en contact</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Appelez directement le service proposé ou suivez l'itinéraire sur la carte — la plupart des services référencés sont gratuits.
            </p>
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-100 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5 mb-6">
        <h2 class="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
          <i class="fas fa-comments text-emerald-600 dark:text-emerald-400" /> Gérer vos conversations
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Dans le chat, le panneau des conversations (icône en haut à gauche sur mobile, toujours visible sur ordinateur) liste vos échanges précédents avec Avina.
          Le bouton <em>« Nouvelle conversation »</em> permet d'en démarrer une nouvelle sans perdre les précédentes.
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Chaque conversation peut être supprimée définitivement au survol (icône corbeille) — utile si vous partagez votre appareil et voulez effacer une trace.
        </p>
      </div>

      <div class="rounded-2xl border border-gray-100 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5 mb-6">
        <h2 class="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
          <i class="fas fa-lock text-emerald-600 dark:text-emerald-400" /> Confidentialité
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Aucun compte n'est requis pour discuter avec Avina ou consulter la carte. Vos échanges restent anonymes et ne sont partagés avec personne.
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Si vous utilisez un appareil partagé (avec une personne dont vous voulez garder la conversation privée), pensez à naviguer en mode privé/incognito
          ou à effacer l'historique de votre navigateur après votre visite.
        </p>
      </div>

      <div class="rounded-2xl border border-red-100 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-5 mb-10">
        <p class="text-sm font-semibold text-red-800 dark:text-red-200 mb-3">En danger immédiat ? Appelez maintenant :</p>
        <div class="flex flex-wrap gap-2">
          <a href="tel:117" class="emergency-chip">🚔 Police — 117</a>
          <a href="tel:119" class="emergency-chip">🚒 Pompiers — 119</a>
          <a href="tel:1510" class="emergency-chip">💜 SOS Violences — 1510</a>
        </div>
      </div>

      <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Questions fréquentes</h2>
      <div class="grid gap-3">
        <details v-for="item in faq" :key="item.q" class="faq-item">
          <summary class="faq-question">{{ item.q }}</summary>
          <p class="faq-answer">{{ item.a }}</p>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SITE_URL, SITE_DEFAULT_OG_IMAGE } from '~/utils/site'

const faq = [
  {
    q: 'Dois-je créer un compte pour utiliser childsafe ?',
    a: "Non. Discuter avec Avina et consulter la carte des services ne nécessitent aucune inscription.",
  },
  {
    q: 'Mes échanges avec Avina sont-ils confidentiels ?',
    a: "Oui, ils sont anonymes et ne sont partagés avec personne. Sur un appareil partagé, pensez à naviguer en mode privé ou à effacer votre historique après votre visite.",
  },
  {
    q: "Que se passe-t-il si ma ville n'est pas couverte par la base de services ?",
    a: "Avina vous le dit honnêtement plutôt que d'inventer un service, et vous propose les zones actuellement disponibles ou une alternative.",
  },
  {
    q: 'Avina peut-elle m\'aider en cas de danger immédiat ?',
    a: "Non, Avina est un outil d'écoute et d'orientation, pas un service d'urgence. En cas de danger immédiat, appelez directement la Police (117), les Pompiers (119) ou SOS Violences (1510).",
  },
  {
    q: 'Comment être sûr·e qu\'Avina comprend bien ma demande ?',
    a: 'Utilisez le bouton "Choisir précisément un type d\'aide + une zone" dans le chat : il affiche des boutons de sélection plutôt que de dépendre d\'un texte libre qui peut parfois être ambigu.',
  },
  {
    q: 'Puis-je supprimer une conversation ?',
    a: 'Oui, chaque conversation peut être supprimée définitivement depuis le panneau des conversations du chat.',
  },
]

useHead({
  title: 'Guide d\'utilisation — childsafe',
  meta: [
    { name: 'description', content: 'Comment utiliser childsafe : parler à Avina, trouver un service sur la carte par zone et catégorie, contacter une structure d\'aide. Gratuit, anonyme, sans compte requis.' },
    { property: 'og:title', content: 'Guide d\'utilisation — childsafe' },
    { property: 'og:description', content: 'Comment utiliser childsafe pour trouver de l\'aide, étape par étape.' },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: `${SITE_URL}/guide` },
    { property: 'og:image', content: SITE_DEFAULT_OG_IMAGE },
  ],
  link: [{ rel: 'canonical', href: `${SITE_URL}/guide` }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'Comment utiliser childsafe pour trouver de l\'aide',
        step: [
          { '@type': 'HowToStep', name: 'Décrivez votre besoin', text: 'Parlez librement à Avina, ou utilisez le sélecteur de type d\'aide + zone pour plus de précision, ou choisissez une catégorie sur la page d\'accueil.' },
          { '@type': 'HowToStep', name: 'Discutez avec Avina', text: 'Avina écoute ou oriente vers un service selon votre situation et votre zone.' },
          { '@type': 'HowToStep', name: 'Explorez la carte des services', text: 'Filtrez par catégorie et zone sur la carte interactive des services.' },
          { '@type': 'HowToStep', name: 'Utilisez votre position', text: 'Triez les services par distance réelle sans avoir à nommer votre zone.' },
          { '@type': 'HowToStep', name: 'Entrez en contact', text: 'Appelez le service ou suivez l\'itinéraire indiqué sur la carte.' },
        ],
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }),
    },
  ],
})
</script>

<style scoped>
.guide-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: white;
  border: 1px solid #f3f4f6;
  border-radius: 1rem;
  padding: 1.1rem 1.25rem;
}
:global(.dark) .guide-card {
  background: #27272a;
  border-color: #3f3f46;
}

.guide-num {
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  background: #d1fae5;
  color: #059669;
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
:global(.dark) .guide-num {
  background: #064e3b;
  color: #6ee7b7;
}

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

.faq-item {
  background: white;
  border: 1px solid #f3f4f6;
  border-radius: 1rem;
  padding: 1rem 1.25rem;
}
:global(.dark) .faq-item {
  background: #27272a;
  border-color: #3f3f46;
}
.faq-question {
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  color: #1f2937;
  list-style: none;
}
:global(.dark) .faq-question { color: white; }
.faq-question::-webkit-details-marker { display: none; }
.faq-question::before {
  content: '+';
  display: inline-block;
  width: 1.1rem;
  color: #059669;
  font-weight: 700;
}
details[open] .faq-question::before { content: '−'; }
.faq-answer {
  margin-top: 0.6rem;
  padding-left: 1.1rem;
  font-size: 0.85rem;
  line-height: 1.6;
  color: #6b7280;
}
:global(.dark) .faq-answer { color: #a1a1aa; }
</style>
