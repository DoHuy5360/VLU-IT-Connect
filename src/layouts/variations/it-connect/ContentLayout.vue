<template>
    <div class="d-flex flex-column" style="height: 100dvh">
        <WebHeader></WebHeader>
        <WebHero></WebHero>
        <BreadcrumbForUsers></BreadcrumbForUsers>
        <div style="flex-grow: 1" class="bg-skin">
            <RouterView />
        </div>
        <WebFooter></WebFooter>
    </div>
</template>

<script setup>
import WebHeader from "@/layouts/partials/it-connect/WebHeader.vue";
import WebFooter from "@/layouts/partials/it-connect/WebFooter.vue";
import WebHero from "@/layouts/partials/it-connect/WebHero.vue";
import BreadcrumbForUsers from "@/layouts/partials/it-connect/BreadcrumbForUsers.vue";
</script>

<style lang="scss" scoped></style>
