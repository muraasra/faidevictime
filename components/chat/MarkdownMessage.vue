<template>
  <div class="mb-4">
    <!-- Affichage du markdown -->
    <div
      class="prose prose-green max-w-none mb-4 bg-white border border-gray-100 rounded-2xl shadow-md p-3 md:p-4 transition markdown-message"
      v-html="htmlContent"
    ></div>
    <!-- Affichage des options si présentes -->
    <div v-if="options.length" class="flex flex-wrap gap-2 md:gap-3 mt-2">
      <button
        v-for="opt in options"
        :key="opt.value"
        @click="onOptionClick(opt.value)"
        class="px-3 md:px-4 py-2 md:py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow transition-all duration-150 text-sm md:text-base touch-manipulation min-h-[44px] md:min-h-[40px]"
      >
        {{ opt.text }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  markdown: { type: String, required: true }
})

const emit = defineEmits(['option-selected'])

// Extraction des options JSON
const options = computed(() => {
  const match = props.markdown.match(/```json\s*([\s\S]*?)\s*```/);
  if (!match) return [];
  try {
    return JSON.parse(match[1]);
  } catch {
    return [];
  }
});

// Fonction pour mettre en gras les infos importantes
function autoBoldInfos(md) {
  // Patterns : Nom :, Prénom :, Téléphone :, Email :, Numéro :, etc.
  // On met en gras la clé et la valeur si c'est un numéro/email
  return md.replace(/((Nom|Prénom|Téléphone|Numéro|Email|Mail|E-mail|Contact)\s*:?\s*)([\w\d@.\-+ ]{3,})/gi, (match, p1, p2, p3) => {
    // Si la valeur ressemble à un numéro ou un email, tout en gras
    if (/^([0-9 +().-]{6,}|[\w.-]+@[\w.-]+)/.test(p3.trim())) {
      return `**${p1}${p3}**`;
    }
    // Sinon, juste la clé en gras
    return `**${p1}**${p3}`;
  });
}

// Nettoyage du markdown pour ne pas afficher le bloc d’options
const htmlContent = computed(() => {
  let md = props.markdown.replace(/```json\s*[\s\S]*?\s*```/, '');
  md = autoBoldInfos(md);
  return marked.parse(md);
});

function onOptionClick(value) {
  emit('option-selected', value);
}
</script>

<style scoped>
.markdown-message :deep(a) {
  @apply text-blue-600 hover:text-blue-800 underline transition;
}
.markdown-message :deep(strong) {
  @apply font-bold text-gray-900;
}
</style>

<style>
/* Pour forcer la couleur des liens même avec .prose */
.prose a {
  color: #2563eb !important; /* blue-600 */
  text-decoration: underline;
  transition: color 0.2s;
}
.prose a:hover {
  color: #1e40af !important; /* blue-800 */
}
</style> 