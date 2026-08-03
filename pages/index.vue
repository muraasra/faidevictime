<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { SITE_URL, SITE_DEFAULT_OG_IMAGE } from '~/utils/site'

useHead({
  title: 'childsafe — Trouver de l\'aide près de chez vous',
  meta: [
    { name: 'description', content: 'Victime ou témoin de violences ? Trouvez gratuitement des services d\'aide près de chez vous : soutien psychologique, aide juridique, hébergement d\'urgence, soins. Confidentiel et anonyme.' },
    { name: 'keywords', content: 'assistance victimes, aide victimes violences, soutien psychologique, aide juridique, hébergement urgence, Cameroun, avina, childsafe' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'childsafe — Trouver de l\'aide près de chez vous' },
    { property: 'og:description', content: 'Services d\'aide gratuits et confidentiels pour les victimes de violences.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: SITE_URL },
    { property: 'og:image', content: SITE_DEFAULT_OG_IMAGE },
    { name: 'twitter:title', content: 'childsafe — Trouver de l\'aide près de chez vous' },
    { name: 'twitter:description', content: 'Services d\'aide gratuits et confidentiels pour les victimes de violences.' },
    { name: 'twitter:image', content: SITE_DEFAULT_OG_IMAGE },
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/ico.png' },
    { rel: 'canonical', href: SITE_URL },
  ],
})

const categories = [
  { label: 'Soutien psychologique', param: 'appui_psychosocial', color: '#ca8a04', icon: 'fas fa-hands-helping' },
  { label: 'Soins médicaux', param: 'soins_medicaux', color: '#dc2626', icon: 'fas fa-hospital' },
  { label: 'Aide juridique', param: 'assistance_juridique', color: '#2563eb', icon: 'fas fa-balance-scale' },
  { label: 'Hébergement d\'urgence', param: 'hebergement', color: '#db2777', icon: 'fas fa-house-user' },
  { label: 'Police / Sécurité', param: 'police_securite', color: '#16a34a', icon: 'fas fa-shield-alt' },
  { label: 'Santé mentale', param: 'sante_mentale', color: '#7c3aed', icon: 'fas fa-brain' },
  { label: 'Réinsertion économique', param: 'reinsertion_economique', color: '#ea580c', icon: 'fas fa-briefcase' },
]

const steps = [
  { icon: 'fas fa-comment-dots', title: 'Décrivez votre besoin', text: 'Parlez à Avina en toute confidentialité ou choisissez directement un type d\'aide.' },
  { icon: 'fas fa-map-marked-alt', title: 'Trouvez un service proche', text: 'La carte vous montre les services disponibles dans votre arrondissement.' },
  { icon: 'fas fa-phone-volume', title: 'Entrez en contact', text: 'Appelez directement ou suivez l\'itinéraire — la plupart des services sont gratuits.' },
]

const principles = [
  { icon: 'fas fa-lock', title: 'Confidentiel', text: 'Aucun compte requis pour discuter avec Avina ou consulter la carte. Vos échanges restent anonymes, rien n\'est partagé.' },
  { icon: 'fas fa-hand-holding-heart', title: 'Gratuit', text: 'La plateforme est gratuite et la grande majorité des services référencés le sont aussi.' },
  { icon: 'fas fa-people-group', title: 'Porté par CIPCRE', text: 'childsafe est développé avec CIPCRE, une organisation active depuis des années dans l\'accompagnement social au Cameroun.' },
]

// Statistiques reelles (issues de la base de services), pas de chiffres inventes.
const stats = [
  { icon: 'fas fa-map-location-dot', target: 9, suffix: '', label: 'Zones couvertes' },
  { icon: 'fas fa-building-shield', target: 360, suffix: '+', label: 'Services référencés' },
  { icon: 'fas fa-layer-group', target: 7, suffix: '', label: 'Types d\'aide' },
  { icon: 'fas fa-clock', target: 24, suffix: '/7', label: 'Avina à l\'écoute' },
]
const statValues = ref(stats.map(() => 0))
let statsAnimated = false

function animateStats() {
  if (statsAnimated) return
  statsAnimated = true
  const duration = 1100
  const start = performance.now()
  function tick(now: number) {
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - (1 - progress) ** 3
    statValues.value = stats.map(s => Math.round(s.target * eased))
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

// Directive de revelation au defilement : ajoute .is-visible des qu'un
// element entre dans le viewport, une seule fois (pas de re-declenchement).
const vReveal = {
  mounted(el: HTMLElement) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          if (el.dataset.reveal === 'stats') animateStats()
          observer.unobserve(el)
        }
      })
    }, { threshold: 0.2 })
    observer.observe(el)
  },
}

const prefersReducedMotion = ref(false)
onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion.value) {
    animateStats()
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'))
  }
})
</script>

<template>
  <div class="home-page">
    <!-- ===== HERO ===== -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="blob blob--1 absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-200/40 dark:bg-emerald-900/20 blur-3xl" />
        <div class="blob blob--2 absolute top-40 -left-20 w-72 h-72 rounded-full bg-pink-200/30 dark:bg-purple-900/20 blur-3xl" />
        <div class="blob blob--3 absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-teal-200/30 dark:bg-teal-900/20 blur-3xl" />
      </div>

      <div class="relative max-w-screen-md mx-auto px-6 pt-20 md:pt-28 pb-10 text-center">
        <span class="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-6 tracking-wide uppercase">
          childsafe
        </span>

        <div class="flex flex-col items-center mb-6">
          <AvinaMark :size="112" class="mb-3" />
          <span class="avina-wordmark">AVINA</span>
        </div>

        <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
          Vous n'êtes pas seul·e.<br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Trouvez de l'aide</span> près de chez vous.
        </h1>
        <p class="text-gray-500 dark:text-gray-400 md:text-lg max-w-xl mx-auto mb-8">
          Avina, l'assistante de childsafe, vous écoute et vous oriente : soutien, soins, protection, aide juridique et hébergement — où que vous soyez.
        </p>

        <div class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <NuxtLink
            to="/services"
            class="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold px-6 py-4 rounded-2xl shadow-lg shadow-emerald-600/25 transition"
          >
            <i class="fas fa-map-marker-alt" />
            Trouver un service
          </NuxtLink>
          <NuxtLink
            to="/chat"
            class="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 active:scale-[0.98] text-gray-800 dark:text-white font-semibold px-6 py-4 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-sm transition"
          >
            <i class="fas fa-comment-dots text-emerald-600" />
            Parler à quelqu'un
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ===== STATISTIQUES ===== -->
    <section class="px-4 pb-14">
      <div
        v-reveal
        data-reveal="stats"
        class="reveal max-w-screen-lg mx-auto grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        <div v-for="(stat, i) in stats" :key="stat.label" class="stat-card" :style="{ '--stagger': i }">
          <i :class="stat.icon" class="text-emerald-600 dark:text-emerald-400 text-xl mb-2" />
          <div class="stat-number">{{ statValues[i] }}<span class="text-emerald-600 dark:text-emerald-400">{{ stat.suffix }}</span></div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- ===== BANDEAU URGENCE ===== -->
    <section class="px-4 pb-12">
      <div v-reveal class="reveal max-w-screen-md mx-auto bg-red-50 dark:bg-red-900/25 border border-red-100 dark:border-red-900/50 rounded-2xl p-5">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/60 flex items-center justify-center flex-shrink-0">
            <i class="fas fa-exclamation-triangle text-red-600 dark:text-red-300" />
          </span>
          <div>
            <h2 class="font-bold text-red-800 dark:text-red-200 leading-tight">En danger immédiat ?</h2>
            <p class="text-sm text-red-600/80 dark:text-red-300/80">Un appui est disponible 24h/24 — appelez maintenant.</p>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <a href="tel:117" class="urgent-tel">
            <span class="text-lg">🚔</span>
            <span class="font-bold">117</span>
            <span class="text-[11px] opacity-75">Police</span>
          </a>
          <a href="tel:119" class="urgent-tel">
            <span class="text-lg">🚒</span>
            <span class="font-bold">119</span>
            <span class="text-[11px] opacity-75">Pompiers</span>
          </a>
          <a href="tel:1510" class="urgent-tel">
            <span class="text-lg">💜</span>
            <span class="font-bold">1510</span>
            <span class="text-[11px] opacity-75">SOS Violences</span>
          </a>
        </div>
      </div>
    </section>

    <!-- ===== ACCÈS PAR BESOIN ===== -->
    <section class="px-4 pb-16">
      <div class="max-w-screen-lg mx-auto">
        <h2 v-reveal class="reveal text-xl md:text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
          De quoi avez-vous besoin ?
        </h2>
        <p v-reveal class="reveal text-sm text-gray-500 dark:text-gray-400 text-center mb-8">
          Touchez une catégorie pour voir les services correspondants sur la carte.
        </p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <NuxtLink
            v-for="(cat, i) in categories"
            :key="cat.param"
            v-reveal
            :to="`/services?cat=${cat.param}`"
            class="reveal category-card group"
            :style="{ '--stagger': i }"
          >
            <span
              class="w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition group-hover:scale-110"
              :style="{ backgroundColor: cat.color + '1a', color: cat.color }"
            >
              <i :class="cat.icon" />
            </span>
            <span class="font-semibold text-sm text-gray-800 dark:text-gray-100 leading-snug">{{ cat.label }}</span>
          </NuxtLink>

          <NuxtLink
            v-reveal
            to="/chat"
            class="reveal category-card group bg-gradient-to-br from-emerald-600 to-teal-600 border-transparent"
            :style="{ '--stagger': categories.length }"
          >
            <span class="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center mb-3 text-white transition group-hover:scale-110">
              <i class="fas fa-comment-dots" />
            </span>
            <span class="font-semibold text-sm text-white leading-snug">Je ne sais pas — je veux en parler</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ===== COMMENT ÇA MARCHE ===== -->
    <section class="px-4 pb-16">
      <div v-reveal class="reveal max-w-screen-lg mx-auto bg-white dark:bg-zinc-800 rounded-3xl border border-gray-100 dark:border-zinc-700 p-8 md:p-12">
        <h2 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white text-center mb-10">
          Comment ça marche ?
        </h2>
        <div class="steps-grid grid md:grid-cols-3 gap-8">
          <div v-for="(step, index) in steps" :key="step.title" class="relative text-center md:text-left">
            <div class="flex items-center justify-center md:justify-start gap-3 mb-3">
              <span class="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center flex-shrink-0">
                {{ index + 1 }}
              </span>
              <i :class="step.icon" class="text-emerald-600 dark:text-emerald-400 text-xl" />
            </div>
            <h3 class="font-semibold text-gray-800 dark:text-white mb-1.5">{{ step.title }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{{ step.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CONFIANCE ===== -->
    <section class="px-4 pb-16">
      <div class="max-w-screen-lg mx-auto">
        <h2 v-reveal class="reveal text-xl md:text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Pourquoi nous faire confiance ?
        </h2>
        <div class="grid md:grid-cols-3 gap-4">
          <div v-for="(principle, i) in principles" :key="principle.title" v-reveal class="reveal flex items-start gap-4 bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-5" :style="{ '--stagger': i }">
            <span class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <i :class="principle.icon" />
            </span>
            <div>
              <h3 class="font-semibold text-gray-800 dark:text-white text-sm mb-1">{{ principle.title }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{{ principle.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CTA FINAL ===== -->
    <section class="px-4 pb-20">
      <div v-reveal class="reveal max-w-screen-lg mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 px-8 py-12 md:py-16 text-center">
        <div class="absolute inset-0 pointer-events-none opacity-10" aria-hidden="true">
          <div class="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div class="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-white blur-3xl" />
        </div>
        <h2 class="relative text-2xl md:text-3xl font-extrabold text-white mb-3">
          Prêt·e à commencer ?
        </h2>
        <p class="relative text-emerald-50 max-w-md mx-auto mb-8">
          Que vous ayez besoin de parler ou de trouver un service précis, Avina et childsafe sont là, gratuitement et en toute confidentialité.
        </p>
        <div class="relative flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <NuxtLink to="/chat" class="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-emerald-50 active:scale-[0.98] text-emerald-700 font-semibold px-6 py-3.5 rounded-2xl transition">
            <i class="fas fa-comment-dots" />
            Discuter avec Avina
          </NuxtLink>
          <NuxtLink to="/services" class="flex-1 flex items-center justify-center gap-2 bg-emerald-700/40 hover:bg-emerald-700/60 active:scale-[0.98] text-white font-semibold px-6 py-3.5 rounded-2xl border border-white/30 transition">
            <i class="fas fa-map-marker-alt" />
            Voir la carte
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.avina-wordmark {
  font-weight: 800;
  font-size: 1.75rem;
  letter-spacing: 0.08em;
  color: #0f1729;
}
:global(.dark) .avina-wordmark { color: #f4f4f5; }

/* Derive lentement en continu — dynamisme discret en arriere-plan */
.blob { animation: blob-drift 16s ease-in-out infinite; }
.blob--2 { animation-duration: 20s; animation-delay: -4s; }
.blob--3 { animation-duration: 24s; animation-delay: -9s; }
@keyframes blob-drift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%      { transform: translate(18px, -14px) scale(1.06); }
  66%      { transform: translate(-14px, 12px) scale(0.96); }
}
@media (prefers-reduced-motion: reduce) {
  .blob { animation: none; }
}

/* Revelation au defilement */
.reveal {
  opacity: 0;
  transform: translateY(22px);
  transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: calc(var(--stagger, 0) * 70ms);
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.urgent-tel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  background: white;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 1rem;
  padding: 0.7rem 0.5rem;
  transition: all 0.15s;
}
.urgent-tel:hover { background: #fef2f2; transform: translateY(-1px); }
.urgent-tel:active { transform: scale(0.97); }
:global(.dark) .urgent-tel {
  background: rgba(127, 29, 29, 0.35);
  color: #fca5a5;
  border-color: rgba(127, 29, 29, 0.6);
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: white;
  border: 1px solid #f3f4f6;
  border-radius: 1.25rem;
  padding: 1.1rem;
  transition: transform 0.18s, box-shadow 0.18s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
.category-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}
:global(.dark) .category-card {
  background: #27272a;
  border-color: #3f3f46;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: white;
  border: 1px solid #f3f4f6;
  border-radius: 1.25rem;
  padding: 1.25rem 0.75rem;
}
:global(.dark) .stat-card { background: #27272a; border-color: #3f3f46; }
.stat-number {
  font-size: 1.6rem;
  font-weight: 800;
  color: #111827;
  font-variant-numeric: tabular-nums;
  line-height: 1.2;
}
:global(.dark) .stat-number { color: white; }
.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.15rem;
}
:global(.dark) .stat-label { color: #a1a1aa; }

/* Ligne de connexion entre les etapes, desktop uniquement */
@media (min-width: 768px) {
  .steps-grid > div:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 20px;
    left: calc(100% - 1.5rem + 20px);
    width: calc(2rem - 8px);
    height: 2px;
    background: repeating-linear-gradient(to right, #a7f3d0 0, #a7f3d0 4px, transparent 4px, transparent 8px);
  }
  :global(.dark) .steps-grid > div:not(:last-child)::after {
    background: repeating-linear-gradient(to right, #065f46 0, #065f46 4px, transparent 4px, transparent 8px);
  }
}
</style>
