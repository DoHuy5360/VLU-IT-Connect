<template>
  <BasePageHeading title="Blog" subtitle="Welcome Admin!">
    <template #extra>
      <button type="button" class="btn btn-alt-primary" @click="$router.push('/administrator/blog')">
        <i class="fa fa-arrow-left opacity-50 me-1"></i>
        Back
      </button>
    </template>
  </BasePageHeading>

  <BaseBlock title="Create Blog">
    <div class="col-lg-8 space-y-5">
      <form @submit.prevent="submitForm">
        <!-- Author Field -->
        <div class="mb-4">
          <label class="form-label" for="author">Author</label>
          <input type="text" class="form-control" id="author" v-model="formData.author" placeholder="Enter author name" required />
        </div>

        <!-- Title Field -->
        <div class="mb-4">
          <label class="form-label" for="title">Title</label>
          <input type="text" class="form-control" id="title" v-model="formData.title" placeholder="Enter blog title" required />
        </div>

        <!-- Category Field -->
        <div class="mb-4">
          <label class="form-label" for="example-select">Select Category</label>
          <select class="form-select" id="example-select" name="example-select">
            <option selected>Open this select category</option>
            <option value="1">Option #1</option>
            <option value="2">Option #2</option>
            <option value="3">Option #3</option>
            <option value="4">Option #4</option>
            <option value="5">Option #5</option>
            <option value="6">Option #6</option>
            <option value="7">Option #7</option>
            <option value="8">Option #8</option>
            <option value="9">Option #9</option>
            <option value="10">Option #10</option>
          </select>
        </div>

        <!-- Video Upload Option -->
        <div class="mb-4">
          <label class="form-label">Upload Video</label>
          <div class="form-check">
            <input type="radio" class="form-check-input" id="upload-link" value="link" v-model="uploadOption.type" />
            <label class="form-check-label" for="upload-link">Link</label>
          </div>
          <div class="form-check">
            <input type="radio" class="form-check-input" id="upload-file" value="file" v-model="uploadOption.type" />
            <label class="form-check-label" for="upload-file">Upload File</label>
          </div>
        </div>

        <!-- Conditional Inputs for Video Upload -->
        <div v-if="uploadOption.type === 'link'" class="mb-4">
          <label class="form-label" for="video-link">Video Link</label>
          <input type="url" class="form-control" id="video-link" v-model="formData.videoLink" placeholder="Enter video link" />
        </div>

        <div v-if="uploadOption.type === 'file'" class="mb-4">
          <VideoDropzone />
        </div>

        <!-- Blog Content -->
        <BaseBlock title="Editor" content-full>
          <ckeditor :editor="ClassicEditor" :config="editorConfig" v-model="editorData" />
        </BaseBlock>
        <div class="mb-4">
          <span class="text-muted">Enable Auto Comments</span>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="auto-comments-switch" v-model="formData.autoComments" />
            <label class="form-check-label" for="auto-comments-switch">Auto</label>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="mb-4">
          <button type="submit" class="btn btn-alt-primary bg-success">Done</button>
          <button type="button" class="btn btn-alt-secondary bg-info" @click="$router.push('/administrator/blog/simulate')">Simulate</button>
        </div>
      </form>
    </div>
  </BaseBlock>
</template>

<script setup>
import { ref } from "vue";
import VideoDropzone from "./components/VideoDropzone.vue";
import CKEditor from "@ckeditor/ckeditor5-vue";

// You can import one of the following CKEditor variation (only one at a time)
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// CKEditor 5 variables
let ckeditor = CKEditor.component;

const editorData = ref("<p>Hello CKEditor5!</p>");
const editorConfig = ref({});

const formData = ref({
  author: "",
  title: "",
  category: "",
  videoLink: "",
  content: "",
});

const uploadOption = ref({
  type: "", // 'link' or 'file'
});

function submitForm() {
  console.log("Form submitted:", formData.value);
}
</script>

<style scoped>
.dropzone {
  border: 2px dashed #007bff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}
</style>
