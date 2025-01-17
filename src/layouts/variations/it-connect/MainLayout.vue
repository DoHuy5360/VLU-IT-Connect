<template>
  <div ref="body" class="position-relative d-flex flex-column" style="height: 100dvh; overflow-x: hidden; ">
      <WebHeader></WebHeader>
      <div style="flex-grow: 1;" class="bg-skin">
          <RouterView />
      </div>
      <WebFooter></WebFooter>
  </div>
</template>

<script setup>
  import WebHeader from "@/layouts/partials/it-connect/WebHeader.vue"
  import WebFooter from "@/layouts/partials/it-connect/WebFooter.vue"
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
