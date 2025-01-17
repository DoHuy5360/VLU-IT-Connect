<template>
  <div class="d-flex flex-column" style="height: 100dvh;">
      <WebHeader></WebHeader>
      <WebHero></WebHero>
      <BreadcrumbForMasterPage></BreadcrumbForMasterPage>
      <div style="flex-grow: 1;">
        <!-- Start body -->
          <div class="bg-new-gray" style="height: 100%;"></div>
          <!-- End body -->
      </div>
      <WebFooter></WebFooter>
  </div>
</template>

<script setup>
  import WebHeader from "@/layouts/partials/master-page/WebHeader.vue"
  import WebFooter from "@/layouts/partials/master-page/WebFooter.vue"
  import WebHero from "@/layouts/partials/master-page/WebHero.vue"
  import BreadcrumbForMasterPage from "@/layouts/partials/master-page/BreadcrumbForMasterPage.vue"
</script>

<style lang="scss" scoped></style>
