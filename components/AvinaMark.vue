<template>
  <div class="avina-mark" :style="{ '--size': size + 'px' }" role="img" aria-label="Avina — assistant de la plateforme childsafe">
    <svg viewBox="0 0 200 200" class="avina-mark__svg">
      <g
        v-for="(petal, index) in petals"
        :key="petal.color"
        :class="`avina-mark__unit avina-mark__unit--${index}`"
      >
        <!-- Phase 1 : une vraie main, teinte de peau realiste -->
        <path :d="handPath" :fill="skinTones[index]" class="avina-mark__hand" />
        <!-- Phase 2 : la main devient le petale du logo (fondu croise, meme position) -->
        <path :d="petalPath" :fill="petal.color" class="avina-mark__petal" />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 140 })

// Couleurs finales du logo Avina (identiques a la marque d'origine)
const petals = [
  { color: '#5f7470' },
  { color: '#8fc34e' },
  { color: '#5fab3c' },
  { color: '#0f7a4d' },
  { color: '#f5d76e' },
  { color: '#7a5233' },
  { color: '#a3391f' },
  { color: '#1c1c1e' },
]

// Teintes de peau reelles et diverses pour la phase "main" — chaque main a sa
// propre couleur, symbolisant des personnes differentes qui s'unissent.
const skinTones = ['#3d2314', '#8a5a34', '#c68642', '#e0ac69', '#f1c27d', '#a86b3c', '#5c3a21', '#ffdbac']

// Silhouette de main (paume + pouce), poignet au centre, doigts vers l'exterieur.
const handPath = `
  M100,100
  C93,96 84,90 80,78
  C77,68 79,56 84,48
  C81,42 78,34 82,28
  C85,23 91,24 93,30
  C93,20 94,8 100,6
  C106,8 107,20 107,30
  C109,24 115,23 118,28
  C122,34 119,42 116,48
  C121,56 123,68 120,78
  C116,90 107,96 100,100
  Z
`

// Petale du logo final (forme d'origine de la marque Avina)
const petalPath = 'M100,100 C100,66 88,18 98,6 C122,10 142,42 136,66 C130,90 112,100 100,100 Z'
</script>

<style scoped>
.avina-mark {
  width: var(--size);
  height: var(--size);
  display: inline-block;
  animation: avina-visibility 9s ease-in-out infinite;
}

.avina-mark__svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* Le cercle (position/taille du groupe) reste fixe : seule la ROTATION de
   chaque unite anime, pour que les elements se deplacent sur le cercle sans
   que le cercle lui-meme ne bouge. */
.avina-mark__unit {
  transform-origin: 100px 100px;
  animation-duration: 9s;
  animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
  animation-iteration-count: infinite;
}
.avina-mark__unit--0 { animation-name: avina-orbit-0; }
.avina-mark__unit--1 { animation-name: avina-orbit-1; }
.avina-mark__unit--2 { animation-name: avina-orbit-2; }
.avina-mark__unit--3 { animation-name: avina-orbit-3; }
.avina-mark__unit--4 { animation-name: avina-orbit-4; }
.avina-mark__unit--5 { animation-name: avina-orbit-5; }
.avina-mark__unit--6 { animation-name: avina-orbit-6; }
.avina-mark__unit--7 { animation-name: avina-orbit-7; }

@keyframes avina-orbit-0 { 0%,8% { transform: rotate(-300deg); } 45%,100% { transform: rotate(0deg); } }
@keyframes avina-orbit-1 { 0%,8% { transform: rotate(-255deg); } 45%,100% { transform: rotate(45deg); } }
@keyframes avina-orbit-2 { 0%,8% { transform: rotate(-210deg); } 45%,100% { transform: rotate(90deg); } }
@keyframes avina-orbit-3 { 0%,8% { transform: rotate(-165deg); } 45%,100% { transform: rotate(135deg); } }
@keyframes avina-orbit-4 { 0%,8% { transform: rotate(-120deg); } 45%,100% { transform: rotate(180deg); } }
@keyframes avina-orbit-5 { 0%,8% { transform: rotate(-75deg); }  45%,100% { transform: rotate(225deg); } }
@keyframes avina-orbit-6 { 0%,8% { transform: rotate(-30deg); }  45%,100% { transform: rotate(270deg); } }
@keyframes avina-orbit-7 { 0%,8% { transform: rotate(15deg); }   45%,100% { transform: rotate(315deg); } }

/* Fondu croise main -> petale, synchronise avec le trajet sur le cercle
   ci-dessus : la main disparait pendant qu'elle tourne, le petale du logo
   apparait a sa place. */
.avina-mark__hand,
.avina-mark__petal {
  animation-duration: 9s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  transform-origin: 100px 100px;
}
.avina-mark__hand { animation-name: avina-fade-out; }
.avina-mark__petal { animation-name: avina-fade-in; }

@keyframes avina-fade-out {
  0%, 8%  { opacity: 1; }
  45%, 100% { opacity: 0; }
}
@keyframes avina-fade-in {
  0%, 8%  { opacity: 0; }
  45%, 100% { opacity: 1; }
}

/* Fondu global au point de bouclage, pour un retour invisible au depart */
@keyframes avina-visibility {
  0%, 100% { opacity: 0; }
  9%       { opacity: 1; }
  92%      { opacity: 1; }
  99%      { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .avina-mark,
  .avina-mark__unit,
  .avina-mark__hand,
  .avina-mark__petal {
    animation: none;
  }
  .avina-mark__hand { opacity: 0; }
  .avina-mark__petal { opacity: 1; }
}
</style>
