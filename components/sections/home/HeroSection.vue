<template>
    <section class="relative w-full">
        <div class="absolute top-0 inset-x-0 h-64 flex items-start">
            <div
                class="h-24 w-2/3 bg-gradient-to-br from-primary opacity-20 blur-2xl dark:from-[#570cac] dark:invisible dark:opacity-40">
            </div>
            <div
                class="h-20 w-3/5 bg-gradient-to-r from-[#8cd66a] opacity-40 blur-2xl dark:from-[#670ccf] dark:opacity-40">
            </div>
        </div>
        <AtomsContainer class-name="relative">
            <div aria-hidden="true" class="absolute inset-y-0 w-44 left-0 hidden dark:flex">
                <div
                    class="h-full md:h-1/2 lg:h-full w-full bg-gradient-to-tr opacity-40 dark:blur-2xl dark:from-[#570cac] dark:opacity-20">
                </div>
            </div>
            <div
                class="grid lg:grid-cols-2 gap-10 xl:gap-14 relative pt-24 lg:max-w-none max-w-2xl md:max-w-3xl mx-auto">
                <div class="lg:py-6">
                    <div class="text-center lg:text-left">
                        <span class="px-2 py-1 rounded-md bg-gray-100 dark:bg-body text-primary ">Lorem ipsum dolor </span>
                        <h1 class="text-gray-800 pt-4 dark:text-white font-bold text-4xl md:text-5xl lg:text-6xl">
                            Lorem ipsum  <br> amet <span
                                class="text-transparent bg-clip-text bg-gradient-to-br from-primary to-[#8cd66a]">possimus</span>
                                illo consequatur
                        </h1>
                    </div>

                    <p class="text-gray-600 dark:text-gray-300 pt-8 text-center lg:text-left mx-auto max-w-xl">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, beatae omnis ipsa magnam neque
                        ut nam nesciunt esse fugit praesentium hic magni possimus illo consequatur.
                    </p>

                    <div class="flex items-center gap-3 pt-9 flex-col sm:flex-row sm:w-max sm:mx-auto lg:mx-0">
                        <AtomsLinkBtn href="/about" variant="primary" class="w-full sm:w-max flex justify-center">
                            Nous contacter
                        </AtomsLinkBtn>

                        <AtomsLinkBtn href="#" variant="costum" costum-span-class="px-6 md:px-7 hover:bg-primary/10"
                            costum-text-color="text-primary ">
                            <div class="flex items-center gap-3">
                                <span class="p-2 rounded-full border border-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3">
  <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.06-.24c1.12.37 2.33.57 3.53.57a1 1 0 0 1 1 1v3.1a1 1 0 0 1-1 1A17.92 17.92 0 0 1 2 4a1 1 0 0 1 1-1h3.1a1 1 0 0 1 1 1c0 1.2.2 2.41.57 3.53a1 1 0 0 1-.24 1.06l-2.2 2.2z"/>
</svg>

                                </span>

                                <span>
                                    +03692569874361
                                </span>
                            </div>
                        </AtomsLinkBtn>
                    </div>
                   
                </div>
                <div class="lg:h-full  hidden md:flex">

                    <div
                        class="flex w-full h-96 min-h-[24rem] lg:min-h-[none] lg:w-full lg:h-full items-center relative">
                        <div
                            class="absolute z-0 top-1/2  -translate-y-1/2 w-5/6 right-0 h-[calc(80%+20px)] bg-gradient-to-tr opacity-25 from-primary to-pink-300 dark:from-[#570cac] dark:to-primary blur-2xl">
                        </div>
                        <div
                            class="absolute w-3/5 h-full z-10 p-1 -translate-y-1/2 top-1/2 right-3 rounded-3xl bg-white dark:bg-body shadow-lg shadow-box-shadow border border-box-border">
                            <img src="/images/home/business-8415251_1280.jpg" alt="In studio" width="500" height="auto" loading="lazy"
                                class="w-full h-full rounded-2xl object-cover">
                        </div>
                        <div
                            class="absolute  -translate-y-1/2 top-1/2 h-[calc(80%-2rem)] w-[calc(40%-20px)] p-1 rounded-3xl bg-white dark:bg-body shadow-lg shadow-box-shadow border border-box-border ">
                            <img src="/images/home/bookkeeper-1016299_1280.jpg" alt="Happy in studio" width="200" height="auto"
                                loading="lazy" class="w-full h-full rounded-2xl object-cover">
                        </div>
                    </div>
                </div>
            </div>
        </AtomsContainer>
    </section>
</template>