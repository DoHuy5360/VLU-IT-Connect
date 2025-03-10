<template>
  <div :style="{overflowY: store.body.allowedScroll ? 'scroll' : 'hidden !important'}" class="position-relative d-flex flex-column" style="height: 100dvh; overflow-x: hidden;">
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
  import { useTemplateStore } from "../../../stores/template";
  const store = useTemplateStore()
</script>