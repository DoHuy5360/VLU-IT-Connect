<template>
  <BasePageHeading title="Tạo Bài Viết" subtitle="">
    <template #extra>
      <button
        type="button"
        class="btn btn-alt-primary"
        @click="$router.push('/administrator/blog')"
        :style="`display: ${isPreviewMode ? 'none' : ''}`"
      >
        <i class="fa fa-arrow-left opacity-50 me-1"></i>
        Quay lại
      </button>
    </template>
  </BasePageHeading>

  <div class="content" :style="`display: ${isPreviewMode ? '' : 'none'}`">
    <div class="mb-4">
      <button
        type="button"
        class="btn btn-alt-primary"
        @click="switchToPreviewMode(false)"
      >
        <i class="fa fa-arrow-left opacity-50 me-1"></i>
        Quay lại
      </button>
    </div>
    <h3>Xem trước giao diện bài viết ở màn hình tìm kiếm</h3>
    <div class="bg-white rounded p-4 mb-4" style="">
      <strong class="" style="font-size: 1.2rem">{{
        previewBlogData?.title
      }}</strong>
      <div class="text-muted">{{ previewBlogData?.excerpt }}</div>
    </div>
    <hr />
    <h3>Xem trước giao diện ở màn hình xem chi tiết bài viết</h3>
    <div class="bg-white rounded mb-4 p-4">
      <div class="d-flex gap-3 text-muted mb-3">
        <strong>{{ getDayFromDate(new Date()) }}</strong>
        <span class="text-primary clickable-text">{{
          previewBlogData?.categoryName
        }}</span>
      </div>
      <div class="d-flex justify-content-start">
        <img
          :src="previewBlogData?.image"
          class="w-100 rounded mb-3"
          style="object-fit: contain"
          alt="Ảnh bìa"
        />
      </div>
      <h4 class="mb-3">{{ previewBlogData?.title }}</h4>
      <div
        id="blogContent"
        class="text-muted mb-3"
        v-html="previewBlogData?.details"
      ></div>
      <div
        v-if="previewBlogData?.video !== null"
        class=""
        style="height: 100vh"
      >
        <iframe
          :src="previewBlogData?.video"
          width="100%"
          height="100%"
          frameborder="0"
          allowfullscreen
          class="rounded"
          title="Guiding clips"
        ></iframe>
      </div>
      <br />
      <strong>{{ previewBlogData?.author }}</strong>
    </div>
    <div class="mb-4">
      <button
        type="button"
        class="btn btn-alt-primary"
        @click="switchToPreviewMode(false)"
      >
        <i class="fa fa-arrow-left opacity-50 me-1"></i>
        Quay lại
      </button>
    </div>
  </div>
  <div class="content" :style="`display: ${isPreviewMode ? 'none' : ''}`">
    <BaseBlock title="">
      <div class="space-y-5 pb-4">
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label for="title" class="form-label">Tiêu đề</label>
            <input
              id="title"
              type="text"
              v-model="state.title"
              @input="generateSlug"
              @blur="v$.title.$touch"
              class="form-control"
              :class="{ 'is-invalid': v$.title.$errors.length }"
            />
            <div v-if="v$.title.$errors.length" class="invalid-feedback">
              <span v-if="v$.title.$errors[0].$validator === 'required'">
                Hãy nhập tiêu đề
              </span>
            </div>
            <div v-if="v$.title.$errors.length" class="invalid-feedback">
              <span v-if="v$.title.$errors[0].$validator === 'maxLength'"
                >Quá giới hạn ký tự cho phép
              </span>
            </div>
          </div>

          <div>
            <label class="form-label" for="slug">Slug</label>
            <input
              id="slug"
              type="text"
              v-model="state.slug"
              @blur="v$.slug.$touch"
              class="form-control"
              :class="{ 'is-invalid': v$.slug.$errors.length }"
            />
            <div v-if="v$.slug.$errors.length" class="invalid-feedback">
              <span v-if="v$.slug.$errors[0].$validator === 'required'">
                Hãy nhập slug
              </span>
            </div>
            <div v-if="v$.slug.$errors.length" class="invalid-feedback">
              <span v-if="v$.slug.$errors[0].$validator === 'maxLength'"
                >Quá giới hạn ký tự cho phép
              </span>
            </div>
          </div>
          <!-- Category -->
          <div>
            <label class="form-label">Thể loại</label>
            <select
              v-model="state.categoryId"
              class="form-control"
              @blur="v$.categoryId.$touch"
              :class="{ 'is-invalid': v$.categoryId.$errors.length }"
              title="Chọn thể loại bài viết"
            >
              <option value="">-- Chọn --</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ `${repeatChar("-", category.NestDepth)} ${category.name}` }}
              </option>
            </select>
            <div v-if="v$.categoryId.$errors.length" class="invalid-feedback">
              <span v-if="v$.categoryId.$errors[0].$validator === 'required'">
                Hãy chọn thể loại
              </span>
            </div>
          </div>
          <!-- Excerpt -->
          <div>
            <label for="excerpt" class="form-label">Mô tả ngắn</label>
            <textarea
              id="excerpt"
              v-model="state.excerpt"
              class="form-control"
              placeholder=""
              @blur="v$.excerpt.$touch"
              :class="{ 'is-invalid': v$.excerpt.$errors.length }"
            ></textarea>
            <div v-if="v$.excerpt.$errors.length" class="invalid-feedback">
              <span v-if="v$.excerpt.$errors[0].$validator === 'maxLength'"
                >Quá giới hạn ký tự cho phép
              </span>
            </div>
          </div>

          <!-- Content -->
          <div>
            <label class="form-label">Nội dung</label>
            <ckeditor
              :editor="editor"
              :config="editorConfig"
              v-model="state.contentHtml"
            ></ckeditor>
          </div>

          <!-- Image -->
          <div>
            <label for="image-file" class="form-label">Ảnh</label>
            <input
              @blur="v$.image.$touch"
              :class="{ 'is-invalid': v$.image.$errors.length }"
              type="file"
              id="image-file"
              accept=".jpg, .jpeg, .png,"
              @change="createImageBlob"
              class="form-control"
            />
            <div v-if="v$.image.$errors.length" class="invalid-feedback">
              <span v-if="v$.image.$errors[0].$validator === 'required'">
                Không được để trống
              </span>
            </div>
            <span
              v-if="v$.image.$errors.some((e) => e.$validator === 'maxSize')"
              class="invalid-feedback"
            >
              Kích thước tệp không được vượt quá 5MB.
            </span>
          </div>

          <!-- Video -->
          <div>
            <label class="form-label">Loại Video</label>
            <div class="form-check">
              <input
                type="radio"
                class="form-check-input"
                id="upload-none"
                value="none"
                v-model="state.videoType"
              />
              <label class="form-check-label" for="upload-none"
                >Không dùng video</label
              >
            </div>
            <div class="form-check">
              <input
                type="radio"
                class="form-check-input"
                id="upload-link"
                value="link"
                v-model="state.videoType"
              />
              <label class="form-check-label" for="upload-link"
                >Gắn đường dẫn video</label
              >
            </div>
            <div class="form-check">
              <input
                type="radio"
                class="form-check-input"
                id="upload-file"
                value="file"
                v-model="state.videoType"
              />
              <label class="form-check-label" for="upload-file"
                >Tải video từ máy</label
              >
            </div>
          </div>

          <div v-if="state.videoType == 'link'">
            <label for="videoLink" class="form-label">Video link</label>
            <input
              id="videoLink"
              v-model="state.videoUrl"
              class="form-control"
              @blur="v$.videoUrl.$touch()"
              :class="{ 'is-invalid': v$.videoUrl.$errors.length }"
            />
            <div v-if="v$.videoUrl.$errors.length" class="invalid-feedback">
              <span v-if="v$.videoUrl.$errors[0].$validator === 'url'">
                Không hợp lệ
              </span>
            </div>
          </div>

          <div v-if="state.videoType == 'file'">
            <label for="videoFile" class="form-label">Video file</label>
            <input
              id="videoFile"
              type="file"
              accept="video/*"
              @change="createVideoBlob"
              class="form-control"
            />
          </div>

          <div style="user-select: none">
            <div class="form-check">
              <label class="form-check-label" for="publish">Công bố</label>
              <input
                class="form-check-input"
                type="checkbox"
                v-model="state.published"
                id="publish"
              />
            </div>
            <div class="form-check">
              <label class="form-check-label" for="allowComment"
                >Cho phép bình luận</label
              >
              <input
                class="form-check-input"
                type="checkbox"
                v-model="state.AllowComment"
                id="allowComment"
              />
            </div>
            <div class="form-check">
              <label class="form-check-label" for="commentCensorship"
                >Kiểm duyệt bình luận</label
              >
              <input
                class="form-check-input"
                type="checkbox"
                v-model="state.CommentCensorship"
                id="commentCensorship"
              />
            </div>
          </div>
          <div class="d-flex gap-2 flex-wrap">
            <button
              type="button"
              class="btn btn-alt-primary"
              @click="$router.push('/administrator/blog')"
            >
              <i class="fa fa-arrow-left opacity-50 me-1"></i>Quay lại
            </button>
            <button type="submit" class="btn btn-success">Hoàn tất</button>
            <button
              type="button"
              class="btn btn-alt-secondary"
              @click="navigateToSimulation"
            >
              Xem trước
            </button>
          </div>
        </form>
      </div>
    </BaseBlock>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Swal from "sweetalert2";
import { CustomUploadAdapter } from "./uploadAdapter";
import useVuelidate from "@vuelidate/core";
import { required, minLength, maxLength, url } from "@vuelidate/validators";
import { authRequest } from "../accountmanager/service/axiosConfig";

const state = reactive({
  title: "",
  slug: "",
  categoryId: "",
  excerpt: "",
  contentHtml: "",
  image: null,
  videoType: "none",
  videoUrl: "",
  video: null,
  enableComments: false,
  published: true,
  AllowComment: true,
  CommentCensorship: false,
});
// Validate
const maxSize = (size) => (value) => {
  return !value || value.size <= size;
};
const rules = {
  title: { required, maxLength: maxLength(225) },
  slug: { required, maxLength: maxLength(200) },
  excerpt: { maxLength: maxLength(160) },
  categoryId: { required },
  image: { maxSize: maxSize(5 * 1024 * 1024) },
  videoUrl: { url },
};

const v$ = useVuelidate(rules, state);

// Slug
function generateSlug() {
  state.slug = state.title
    .toLowerCase()
    .normalize("NFD") // Chuyển thành dạng decomposed để tách dấu
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d") // Chuyển đ -> d
    .replace(/[^a-z0-9\s-]/g, "") // Loại bỏ ký tự đặc biệt
    .trim()
    .replace(/\s+/g, "-"); // Chuyển khoảng trắng thành dấu gạch ngang
}

const editorConfig = ref({
  placeholder: "Nội dung bài viết ...",
  extraPlugins: [CustomUploadAdapterPlugin], // Kích hoạt plugin upload
});

const router = useRouter();

const categories = ref([]);

async function getCategories() {
  try {
    const response = await authRequest.get("/Categories/getallcategories", {
      params: { cateName: "", indexPage: 1, limitRange: 100 },
    });
    const categoryTree = response.data?.data?.categories.$values;

    if (categoryTree.length !== 0) {
      spreadCategory(categoryTree);
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

getCategories();

const repeatChar = (char, times) => char.repeat(times);

function spreadCategory(categoryJsonTree) {
  for (let index = 0; index < categoryJsonTree.length; index++) {
    const category = categoryJsonTree[index];
    if (category.Children.$values.length === 0) {
      categories.value.push({
        id: category.Id,
        name: category.Name,
        NestDepth: category.NestDepth,
      });
    } else {
      categories.value.push({
        id: category.Id,
        name: category.Name,
        NestDepth: category.NestDepth,
      });
      spreadCategory(category.Children.$values);
    }
  }
}

const submitForm = async () => {
  v$.value.$touch(); // Đánh dấu tất cả các trường
  if (v$.value.$invalid) {
    console.log("khong hop le");
    console.log(v$.value);
    return;
  } else {
    console.log("hop le");
    console.log(state);
  }
  try {
    const formData = new FormData();
    formData.append("Title", state.title.trim());
    formData.append("Slug", state.slug);
    formData.append("CategoryIds[0]", state.categoryId);
    formData.append("ContentHtml", state.contentHtml);
    formData.append("Files", state.image);
    formData.append("Excerpt", state.excerpt);
    formData.append("Published", state.published);
    formData.append("EnableComments", false);
    formData.append("VideoType", state.videoType);
    formData.append("VideoUrl", state.videoUrl);
    formData.append("VideoFile", state.video);
    formData.append("AllowComment", state.AllowComment);
    formData.append("CommentCensorship", state.CommentCensorship);

    await authRequest.post("/admin/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const userConfirmed = await Swal.fire({
      title: "Tạo bài viết thành công",
      text: "",
      icon: "success",
      showCancelButton: false,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (userConfirmed.isConfirmed) {
      router.push("/administrator/blog");
    }
  } catch (error) {
    console.error("Error creating post:", error);

    await Swal.fire({
      title: "Lỗi khi tạo bài viết",
      text: error.response.data.error,
      icon: "error",
    });
  }
};

const previewImageUrl = ref(null);
const previewVideoUrl = ref(null);
const createImageBlob = (event) => {
  const file = event.target.files[0];
  if (file) {
    previewImageUrl.value = URL.createObjectURL(file);

    state.image = file; // Cập nhật state
    v$.value.image.$touch(); // Kích hoạt kiểm tra lỗi ngay sau khi chọn file
  }
};
const createVideoBlob = (event) => {
  const file = event.target.files[0];
  if (file) {
    previewVideoUrl.value = URL.createObjectURL(file);

    state.video = file;
  }
};

const previewBlogData = ref({});
const isPreviewMode = ref(false);

const navigateToSimulation = () => {
  const selectedCategory = categories.value.filter(
    (category) => category.id === parseInt(state.categoryId)
  );

  previewBlogData.value = {
    title: state.title.trim(),
    details: state.contentHtml,
    categoryName:
      selectedCategory.length != 0
        ? selectedCategory[0].name
        : "[Tên thể loại sẽ hiển thị ở đây]",
    image:
      previewImageUrl.value ||
      "/../assets/media/brand/30_years_vertical_version.png",
    video:
      state.videoType !== "none"
        ? state.videoType === "link"
          ? state.videoUrl
          : previewVideoUrl.value
        : null,
    author: "[Tên tác giả sẽ hiển thị ở đây]",
    excerpt: state.excerpt,
  };
  switchToPreviewMode(true);
};

function getDayFromDate(stringDate) {
  const date = new Date(stringDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function switchToPreviewMode(status) {
  isPreviewMode.value = status;
}

function CustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new CustomUploadAdapter(loader);
  };
}

const editor = ClassicEditor;
</script>
<style>
#blogContent img {
  max-width: 100%;
}
</style>
