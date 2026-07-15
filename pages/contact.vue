<template>
  <div class="min-h-screen bg-gray-50 dark:bg-zinc-900 pt-28 pb-16 px-4">
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-10">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">Nous contacter</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          Plusieurs façons de nous joindre, selon ton besoin.
        </p>
      </div>

      <div class="grid gap-4">
        <NuxtLink to="/chat" class="contact-card">
          <div class="contact-icon bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
            <i class="fas fa-comment-dots" />
          </div>
          <div class="flex-1">
            <h2 class="font-semibold text-gray-800 dark:text-white">Parler à Avina</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Échange anonyme et confidentiel, disponible à tout moment.</p>
          </div>
          <i class="fas fa-chevron-right text-gray-300 dark:text-zinc-600" />
        </NuxtLink>

        <a href="https://www.cipcre.org/contact/" target="_blank" rel="noopener" class="contact-card">
          <div class="contact-icon bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <i class="fas fa-envelope" />
          </div>
          <div class="flex-1">
            <h2 class="font-semibold text-gray-800 dark:text-white">Écrire à CIPCRE</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">L'organisation qui porte SafePlace — cipcre.org/contact</p>
          </div>
          <i class="fas fa-arrow-up-right-from-square text-sm text-gray-300 dark:text-zinc-600" />
        </a>

        <NuxtLink to="/services" class="contact-card">
          <div class="contact-icon bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
            <i class="fas fa-map-marker-alt" />
          </div>
          <div class="flex-1">
            <h2 class="font-semibold text-gray-800 dark:text-white">Trouver un service près de toi</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Carte des structures d'aide (santé, juridique, psychosocial…)</p>
          </div>
          <i class="fas fa-chevron-right text-gray-300 dark:text-zinc-600" />
        </NuxtLink>
      </div>

      <div class="mt-8 rounded-2xl border border-red-100 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-5">
        <p class="text-sm font-semibold text-red-800 dark:text-red-200 mb-3">En danger immédiat ? Appelle maintenant :</p>
        <div class="flex flex-wrap gap-2">
          <a href="tel:117" class="emergency-chip">🚔 Police — 117</a>
          <a href="tel:119" class="emergency-chip">🚒 Pompiers — 119</a>
          <a href="tel:1510" class="emergency-chip">💜 SOS Violences — 1510</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Contact — SafePlace' })
</script>

<style scoped>
.contact-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  border: 1px solid #f3f4f6;
  border-radius: 1rem;
  padding: 1.1rem 1.25rem;
  transition: all 0.15s;
}
.contact-card:hover {
  border-color: #a7f3d0;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}
:global(.dark) .contact-card {
  background: #27272a;
  border-color: #3f3f46;
}

.contact-icon {
  width: 44px;
  height: 44px;
  border-radius: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
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
</style>
