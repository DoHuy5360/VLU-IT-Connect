<template>
  <BasePageHeading title="Master" subtitle="Welcome Admin!">//trang  nhận id sau khi nhấn bên blog admin và hiển thị thông tin của bài viết theo bảng này
    <template #extra>
      <button type="button" class="btn btn-alt-primary" @click="$router.push('/administrator/blog/create')">
        <i class="fa fa-arrow-left opacity-50 me-1"></i>
        Back
      </button>
    </template>
  </BasePageHeading>

  <div class="content">
    <div class="container py-3">
      <div class="row gx-2 gy-2">
        <!-- Left Column: Blog Details -->
        <div class="col-lg-8">
          <div class="rounded p-4 bg-white">
            <h4 class="mb-3 fw-bold">Nội Dung Bài Viết</h4>
            <div class="blog-detail-box">
              <div class="text-muted mb-3">
                <strong>{{ featuredArticle.date }}</strong> |
                <span class="text-primary clickable-text">{{ featuredArticle.category }}</span>
              </div>
              <img :src="featuredArticle.image" alt="Blog Article Image" class="rounded mb-3" style="width: 100%; height: 400px; object-fit: cover" />
              <h4 class="mb-3">{{ featuredArticle.title }}</h4>
              <p class="text-muted mb-3">{{ featuredArticle.details }}</p>
              <div class="text-muted"><strong>Tác giả:</strong> {{ featuredArticle.author }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const featuredArticle = ref({
  date: "2023-10-01",
  category: "Technology",
  image: "https://via.placeholder.com/800x400",
  title: "Sample Blog Title",
  details: "This is a sample blog post detail. Replace this with actual content.",
  author: "John Doe",
});
</script>

<style scoped>
.clickable-text {
  cursor: pointer;
}

.blog-detail-box {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
}

.content {
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: auto;
}
</style>
