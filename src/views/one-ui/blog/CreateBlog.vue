<template>
  <BasePageHeading title="Blog" subtitle="Welcome Admin!">
    <template #extra>
      <button
        type="button"
        class="btn btn-alt-primary"
        @click="$router.push('/administrator/blog')"
      >
        <i class="fa fa-arrow-left opacity-50 me-1"></i>
        Back
      </button>
    </template>
  </BasePageHeading>

  <BaseBlock title="Thêm Bài Viết">
    <div class="col-lg-8 space-y-5">
      <form @submit.prevent="submitForm">
        <!-- Title Field -->
        <div class="mb-4">
          <label class="form-label" for="title">Tiêu Đề</label>
          <input
            type="text"
            class="form-control"
            id="title"
            v-model="formData.title"
            placeholder="Thêm Tiêu Đề Bài Viết"
            required
          />
        </div>

        <!-- Slug Field -->
        <SlugInput :title="formData.title" v-model="formData.slug" />

        <!-- Category Field -->
        <div class="mb-4">
          <label class="form-label" for="example-select">Thể Loại</label>
          <select class="form-select" id="example-select" v-model="formData.categoryId" required>
            <option value="">Chọn Thể Loại</option>
            <option v-for="category in categories" :key="category.Id" :value="category.Id">
              {{ category.Name }}
            </option>
          </select>
        </div>

        <!-- Content Editor -->
        <BaseBlock title="Editor" content-full>
          <ckeditor
            :editor="ClassicEditor"
            :config="editorConfig"
            v-model="formData.contentHtml"
          />
        </BaseBlock>

        <!-- Video Type -->
        <div class="mb-4">
          <label class="form-label" for="video-type">Loại Video</label>
          <input
            type="text"
            class="form-control"
            id="video-type"
            v-model="formData.VideoType"
            placeholder="Nhập loại video"
          />
        </div>

        <!-- Video URL -->
        <div class="mb-4">
          <label class="form-label" for="video-url">URL Video</label>
          <input
            type="url"
            class="form-control"
            id="video-url"
            v-model="formData.VideoUrl"
            placeholder="Nhập URL video"
          />
        </div>

        <!-- Video File -->
        <div class="mb-4">
          <label class="form-label" for="video-file">Tải lên Video</label>
          <input type="file" class="form-control" id="video-file" @change="handleFileUpload" />
        </div>

        <!-- Enable Comments -->
        <div class="mb-4 form-check">
          <input
            type="checkbox"
            class="form-check-input"
            id="enable-comments"
            v-model="formData.EnableComments"
          />
          <label class="form-check-label" for="enable-comments">Cho phép bình luận</label>
        </div>

        <!-- Published -->
        <div class="mb-4 form-check">
          <input
            type="checkbox"
            class="form-check-input"
            id="published"
            v-model="formData.Published"
          />
          <label class="form-check-label" for="published">Công bố</label>
        </div>

        <!-- Submit Button -->
        <div class="mb-4">
          <button type="submit" class="btn btn-alt-primary bg-success">Hoàn tất</button>
          <button
            type="button"
            class="btn btn-alt-secondary bg-info"
            @click="$router.push('/administrator/blog/simulate')"
          >
            Mô phỏng
          </button>
        </div>
      </form>
    </div>
  </BaseBlock>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import SlugInput from "./components/SlugInput.vue";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// Editor and form data
const formData = ref({
  title: "",
  slug: "",
  categoryId: "",
  contentHtml: "<p>Thêm Nội Dung Bài Viết</p>",
  VideoType: "",
  VideoUrl: "",
  VideoFile: null,
  EnableComments: false,
  Published: false,
});

const categories = ref([]);
const token = localStorage.getItem("authToken");

const editorConfig = ref({});
let ckeditor = CKEditor.component;

// Fetch categories
onMounted(() => {
  axios
    .get("/api/Categories/getallcategories", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        cateName: "",
        indexPage: 1,
        limitRange: 10,
      },
    })
    .then((response) => {
      categories.value = response.data;
    })
    .catch((error) => {
      console.error("Lỗi khi tải thể loại:", error);
      alert("Không thể tải danh sách thể loại. Vui lòng thử lại.");
    });
});

// File upload handler
function handleFileUpload(event) {
  const file = event.target.files[0];
  const validFormats = ["video/mp4", "video/avi", "video/mkv"];
  if (file && !validFormats.includes(file.type)) {
    alert("Định dạng video không được hỗ trợ. Vui lòng tải lên tệp MP4, AVI hoặc MKV.");
    return;
  }
  if (file && file.size > 50 * 1024 * 1024) {
    alert("Kích thước tệp video vượt quá 50MB.");
    return;
  }
  formData.value.VideoFile = file;
}

// Validate form
function validateForm() {
  if (!formData.value.title.trim()) {
    alert("Tiêu đề không được để trống.");
    return false;
  }
  if (!formData.value.categoryId) {
    alert("Vui lòng chọn thể loại.");
    return false;
  }
  if (formData.value.VideoUrl && !isValidURL(formData.value.VideoUrl)) {
    alert("URL video không hợp lệ.");
    return false;
  }
  return true;
}

function isValidURL(url) {
  const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return regex.test(url);
}

// Form submission
function submitForm() {
  if (!token) {
    alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    $router.push("/auth/signin");
    return;
  }

  if (!validateForm()) return;

  const formPayload = new FormData();
  Object.entries(formData.value).forEach(([key, value]) => {
    formPayload.append(key, value);
  });

  axios
    .post("/api/admin/posts", formPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log("Bài viết đã được lưu:", response.data);
      alert("Bài viết đã được thêm thành công!");
      $router.push("/administrator/blog");
    })
    .catch((error) => {
      console.error("Đã xảy ra lỗi khi thêm bài viết:", error.response?.data || error);
      alert(error.response?.data?.message || "Đã xảy ra lỗi! Vui lòng thử lại.");
    });
}
</script>

<style scoped>
/* Add any specific styles here */
</style>
