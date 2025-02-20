<template>
    <RouterView />
</template>

<style lang="scss">
// Main Stylesheet
@import "@/assets/scss/main";
@import "flatpickr/dist/flatpickr.css";
@import "@/assets/scss/vendor/flatpickr";

// All color themes are included and available by default
// Feel free to comment out any of them if you won't use them in your project
// @import "@/assets/scss/oneui/themes/amethyst";
// @import "@/assets/scss/oneui/themes/city";
// @import "@/assets/scss/oneui/themes/flat";
// @import "@/assets/scss/oneui/themes/modern";
// @import "@/assets/scss/oneui/themes/smooth";

.hover_underline:hover {
    text-decoration: underline;
}
.hover_blue_text:hover {
    color: #0891b2;
}
.hover_red_text:hover {
    color: #d72134;
}
* {
    scroll-behavior: smooth;
    scroll-padding-top: 3rem;
    scrollbar-width: thin; /* Gán chiều rộng cho scrollbar */
}
</style>
