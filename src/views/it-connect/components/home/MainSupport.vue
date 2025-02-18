<template>
    <div class="w-100 h-100" id="heroOverlay" style="display: grid; place-items: center">
        <div class="d-none d-sm-flex flex-column align-items-center" id="search">
            <label for="searchInput" class="text-white mb-3" style="font-weight: 600; font-size: 2rem">
                {{ store.isVietNamese() ? "Bạn cần giúp đỡ vấn đề gì?" : "What can I assist you?" }}
            </label>
            <div class="bg-white rounded-pill px-2 py-1 d-flex align-items-center" style="height: fit-content; width: 450px; height: 40px">
                <input
                    id="searchInput"
                    type="text"
                    style="outline: none; border: none"
                    autofocus
                    @keypress.enter="onSearch"
                    v-model="searchQuery"
                    ref="searchInput"
                    class="w-100"
                    :placeholder="store.isVietNamese() ? 'Tìm kiếm...' : 'Search...'"
                />
                <svg style="cursor: pointer; user-select: none" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" @click="onSearch">
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
    <div class="w-100 bg-new-gray position-relative" style="bottom: 0" id="wrapThreeRepresentItems">
        <div class="position-absolute w-100" id="threeRepresentItems" style="opacity: 0.9">
            <div class="container">
                <div class="row justify-content-center bg-white rounded">
                    <RouterLink to="/categories" class="hover_underline col-sm-4 p-3 text-black">
                        <img :src="store.getOtherAsset('/browse_knowledge.png')" style="object-fit: cover; display: block; width: 100%; height: 120px" alt="" />
                        <div class="d-flex flex-column mt-2">
                            <b>{{ store.isVietNamese() ? "Kiến thức Công nghệ thông tin" : "Information Technology knowledge" }}</b>
                            <span style="">{{
                                store.isVietNamese()
                                    ? "Tìm kiếm thông tin để khắc phục sự cố hoặc tìm hiểu cách thực hiện những gì bạn cần."
                                    : "Find information to troubleshoot problems or learn how to do what you need."
                            }}</span>
                        </div>
                    </RouterLink>
                    <div class="col-sm-4 p-3">
                        <img :src="store.getOtherAsset('/submit_a_ticket.png')" style="object-fit: cover; display: block; width: 100%; height: 120px" alt="" />
                        <div class="d-flex flex-column mt-2">
                            <b>{{ store.isVietNamese() ? "Yêu cầu hỗ trợ" : "Request support" }}</b>
                            <span style="">{{
                                store.isVietNamese()
                                    ? "Hỗ trợ nhanh theo các danh mục dịch vụ Công nghệ thông tin sẵn có."
                                    : "Quick support according to available Information Technology service categories."
                            }}</span>
                        </div>
                    </div>
                    <div class="col-sm-4 p-3">
                        <RouterLink to="/support" class="hover_underline text-black">
                            <img :src="store.getOtherAsset('/request_something.png')" style="object-fit: cover; display: block; width: 100%; height: 120px" alt="" />
                            <div class="d-flex flex-column mt-2">
                                <b>{{ store.isVietNamese() ? "Trợ giúp" : "Help" }}</b>
                                <span style="">{{
                                    store.isVietNamese()
                                        ? "Bạn không tìm thấy những thông tin cần thiết trên đây? Hãy liên hệ với bộ phận Hỗ trợ dịch vụ CNTT."
                                        : "Didn't find the necessary information above? Contact IT Service Support."
                                }}</span>
                            </div>
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useTemplateStore } from "@/stores/template";
import { RouterLink, useRouter } from "vue-router";
const store = useTemplateStore();

const router = useRouter();
const searchQuery = ref("");
const searchInput = ref(null);

function onSearch() {
    const trimmedQuery = searchQuery.value.trim();
    if (trimmedQuery) {
        router.push({ name: "ListResult", query: { q: trimmedQuery } });
    } else {
        searchInput.value.focus();
    }
}
</script>

<style lang="scss" scoped></style>
