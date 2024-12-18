<template>
  <div id="dropzoneForm" class="dropzone"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import Dropzone from "dropzone";

const dropzoneInstance = ref(null);

onMounted(() => {
  const dropzoneElement = document.querySelector("#dropzoneForm");
  if (dropzoneElement) {
    Dropzone.autoDiscover = false;
    dropzoneInstance.value = new Dropzone(dropzoneElement, {
      url: "https://httpbin.org/post", // Replace with your upload endpoint
      maxFiles: 1,
      acceptedFiles: "video/*",
    });

    dropzoneInstance.value.on("success", (file, response) => {
      console.log("File uploaded:", file.name, response);
    });
  }
});

onBeforeUnmount(() => {
  if (dropzoneInstance.value) {
    dropzoneInstance.value.destroy();
  }
});
</script>

<style scoped>
.dropzone {
  border: 2px dashed #007bff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}
</style>
