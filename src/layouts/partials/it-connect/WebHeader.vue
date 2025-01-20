<template>
    <div class="bg-secondary d-none d-sm-block">
        <div class="container">
            <div class="d-flex gap-4 justify-content-end align-items-center">
                <div class="bg-primary text-white p-2 text-center">
                    {{ store.isVietNamese() ? "Trang Chủ" : "Home" }}
                </div>
                <div class="text-white">
                    {{
                        store.isVietNamese()
                            ? "Dịch vụ CNTT dành cho: Khách | Sinh viên | Cán bộ - Giảng viên - Nhân viên"
                            : "Information Technology services for: Guest | Student | Staff - Lecture - Employee"
                    }}
                </div>
                <div class="position-relative">
                    <div @click="toggleLanguageChoice" style="cursor: pointer">
                        <div v-if="store.app.language === 'VN'" class="d-flex gap-1 justify-content-end align-items-center">
                            <!-- Viet Nam flag icon -->
                            <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M10.872 1.18918H2.73747C1.33166 1.18918 0.192017 2.27254 0.192017 3.60892V16.3921C0.192017 17.7284 1.33166 18.8118 2.73747 18.8118H25.4544C26.8602 18.8118 27.9999 17.7284 27.9999 16.3921V3.60892C27.9999 2.27254 26.8602 1.18918 25.4544 1.18918H10.872Z"
                                    fill="#D80027"
                                />
                                <path
                                    d="M14.0956 4.90355L15.3264 8.50457H19.3095L16.0871 10.7301L17.318 14.3312L14.0955 12.1056L10.8731 14.3312L12.104 10.7301L8.88153 8.50457H12.8647L14.0955 4.90355H14.0956Z"
                                    fill="#FFDA44"
                                />
                            </svg>
                            <span class="text-white">VN</span>
                        </div>
                        <div v-if="store.app.language === 'EN'" class="d-flex gap-1 justify-content-end align-items-center">
                            <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_1241_1955)">
                                    <path
                                        d="M25.9031 1.28175H2.097C0.938815 1.28175 0 2.17406 0 3.27488V16.7249C0 17.8256 0.938815 18.718 2.097 18.718H25.9031C27.0611 18.718 28 17.8256 28 16.7249V3.27488C28 2.17406 27.0612 1.28175 25.9031 1.28175Z"
                                        fill="#41479B"
                                    />
                                    <path
                                        d="M27.971 2.94543C27.8057 2.00155 26.943 1.28175 25.9031 1.28175H25.3575L16.4139 6.85111V1.2818H11.5862V6.85118L2.64264 1.2818H2.09702C1.05702 1.2818 0.19433 2.00155 0.029054 2.94548L7.67315 7.7057H0V12.2942H7.67315L0.029054 17.0543C0.19433 17.9982 1.05702 18.718 2.09702 18.718H2.64264L11.5862 13.1486V18.718H16.4139V13.1486L25.3575 18.718H25.9031C26.943 18.718 27.8057 17.9982 27.971 17.0543L20.3269 12.2941H28V7.7056H20.3269L27.971 2.94543Z"
                                        fill="#F5F5F5"
                                    />
                                    <path d="M15.4482 1.28175H12.5517V8.62328H0V11.3764H12.5517V18.7179H15.4482V11.3764H28V8.62328H15.4482V1.28175Z" fill="#FF4B55" />
                                    <path d="M1.3562 18.5895L11.5599 12.2941H9.78654L0.504761 18.0207C0.731883 18.2727 1.02376 18.4701 1.3562 18.5895Z" fill="#FF4B55" />
                                    <path d="M18.9429 12.2942H17.1696L27.0525 18.3915C27.329 18.2189 27.5598 17.9858 27.7245 17.7119L18.9429 12.2942Z" fill="#FF4B55" />
                                    <path d="M0.221558 2.38375L8.84743 7.7057H10.6208L0.846427 1.67512C0.583987 1.86079 0.369234 2.10354 0.221558 2.38375Z" fill="#FF4B55" />
                                    <path d="M18.1872 7.70566L27.486 1.96849C27.2562 1.71738 26.9621 1.52111 26.6274 1.404L16.4138 7.70564H18.1872L18.1872 7.70566Z" fill="#FF4B55" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_1241_1955">
                                        <rect width="28" height="19.355" fill="white" transform="translate(0 0.322502)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <span class="text-white">EN</span>
                        </div>
                    </div>
                    <div v-if="isShowLanguageChoice" class="language_choice_wrapper bg-white rounded position-absolute shadow" style="overflow: hidden">
                        <div @click="selectLanguage('VN')" :class="(store.app.language === 'VN' && 'bg-primary ') + 'language_option d-flex gap-1 px-3 py-1'" style="cursor: pointer">
                            <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M10.872 1.18918H2.73747C1.33166 1.18918 0.192017 2.27254 0.192017 3.60892V16.3921C0.192017 17.7284 1.33166 18.8118 2.73747 18.8118H25.4544C26.8602 18.8118 27.9999 17.7284 27.9999 16.3921V3.60892C27.9999 2.27254 26.8602 1.18918 25.4544 1.18918H10.872Z"
                                    fill="#D80027"
                                />
                                <path
                                    d="M14.0956 4.90355L15.3264 8.50457H19.3095L16.0871 10.7301L17.318 14.3312L14.0955 12.1056L10.8731 14.3312L12.104 10.7301L8.88153 8.50457H12.8647L14.0955 4.90355H14.0956Z"
                                    fill="#FFDA44"
                                />
                            </svg>
                            <span>VN</span>
                        </div>
                        <div @click="selectLanguage('EN')" :class="(store.app.language === 'EN' && 'bg-primary ') + 'language_option d-flex gap-1 px-3 py-1'" style="cursor: pointer">
                            <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_1241_1955)">
                                    <path
                                        d="M25.9031 1.28175H2.097C0.938815 1.28175 0 2.17406 0 3.27488V16.7249C0 17.8256 0.938815 18.718 2.097 18.718H25.9031C27.0611 18.718 28 17.8256 28 16.7249V3.27488C28 2.17406 27.0612 1.28175 25.9031 1.28175Z"
                                        fill="#41479B"
                                    />
                                    <path
                                        d="M27.971 2.94543C27.8057 2.00155 26.943 1.28175 25.9031 1.28175H25.3575L16.4139 6.85111V1.2818H11.5862V6.85118L2.64264 1.2818H2.09702C1.05702 1.2818 0.19433 2.00155 0.029054 2.94548L7.67315 7.7057H0V12.2942H7.67315L0.029054 17.0543C0.19433 17.9982 1.05702 18.718 2.09702 18.718H2.64264L11.5862 13.1486V18.718H16.4139V13.1486L25.3575 18.718H25.9031C26.943 18.718 27.8057 17.9982 27.971 17.0543L20.3269 12.2941H28V7.7056H20.3269L27.971 2.94543Z"
                                        fill="#F5F5F5"
                                    />
                                    <path d="M15.4482 1.28175H12.5517V8.62328H0V11.3764H12.5517V18.7179H15.4482V11.3764H28V8.62328H15.4482V1.28175Z" fill="#FF4B55" />
                                    <path d="M1.3562 18.5895L11.5599 12.2941H9.78654L0.504761 18.0207C0.731883 18.2727 1.02376 18.4701 1.3562 18.5895Z" fill="#FF4B55" />
                                    <path d="M18.9429 12.2942H17.1696L27.0525 18.3915C27.329 18.2189 27.5598 17.9858 27.7245 17.7119L18.9429 12.2942Z" fill="#FF4B55" />
                                    <path d="M0.221558 2.38375L8.84743 7.7057H10.6208L0.846427 1.67512C0.583987 1.86079 0.369234 2.10354 0.221558 2.38375Z" fill="#FF4B55" />
                                    <path d="M18.1872 7.70566L27.486 1.96849C27.2562 1.71738 26.9621 1.52111 26.6274 1.404L16.4138 7.70564H18.1872L18.1872 7.70566Z" fill="#FF4B55" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_1241_1955">
                                        <rect width="28" height="19.355" fill="white" transform="translate(0 0.322502)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <span>EN</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="bg-white py-2">
        <div class="container">
            <div class="row justify-content-between">
                <img src="@/../assets/media/brand/vlu_logo_final_vlu_logo_ngang_eng.png" class="col-sm-2 col-5 image-responsive" style="object-fit: contain" alt="Van Lang Logo" />
                <div class="col d-flex gap-2 align-items-center justify-content-end d-sm-none">
                    <!-- Search icon -->
                    <span @click="toggleSearchBar">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                                stroke="#171717"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path d="M22 22L20 20" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </span>
                    <!-- Hamburger icon -->
                    <span @click="toggleHeaderInMobileView">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M18.9613 12.8714H5.03867C4.80789 12.8714 4.58656 12.7798 4.42337 12.6166C4.26019 12.4534 4.16851 12.2321 4.16851 12.0013C4.16851 11.7705 4.26019 11.5492 4.42337 11.386C4.58656 11.2228 4.80789 11.1311 5.03867 11.1311H18.9613C19.1921 11.1311 19.4134 11.2228 19.5766 11.386C19.7398 11.5492 19.8315 11.7705 19.8315 12.0013C19.8315 12.2321 19.7398 12.4534 19.5766 12.6166C19.4134 12.7798 19.1921 12.8714 18.9613 12.8714ZM22.5 19.9024C22.5 19.6716 22.4083 19.4503 22.2451 19.2871C22.0819 19.1239 21.8606 19.0322 21.6298 19.0322H2.37017C2.13938 19.0322 1.91805 19.1239 1.75487 19.2871C1.59168 19.4503 1.5 19.6716 1.5 19.9024C1.5 20.1332 1.59168 20.3545 1.75487 20.5177C1.91805 20.6809 2.13938 20.7725 2.37017 20.7725H21.6298C21.8597 20.7695 22.0793 20.6769 22.2418 20.5144C22.4044 20.3518 22.497 20.1322 22.5 19.9024ZM22.5 4.10017C22.497 3.87032 22.4044 3.65073 22.2418 3.48819C22.0793 3.32565 21.8597 3.23301 21.6298 3.23H2.37017C2.13938 3.23 1.91805 3.32168 1.75487 3.48487C1.59168 3.64806 1.5 3.86939 1.5 4.10017C1.5 4.33095 1.59168 4.55228 1.75487 4.71547C1.91805 4.87866 2.13938 4.97034 2.37017 4.97034H21.6298C21.8606 4.97034 22.0819 4.87866 22.2451 4.71547C22.4083 4.55228 22.5 4.33095 22.5 4.10017Z"
                                fill="#252F4A"
                            />
                        </svg>
                    </span>
                </div>
                <div class="col d-none d-sm-flex gap-4 justify-content-end align-items-center text-end menu" style="font-weight: bold">
                    <a href="#frequentlyQuestions" style="cursor: pointer; color: black;">
                        {{ store.isVietNamese() ? "Các câu hỏi thường gặp" : "Frequently asked questions" }}
                    </a>
                    <div style="cursor: pointer">
                        {{ store.isVietNamese() ? "Yêu cầu hỗ trợ" : "Request support" }}
                    </div>
                    <div style="cursor: pointer">
                        {{ store.isVietNamese() ? "Quy định - Chính sách" : "Regulation - Policy" }}
                    </div>
                    <div style="cursor: pointer">
                        {{ store.isVietNamese() ? "Liên hệ" : "Contact" }}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div ref="searchBar" class="container my-2 d-none">
        <div class="bg-white rounded-pill px-2 py-1 d-flex align-items-center border border-grey">
            <input type="text" style="outline: none; border: none; width: 400px" autofocus />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <div class="d-sm-none position-absolute bg-white w-100 z-2 h-100" style="top: 0; left: 100%; transition: 300ms linear" ref="headerAsSidebar">
        <div class="d-flex justify-content-between p-3">
            <div>
                <img src="@/../assets/media/brand/vlu_logo_final_vlu_logo_ngang_eng.png" class="col-sm-2 col-5 image-responsive" style="object-fit: contain" alt="Van Lang Logo" />
            </div>
            <div @click="toggleHeaderInMobileView" style="width: 24px">
                <!-- Close header sidebar icon -->
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M19.4325 6.10068C19.8558 5.67731 19.8558 4.9909 19.4325 4.56753C19.0091 4.14416 18.3227 4.14416 17.8993 4.56753L12 10.4668L6.10068 4.56753C5.67731 4.14416 4.9909 4.14416 4.56753 4.56753C4.14416 4.9909 4.14416 5.67731 4.56753 6.10068L10.4668 12L4.56753 17.8993C4.14416 18.3227 4.14416 19.0091 4.56753 19.4325C4.9909 19.8558 5.67731 19.8558 6.10068 19.4325L12 13.5332L17.8993 19.4325C18.3227 19.8558 19.0091 19.8558 19.4325 19.4325C19.8558 19.0091 19.8558 18.3227 19.4325 17.8993L13.5332 12L19.4325 6.10068Z"
                        fill="black"
                    />
                </svg>
            </div>
        </div>
        <div class="d-flex gap-2 p-3">
            <div class="d-flex gap-2">
                <!-- Viet Nam flag icon -->
                <div>
                    <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10.872 1.18918H2.73747C1.33166 1.18918 0.192017 2.27254 0.192017 3.60892V16.3921C0.192017 17.7284 1.33166 18.8118 2.73747 18.8118H25.4544C26.8602 18.8118 27.9999 17.7284 27.9999 16.3921V3.60892C27.9999 2.27254 26.8602 1.18918 25.4544 1.18918H10.872Z"
                            fill="#D80027"
                        />
                        <path
                            d="M14.0956 4.90355L15.3264 8.50457H19.3095L16.0871 10.7301L17.318 14.3312L14.0955 12.1056L10.8731 14.3312L12.104 10.7301L8.88153 8.50457H12.8647L14.0955 4.90355H14.0956Z"
                            fill="#FFDA44"
                        />
                    </svg>
                </div>
                <span>VN</span>
            </div>
            <span>|</span>
            <div class="d-flex gap-2">
                <!-- UK flag icon -->
                <div>
                    <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_1241_1955)">
                            <path
                                d="M25.9031 1.28175H2.097C0.938815 1.28175 0 2.17406 0 3.27488V16.7249C0 17.8256 0.938815 18.718 2.097 18.718H25.9031C27.0611 18.718 28 17.8256 28 16.7249V3.27488C28 2.17406 27.0612 1.28175 25.9031 1.28175Z"
                                fill="#41479B"
                            />
                            <path
                                d="M27.971 2.94543C27.8057 2.00155 26.943 1.28175 25.9031 1.28175H25.3575L16.4139 6.85111V1.2818H11.5862V6.85118L2.64264 1.2818H2.09702C1.05702 1.2818 0.19433 2.00155 0.029054 2.94548L7.67315 7.7057H0V12.2942H7.67315L0.029054 17.0543C0.19433 17.9982 1.05702 18.718 2.09702 18.718H2.64264L11.5862 13.1486V18.718H16.4139V13.1486L25.3575 18.718H25.9031C26.943 18.718 27.8057 17.9982 27.971 17.0543L20.3269 12.2941H28V7.7056H20.3269L27.971 2.94543Z"
                                fill="#F5F5F5"
                            />
                            <path d="M15.4482 1.28175H12.5517V8.62328H0V11.3764H12.5517V18.7179H15.4482V11.3764H28V8.62328H15.4482V1.28175Z" fill="#FF4B55" />
                            <path d="M1.3562 18.5895L11.5599 12.2941H9.78654L0.504761 18.0207C0.731883 18.2727 1.02376 18.4701 1.3562 18.5895Z" fill="#FF4B55" />
                            <path d="M18.9429 12.2942H17.1696L27.0525 18.3915C27.329 18.2189 27.5598 17.9858 27.7245 17.7119L18.9429 12.2942Z" fill="#FF4B55" />
                            <path d="M0.221558 2.38375L8.84743 7.7057H10.6208L0.846427 1.67512C0.583987 1.86079 0.369234 2.10354 0.221558 2.38375Z" fill="#FF4B55" />
                            <path d="M18.1872 7.70566L27.486 1.96849C27.2562 1.71738 26.9621 1.52111 26.6274 1.404L16.4138 7.70564H18.1872L18.1872 7.70566Z" fill="#FF4B55" />
                        </g>
                        <defs>
                            <clipPath id="clip0_1241_1955">
                                <rect width="28" height="19.355" fill="white" transform="translate(0 0.322502)" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>
                <span>EN</span>
            </div>
        </div>
        <div>
            <div class="bg-primary-active text-white px-3 py-2" style="font-weight: 600">Trang chủ</div>
            <div class="bg-secondary-active text-white px-3 py-2" style="font-weight: 600">Dịch vụ CNTT dành cho</div>
            <ul class="bg-secondary text-white mb-0" style="list-style-type: none">
                <li class="p-2" style="font-weight: 600">Khách</li>
                <li class="p-2" style="font-weight: 600">Sinh viên</li>
                <li class="p-2" style="font-weight: 600">Cán bộ - Giảng viên - Nhân viên</li>
            </ul>
            <div class="bg-white text-secondary px-3 py-2 border border-b" style="font-weight: bold">
                {{ store.isVietNamese() ? "Các câu hỏi thường gặp" : "Frequently asked questions" }}
            </div>
            <div class="bg-white text-secondary px-3 py-2 border border-b" style="font-weight: bold">
                {{ store.isVietNamese() ? "Yêu cầu hỗ trợ" : "Request support" }}
            </div>
            <div class="bg-white text-secondary px-3 py-2 border border-b" style="font-weight: bold">
                {{ store.isVietNamese() ? "Quy định - Chính sách" : "Regulation - Policy" }}
            </div>
            <div class="bg-white text-secondary px-3 py-2 border border-b" style="font-weight: bold">
                {{ store.isVietNamese() ? "Liên hệ" : "Contact" }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { inject } from "vue";
import { useTemplateStore } from "@/stores/template";

const isShowLanguageChoice = ref(false);

const store = useTemplateStore();

const disableScroll = inject("disableScroll");

const headerAsSidebar = ref(null);
const searchBar = ref(null);
const isSelectLanguageChoice = ref(false);

function toggleHeaderInMobileView() {
    headerAsSidebar.value.classList.toggle("header_visibility");
    disableScroll();
}

function toggleSearchBar() {
    searchBar.value.classList.toggle("search_bar_visibility");
}

function toggleLanguageChoice(e) {
    e.stopPropagation();
    isSelectLanguageChoice.value = true;
    isShowLanguageChoice.value = !isShowLanguageChoice.value;
}

function selectLanguage(lang) {
    store.setLanguage(lang);
    isShowLanguageChoice.value = false;
}

function handleClickOutside(e) {
    e.stopPropagation();
    if (isShowLanguageChoice.value && isSelectLanguageChoice.value) {
        isShowLanguageChoice.value = false;
    }
}

onMounted(() => {
    window.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
    window.removeEventListener("click", handleClickOutside);
});
</script>

<style lang="css" scoped>
.header_visibility {
    left: 0 !important;
}
.search_bar_visibility {
    display: block !important;
}

@media (max-width: 576px) {
    .menu {
        font-size: 14px;
    }
}

@media (min-width: 577px) and (max-width: 768px) {
    .menu {
        font-size: 16px;
    }
}

@media (min-width: 769px) {
    .menu {
        font-size: 0.9rem;
    }
}
</style>
