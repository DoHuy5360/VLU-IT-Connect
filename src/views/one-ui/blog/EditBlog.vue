<template>
  <BasePageHeading title="Chỉnh Sửa Bài Viết" subtitle="">
      <template #extra>
          <button type="button" class="btn btn-alt-primary" @click="$router.push('/administrator/blog')">
              <i class="fa fa-arrow-left opacity-50 me-1"></i>
              Quay lại
          </button>
      </template>
  </BasePageHeading>

  <div class="content">
      <BaseBlock title="">
          <div class="space-y-5 w-full pb-4">
              <form @submit.prevent="submitForm" class="w-full">
                  <!-- Title Field -->
                  <div>
                      <label for="title" class="form-label">Tiêu đề</label>
                      <input id="title" v-model="state.title" @input="generateSlug" @blur="v$.title.$touch" class="form-control" :class="{ 'is-invalid': v$.title.$errors.length }" />
                      <div v-if="v$.title.$errors.length" class="invalid-feedback">
                          <span v-if="v$.title.$errors[0].$validator === 'required'"> Hãy nhập tiêu đề </span>
                      </div>
                  </div>

                  <div>
                      <label class="form-label" for="slug">Slug</label>
                      <input id="slug" type="text" v-model="state.slug" @blur="v$.slug.$touch" class="form-control" :class="{ 'is-invalid': v$.slug.$errors.length }" />
                      <div v-if="v$.slug.$errors.length" class="invalid-feedback">
                          <span v-if="v$.slug.$errors[0].$validator === 'required'"> Hãy nhập slug </span>
                      </div>
                  </div>

                  <!-- Category Field -->
                  <div class="mb-4">
                      <label class="form-label">Thể loại</label>
                      <select v-model="state.categoryId" class="form-control" @blur="v$.categoryId.$touch" :class="{ 'is-invalid': v$.categoryId.$errors.length }" title="Chọn thể loại bài viết">
                          <option v-for="category in categories" :key="category.id" :value="category.id">
                              {{ `${repeatChar("-", category.NestDepth)} ${category.name}` }}
                          </option>
                      </select>
                      <div v-if="v$.categoryId.$errors.length" class="invalid-feedback">
                          <span v-if="v$.categoryId.$errors[0].$validator === 'required'"> Hãy chọn thể loại </span>
                      </div>
                  </div>

                  <!-- Excerpt -->
                  <div class="mb-4">
                      <label for="excerpt" class="form-label">Mô tả ngắn</label>
                      <textarea id="excerpt" v-model="state.excerpt" class="form-control" placeholder=""></textarea>
                  </div>

                  <!-- Blog Content -->
                  <div class="mb-4">
                      <label class="form-label" for="">Nội dung</label>
                      <ckeditor :editor="ClassicEditor" :config="editorConfig" v-model="state.contentHtml" />
                  </div>

                  <!-- Image -->
                  <div class="mb-4">
                      <div v-if="state.imageURL !== ''" class="row">
                          <div class="col-4">
                              <img
                                  :src="state.imageURL"
                                  class="img-fluid w-100"
                                  style=""
                                  alt="Ảnh bìa của bài viết"
                                  @error="
                                      () => {
                                          state.imageURL = store.getBrandAsset('/30_years_vertical_version.png');
                                      }
                                  "
                              />
                          </div>
                      </div>
                      <div v-else>Bài viết này hiện chưa có ảnh bìa</div>
                      <br />
                      <label for="image-file" class="form-label">Đổi hình ảnh</label>
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
                          <span v-if="v$.image.$errors[0].$validator === 'required'"> Không được để trống </span>
                      </div>
                      <span v-if="v$.image.$errors.some((e) => e.$validator === 'maxSize')" class="invalid-feedback"> Kích thước tệp không được vượt quá 5MB. </span>
                  </div>

                  <!-- Video Upload Option -->
                  <div class="mb-4">
                      <div class="mb-4">
                          <label class="form-label">Video hiện tại</label>
                          <div v-if="state.videoUrl !== null" class="row">
                              <div class="col-4" style="">
                                  <video v-if="store.isMP4(state.videoUrl)" :src="state.videoUrl" controls class="rounded w-100"></video>
                                  <iframe v-else width="100%" height="200px" :src="state.videoUrl" frameborder="0" allowfullscreen class="rounded" title="Guiding clips"></iframe>
                              </div>
                          </div>
                          <div v-else class="text-muted">Chưa có video</div>
                      </div>
                      <label class="form-label" for="">Loại video</label>
                      <div class="form-check">
                          <input type="radio" class="form-check-input" id="upload-link" value="none" v-model="state.videoType" />
                          <label class="form-check-label" for="upload-link">Không dùng video</label>
                      </div>
                      <div class="form-check">
                          <input
                              type="radio"
                              class="form-check-input"
                              id="upload-link"
                              value="link"
                              v-model="state.videoType"
                              @blur="v$.videoUrl.$touch()"
                              :class="{ 'is-invalid': v$.videoUrl.$errors.length }"
                          />
                          <label class="form-check-label" for="upload-link">Gắn đường dẫn video</label>
                          <div v-if="v$.videoUrl.$errors.length" class="invalid-feedback">
                              <span v-if="v$.videoUrl.$errors[0].$validator === 'url'"> Không hợp lệ </span>
                          </div>
                      </div>
                      <div class="form-check">
                          <input type="radio" class="form-check-input" id="upload-file" value="file" v-model="state.videoType" />
                          <label class="form-check-label" for="upload-file">Tải video từ máy</label>
                      </div>
                  </div>

                  <!-- Conditional Inputs for Video Upload -->
                  <div v-if="state.videoType === 'link'" class="mb-4">
                      <label class="form-label" for="video-link">Thay đổi Video</label>
                      <input type="url" class="form-control" id="video-link" v-model="state.videoUrl" placeholder="Enter video link" />
                  </div>

                  <div v-if="state.videoType === 'file'" class="mb-4">
                      <label class="form-label" for="video-file">Thay đổi Video</label>
                      <input type="file" id="video-file" accept="video/*" @change="createVideoBlob" class="form-control" />
                  </div>

                  <div class="my-4">
                      <div class="form-check">
                          <label class="form-check-label" for="publish">Công bố</label>
                          <input class="form-check-input" type="checkbox" v-model="state.published" id="publish" />
                      </div>
                      <div class="form-check">
                          <label class="form-check-label" for="allowComment">Cho phép bình luận</label>
                          <input class="form-check-input" type="checkbox" v-model="state.AllowComment" id="allowComment" />
                      </div>
                      <div class="form-check">
                          <label class="form-check-label" for="commentCensorship">Kiểm duyệt bình luận</label>
                          <input class="form-check-input" type="checkbox" v-model="state.CommentCensorship" id="commentCensorship" />
                      </div>
                  </div>
                  <!-- Submit Buttons -->
                  <div class="col-6 d-flex gap-3">
                      <button type="submit" class="btn btn-success">Lưu</button>
                      <button type="button" class="btn btn-alt-primary" @click="$router.push('/administrator/blog')">Quay lại</button>
                  </div>
              </form>
          </div>
      </BaseBlock>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Swal from "sweetalert2";
import { CustomUploadAdapter } from "./uploadAdapter";
import useVuelidate from "@vuelidate/core";
import { required, minLength, maxLength, url } from "@vuelidate/validators";
import { authRequest } from "../accountmanager/service/axiosConfig";
import { useTemplateStore } from "../../../stores/template";

const store = useTemplateStore();

const editorConfig = ref({
  placeholder: "Start typing your blog content...",
  extraPlugins: [CustomUploadAdapterPlugin], // Kích hoạt plugin upload
});

function CustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new CustomUploadAdapter(loader);
  };
}
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

const router = useRouter();
const route = useRoute();
const state = reactive({
  title: "",
  slug: "",
  categoryId: "",
  excerpt: "",
  contentHtml: "",
  image: null,
  imageURL: "",
  videoType: "",
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

const categories = ref([]);

function getTypeOfVideo(metadata) {
  const metaObj = JSON.parse(metadata);
  return metaObj.Video?.type;
}

const getPost = async () => {
  try {
      const id = route.params.id;
      if (!id) return console.error("ID không tồn tại trong route.");

      const response = await authRequest.get(`/admin/posts/${id}`);

      if (response.data) {
          const data = response.data;

          state.title = data.title;
          state.slug = data.slug;
          state.categoryId = data.category.id;
          state.contentHtml = data.contentHtml;
          state.excerpt = data.excerpt;
          state.imageURL = store.parseMetadataImage(data.metadata);
          state.videoUrl = store.parseMetadataVideo(data.metadata);
          state.videoType = getTypeOfVideo(data.metadata);
          state.published = data.published || false;
          state.enableComments = JSON.parse(data.metadata)?.EnableComments || false;
          state.AllowComment = data.AllowComment;
          state.CommentCensorship = data.CommentCensorship;
      }
  } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
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

const fetchCategories = async () => {
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
};

const submitForm = async () => {
  v$.value.$touch(); // Đánh dấu tất cả các trường
  if (v$.value.$invalid) {
      console.log("khong hop le");

      return;
  } else {
      console.log("hop le");
      console.log(state);
  }
  try {
      const formData = new FormData();
      formData.append("Title", state.title);
      formData.append("Slug", state.slug);
      formData.append("CategoryId", state.categoryId);
      formData.append("ContentHtml", state.contentHtml);
      formData.append("Excerpt", state.excerpt);
      formData.append("Published", state.published);
      formData.append("EnableComments", state.enableComments);
      formData.append("VideoUrl", state.videoUrl);
      formData.append("Files", state.image);
      formData.append("VideoFile", state.video);
      formData.append("VideoType", state.videoType);
      formData.append("AllowComment", state.AllowComment);
      formData.append("CommentCensorship", state.CommentCensorship);

      await authRequest.put(`/admin/posts/${route.params.id}`, formData, {
          headers: {
              "Content-Type": "multipart/form-data",
          },
      });
      const userConfirmed = await Swal.fire({
          title: "Cập nhật bài viết thành công",
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
      console.error("Lỗi khi cập nhật bài viết:", error);

      await Swal.fire({
          title: "Lỗi khi tạo bài viết",
          text: error.response.data.error,
          icon: "error",
      });
  }
};

onMounted(() => {
  getPost();
  fetchCategories();
});
</script>
