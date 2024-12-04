<template>
  <div class="container py-3">
    <div class="row gx-2 gy-2">
      <!-- Left Column: Blog Details -->
      <div class="col-lg-9">
        <div class="rounded p-4 bg-white">
          <h4 class="mb-3 fw-bold">Nội Dung Bài Viết</h4>
          <div class="blog-detail-box">
            <div class="text-muted mb-3">
              <strong>{{ featuredArticle.date }}</strong> |
              <span class="text-primary clickable-text">{{
                featuredArticle.category
              }}</span>
            </div>
            <img
              :src="featuredArticle.image"
              alt="Blog Article Image"
              class="rounded mb-3"
              style="width: 100%; height: 400px; object-fit: cover"
            />
            <h4 class="mb-3">{{ featuredArticle.title }}</h4>
            <p class="text-muted mb-3">{{ featuredArticle.details }}</p>
            <div class="text-muted">
              <strong>Tác giả:</strong> {{ featuredArticle.author }}
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Category List and Related Posts -->
      <div class="col-lg-3">
        <!-- Category List -->
        <div class="rounded p-4 bg-white mb-3">
          <h4 class="mb-3 fw-bold">Danh Mục</h4>
          <ul class="list-unstyled">
            <li
              v-for="(category, index) in categories"
              :key="index"
              class="d-flex justify-content-between align-items-center mb-2"
            >
              <span class="clickable-text">{{ category.name }}</span>
              <span class="custom-badge clickable-text">{{
                category.count
              }}</span>
            </li>
          </ul>
        </div>

        <!-- Related Posts -->
        <div class="rounded p-4 bg-white">
          <h4 class="mb-3 fw-bold">Bài Viết Liên Quan</h4>
          <ul class="list-unstyled">
            <li
              v-for="(article, index) in relatedPosts"
              :key="index"
              class="d-flex gap-2 align-items-start mb-3"
            >
              <!-- Image -->
              <img
                :src="article.image"
                alt="Related Post Image"
                class="rounded"
                style="width: 60px; height: 60px; object-fit: cover"
              />
              <!-- Title and Details -->
              <div style="flex: 1">
                <!-- Title -->
                <h6 class="mb-1 clickable-text text-truncate">
                  {{ article.title }}
                </h6>
                <!-- Details -->
                <p class="text-muted small mb-0">
                  {{ truncateText(article.details, 60) }}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      featuredArticle: {
        title: "Mastering Vue 3 for Frontend Development",
        details:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed blandit ante eu pulvinar semper. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse ac lorem magna. Donec venenatis, ipsum in porta pretium, leo purus dictum dolor, at convallis mi nulla quis sem. Maecenas vel risus vestibulum, accumsan eros non, vestibulum ligula. Nulla tincidunt ac nunc a malesuada. Vestibulum nec purus dignissim tellus sagittis auctor in sed diam. Nunc dignissim at lacus sit amet mollis. Morbi arcu lacus, elementum sed arcu id, laoreet mollis nisi. Duis dolor nisl, imperdiet eget urna a, vestibulum cursus mi.Quisque tincidunt commodo sapien, non viverra ante auctor ut. Sed at tempus justo. Curabitur at scelerisque mi. Aenean pellentesque arcu nulla, ac laoreet ipsum elementum aliquam. Mauris sit amet diam velit. Pellentesque posuere dictum lacinia. Cras egestas sapien neque, in gravida nibh semper ut. Duis interdum massa a turpis vestibulum tincidunt. Integer vehicula nibh et turpis bibendum ultricies ac ut dui. Nunc eu fermentum ex. Nunc volutpat orci eu leo feugiat lobortis. Cras hendrerit quis urna venenatis iaculis.In venenatis neque eget est rutrum, id porttitor orci posuere. Quisque facilisis libero id molestie elementum. Praesent cursus eget lacus eu tempus. Fusce id tempus ex, ac porta urna. Fusce cursus, ipsum ac mollis fermentum, purus lorem maximus justo, at pharetra lacus eros quis dui. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Phasellus et fringilla arcu. Cras elit nisi, sagittis ac egestas vitae, dapibus ac dolor. Vestibulum ut faucibus mauris. Integer magna dui, dignissim eu enim nec, tincidunt sollicitudin libero. Aenean nec aliquet urna. Ut venenatis id ante non finibus. Integer aliquet enim ut dolor rutrum eleifend. Fusce lacinia tempus commodo. Phasellus at augue",
        date: "12-10-2024",
        category: "Công nghệ",
        author: "Dat Tran",
        image: "https://via.placeholder.com/720x360",
      },
      categories: [
        { name: "Văn Lang ID - VLID", count: 2 },
        { name: "Các dịch vụ trực tuyến - Online", count: 26 },
        { name: "Thư viện", count: 3 },
        { name: "Phòng Lab", count: 10 },
        { name: "Mạng không dây", count: 8 },
        { name: "Mạng có dây", count: 7 },
        { name: "Email", count: 6 },
        { name: "One Drive", count: 2 },
        { name: "MS Teams", count: 5 },
      ],
      relatedPosts: [
        {
          title: "Lorem ipsum dolor sit amet",
          details: "Sed blandit ante eu pulvinar semper.",
          image: "https://via.placeholder.com/100x100",
        },
        {
          title: "Aliquam tincidunt mauris eu risus",
          details:
            "Vestibulum auctor dapibus neque. Vivamus eget nibh et sapien eleifend.",
          image: "https://via.placeholder.com/100x100",
        },
        {
          title: "Phasellus ultrices nulla quis nibh",
          details:
            "Quisque facilisis libero et nisi placerat blandit. Morbi eget nisi id libero dapibus volutpat.",
          image: "https://via.placeholder.com/100x100",
        },
      ],
    };
  },
  methods: {
    // Helper Function to Truncate Text
    truncateText(text, maxLength) {
      return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
    },
  },
};
</script>

<style scoped>
.custom-badge {
  background-color: transparent;
  color: black;
  font-size: inherit; /* Make the font size inherit from the parent */
}
.clickable-text:hover {
  color: black;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s ease;
}
.clickable-text:hover {
  color: blue;
}

ul li {
  list-style-type: none;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.small {
  font-size: 0.875rem;
}
</style>
