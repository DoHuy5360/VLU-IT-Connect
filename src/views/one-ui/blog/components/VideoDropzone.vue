<template>
  <div id="dropzoneForm" class="dropzone">
    <p>Drag and drop your video here or click to upload.</p>
  </div>
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
      url: "https://your-upload-endpoint.com/upload", // Replace with actual endpoint
      maxFiles: 1,
      acceptedFiles: "video/*",
      dictDefaultMessage: "Drop your video here or click to upload.",
      init: function () {
        this.on("addedfile", (file) => {
          console.log("File added:", file.name);
        });

        this.on("success", (file, response) => {
          console.log("File uploaded successfully:", file.name);
          console.log("Server response:", response);
        });

        this.on("error", (file, errorMessage) => {
          console.error("Error uploading file:", file.name, errorMessage);
        });

        this.on("removedfile", (file) => {
          console.log("File removed:", file.name);
        });
      },
    });
  }
});

onBeforeUnmount(() => {
  if (dropzoneInstance.value) {
    dropzoneInstance.value.destroy();
    dropzoneInstance.value = null;
  }
});
</script>

<style scoped>
.dropzone {
  border: 2px dashed #007bff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  background-color: #f8f9fa;
  transition: background-color 0.3s;
}

.dropzone:hover {
  background-color: #e2e6ea;
}

.dropzone p {
  margin: 0;
  color: #6c757d;
  font-size: 14px;
}
</style>
