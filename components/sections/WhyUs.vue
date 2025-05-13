<template>
    <section class="pt-20 md:pt-24">
        <AtomsContainer>
            <div class="grid md:grid-cols-2 gap-10 xl:gap-14 relative">
                <div class="md:py-2 lg:py-4 relative">
                    <div class="absolute left-0 top-0 h-full w-full flex justify-end">
                        <span class="flex opacity-20">
                            <span class="w-16 h-32 rounded-l-full flex bg-primary blur-2xl"></span>
                            <span class="w-16 h-32 rounded-r-full flex bg-[#f88fc2] blur-2xl mt-14"></span>
                        </span>
                    </div>
                    <div class="relative">
                        <AtomsTitle texte="Découvrez une aide chatbot personnalisée, rien que pour vous." />
                        <p class=" text-sm text-gray-600 dark:text-gray-300 pt-8">
                            Ce chatbot est un assistant virtuel conçu pour écouter, soutenir et orienter toute personne confrontée à des violences sexuelles, culturelles ou liées au genre. 
                            Il offre un espace confidentiel et bienveillant pour parler, s'informer et trouver de l’aide adaptée.
                        </p>
                    <div class="space-y-4 pt-8">
                        <!-- Message de l'utilisateur -->
                        <div class="p-2 rounded-xl border border-box-border transition dark:bg-box-bg w-3/4 ml-auto">
                            <h3 class="text-gray-700 dark:text-gray-200 font-semibold text-xl">🧑moi</h3>
                            <p class="text-[12px] text-base text-gray-600 dark:text-gray-300">Je viens de subir une atrocité 😭 je ne sais pas quoi faire.</p>
                        </div>

                        <!-- Réponse du chatbot -->
                        <div class="p-2 rounded-xl border border-box-border transition bg-primary w-3/4 mr-auto">
                            <h3 class="text-gray-700 dark:text-black-800 font-semibold text-xl">✨chatbot</h3>
                             <p class="text-[12px] text-gray-900 dark:black-600">Je suis vraiment désolé d'apprendre ce que tu traverses. Peut-être que tu pourrais m'en dire un peu plus sur ce qui s'est passé ? Parler de ce que tu vis, même un peu, peut alléger le fardeau. Une fois que tu te sentiras prêt(e), il serait aussi important d'en parler à tes proches et consulter un professionnel qui pourra vraiment t'aider à surmonter cela. Tu n'es pas seul(e).</p>
                        </div>

                        <!-- Message de l'utilisateur -->
                        <div class="p-2 rounded-xl border border-box-border transition dark:bg-box-bg w-3/4 ml-auto">
                            <h3 class="text-gray-700 dark:text-gray-200 font-semibold text-xl">🧑moi</h3>
                            <p class="text-[12px] text-base text-gray-600 dark:text-gray-300">J'ai peur d'en parler, je ne sais pas si je peux faire confiance à mes proches.</p>
                        </div>
                    </div>

                        <div class="pt-10 flex">
                            <AtomsLinkBtn href="/chatbot" variant="primary">
                                Commencer le chat
                            </AtomsLinkBtn>
                        </div>
                    </div>
                </div>
                <div class="flex md:h-full relative">
                    <div
                            class="absolute z-0 top-1/2  -translate-y-1/2 w-5/6 right-0 h-[calc(80%+20px)] bg-gradient-to-tr opacity-25 from-primary to-pink-300 dark:from-[#570cac] dark:to-primary blur-2xl">
                        </div>
                    <div
                        class="w-full h-[27rem] sm:h-[30rem] md:h-full flex justify-start md:justify-end relative pb-5">
                        <img src="/images/femme.jpeg" alt="Podcast image" width="300" class="w-2/5 aspect-square absolute bottom-0 right-0 md:left-0 object-cover  rounded-t-[30%] rounded-b-[30%] border-4 border-box-border shadow-md shadow-box-shadow">
                        <img src="/images/jeunefemme.jpg" alt="Illustratuin about" width="500"
                            class="w-11/12 lg:w-5/6 h-full object-cover rounded-t-[10rem] rounded-b-[10rem] md:rounded-t-[11rem] md:rounded-b-[11rem] lg:rounded-t-[14rem] lg:rounded-b-[14rem]">
                    </div>
                </div>
            </div>
        </AtomsContainer>
    </section>
</template>