<template>
  <div class="d-flex flex-column" style="height: 100dvh">
    <Header></Header>
    <Hero></Hero>
    <Breadcrumb></Breadcrumb>
    <div style="flex-grow: 1" class="bg-skin">
      <RouterView />
    </div>
    <Footer></Footer>
  </div>
</template>

<script setup>
import Header from "@/layouts/partials/it-connect/Header.vue";
import Footer from "@/layouts/partials/it-connect/Footer.vue";
import Hero from "@/layouts/partials/it-connect/Hero.vue";
import Breadcrumb from "@/layouts/partials/it-connect/Breadcrumb.vue";
</script>

<style lang="scss" scoped></style>
