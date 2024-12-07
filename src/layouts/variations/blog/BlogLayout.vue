<template>
  <div class="d-flex flex-column" style="height: 100dvh">
    <Header></Header>
    <div style="flex-grow: 1">
      <!-- Start body -->
      <RouterView />
      <!-- End body -->
    </div>
    <Footer></Footer>
  </div>
</template>

<script setup>
import Header from "@/layouts/partials/blog/Header.vue";
import Footer from "@/layouts/partials/blog/Footer.vue";
import { RouterView } from "vue-router";
</script>

<style lang="scss" scoped></style>
