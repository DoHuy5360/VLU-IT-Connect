<template>
  <div class="container py-3">
    <div class="row gx-0 gy-2">
      <!-- Reduced vertical gap (gy-2) -->
      <!-- Left Column: New Article -->
      <div class="col-lg-6">
        <div class="rounded p-4 bg-white">
          <h4 class="mb-3 fw-bold">Bài viết mới</h4>
          <div class="featured-article-box d-flex flex-column gap-3">
            <!-- Article Image -->
            <img :src="featuredArticle.image" alt="Featured Article Image" class="rounded mb-3" style="width: 100%; height: 300px; object-fit: cover" />
            <!-- Article Details -->
            <div>
              <h4 class="mb-3 clickable-text" @click="$router.push('/blog/detail')">
                {{ featuredArticle.title }}
              </h4>
              <p class="text-muted mb-3">{{ featuredArticle.details }}</p>
              <div class="text-muted mb-1">
                <strong>{{ featuredArticle.author }}</strong
                >, {{ featuredArticle.date }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Old Articles -->
      <div class="col-lg-6">
        <div class="rounded p-4 bg-white">
          <h4 class="mb-3 fw-bold">Bài viết cũ</h4>
          <div>
            <ul class="list-unstyled">
              <li v-for="(article, index) in oldArticles" :key="index" class="mb-3">
                <h6 class="mb-2 clickable-text" @click="$router.push('/blog/detail')">
                  {{ article.title }}
                </h6>
                <p class="text-muted small mb-1">{{ article.details }}</p>
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
    <hr class="my-1" />
    <!-- Reduced spacing of the horizontal rule -->

    <!-- Video Tutorials Section -->
    <div class="container py-2 bg-white rounded shadow-sm mt-4">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="fw-bold mb-3">Clip hướng dẫn sử dụng</h4>
        <b class="text-danger hover_underline" style="cursor: pointer">Xem tất cả</b>
      </div>
      <div class="row gx-4 gy-3">
        <div class="col-12 col-md-4" v-for="index in 3" :key="index">
          <div class="ratio ratio-16x9 mb-3">
            <iframe :src="'https://www.youtube.com/embed/u31qwQUeGuM?si=9IaKmebZwgbysBE6'" allowfullscreen></iframe>
          </div>
          <div>
            <strong>Hướng dẫn</strong>
            <p class="text-muted small">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maxime aliquid iusto tempore recusandae obcaecati</p>
          </div>
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
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed blandit ante eu pulvinar semper. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse ac lorem magna. Donec venenatis, ipsum in porta pretium, leo purus dictum dolor, at convallis mi nulla quis sem. Maecenas vel risus vestibulum, accumsan eros non, vestibulum ligula. Nulla tincidunt ac nunc a malesuada. Vestibulum nec purus dignissim tellus sagittis auctor in sed diam. Nunc dignissim at lacus sit amet mollis. Morbi arcu lacus, elementum sed arcu id, laoreet mollis nisi. Duis dolor nisl, imperdiet eget urna a, vestibulum cursus mi.",
        date: "12-10-2024",
        author: "Dat Tran",
        image: "https://via.placeholder.com/600x400",
      },
      oldArticles: [
        {
          title: "Introduction to Bootstrap Vue",
          details:
            "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse ac lorem magna. Donec venenatis, ipsum in porta pretium, leo purus dictum dolor, at convallis mi nulla quis sem.",
          date: "12-10-2024",
          author: "Phuong Nguyen",
        },
        {
          title: "Top 10 Vue.js Plugins",
          details:
            "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse ac lorem magna. Donec venenatis, ipsum in porta pretium, leo purus dictum dolor, at convallis mi nulla quis sem.",
          date: "12-10-2024",
          author: "Hoang Nguyen",
        },
        {
          title: "Styling Best Practices with Bootstrap",
          details:
            "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse ac lorem magna. Donec venenatis, ipsum in porta pretium, leo purus dictum dolor, at convallis mi nulla quis sem.",
          date: "12-10-2024",
          author: "Duy Nguyen",
        },
        {
          title: "Advanced Vue.js Techniques",
          details:
            "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse ac lorem magna. Donec venenatis, ipsum in porta pretium, leo purus dictum dolor, at convallis mi nulla quis sem.",
          date: "12-10-2024",
          author: "Huy Nguyen",
        },
      ],
    };
  },
};
</script>

<style scoped>
.clickable-text {
  color: black;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s ease;
}
.clickable-text:hover {
  color: blue;
}
</style>
