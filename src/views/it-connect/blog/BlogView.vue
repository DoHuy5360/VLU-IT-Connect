<template>
  <div class="container py-3">
    <div class="bg-white px-4 rounded rounded-lg border border-new-pale-gray">
      <!-- Featured Article -->
      <div class="row gy-2 align-items-stretch">
        <div v-if="featuredArticle" class="col-lg-6 h-120 d-flex flex-column">
          <div class="rounded py-4 flex-grow-1">
            <RouterLink
              :to="`/blog/detail/${featuredArticle.slug}`"
              class="text-black"
            >
              <div
                class="featured-article-box d-flex flex-column gap-3"
                style="cursor: pointer"
              >
                <img
                  :src="featuredArticle.image"
                  alt="Featured Article Image"
                  class="rounded"
                  style="width: 100%; object-fit: contain"
                  @error="
                    () => {
                      featuredArticle.image = store.getBrandAsset(
                        '/30_years_vertical_version.png'
                      );
                    }
                  "
                />
                <div>
                  <div class="hover_underline">
                    <h4 class="mb-sm-3 mb-2 clickable-text">
                      {{ featuredArticle.title }}
                    </h4>
                    <p class="text-muted mb-sm-3 mb-0">
                      {{ store.truncateText(featuredArticle.details, 600) }}
                    </p>
                  </div>
                  <div class="d-flex gap-2 text-muted">
                    <strong>
                      {{ featuredArticle.userName }}
                    </strong>
                    <span>
                      {{ featuredArticle.publishedAt }}
                    </span>
                  </div>
                </div>
              </div>
            </RouterLink>
          </div>
        </div>
        <div v-else style="height: 100vh; display: grid; place-items: center">
          {{ store.isVietNamese() ? "Bài viết không tồn tại" : "No content" }}
        </div>
        <!-- Old Articles with Pagination -->
        <div class="col-lg-6 d-flex flex-column">
          <div
            v-if="data.paginated.length"
            class="rounded d-flex flex-column py-sm-4 flex-grow-1"
          >
            <ul class="list-unstyled flex-grow-1">
              <li
                v-for="(article, index) in data.paginated"
                :key="index"
                class="mb-4 rounded"
                style="cursor: pointer"
              >
                <RouterLink
                  :to="`/blog/detail/${article.slug}`"
                  class="text-black hover_underline"
                >
                  <h4 class="mb-2 clickable-text">
                    {{ store.truncateText(article.title, 50) }}
                  </h4>
                  <p class="text-muted small mb-1">
                    {{ store.truncateText(article.details, 100) }}
                  </p>
                </RouterLink>
                <div class="d-flex gap-2 text-muted">
                  <strong>
                    {{ article.userName }}
                  </strong>
                  <span>
                    {{ article.publishedAt }}
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <Pagination v-model="data" />
        </div>
      </div>
      <hr />
      <div class="py-2 mb-3">
        <div class="d-flex gap-2 justify-content-between">
          <h4 class="mb-3 font-weight-bold">
            {{
              store.isVietNamese() ? "Clip hướng dẫn sử dụng" : "Guiding clips"
            }}
          </h4>
          <RouterLink
            :to="`/videos?category=${category}`"
            class="text-primary hover_underline"
            style="white-space: nowrap"
          >
            <b>{{ store.isVietNamese() ? "Xem tất cả" : "View all" }}</b>
          </RouterLink>
        </div>
        <div v-if="videos.length !== 0" class="row" id="wrapVideo">
          <div v-for="video in videos" class="col-auto col-sm-3">
            <video
              v-if="store.isMP4(video.video)"
              :src="video.video"
              controls
              class="rounded w-100 h-50"
            ></video>
            <iframe
              v-else
              width="100%"
              height="200px"
              :src="video.video"
              frameborder="0"
              allowfullscreen
              class="rounded h-50"
              title="Guiding clips"
            ></iframe>
            <RouterLink
              :to="`/blog/detail/${video.slug}`"
              class="hover_underline text-black"
            >
              <div class="mt-2">
                <strong>{{ store.truncateText(video.title, 50) }}</strong>
                <div>{{ store.truncateText(video.excerpt, 50) }}</div>
              </div>
            </RouterLink>
          </div>
        </div>
        <div v-else>
          {{
            store.isVietNamese() ? "Không có nội dung" : "No content available"
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useTemplateStore } from "@/stores/template";
import { guestRequest } from "../../one-ui/accountmanager/service/axiosConfig";
import Pagination from "../../../components/custom/Pagination.vue";

import { RouterLink, useRoute } from "vue-router";

const store = useTemplateStore();
const data = reactive({
  origin: [],
  paginated: [],
  size: 5,
});

const route = useRoute();
const category = route.query.category;
const videos = ref([]);

const featuredArticle = ref(null);

watch(
  () => route.query.category,
  (newCategory) => {
    getBlogs(newCategory);
  }
);

async function getBlogs(category) {
  try {
    const response = await guestRequest.get(
      `/posts?PageNumber=1&PageSize=9999${
        category === undefined ? "" : `&CategorySlug=${category}`
      }`
    );
    let posts = response.data?.data;

    featuredArticle.value = null;
    data.origin = [];

    if (posts.length > 0) {
      // Bì viết đầu tiên
      const firstBlog = posts[0];
      featuredArticle.value = {
        id: firstBlog.id,
        slug: firstBlog.slug,
        title: firstBlog.title,
        details: firstBlog.excerpt,
        image: store.parseMetadataImage(firstBlog.metadata),
        video: store.parseMetadataVideo(firstBlog.metadata),
        category: firstBlog.category,
        publishedAt: store.formatDate(firstBlog.publishedAt),
        userName: firstBlog.userName,
        excerpt: firstBlog.excerpt,
      };
      // Những bài viết sau bài đàu tiên
      data.origin = posts.slice(1).map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        details: post.excerpt,
        image: store.parseMetadataImage(post.metadata),
        video: store.parseMetadataVideo(post.metadata),
        category: post.category,
        publishedAt: store.formatDate(post.publishedAt),
        userName: post.userName,
        excerpt: post.excerpt,
      }));

      let amountOfSiblingVideo = 3;

      if (featuredArticle.value.video !== null) {
        // Nếu bài viết đầu tiên có video thì lấy video của bài viết đầu và 3 bài sau
        videos.value.push(featuredArticle.value);
      } else {
        // Nếu bài viết đầu tiên không có video thì lấy video của 4 bài sau
        amountOfSiblingVideo = 4;
      }
      data.origin
        .filter((blog) => blog.video !== null)
        .slice(0, amountOfSiblingVideo)
        .forEach((blog) => {
          if (blog.video !== null) {
            videos.value.push(blog);
          }
        });
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
  } finally {
    const baseCrumb = {
      name: {
        vn: "Kiến thức CNTT - Sinh viên",
        en: "Information Knowledge - Student",
      },
      path: "/categories",
    };
    if (category === undefined) {
      store.setBreadcrumb([
        baseCrumb,
        {
          name: {
            vn: "Bài viết",
            en: "Blogs",
          },
          path: "/blog",
        },
      ]);
    } else {
      store.setBreadcrumb([
        baseCrumb,
        {
          name: {
            vn: featuredArticle.value?.category?.name,
            en: featuredArticle.value?.category?.name,
          },
          path: `/blog?category=${featuredArticle.value?.category?.slug}`,
        },
      ]);
    }
  }
  store.setHeroTitleName({
    vn: "Kiến thức Công Nghệ Thông Tin<br>Dành cho Sinh viên",
    en: "Information Knowledge<br>For Student",
  });
}
getBlogs(category);
</script>
