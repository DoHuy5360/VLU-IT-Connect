<template>
    <div class="gap-3" style="display: grid" id="hero">
        <div
            class="d-none d-sm-flex w-100 bg-new-gray heroLandscape"
            style="display: flex; flex-direction: column; background-repeat: no-repeat"
            :style="`background-image: url(${store.getBrandAsset('/vlu_landscape-compressed.jpg')})`"
        >
            <MainSupport />
        </div>
        <div
            class="d-flex d-sm-none w-100 bg-new-gray heroLandscape"
            style="display: flex; flex-direction: column; background-repeat: no-repeat"
            :style="`background-image: url(${store.getBrandAsset('/cropped_landscape.png')})`"
        >
            <MainSupport />
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
                                <RouterLink to="/blog/detail/truy-cap-wifi-van-lang-nhu-the-nao" class="text-black hover_underline">
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
                                <RouterLink to="/blog/detail/dia-chi-email-cua-em-la-gi-va-su-dung-nhu-the-nao" class="text-black hover_underline">
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
                                <RouterLink to="/blog/detail/tai-khoan-cac-dich-vu-cntt-cua-sinh-vien-bao-gom-nhung-tai-khoan-nao" class="text-black hover_underline">
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
                                <RouterLink to="/blog/detail/em-muon-thay-doi-mat-khau-cac-dich-vu-cntt-thi-lam-nhu-the-nao" class="text-black hover_underline">
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
                                <RouterLink to="/blog/detail/su-dung-microsoft-teams-nhu-the-nao" class="text-black hover_underline">
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
                                <RouterLink to="/blog/detail/dang-nhap-vao-trang-elearning-nhu-the-nao" class="text-black hover_underline">
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
                                <RouterLink to="/blog/detail/lam-the-nao-de-tim-duoc-lop-hoc-tren-elearning" class="text-black hover_underline">
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
                                <RouterLink to="/blog/detail/em-khong-ghi-danh-duoc-vao-lop-hoc-tren-trang-e-learning-thi-phai-lam-sao" class="text-black hover_underline">
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
                                        <div>{{ store.truncateText(post.title, 40) }}</div>
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
                        <video
                            v-if="store.isMP4(post.video)"
                            width="100%"
                            height="150px"
                            :src="post.video"
                            frameborder="0"
                            controls
                            allowfullscreen
                            class="rounded w-100"
                            title="Guiding clips"
                        ></video>
                        <iframe v-else width="100%" height="150px" :src="post.video" frameborder="0" allowfullscreen class="rounded" title="Guiding clips"></iframe>
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
import { RouterLink } from "vue-router";
import { useTemplateStore } from "../../stores/template";

import { guestRequest } from "../one-ui/accountmanager/service/axiosConfig";
import MainSupport from "./components/home/MainSupport.vue";

const store = useTemplateStore();

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

<style lang="css">
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
    .heroLandscape {
        background-size: contain;
        background-position: top;
        /* background-image: url("@/../assets/media/brand/cropped_landscape.png"); */
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
    .heroLandscape {
        background-size: cover;
        background-position: center;
        height: 100%;
        /* background-image: url("@/../assets/media/brand/vlu_landscape-compressed.jpg"); */
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
