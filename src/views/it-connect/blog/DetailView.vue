<template>
  <div class="container py-3">
    <div class="row gx-2 gy-2">
      <!-- Left Column: Blog Details -->
      <div class="col-lg-8">
        <div class="rounded p-4 bg-white border shadow-sm">
          <h4 class="mb-3 fw-bold">Nội Dung Bài Viết</h4>
          <div class="blog-detail-box">
            <div class="text-muted mb-3">
              <strong>{{ featuredArticle?.date }}</strong> |
              <span class="text-primary clickable-text">{{ featuredArticle?.category }}</span>
            </div>
            <img
              :src="featuredArticle?.image"
              alt="Blog Article Image"
              class="rounded mb-3"
              style="width: 100%; height: 400px; object-fit: cover"
            />
            <h4 class="mb-3">{{ featuredArticle?.title }}</h4>
            <div class="text-muted mb-3" v-html="featuredArticle?.details"></div>
            <div class="text-muted"><strong>Tác giả:</strong> {{ featuredArticle?.author }}</div>
          </div>
        </div>
      </div>

      <!-- Right Column: Category List -->
      <div class="col-lg-4">
        <div class="rounded p-3 bg-white border shadow-sm mb-3">
          <h4 class="mb-3 fw-bold">Danh Mục</h4>
          <ul v-if="formattedCategories.length" class="list-unstyled">
            <CategoryItem v-for="(category, index) in formattedCategories" :key="index" :category="category" />
          </ul>
          <p v-else class="text-muted">Không có danh mục nào để hiển thị.</p>
        </div>

        <!-- Related Posts -->
        <div class="rounded p-3 bg-white border shadow-sm">
          <h4 class="mb-3 fw-bold">Bài Viết Liên Quan</h4>
          <ul v-if="relatedArticles.length" class="list-unstyled">
            <li v-for="(article, index) in relatedArticles" :key="index" class="row  align-items-start mb-3">
              <img
                :src="article.image"
                alt="Related Post Image"
                class="rounded border col-3"
                style="width: 100px; height: 100px; object-fit: cover"
              />
              <div class="col-9">
                <h6 class="mb-1 clickable-text text-truncate" @click="navigateToArticle(article.id)" :title="article.title">
                  {{ truncateText(article.title, 30) }}
                </h6>
                <p class="text-muted small mb-1">
                  {{ truncateText(article.excerpt, 60) }}
                </p>
                <div class="text-muted small">
                  <strong>{{ article.author }}</strong>, {{ article.date }}
                </div>
              </div>
            </li>
          </ul>
          <p v-else class="text-muted">Không có bài viết liên quan nào.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CategoryItem from "./CategoryItem.vue";

export default {
  components: {
    CategoryItem,
  },
  props: ["id"],
  data() {
    return {
      featuredArticle: null,
      categories: {},
      relatedArticles: [],
      baseURL: "https://localhost:7017/",
    };
  },
  computed: {
    formattedCategories() {
      if (!this.categories || !this.categories.leftChild) return [];
      return [
        ...(this.categories.leftChild ? [this.formatCategory(this.categories.leftChild)] : []),
        ...(this.categories.rightChild ? [this.formatCategory(this.categories.rightChild)] : []),
      ];
    },
  },
  methods: {
    async fetchFeaturedArticle() {
      try {
        const response = await axios.get(`/api/posts/${this.id}`);
        const post = response.data.data;

        if (post) {
          this.featuredArticle = {
            id: post.id,
            title: post.title || "No Title Available",
            category: post.category || "No Category",
            details: post.contentHtml || "No details available.",
            date: new Date(post.publishedAt).toLocaleDateString(),
            author: post.userName || "Unknown author",
            image: this.parseMetadata(post.metadata),
          };
        } else {
          this.featuredArticle = null;
        }
      } catch (error) {
        console.error("Error fetching article:", error.message);
      }
    },
    async getCategories() {
      try {
        const response = await axios.get("/api/Categories/getallcategories", {
          params: {
            cateName: this.searchTerm || "",
            indexPage: 1,
            limitRange: 10,
          },
        });
        this.categories = response.data?.data?.categories || null;
      } catch (error) {
        console.error("Error fetching categories:", error.response?.data || error.message);
        this.categories = null;
      }
    },
    async getRelatedArticles() {
      try {
        const response = await axios.get("/api/posts");
        let posts = response.data?.data?.$values || [];

        posts = posts
          .filter((post) => post.publishedAt)
          .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        this.relatedArticles = posts.slice(1, 4).map((post) => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt || "No excerpt available.",
          date: new Date(post.publishedAt).toLocaleDateString(),
          author: post.userName || "Unknown author",
          image: this.parseMetadata(post.metadata),
        }));
      } catch (error) {
        console.error("Error fetching related articles:", error);
      }
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
    truncateText(text, maxLength) {
      return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    },
    navigateToArticle(id) {
      this.$router.push(`/blog/detail/${id}`);
    },
  },
  watch: {
    id: "fetchFeaturedArticle",
  },
  async created() {
    await this.fetchFeaturedArticle();
    await this.getCategories();
    await this.getRelatedArticles();
  },
};
</script>
