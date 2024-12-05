<template>
  <div class="d-flex flex-column" style="height: 100dvh;">
      <Header></Header>
      <Hero></Hero>
      <Breadcrumb></Breadcrumb>
      <div style="flex-grow: 1;">
        <!-- Start body -->
          <div class="bg-new-gray" style="height: 100%;"></div>
          <!-- End body -->
      </div>
      <Footer></Footer>
  </div>
</template>

<script setup>
  import Header from "@/layouts/partials/master-page/Header.vue"
  import Footer from "@/layouts/partials/master-page/Footer.vue"
  import Hero from "@/layouts/partials/master-page/Hero.vue"
  import Breadcrumb from "@/layouts/partials/master-page/Breadcrumb.vue"
</script>

<style lang="scss" scoped></style>
