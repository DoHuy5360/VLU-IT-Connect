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

  <BaseBlock title="THÊM BÀI VIẾT">
    <div class="col-lg-8 space-y-5">
      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Tiêu đề -->
        <div>
          <label>Tiêu đề</label>
          <input v-model="formData.title" required class="form-control" />
        </div>

        <!-- Slug -->
        <div>
          <label>Slug</label>
          <input v-model="formData.slug" class="form-control" />
        </div>

        <!-- Thể loại -->
        <div>
          <label>Thể loại</label>
          <select v-model="formData.categoryId" required class="form-control">
            <option value="">Chọn thể loại</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Editor -->
        <div>
          <label>Nội dung</label>
          <ckeditor
            :editor="editor"
            v-model="formData.contentHtml"
            required
          ></ckeditor>
        </div>

        <!-- Excerpt -->
        <div>
          <label>Tóm tắt</label>
          <textarea
            v-model="formData.excerpt"
            class="form-control"
            rows="3"
          ></textarea>
        </div>

        <!-- Video -->
        <div>
          <label>Loại Video</label>
          <input v-model="formData.videoType" class="form-control" />
        </div>

        <div>
          <label>URL Video</label>
          <input v-model="formData.videoUrl" class="form-control" />
        </div>

        <div>
          <label>File Video</label>
          <input
            type="file"
            id="video-file"
            accept="video/*"
            class="form-control"
          />
        </div>

        <!-- Checkboxes -->
        <div class="flex space-x-4">
          <label>
            <input type="checkbox" v-model="formData.enableComments" />
            Cho phép bình luận
          </label>

          <label>
            <input type="checkbox" v-model="formData.published" />
            Công bố
          </label>
        </div>

        <button type="submit" class="btn btn-alt-primary bg-success">
          Hoàn tất
        </button>
        <button type="button" class="btn btn-alt-secondary ms-2">
          Mở phòng
        </button>
      </form>
    </div>
  </BaseBlock>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default {
  setup() {
    const router = useRouter();
    const editor = ClassicEditor;
    const categories = ref([]);

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
    });

    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("Token not found");
          return;
        }

        const response = await axios.get("/api/Categories/getallcategories", {
          params: {
            cateName: "",
            indexPage: 1,
            limitRange: 100,
          },
        });

        console.log("API Response:", response.data);

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
          console.log("Processed Categories:", categories.value);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        if (error.response) {
          console.error("Error Response:", error.response.data);
        }
        alert("Không thể tải danh sách thể loại. Vui lòng thử lại.");
      }
    };

    onMounted(() => {
      fetchCategories();
    });

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
        formDataToSend.append("ContentHtml", formData.value.contentHtml.trim());

        // Optional fields
        formDataToSend.append("Excerpt", formData.value.excerpt?.trim() || "");
        formDataToSend.append("Published", formData.value.published.toString());
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
        const response = await axios.post("/api/admin/posts", formDataToSend, {
          headers: {
            Authorization: token, // Không thêm 'Bearer' vì token đã có prefix
          },
          timeout: 10000,
        });

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
          if (error.response.status === 401 || error.response.status === 403) {
            alert("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
            router.push("/login");
            return;
          }
          alert(
            `Lỗi: ${error.response.data?.message || error.response.statusText}`
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

    return {
      editor,
      formData,
      categories,
      submitForm,
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
headers: { Authorization: token // token đã có dạng "Bearer xxx" hoặc "tokenType
xxx" }headers: { Authorization: token // token đã có dạng "Bearer xxx" hoặc
"tokenType xxx" }
