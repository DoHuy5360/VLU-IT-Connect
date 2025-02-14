<template>
    <div class="gap-3" style="display: grid" id="hero">
        <div class="w-100 bg-new-gray" style="display: flex; flex-direction: column; background-repeat: no-repeat" id="heroLandscape">
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
                                <img src="@/../assets/media/other/browse_knowledge.png" style="object-fit: cover; display: block; width: 100%; height: 120px" alt="" />
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
                                <img src="@/../assets/media/other/submit_a_ticket.png" style="object-fit: cover; display: block; width: 100%; height: 120px" alt="" />
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
                                    <img src="@/../assets/media/other/request_something.png" style="object-fit: cover; display: block; width: 100%; height: 120px" alt="" />
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
        </div>
        <div class="d-flex flex-column gap-3">
            <div class="container py-2">
                <div class="row gap-4" id="wrapQuestionAndNotification">
                    <div class="col col-sm-12 col-lg-7 rounded p-3 bg-white shadow-sm">
                        <h4 class="mb-4" style="font-weight: bold" id="frequentlyQuestions">{{ store.isVietNamese() ? "Các câu hỏi thường gặp" : "Frequently questions" }}</h4>
                        <div class="d-flex flex-column gap-3">
                            <div class="d-flex gap-2">
                                <div style="width: 24px">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z"
                                            fill="#171717"
                                        />
                                        <path
                                            d="M10.74 16.28C10.55 16.28 10.36 16.21 10.21 16.06C9.91999 15.77 9.91999 15.29 10.21 15L13.21 12L10.21 9.00003C9.91999 8.71003 9.91999 8.23003 10.21 7.94003C10.5 7.65003 10.98 7.65003 11.27 7.94003L14.8 11.47C15.09 11.76 15.09 12.24 14.8 12.53L11.27 16.06C11.12 16.21 10.93 16.28 10.74 16.28Z"
                                            fill="#171717"
                                        />
                                    </svg>
                                </div>
                                <RouterLink to="/blog/detail/how-to-access-to-the-van-lang-wifi" class="text-black hover_underline">
                                    <div class="hover_underline" style="cursor: pointer">{{ store.isVietNamese() ? "Truy cập Wifi Văn Lang như thế nào?" : "How to access to the Văn Lang Wifi" }}</div>
                                </RouterLink>
                            </div>
                            <div class="d-flex gap-2">
                                <div style="width: 24px">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z"
                                            fill="#171717"
                                        />
                                        <path
                                            d="M10.74 16.28C10.55 16.28 10.36 16.21 10.21 16.06C9.91999 15.77 9.91999 15.29 10.21 15L13.21 12L10.21 9.00003C9.91999 8.71003 9.91999 8.23003 10.21 7.94003C10.5 7.65003 10.98 7.65003 11.27 7.94003L14.8 11.47C15.09 11.76 15.09 12.24 14.8 12.53L11.27 16.06C11.12 16.21 10.93 16.28 10.74 16.28Z"
                                            fill="#171717"
                                        />
                                    </svg>
                                </div>
                                <RouterLink to="/blog/detail/how-to-use-my-email" class="text-black hover_underline">
                                    <div class="hover_underline" style="cursor: pointer">{{ store.isVietNamese() ? "Địa chỉ email của em là gì và sử dụng như thế nào?" : "How to use my email" }}</div>
                                </RouterLink>
                            </div>
                            <div class="d-flex gap-2">
                                <div style="width: 24px">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z"
                                            fill="#171717"
                                        />
                                        <path
                                            d="M10.74 16.28C10.55 16.28 10.36 16.21 10.21 16.06C9.91999 15.77 9.91999 15.29 10.21 15L13.21 12L10.21 9.00003C9.91999 8.71003 9.91999 8.23003 10.21 7.94003C10.5 7.65003 10.98 7.65003 11.27 7.94003L14.8 11.47C15.09 11.76 15.09 12.24 14.8 12.53L11.27 16.06C11.12 16.21 10.93 16.28 10.74 16.28Z"
                                            fill="#171717"
                                        />
                                    </svg>
                                </div>
                                <RouterLink to="/blog/detail/what-accounts-are-included-in-student-it-services-accounts" class="text-black hover_underline">
                                    <div class="hover_underline" style="cursor: pointer">
                                        {{
                                            store.isVietNamese()
                                                ? "Tài khoản các dịch vụ CNTT của sinh viên bao gồm những tài khoản nào?"
                                                : "What accounts are included in student IT services accounts"
                                        }}
                                    </div>
                                </RouterLink>
                            </div>
                            <div class="d-flex gap-2">
                                <div style="width: 24px">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z"
                                            fill="#171717"
                                        />
                                        <path
                                            d="M10.74 16.28C10.55 16.28 10.36 16.21 10.21 16.06C9.91999 15.77 9.91999 15.29 10.21 15L13.21 12L10.21 9.00003C9.91999 8.71003 9.91999 8.23003 10.21 7.94003C10.5 7.65003 10.98 7.65003 11.27 7.94003L14.8 11.47C15.09 11.76 15.09 12.24 14.8 12.53L11.27 16.06C11.12 16.21 10.93 16.28 10.74 16.28Z"
                                            fill="#171717"
                                        />
                                    </svg>
                                </div>
                                <RouterLink to="/blog/detail/how-to-change-the-it-services-password" class="text-black hover_underline">
                                    <div class="hover_underline" style="cursor: pointer">
                                        {{ store.isVietNamese() ? "Em muốn thay đổi mật khẩu các dịch vụ CNTT thì làm như thế nào?" : "How to change the IT services's password" }}
                                    </div>
                                </RouterLink>
                            </div>
                            <div class="d-flex gap-2">
                                <div style="width: 24px">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z"
                                            fill="#171717"
                                        />
                                        <path
                                            d="M10.74 16.28C10.55 16.28 10.36 16.21 10.21 16.06C9.91999 15.77 9.91999 15.29 10.21 15L13.21 12L10.21 9.00003C9.91999 8.71003 9.91999 8.23003 10.21 7.94003C10.5 7.65003 10.98 7.65003 11.27 7.94003L14.8 11.47C15.09 11.76 15.09 12.24 14.8 12.53L11.27 16.06C11.12 16.21 10.93 16.28 10.74 16.28Z"
                                            fill="#171717"
                                        />
                                    </svg>
                                </div>
                                <RouterLink to="/blog/detail/how-to-use-microsoft-teams" class="text-black hover_underline">
                                    <div class="hover_underline" style="cursor: pointer">{{ store.isVietNamese() ? "Sử dụng Microsoft Teams như thế nào?" : "How to use Microsoft Teams" }}</div>
                                </RouterLink>
                            </div>
                            <div class="d-flex gap-2">
                                <div style="width: 24px">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z"
                                            fill="#171717"
                                        />
                                        <path
                                            d="M10.74 16.28C10.55 16.28 10.36 16.21 10.21 16.06C9.91999 15.77 9.91999 15.29 10.21 15L13.21 12L10.21 9.00003C9.91999 8.71003 9.91999 8.23003 10.21 7.94003C10.5 7.65003 10.98 7.65003 11.27 7.94003L14.8 11.47C15.09 11.76 15.09 12.24 14.8 12.53L11.27 16.06C11.12 16.21 10.93 16.28 10.74 16.28Z"
                                            fill="#171717"
                                        />
                                    </svg>
                                </div>
                                <RouterLink to="/blog/detail/how-to-login-to-elearning" class="text-black hover_underline">
                                    <div class="hover_underline" style="cursor: pointer">{{ store.isVietNamese() ? "Đăng nhập vào trang Elearning như thế nào?" : "How to login to Elearning" }}</div>
                                </RouterLink>
                            </div>
                            <div class="d-flex gap-2">
                                <div style="width: 24px">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z"
                                            fill="#171717"
                                        />
                                        <path
                                            d="M10.74 16.28C10.55 16.28 10.36 16.21 10.21 16.06C9.91999 15.77 9.91999 15.29 10.21 15L13.21 12L10.21 9.00003C9.91999 8.71003 9.91999 8.23003 10.21 7.94003C10.5 7.65003 10.98 7.65003 11.27 7.94003L14.8 11.47C15.09 11.76 15.09 12.24 14.8 12.53L11.27 16.06C11.12 16.21 10.93 16.28 10.74 16.28Z"
                                            fill="#171717"
                                        />
                                    </svg>
                                </div>
                                <RouterLink to="/blog/detail/how-to-find-courses-on-elearning" class="text-black hover_underline">
                                    <div class="hover_underline" style="cursor: pointer">
                                        {{ store.isVietNamese() ? "Làm thế nào để tìm được lớp học trên Elearning?" : "How to find courses on Elearning" }}
                                    </div>
                                </RouterLink>
                            </div>
                            <div class="d-flex gap-2">
                                <div style="width: 24px">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z"
                                            fill="#171717"
                                        />
                                        <path
                                            d="M10.74 16.28C10.55 16.28 10.36 16.21 10.21 16.06C9.91999 15.77 9.91999 15.29 10.21 15L13.21 12L10.21 9.00003C9.91999 8.71003 9.91999 8.23003 10.21 7.94003C10.5 7.65003 10.98 7.65003 11.27 7.94003L14.8 11.47C15.09 11.76 15.09 12.24 14.8 12.53L11.27 16.06C11.12 16.21 10.93 16.28 10.74 16.28Z"
                                            fill="#171717"
                                        />
                                    </svg>
                                </div>
                                <RouterLink to="/blog/detail/i-cant-enroll-to-my-elearning-course-help" class="text-black hover_underline">
                                    <div class="hover_underline" style="cursor: pointer">
                                        {{ store.isVietNamese() ? "Em không ghi danh được vào lớp học trên trang E-learning thì phải làm sao?" : "I can't enroll to my Elearning course, HELP!!!" }}
                                    </div>
                                </RouterLink>
                            </div>
                        </div>
                    </div>
                    <div class="col col-sm-12 col-lg rounded p-3 bg-white shadow-sm">
                        <h4 class="mb-4" style="font-weight: bold">{{ store.isVietNamese() ? "Thông báo" : "News" }}</h4>
                        <div class="d-flex flex-column gap-2">
                            <div v-for="post in news" :key="post.id" class="background_gradient_pink rounded rounded-pill">
                                <div class="d-flex gap-1 align-items-center py-1 px-2">
                                    <div style="width: 12px">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M3.57564 1.57999C3.80995 1.33987 4.18985 1.33987 4.42417 1.57999L8.42417 5.679C8.65848 5.91911 8.65848 6.30841 8.42417 6.54853L4.64639 10.4198C4.41207 10.6599 4.03218 10.6599 3.79786 10.4198C3.56355 10.1797 3.56355 9.7904 3.79786 9.55028L7.15138 6.11376L3.57564 2.44952C3.34132 2.2094 3.34132 1.8201 3.57564 1.57999Z"
                                                fill="#252F4A"
                                            />
                                        </svg>
                                    </div>
                                    <RouterLink :to="`/blog/detail/${post.slug}`" class="hover_underline w-100 text-black" style="cursor: pointer">
                                        <!-- {{ store.isVietNamese() ? "Nâng cấp hệ thống Wifi và dịch vụ CNTT" : "Update Wifi system and IT services" }} -->
                                        <div>{{ store.truncateText(post.title, 50) }}</div>
                                    </RouterLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container py-3 bg-white rounded mb-3 shadow-sm">
                <div class="d-flex justify-content-between">
                    <h4 class="" style="font-weight: bold">{{ store.isVietNamese() ? "Clip hướng dẫn sử dụng" : "Guiding clips" }}</h4>
                    <RouterLink to="/videos" class="text-primary hover_underline">
                        <b>{{ store.isVietNamese() ? "Xem tất cả" : "View all" }}</b>
                    </RouterLink>
                </div>
                <div class="row" id="wrapVideo">
                    <div v-for="post in posts" :key="post.id" class="col-auto col-sm-4">
                        <iframe width="100%" height="200px" :src="post.video" frameborder="0" allowfullscreen class="rounded" title="Guiding clips"></iframe>
                        <RouterLink :to="`/blog/detail/${post.slug}`" :title="post.title" class="text-black hover_underline">
                            <strong>{{ post.title }}</strong>
                            <div>{{ store.truncateText(post.excerpt, 100) }}</div>
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useTemplateStore } from "../../stores/template";

import { guestRequest } from "../one-ui/accountmanager/service/axiosConfig";

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
const posts = ref([]);
async function getBlogsHasVideo() {
    const response = await guestRequest.get(`/posts?PageNumber=1&PageSize=3&HasVideo=true`);
    posts.value = response.data?.data.map((post) => ({
        title: post.title,
        excerpt: post.excerpt,
        video: store.parseMetadataVideo(post.metadata),
        slug: post.slug,
    }));
}
getBlogsHasVideo();

const news = ref([]);
async function getBlogsAsNews() {
    const response = await guestRequest.get(`/posts?PageNumber=1&PageSize=5`);
    news.value = response.data?.data.map((post) => ({
        title: post.title,
        slug: post.slug,
    }));
}
getBlogsAsNews();
</script>

<style lang="css" scoped>
.background_gradient_pink {
    background: linear-gradient(to right, #ffebe9, #ffffff);
}
/* màn hình nhỏ */
@media (max-width: 576px) {
    #hero {
        grid-template-rows: 800px 1fr;
    }
    #wrapThreeRepresentItems {
        height: 100%;
    }
    #heroOverlay {
        background: none !important;
    }
    #threeRepresentItems {
        bottom: 15px;
    }
    #heroLandscape {
        background-size: contain;
        background-position: top;
        background-image: url("@/../assets/media/brand/cropped_landscape.png");
    }
    #wrapQuestionAndNotification {
        display: flex !important;
        flex-direction: column-reverse;
    }
    #wrapVideo {
        display: flex !important;
        flex-direction: column;
    }
}
/* màn hình lớn */
@media (min-width: 576px) {
    #hero {
        grid-template-rows: 550px 1fr;
    }
    #threeRepresentItems {
        bottom: 15px;
    }
    #wrapThreeRepresentItems {
        height: 120px;
    }
    #heroLandscape {
        background-size: cover;
        background-position: center;
        height: 100%;
        background-image: url("@/../assets/media/brand/vlu_landscape-compressed.jpg");
    }
    #search {
        transform: translateY(-50%);
    }
}
/* Tablet */
@media (min-width: 767px) and (max-width: 885px) {
    #wrapQuestionAndNotification {
        display: flex !important;
        flex-direction: column-reverse;
    }
}
</style>
