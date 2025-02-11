<template>
    <div class="position-relative w-100">
        <div class="position-relative overflow-hidden">
            <img src="@/../assets/media/brand/hero.png" class="hero-image" alt="Hero Image" />
            <img src="@/../assets/media/brand/hero-partial-right.png" class="hero-decoration-right" alt="Hero Decoration Right" />
            <img src="@/../assets/media/brand/hero-partial-left.png" class="hero-decoration-left" alt="Hero Decoration Left" />
        </div>
        <div class="position-absolute w-100 top-50 hero-content">
            <div class="container">
                <div class="row">
                    <div class="col">
                        <label for="searchInputHeroVer" class="text-white hero-title">{{ store.isVietNamese() ? store.heroTitleName.vn : store.heroTitleName.en }}</label>
                      
                    </div>
                    <div class="col-4 d-none d-sm-block">
                        <div class="search-container">
                            <input
                                id="searchInputHeroVer"
                                v-model="searchQuery"
                                class="search-input"
                                type="text"
                                :placeholder="`${store.isVietNamese() ? 'Nhập từ khóa tìm kiếm' : 'Search blogs by keyword'}`"
                                @keypress.enter="onSearch"
                                autofocus
                            />
                            <svg class="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" @click="onSearch">
                                <path
                                    d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                                    stroke="#171717"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path d="M22 22L20 20" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useTemplateStore } from "@/stores/template";
import { useRouter } from "vue-router";
import { ref } from "vue";

const store = useTemplateStore();
const router = useRouter();
const searchQuery = ref("");

function onSearch() {
    const trimmedQuery = searchQuery.value.trim();
    if (trimmedQuery) {
        router.push({ name: "ListResult", query: { q: trimmedQuery } });
    }
}
</script>

<style scoped>
.hero-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.hero-decoration-right {
    position: absolute;
    right: 0;
    transform: translateX(50%);
}

.hero-decoration-left {
    position: absolute;
    left: -10px;
    bottom: 0;
    transform: translateY(50%);
}

.hero-content {
    transform: translateY(-50%);
}

.hero-title {
    font-size: 2rem;
    font-weight: bold;
}

.search-container {
    display: flex;
    align-items: center;
    background-color: white;
    border-radius: 999px;
    padding: 0.5rem 1rem;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.search-input {
    flex-grow: 1;
    outline: none;
    border: none;
    font-size: 1rem;
    padding: 0.25rem 0.5rem;
}

.search-icon {
    cursor: pointer;
    transition: transform 0.2s ease;
}

.search-icon:hover {
    transform: scale(1.1);
}
</style>
