<template>
  <div class="container py-3">
    <div class="rounded-3 p-3 border-new-gray border bg-white">
      <div v-if="getSearchBlogResult.length" class="d-flex flex-column gap-3">
        <div v-for="blog in getSearchBlogResult" :key="blog.id" class="">
          <a :href="`/blog/detail/${blog.slug}`" target="_blank" class="text-black hover_underline" style="cursor: pointer;">
            <strong class="" style="font-size: 1.2rem;">{{ blog.title }}</strong>
            <div class="text-muted">{{ blog.excerpt }}</div>
            <!-- <div><strong>Category:</strong> {{ blog.categoryName }}</div>
            <div><strong>Published At:</strong> {{ new Date(blog.publishedAt).toLocaleDateString() }}</div> -->
          </a>
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
import { useRoute } from "vue-router";
import { useTemplateStore } from "@/stores/template";

const store = useTemplateStore();
const route = useRoute()

const searchParams = route.query.q

store.setBreadcrumb([
      { name: "Kết quả tìm kiếm", path: `/search?q=${searchParams}` },
  ]);

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

</script>
