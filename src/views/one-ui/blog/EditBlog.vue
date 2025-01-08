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
            <option v-for="category in categories" :key="category.id" :value="category.name">
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

<script setup>
import { ref, onMounted } from "vue";
import VideoDropzone from "./components/VideoDropzone.vue";
import SlugInput from "./components/SlugInput.vue";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const editorConfig = ref({
  placeholder: "Start typing your blog content...",
});

const formData = ref({
  title: "",
  slug: "",
  excerpt: "",
  categoryId: "",
  videoLink: "",
  contentHtml: "",
  isVisible: false,
  autoComments: false,
});

const categories = ref([]);
const uploadOption = ref({ type: "link" });

onMounted(async () => {
  const id = route.params.id;
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Session expired. Please log in again.");
      router.push("/login");
      return;
    }

    // Fetch blog details
    const blogResponse = await axios.get(`/api/admin/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const post = blogResponse.data.data;

    const metadata = post.metadata ? JSON.parse(post.metadata) : {};

    formData.value = {
      title: post.title || "",
      slug: post.slug || "",
      excerpt: post.excerpt || "",
      contentHtml: post.contentHtml || "",
      categoryId: post.categoryName || "",
      videoLink: metadata.Video?.url || "",
      isVisible: post.published || false,
      autoComments: metadata.EnableComments ?? false,
    };

    uploadOption.value.type = metadata.Video?.type || "link";

    // Fetch categories
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

    fetchCategories();
  } catch (error) {
    console.error("Error fetching blog details:", error);
  }
});

const submitForm = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Session expired. Please log in again.");
      router.push("/login");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.value.title.trim());
    formDataToSend.append(
      "slug",
      formData.value.slug?.trim() || formData.value.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    );
    formDataToSend.append("contentHtml", formData.value.contentHtml.trim());
    formDataToSend.append("excerpt", formData.value.excerpt || "");
    formDataToSend.append("published", formData.value.isVisible.toString());
    formDataToSend.append("categoryName", formData.value.categoryId || "");
    formDataToSend.append(
      "metadata",
      JSON.stringify({
        Video: {
          type: uploadOption.value.type,
          url: formData.value.videoLink || null,
        },
        EnableComments: formData.value.autoComments,
      })
    );

    const response = await axios.put(`/api/admin/posts/${route.params.id}`, formDataToSend, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Post updated successfully!");
    router.push("/administrator/blog");
  } catch (error) {
    console.error("Error updating post:", error);

    if (error.response) {
      alert(`Error: ${error.response.data?.message || error.response.statusText}`);
    } else if (error.request) {
      alert("No response received from the server. Please check your network.");
    } else {
      alert(`Unexpected error: ${error.message}`);
    }
  }
};

const handleSimulate = () => {
  router.push("/administrator/blog/simulate");
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
</script>

<style scoped>
.dropzone {
  border: 2px dashed #007bff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}
</style>