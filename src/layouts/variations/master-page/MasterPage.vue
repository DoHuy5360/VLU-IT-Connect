<template>
  <div class="d-flex flex-column" style="height: 100dvh;">
      <Header></Header>
      <div style="flex-grow: 1;">
        <!-- Start body -->
          <div class="bg-gray" style="height: 100%;"></div>
          <!-- End body -->
      </div>
      <Footer></Footer>
  </div>
</template>

<script setup>
  import Header from "@/layouts/partials/master-page/Header.vue"
  import Footer from "@/layouts/partials/master-page/Footer.vue"
</script>

<style lang="scss" scoped></style>
