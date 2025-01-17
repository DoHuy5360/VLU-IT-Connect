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
              <h4 class="mb-3 clickable-text"  @click="viewBlog(featuredArticle.id)">
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

      <!-- Old Articles -->
      <div class="col-lg-6" v-if="oldArticles.length">
        <div class="rounded p-4 bg-white">
          <h4 class="mb-3 fw-bold">Bài viết cũ</h4>
          <ul class="list-unstyled">
            <li v-for="(article, index) in oldArticles" :key="index" class="mb-3">
              <h6 class="mb-2 clickable-text"  @click="viewBlog(article.id)">
                {{ article.title }}
              </h6>
              <p class="text-muted small mb-1">{{ truncateText(article.details, 80) }}</p>
              <div class="text-muted small">
                <strong>{{ article.author }}</strong>, {{ article.date }}
              </div>
            </li>
          </ul>
        </div>
      </div>
      
    </div>
    <hr >
      
    
    <h4 class="mb-3 fw-bold">Clip hướng dẫn sử dụng</h4>

    <div class="row" id="wrapVideo">
                    <div class="col">
                        <iframe width="100%" height="200px" src="https://www.youtube.com/embed/u31qwQUeGuM?si=9IaKmebZwgbysBE6" frameborder="0" allowfullscreen class="rounded"></iframe>
                        <div>
                            <strong>Hướng dẫn</strong>
                            <div>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maxime aliquid iusto tempore recusandae obcaecati</div>
                        </div>
                    </div>
                    <div class="col">
                        <iframe width="100%" height="200px" src="https://www.youtube.com/embed/u31qwQUeGuM?si=9IaKmebZwgbysBE6" frameborder="0" allowfullscreen class="rounded"></iframe>
                        <div>
                            <strong>Hướng dẫn</strong>
                            <div>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maxime aliquid iusto tempore recusandae obcaecati</div>
                        </div>
                    </div>
                    <div class="col">
                        <iframe width="100%" height="200px" src="https://www.youtube.com/embed/u31qwQUeGuM?si=9IaKmebZwgbysBE6" frameborder="0" allowfullscreen class="rounded"></iframe>
                        <div>
                            <strong>Hướng dẫn</strong>
                            <div>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maxime aliquid iusto tempore recusandae obcaecati</div>
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
      baseURL: "https://localhost:7017/", // Cập nhật đường dẫn domain của API
      featuredArticle: null,
      oldArticles: [],
    };
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

    // Chuyển đến trang chi tiết bài viết
    viewBlog(id) {
      this.$router.push({ name: "Detail", params: { id: id.toString() } });
    }
  },
  async created() {
    try {
      const response = await axios.get("/api/posts", {});
      let posts = response.data?.data?.$values || [];

      posts = posts.filter(post => post.publishedAt)
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
       
        }));
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }
};
</script>

<style scoped>
.clickable-text {
  cursor: pointer;
  color: #007bff;
}
.clickable-text:hover {
  text-decoration: underline;
}
</style>
