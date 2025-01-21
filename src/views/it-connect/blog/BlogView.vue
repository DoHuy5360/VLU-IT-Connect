<template>
  <div class="container py-3">
    <div class="row gx-3 gy-2 align-items-stretch"> <!-- ✅ Thêm align-items-stretch -->

      <!-- Featured Article -->
      <div class="col-lg-6 h-120 d-flex flex-column" v-if="featuredArticle"> <!-- ✅ Thêm h-100 và d-flex -->
        <div class="rounded p-4 bg-white border shadow-sm flex-grow-1"> <!-- ✅ Thêm flex-grow-1 -->
          <h4 class="mb-3 fw-bold">Bài viết mới</h4>
          <div class="featured-article-box d-flex flex-column gap-3">
            <img :src="featuredArticle.image" alt="Featured Article Image" class="rounded mb-3"
                 style="width: 100%; height: 300px; object-fit: cover" />
            <div>
              <h4 class="mb-3 clickable-text" @click="viewBlog(featuredArticle.id)">
                {{ featuredArticle.title }}
              </h4>
              <p class="text-muted mb-3">{{ truncateText(featuredArticle.details, 150) }}</p>
              <div class="text-muted mb-1">
                <strong>{{ featuredArticle.author }}</strong>, {{ featuredArticle.date }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Old Articles with Pagination -->
      <div class="col-lg-6 d-flex flex-column" v-if="oldArticles.length"> <!-- ✅ Thêm h-100 và d-flex -->
        <div class="rounded d-flex flex-column p-4 bg-white border shadow-sm flex-grow-1"> <!-- ✅ Thêm flex-grow-1 -->
          <h4 class="mb-3 fw-bold">Bài viết cũ</h4>
     
          <ul class="list-unstyled flex-grow-1">
            <li v-for="(article, index) in paginatedArticles" :key="index" class="mb-3">
              <hr>
              <h6 class="mb-2 clickable-text" @click="viewBlog(article.id)">
                {{ article.title }}
              </h6>
              <p class="text-muted small mb-1">{{ truncateText(article.details, 80) }}</p>
              <div class="text-muted small">
                <strong>{{ article.author }}</strong>, {{ article.date }}
              </div>
            </li>
          </ul>

          <!-- Pagination Controls -->
          <div class="d-flex justify-content-center align-items-center gap-3 mt-3" v-if="totalPages > 1">
            <button class="btn btn-outline-primary btn-sm" @click="prevPage" :disabled="currentPage === 1">← Trước</button>
            <span class="fw-bold">Trang {{ currentPage }} / {{ totalPages }}</span>
            <button class="btn btn-outline-primary btn-sm" @click="nextPage" :disabled="currentPage === totalPages">Sau →</button>
          </div>
        </div>
      </div>
      <div class="py-2 mb-3">
        <div class="d-flex justify-content-between">
          <h4 class="mb-3 font-weight-bold">Clip hướng dẫn sử dụng</h4>
          <b class="text-primary hover_underline" style="cursor: pointer">Xem tất cả</b>
        </div>
        <div class="row" id="wrapVideo">
          <div class="col-auto col-sm" v-for="video in videos" :key="video.id">
            <iframe :src="video.url" width="100%" height="200px" frameborder="0" allowfullscreen class="rounded"></iframe>
            <div class="mt-2">
              <strong>{{ video.title }}</strong>
              <div>{{ video.description }}</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref } from 'vue';

export default {
  data() {
    return {
      baseURL: "https://localhost:7017/", 
      featuredArticle: null,
      oldArticles: [],
      currentPage: 1,  // Trang hiện tại
      articlesPerPage: 4, // Số bài viết mỗi trang
      videos: ref([
        {
          id: "v1",
          url: "https://www.youtube.com/embed/u31qwQUeGuM?si=9IaKmebZwgbysBE6",
          title: "Hướng dẫn 1",
          description: "Clip hướng dẫn chi tiết về việc sử dụng nền tảng của bạn.",
        },
        {
          id: "v2",
          url: "https://www.youtube.com/embed/u31qwQUeGuM?si=9IaKmebZwgbysBE6",
          title: "Hướng dẫn 2",
          description: "Giới thiệu các tính năng nâng cao và cách tận dụng.",
        },
        {
          id: "v3",
          url: "https://www.youtube.com/embed/u31qwQUeGuM?si=9IaKmebZwgbysBE6",
          title: "Hướng dẫn 3",
          description: "Tips và tricks cho người dùng mới bắt đầu.",
        },
      ]),
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.oldArticles.length / this.articlesPerPage);
    },
    paginatedArticles() {
      const start = (this.currentPage - 1) * this.articlesPerPage;
      return this.oldArticles.slice(start, start + this.articlesPerPage);
    },
  },
  methods: {
    truncateText(text, maxLength) {
      return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    },

    parseMetadata(metadata) {
      try {
        const metaObj = JSON.parse(metadata);
        if (metaObj.Files?.length) {
          let imagePath = metaObj.Files[0].replace(/\\/g, "/");
          return this.baseURL + imagePath;
        }
        return "https://via.placeholder.com/600x300";
      } catch (error) {
        console.error("Error parsing metadata:", error);
        return "https://via.placeholder.com/600x300";
      }
    },

    viewBlog(id) {
      this.$router.push({ name: "Detail", params: { id: id.toString() } });
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  },
  async created() {
    try {
      const response = await axios.get("/api/posts");
      let posts = response.data?.data?.$values || [];

      // ⚡ Chỉ lấy những bài có `published: true`
      posts = posts
        .filter((post) => post.published === true)
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

      if (posts.length > 0) {
        this.featuredArticle = {
          id: posts[0].id,
          title: posts[0].title,
          details: posts[0].content || "No details available.",
          date: new Date(posts[0].publishedAt).toLocaleDateString(),
          author: posts[0].userName || "Unknown author",
          image: this.parseMetadata(posts[0].metadata),
        };

        this.oldArticles = posts.slice(1).map((post) => ({
          id: post.id,
          title: post.title,
          details: post.excerpt || "No excerpt available.",
          date: new Date(post.publishedAt).toLocaleDateString(),
          author: post.userName || "Unknown author",
          image: this.parseMetadata(post.metadata),
        }));
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  },
};
</script>
