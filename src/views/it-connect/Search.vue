<template>
  <div class="container py-3">
    <div class="rounded-3 p-3 border-new-gray border shadow-sm bg-white">
      <h3>Search Results</h3>
      <div v-if="getSearchBlogResult.length">
        <div v-for="blog in getSearchBlogResult" :key="blog.id" class="search-item mb-3 shadow-sm p-3 clickable-test" @click="viewBlog(blog.id)" style="cursor: pointer;"> 
          <h4 class="mb-3 clickable-text" @click="viewBlog(blog.id)">{{ blog.title }}</h4>
          <p>{{ blog.excerpt }}</p>
          <p><strong>Category:</strong> {{ blog.categoryName }}</p>
          <p><strong>Published At:</strong> {{ new Date(blog.publishedAt).toLocaleDateString() }}</p>
        </div>
      </div>
      <div v-else>
        <p>No blog posts found.</p>
      </div>
      <hr style="border-top: dashed 2px black" />

      <!-- Videos Section -->
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

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useTemplateStore } from "@/stores/template";

const store = useTemplateStore();
const router = useRouter();

const getSearchBlogResult = computed(() => store.searchBlogResult);
const videos = ref([
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
]);

const viewBlog = (id) => {
  router.push({ name: "Detail", params: { id: id.toString() } });
};
</script>

<style>
.search-item:hover {
  background-color: #EFF6FF;
}

</style>