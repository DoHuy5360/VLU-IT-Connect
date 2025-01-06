<template>
  <BasePageHeading title="Blog" subtitle="Welcome Admin!">
    <template #extra>
      <button type="button" class="btn btn-alt-primary" @click="$router.push('/administrator/blog')">
        <i class="fa fa-arrow-left opacity-50 me-1"></i>
        Back
      </button>
    </template>
  </BasePageHeading>

  <BaseBlock title="Thêm Bài Viết">
    <div class="col-lg-8 space-y-5">
      <form @submit.prevent="submitForm">
        <!-- Author Field -->
        <div class="mb-4">
          <label class="form-label" for="author">Tác Giả</label>
          <input type="text" class="form-control" id="author" v-model="formData.author" placeholder="Thêm Tên Tác Giả" required />
        </div>

        <!-- Title Field -->
        <div class="mb-4">
          <label class="form-label" for="title">Tiêu Đề</label>
          <input type="text" class="form-control" id="title" v-model="formData.title" placeholder="Thêm Tiêu Đề Bài Viết" required />
        </div>

        <!-- Slug Field -->
        <SlugInput
          :title="formData.title"
          v-model="formData.slug"
        />

        <!-- Category Field -->
        <div class="mb-4">
          <label class="form-label" for="example-select">Thể Loại</label>
          <select class="form-select" id="example-select" v-model="formData.category">
            <option value="">Chọn Thể Loại</option>
            <option value="1">Option #1</option>
            <option value="2">Option #2</option>
            <option value="3">Option #3</option>
          </select>
        </div>

        <!-- Other Fields -->
        <BaseBlock title="Editor" content-full>
          <ckeditor :editor="ClassicEditor" :config="editorConfig" v-model="editorData" />
        </BaseBlock>

        <!-- Submit Button -->
        <div class="mb-4">
          <button type="submit" class="btn btn-alt-primary bg-success">Hoàn tất</button>
          <button type="button" class="btn btn-alt-secondary bg-info" @click="$router.push('/administrator/blog/simulate')">Mô phỏng</button>
        </div>
      </form>
    </div>
  </BaseBlock>
</template>

<script setup>
import { ref } from "vue";
import SlugInput from "./components/SlugInput.vue";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const editorData = ref("<p>Thêm Nội Dung Bài Viết</p>");
const editorConfig = ref({});
let ckeditor = CKEditor.component;




const formData = ref({
  author: "",
  title: "",
  slug: "",
  category: "",
  content: "",
});

function submitForm() {
  console.log("Form submitted:", formData.value);
}
</script>

<style scoped>
/* Optional: Add specific styles */
</style>
