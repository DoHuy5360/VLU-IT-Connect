<template>
    <div class="position-relative w-100">
        <div class="position-relative overflow-hidden">
            <img src="../../../../public/assets/media/brand/hero.png" style="width: 100%; height: 200px;" class="" alt="">
            <img src="../../../../public/assets/media/brand/hero-partial-right.png" style="right: 0; transform: translateX(50%);" class="position-absolute" alt="">
            <img src="../../../../public/assets/media/brand/hero-partial-left.png" style="left: -10px; bottom: 0; transform: translateY(50%);" class="position-absolute" alt="">
        </div>
        <div class="d-flex position-absolute top-50 w-100 justify-content-between align-items-center px-5" style="transform: translateY(-50%);">
            <span class="text-white d-flex flex-column" style="line-height: 2.2rem;">
                <span v-if="heroTitles[0]!=undefined" style="font-size: 2rem; font-weight: 600;">
                    {{ heroTitles[0] }}
                </span>
                <span v-if="heroTitles[1]!=undefined" style="font-size: 2rem;">
                    {{ heroTitles[1] }}
                </span>
            </span>
            <div class="bg-white rounded-pill px-2 py-1 d-flex">
                <input
                    type="text"
                    style="
                        outline: none;
                        border: none;
                        width: 400px;
                    "
                    autofocus
                />
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                        stroke="#171717"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M22 22L20 20"
                        stroke="#171717"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </div>
        </div>
    </div>
</template>

<script setup>
   import {useRoute} from 'vue-router'
   import { computed } from 'vue';
   const route = useRoute()
   const metaInfo = computed(() => route.meta)
   const heroTitles = metaInfo.value.heroTitles

</script>

<style lang="scss" scoped>

</style>