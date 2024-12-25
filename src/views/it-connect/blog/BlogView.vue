<template>
  <div class="container py-3">
    <div class="row gx-0 gy-2">
      <!-- Featured Article -->
      <div class="col-lg-6" v-if="featuredArticle">
        <div class="rounded p-4 bg-white">
          <h4 class="mb-3 fw-bold">Bài viết mới</h4>
          <div class="featured-article-box d-flex flex-column gap-3">
            <img :src="featuredArticle.image" alt="Featured Article Image" class="rounded mb-3" style="width: 100%; height: 300px; object-fit: cover" />
            <div>
              <h4 class="mb-3 clickable-text" @click="$router.push(`/blog/detail/${featuredArticle.id}`)">
                {{ featuredArticle.title }}
              </h4>
              <p class="text-muted mb-3">{{ truncateText(featuredArticle.details, 150) }}</p>
              <div class="text-muted mb-1">
                <strong>{{ featuredArticle.author }}</strong
                >, {{ featuredArticle.date }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Old Articles -->
      <div class="col-lg-6" v-if="oldArticles.length">
        <div class="rounded p-4 bg-white">
          <h4 class="mb-3 fw-bold">Bài viết cũ</h4>
          <ul class="list-unstyled">
            <li v-for="(article, index) in oldArticles" :key="index" class="mb-3">
              <h6 class="mb-2 clickable-text" @click="$router.push(`/blog/detail/${article.id}`)">
                {{ article.title }}
              </h6>
              <p class="text-muted small mb-1">{{ truncateText(article.details, 80) }}</p>
              <div class="text-muted small">
                <strong>{{ article.author }}</strong
                >, {{ article.date }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      featuredArticle: null, // Store the most recent article
      oldArticles: [], // Store the remaining articles
    };
  },
  methods: {
    truncateText(text, maxLength) {
      // Safely truncate text
      return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    },
  },
  async created() {
    try {
      const response = await axios.get("/api/posts", {});
      const posts = response.data?.data?.$values || [];

      if (posts.length > 0) {
        // Assign featured article
        this.featuredArticle = {
          id: posts[0].id,
          title: posts[0].title,
          details: posts[0].content || "No details available.",
          date: new Date(posts[0].publishedAt).toLocaleDateString(),
          author: posts[0].userId || "Unknown author",
          image: posts[0].metadata?.image || "https://via.placeholder.com/600x300",
        };

        // Assign old articles
        this.oldArticles = posts.slice(1).map((post) => ({
          id: post.id,
          title: post.title,
          details: post.excerpt || "No excerpt available.",
          date: new Date(post.publishedAt).toLocaleDateString(),
          author: post.userId || "Unknown author",
        }));
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  },
};
</script>
