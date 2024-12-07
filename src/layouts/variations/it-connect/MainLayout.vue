<template>
  <div ref="body" class="position-relative d-flex flex-column" style="height: 100dvh; overflow-x: hidden; ">
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
  import { ref, provide } from 'vue';
  const body = ref(null)

  function disableScroll(){
    body.value.classList.toggle("stop_scroll")
  }

  provide('disableScroll', disableScroll);

</script>

<style lang="css" scoped>

.stop_scroll{
  overflow-y: hidden;
}

</style>
