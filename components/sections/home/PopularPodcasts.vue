<template>
    <section class="pt-16 relative">
        <div aria-hidden="true" class="absolute inset-y-0 w-44 left-0 hidden dark:flex">
            <div
                class="h-full md:h-1/2 lg:h-full w-full bg-gradient-to-tr opacity-40 dark:blur-2xl dark:from-[#570cac] dark:opacity-20">
            </div>
        </div>
        <div class="absolute top-14 inset-x-0 h-64 flex items-start">
            <div
                class="h-24 w-2/3 bg-gradient-to-br from-primary opacity-20 blur-2xl dark:from-[#570cac] dark:invisible dark:opacity-40">
            </div>
            <div
                class="h-20 w-3/5 bg-gradient-to-r from-[#8cd66a] opacity-40 blur-2xl dark:from-[#670ccf] dark:opacity-40">
            </div>
        </div>
        <AtomsContainer class-name="relative">
            <div class="flex justify-between pb-6 relative">
                <div class="">
                    <AtomsTitle texte="sensibilisations" />
                </div>
                <div class="flex items-center min-w-max gap-5">
                    <AtomsLinkBtn href="/sensibilisations" variant="primary">
                        Voir plus
                    </AtomsLinkBtn>
                </div>
            </div>
            <div
                class="grid grid-cols-2 items-stretch sm:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-10 sm:gap-x-5 sm:gap-y-8">

                <CardsPodCast title="Violences basées sur le genre " 
                    href="#" 
                    cover-image="/images/femme-affaires-asiatique-serieuse-donnant-presentation-equipe-multiraciale-tableau-feuilles-mobiles_1163-4630.avif" 
                    category="" 
                    created-at=""
                    description="Lorem ipsum dolor sit amet,  voluptates porro" 
                />

                <CardsPodCast title="Stop aux violences ! " 
                    href="#" 
                    cover-image="/images/femme-affaires-asiatique-serieuse-donnant-presentation-equipe-multiraciale-tableau-feuilles-mobiles_1163-4630.avif" 
                    category="" 
                    created-at=""
                    description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae voluptates porro" 
                />

                <CardsPodCast title="Briser les silences" 
                    href="#" 
                    cover-image="/images/femme-affaires-asiatique-serieuse-donnant-presentation-equipe-multiraciale-tableau-feuilles-mobiles_1163-4630.avif" 
                    category="" 
                    created-at=""
                    description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae voluptates porro" 
                />

                <CardsPodCast title="Lutter contre les violences" 
                    href="#" 
                    cover-image="/images/femme-affaires-asiatique-serieuse-donnant-presentation-equipe-multiraciale-tableau-feuilles-mobiles_1163-4630.avif" 
                    category="" 
                    created-at=""
                    description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae voluptates porro" 
                />

                <CardsPodCast title="Plaidoyer pour l’égalité" 
                    href="#" 
                    cover-image="/images/femme-affaires-asiatique-serieuse-donnant-presentation-equipe-multiraciale-tableau-feuilles-mobiles_1163-4630.avif" 
                    category="" 
                    created-at=""
                    description="Lorem ipsum dolor sit amet,  voluptates porro" 
                />

                <CardsPodCast title="Vers une société sans violence " 
                    href="#" 
                    cover-image="/images/femme-affaires-asiatique-serieuse-donnant-presentation-equipe-multiraciale-tableau-feuilles-mobiles_1163-4630.avif" 
                    category="" 
                    created-at=""
                    description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae voluptates porro" 
                />

                <CardsPodCast title="Réduire les inégalités, combattre les violences" 
                    href="#" 
                    cover-image="/images/femme-affaires-asiatique-serieuse-donnant-presentation-equipe-multiraciale-tableau-feuilles-mobiles_1163-4630.avif" 
                    category="" 
                    created-at=""
                    description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae voluptates porro" 
                />

                <CardsPodCast title="Éduquer, prévenir, agir " 
                    href="#" 
                    cover-image="/images/femme-affaires-asiatique-serieuse-donnant-presentation-equipe-multiraciale-tableau-feuilles-mobiles_1163-4630.avif" 
                    category="" 
                    created-at=""
                    description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae voluptates porro" 
                />
                
            </div>
        </AtomsContainer>
    </section>
</template>