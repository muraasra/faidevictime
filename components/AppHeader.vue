<script lang="ts" setup>
const navIsOpen = useState('navIsOpen', () => false)

function toggleNav(event: MouseEvent): void {
    event.preventDefault()
    navIsOpen.value = !navIsOpen.value
}

const navLinks = [
    {
        text: "À propos",
        href: "/about"
    },
    {
        text: "Services",
        href: "/services"
    },
    {
        text: "Sensibilisations",
        href: "/formations"
    },
    {
        text: "Assistance",
        href: "/chatbot"
    },
    {
        text: "Contact",
        href: "/contact"
    }
]

</script>
<template>
    <header class="fixed inset-x-0 top-0 py-3 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <AtomsContainer class-name="relative">
            <nav class="flex items-center justify-between w-full relative">
                <!-- app logo -->
                <div class="inline-flex relative bg-inherit">
                    <NuxtLink to="/" class="flex items-center gap-2">
                        <span class="flex">
                            <img src="/ico.png" width="40" alt="avatar"
                                class="w-10 h-10 rounded-full border-2 border-white dark:border-gray-400 object-cover">
                        </span>
                        <span class="text-lg text-gray-700 dark:text-white">VictiSafe</span>
                    </NuxtLink>
                </div>

                <!-- Navigation mobile -->
                <div 
                    class="fixed inset-0 bg-gray-800/40 dark:bg-gray-900/60 lg:hidden transition-opacity duration-300"
                    :class="navIsOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
                    @click="navIsOpen = false"
                ></div>

                <div 
                    class="fixed top-0 bottom-0 left-0 w-[280px] lg:w-auto lg:static bg-white  lg:bg-transparent dark:text-white
                    p-6 lg:p-0 transition-transform duration-300 transform lg:transform-none shadow-lg lg:shadow-none"
                    :class="navIsOpen ? 'translate-x-0' : '-translate-x-full'"
                >
                    <!-- Bouton fermer menu mobile -->
                    <button 
                        @click="navIsOpen = false"
                        class="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white lg:hidden"
                    >
                        <span class="sr-only">Fermer menu</span>
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <ul class="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-8 mt-8 lg:mt-0">
                        <AtomsNavLink v-for="navItem in navLinks" :key="navItem.href" :href="navItem.href" :text="navItem.text" @click="navIsOpen = false" />
                    </ul>
                </div>

                <div class="flex items-center bg-inherit gap-1 lg:gap-3 min-w-max">
                    <ElementsThemeSwitcher />
                    <div class="hidden lg:flex lg:items-center gap-4">
                        <AtomsLinkBtn href="/chat" variant="primary">
                            Discutez avec nous!
                        </AtomsLinkBtn>
                    </div>

                    <!-- Menu mobile toggle -->
                    <button 
                        @click="toggleNav" 
                        class="flex lg:hidden p-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                        aria-label="Toggle mobile menu"
                    >
                        <div class="w-6 h-5 relative flex flex-col justify-between">
                            <span 
                                class="w-full h-0.5 bg-current rounded-full transform transition-transform duration-300"
                                :class="navIsOpen ? 'rotate-45 translate-y-2' : ''"
                            ></span>
                            <span 
                                class="w-full h-0.5 bg-current rounded-full transition-opacity duration-300"
                                :class="navIsOpen ? 'opacity-0' : ''"
                            ></span>
                            <span 
                                class="w-full h-0.5 bg-current rounded-full transform transition-transform duration-300"
                                :class="navIsOpen ? '-rotate-45 -translate-y-2' : ''"
                            ></span>
                        </div>
                    </button>
                </div>
            </nav>
        </AtomsContainer>
    </header>
</template>

<style scoped>
.nav-link {
    @apply transition-colors duration-300;
}

.nav-link:hover {
    @apply text-emerald-500;
}

@media (max-width: 1024px) {
    .nav-link {
        @apply block w-full py-2;
    }
}
</style>