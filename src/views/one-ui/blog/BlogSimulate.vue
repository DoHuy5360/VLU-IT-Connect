<template>
  <BasePageHeading title="Master" subtitle="Welcome Admin!">
    <template #extra>
      <button
        type="button"
        class="btn btn-alt-primary"
        @click="$router.push({ path: '/administrator/blog/create', query: blogData })"
      >
        <i class="fa fa-arrow-left opacity-50 me-1"></i>
        Back
      </button>
    </template>
  </BasePageHeading>

  <div class="content">
    <div class="py-3">
      <div class="row gx-2 gy-2">
        <!-- Left Column: Blog Details -->
        <div class="">
          <div class="rounded p-4 bg-white">
            <h4 class="mb-3 fw-bold">Nội Dung Bài Viết</h4>
            <div class="bg-new-pale-gray p-3 rounded">
              <div class="text-muted mb-3">
                <strong>{{ blogData.date }}</strong> |
                <span class="text-primary">{{ blogData.category }}</span>
              </div>
              <!-- Hình ảnh hoặc video -->
              <div class="media-content mb-3">
                <template v-if="blogData.videoUrl">
                  <!-- Hiển thị video -->
                  <video
                    controls
                    class="rounded"
                    style="width: 100%; height: 400px; object-fit: cover"
                  >
                    <source :src="blogData.videoUrl" type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ thẻ video.
                  </video>
                </template>
                <template v-else>
                  <!-- Hiển thị hình ảnh -->
                  <img
                    :src="blogData.image || 'https://via.placeholder.com/800x400'"
                    alt="Blog Media"
                    class="rounded"
                    style="width: 100%; height: 400px; object-fit: cover"
                  />
                </template>
              </div>
              <!-- Tiêu đề bài viết -->
              <h4 class="mb-3">{{ blogData.title }}</h4>
              <p class="text-muted mb-3">{{ blogData.excerpt }}</p>
              <div v-html="blogData.contentHtml" class="mb-3"></div>
              <div class="text-muted"><strong>Tác giả:</strong> {{ blogData.author }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const blogData = ref({
  title: "",
  category: "",
  date: new Date().toLocaleDateString(),
  excerpt: "",
  contentHtml: "",
  author: "Admin",
  image: "",
  videoUrl: "",
});

// Cập nhật dữ liệu từ route.query
onMounted(() => {
  blogData.value = {
    title: route.query.title || "Tiêu đề bài viết",
    category: route.query.category || "Thể loại chưa chọn",
    date: route.query.date || new Date().toLocaleDateString(),
    excerpt: route.query.excerpt || "Mô tả ngắn chưa nhập",
    contentHtml: route.query.contentHtml || "Nội dung bài viết chưa có.",
    author: route.query.author || "Admin",
    image: route.query.image || "https://via.placeholder.com/800x400", // Hình ảnh mặc định
    videoUrl: route.query.videoUrl || "", // URL video (nếu có)
  };
});
</script>