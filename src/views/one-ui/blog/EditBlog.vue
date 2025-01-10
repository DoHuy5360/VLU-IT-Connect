<template>
  <BasePageHeading title="Blog" subtitle="Welcome Admin!">
    <template #extra>
      <button type="button" class="btn btn-alt-primary" @click="$router.push('/administrator/blog')">
        <i class="fa fa-arrow-left opacity-50 me-1"></i>
        Back
      </button>
    </template>
  </BasePageHeading>

  <BaseBlock title="Edit Blog">
    <div class="col-lg-8 space-y-5">
      <form @submit.prevent="submitForm">
        <!-- Title Field -->
        <div class="mb-4">
          <label class="form-label" for="title">Title</label>
          <input
            type="text"
            class="form-control"
            id="title"
            v-model="formData.title"
            placeholder="Enter blog title"
            required
          />
        </div>

        <!-- Slug Field -->
        <SlugInput :title="formData.title" v-model="formData.slug" />

        <!-- Excerpt Field -->
        <div class="mb-4">
          <label class="form-label" for="excerpt">Excerpt</label>
          <textarea
            class="form-control"
            id="excerpt"
            v-model="formData.excerpt"
            placeholder="Enter excerpt"
          ></textarea>
        </div>

        <!-- Category Field -->
        <div class="mb-4">
          <label class="form-label" for="example-select">Select Category</label>
          <select class="form-select" id="example-select" v-model="formData.categoryId" required>
            <option value="" disabled>Select a category</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
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
          <input
            type="url"
            class="form-control"
            id="video-link"
            v-model="formData.videoLink"
            placeholder="Enter video link"
          />
        </div>

        <div v-if="uploadOption.type === 'file'" class="mb-4">
          <VideoDropzone />
        </div>

        <!-- Blog Content -->
        <BaseBlock title="Editor" content-full>
          <ckeditor :editor="ClassicEditor" :config="editorConfig" v-model="formData.contentHtml" />
        </BaseBlock>

        <!-- Visibility Switch -->
        <div class="mb-4">
          <span class="text-muted">Visibility</span>
          <div class="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              id="visibility-switch"
              v-model="formData.isVisible"
            />
          </div>
        </div>

        <!-- Auto Comments Switch -->
        <div class="mb-4">
          <span class="text-muted">Enable Auto Comments</span>
          <div class="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              id="auto-comments-switch"
              v-model="formData.autoComments"
            />
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="mb-4">
          <button type="submit" class="btn btn-alt-primary bg-success">Save</button>
          <button
  type="button"
  class="btn btn-alt-secondary ms-2"
  @click="navigateToSimulation"
>
  Mở Mô Phỏng
</button>
        </div>
      </form>
    </div>
  </BaseBlock>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SlugInput from "./components/SlugInput.vue";

export default {
  components: {
      SlugInput,
    },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const formData = ref({
      title: "",
      slug: "",
      categoryId: "",
      contentHtml: "",
      excerpt: "",
      videoType: "",
      videoUrl: "",
      published: false,
      enableComments: false,
      image: "",
    });

    // Khi trang tải, lấy dữ liệu từ query (nếu có)
    onMounted(() => {
      console.log("Route query on load:", route.query);
      formData.value = {
        title: route.query.title || formData.value.title,
        slug: route.query.slug || formData.value.slug,
        categoryId: route.query.categoryId || formData.value.categoryId,
        contentHtml: route.query.contentHtml || formData.value.contentHtml,
        excerpt: route.query.excerpt || formData.value.excerpt,
        videoType: route.query.videoType || formData.value.videoType,
        videoUrl: route.query.videoUrl || formData.value.videoUrl,
        published:
          route.query.published === "true" || formData.value.published,
        enableComments:
          route.query.enableComments === "true" ||
          formData.value.enableComments,
        image: route.query.image || formData.value.image,
      };
    });

    // Fetch categories from API
    const categories = ref([]);

    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("Token not found");
          return;
        }

        const response = await axios.get(
          "/api/Categories/getallcategories",
          {
            params: {
              cateName: "",
              indexPage: 1,
              limitRange: 100,
            },
            headers: { Authorization: token },
          }
        );

        if (response.data?.data?.categories) {
          const mainCategory = response.data.data.categories;
          const allCategories = [];

          allCategories.push({
            id: mainCategory.Id,
            name: mainCategory.Name,
          });

          if (mainCategory.LeftChild) {
            allCategories.push({
              id: mainCategory.LeftChild.Id,
              name: mainCategory.LeftChild.Name,
            });
          }

          if (mainCategory.RightChild) {
            allCategories.push({
              id: mainCategory.RightChild.Id,
              name: mainCategory.RightChild.Name,
            });
          }

          categories.value = allCategories;
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    onMounted(() => {
      fetchCategories();
    });

    // Form submission logic
    const submitForm = async () => {
      try {
        // Validate token first
        const token = localStorage.getItem("authToken");
        if (!token) {
          alert("Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn");
          router.push("/login");
          return;
        }

        // Validate required fields
        if (!formData.value.title?.trim()) {
          alert("Vui lòng nhập tiêu đề bài viết");
          return;
        }
        if (!formData.value.contentHtml?.trim()) {
          alert("Vui lòng nhập nội dung bài viết");
          return;
        }
        if (!formData.value.categoryId) {
          alert("Vui lòng chọn thể loại bài viết");
          return;
        }

        const formDataToSend = new FormData();

        // Required fields
        formDataToSend.append("Title", formData.value.title.trim());
        formDataToSend.append(
          "Slug",
          formData.value.slug?.trim() ||
            formData.value.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
        );
        formDataToSend.append(
          "CategoryIds[0]",
          formData.value.categoryId.toString()
        );
        formDataToSend.append(
          "ContentHtml",
          formData.value.contentHtml.trim()
        );

        // Optional fields
        formDataToSend.append(
          "Excerpt",
          formData.value.excerpt?.trim() || ""
        );
        formDataToSend.append(
          "Published",
          formData.value.published.toString()
        );
        formDataToSend.append(
          "EnableComments",
          formData.value.enableComments.toString()
        );
        formDataToSend.append(
          "VideoType",
          formData.value.videoType?.trim() || ""
        );
        formDataToSend.append(
          "VideoUrl",
          formData.value.videoUrl?.trim() || ""
        );

        const videoFileInput = document.getElementById("video-file");
        if (videoFileInput?.files[0]) {
          const fileSize = videoFileInput.files[0].size;
          const maxSize = 5 * 1024 * 1024; // 5MB
          if (fileSize > maxSize) {
            alert("File video không được vượt quá 5MB");
            return;
          }
          formDataToSend.append("VideoFile", videoFileInput.files[0]);
        }

        // Log request data
        console.log("Form data being sent:");
        for (let pair of formDataToSend.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`);
        }

        // Token đã có prefix từ localStorage
        const response = await axios.post(
          "/api/admin/posts",
          formDataToSend,
          {
            headers: {
              Authorization: token, // Không thêm 'Bearer' vì token đã có prefix
            },
            timeout: 10000,
          }
        );

        console.log("Response:", response.data);

        if (response.data) {
          alert("Bài viết đã được tạo thành công!");
          router.push("/administrator/blog");
        }
      } catch (error) {
        console.error("Error creating post:", error);

        // Handle different types of errors
        if (error.response) {
          // Server responded with error
          console.error("Server error response:", error.response);
          if (
            error.response.status === 401 ||
            error.response.status === 403
          ) {
            alert("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
            router.push("/login");
            return;
          }
          alert(
            `Lỗi: ${
              error.response.data?.message || error.response.statusText
            }`
          );
        } else if (error.request) {
          // Request was made but no response
          console.error("No response received:", error.request);
          alert(
            "Không thể kết nối đến server. Vui lòng:\n1. Đăng nhập lại để lấy token mới\n2. Kiểm tra server đang chạy\n3. Kiểm tra địa chỉ https://localhost:7017"
          );
        } else {
          // Error setting up request
          console.error("Error:", error.message);
          alert("Lỗi khi gửi yêu cầu: " + error.message);
        }
      }
    };

    const navigateToSimulation = () => {
      console.log("Navigating to simulation with data:", formData.value);
      router.push({
        path: "/administrator/blog/simulate",
        query: {
          ...formData.value,
          image:
            formData.value.image || "https://via.placeholder.com/800x400", // URL hình ảnh mặc định
          videoUrl: formData.value.videoUrl || "", // URL video (nếu có)
        },
      });
    };

    return {
      editor: ClassicEditor,
      formData,
      categories,
      submitForm,
      navigateToSimulation,
    };
  },
};
</script>


  <style scoped>
  .ck-editor__editable {
    min-height: 300px;
  }

  .form-check {
    margin-left: 1.25rem;
  }
  </style>
