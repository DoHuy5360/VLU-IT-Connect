<template>
  <div class="d-flex flex-column" style="height: 100dvh;">
      <Header></Header>
      <div style="flex-grow: 1;" class="bg-skin">
          <RouterView />
      </div>
      <Footer></Footer>
  </div>
</template>

<script setup>
  import Header from "@/layouts/partials/it-connect/Header.vue"
  import Footer from "@/layouts/partials/it-connect/Footer.vue"
</script>

<style lang="scss" scoped></style>
