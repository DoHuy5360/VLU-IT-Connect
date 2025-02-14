<template>
    <div class="container py-3">
        <div class="bg-white px-4 rounded rounded-lg border border-new-pale-gray">
            <!-- Featured Article -->
            <div class="row gy-2 align-items-stretch">
                <div v-if="featuredArticle" class="col-lg-6 h-120 d-flex flex-column">
                    <div class="rounded py-4 flex-grow-1">
                        <RouterLink :to="`/blog/detail/${featuredArticle.slug}`" class="text-black">
                            <div class="featured-article-box d-flex flex-column gap-3" style="cursor: pointer">
                                <img :src="featuredArticle.image" alt="Featured Article Image" class="rounded" style="width: 100%; object-fit: contain" />
                                <div>
                                    <div class="hover_underline">
                                        <h4 class="mb-3 clickable-text">{{ featuredArticle.title }}</h4>
                                        <p class="text-muted mb-3">{{ store.truncateText(featuredArticle.details, 600) }}</p>
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
                <div v-else style="height: 100vh; display: grid; place-items: center">{{ store.isVietNamese() ? "Bài viết không tồn tại" : "Not found" }}</div>
                <!-- Old Articles with Pagination -->
                <div class="col-lg-6 d-flex flex-column" v-if="oldArticles.length">
                    <div class="rounded d-flex flex-column py-4 flex-grow-1">
                        <ul class="list-unstyled flex-grow-1">
                            <li v-for="(article, index) in paginatedArticles" :key="index" class="hover_underline p-2 mb-2 rounded" style="cursor: pointer">
                                <RouterLink :to="`/blog/detail/${article.slug}`" class="text-black">
                                    <h4 class="mb-2 clickable-text">{{ store.truncateText(article.title, 50) }}</h4>
                                    <p class="text-muted small mb-1">{{ store.truncateText(article.details, 100) }}</p>
                                    <div class="d-flex gap-2 text-muted">
                                        <strong>
                                            {{ article.userName }}
                                        </strong>
                                        <span>
                                            {{ article.publishedAt }}
                                        </span>
                                    </div>
                                </RouterLink>
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
            </div>
            <hr />
            <div class="py-2 mb-3">
                <div class="d-flex justify-content-between">
                    <h4 class="mb-3 font-weight-bold">{{ store.isVietNamese() ? "Clip hướng dẫn sử dụng" : "Guiding clips" }}</h4>
                    <RouterLink :to="`/videos?category=${category}`" class="text-primary hover_underline">
                        <b>{{ store.isVietNamese() ? "Xem tất cả" : "View all" }}</b>
                    </RouterLink>
                </div>
                <div class="row" id="wrapVideo">
                    <div v-if="featuredArticle && featuredArticle.video !== null" class="col-auto col-sm-3">
                        <video v-if="store.isMP4(featuredArticle.video)" :src="featuredArticle.video" controls class="rounded w-100 h-50"></video>
                        <iframe v-else width="100%" height="200px" :src="featuredArticle.video" frameborder="0" allowfullscreen class="rounded h-50" title="Guiding clips"></iframe>
                        <RouterLink :to="`/blog/detail/${featuredArticle.slug}`" class="hover_underline text-black">
                            <div class="mt-2">
                                <strong>{{ store.truncateText(featuredArticle.title, 50) }}</strong>
                                <div>{{ store.truncateText(featuredArticle.excerpt, 50) }}</div>
                            </div>
                        </RouterLink>
                    </div>
                    <div v-for="(blog, index) in paginatedArticles.filter((blog) => blog.video !== null).slice(0, 3)" :key="index" class="col-auto col-sm-3">
                        <video v-if="store.isMP4(blog.video)" :src="blog.video" controls class="rounded w-100 h-50"></video>
                        <iframe v-else width="100%" height="200px" :src="blog.video" frameborder="0" allowfullscreen class="rounded h-50" title="Guiding clips"></iframe>
                        <RouterLink :to="`/blog/detail/${blog.slug}`" class="hover_underline text-black">
                            <div class="mt-2">
                                <strong>{{ store.truncateText(blog.title, 50) }}</strong>
                                <div>{{ store.truncateText(blog.excerpt, 50) }}</div>
                            </div>
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useTemplateStore } from "@/stores/template";
import { guestRequest } from "../../one-ui/accountmanager/service/axiosConfig";
const store = useTemplateStore();

import { RouterLink, useRoute, useRouter } from "vue-router";

const route = useRoute();
const category = route.query.category;

const featuredArticle = ref(null);
const oldArticles = ref([]);
const currentPage = ref(1); // Trang hiện tại
const articlesPerPage = 5; // Số bài viết mỗi trang

const totalPages = computed(() => Math.ceil(oldArticles.value.length / articlesPerPage));

const paginatedArticles = computed(() => {
    const start = (currentPage.value - 1) * articlesPerPage;
    return oldArticles.value.slice(start, start + articlesPerPage);
});

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

watch(
    () => route.query.category,
    (newCategory) => {
        console.log(newCategory);
        getBlogs(newCategory);
    }
);

function getDayFromDate(stringDate) {
    const date = new Date(stringDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

async function getBlogs(category) {
    try {
        const response = await guestRequest.get(`/posts?PageNumber=1&PageSize=9999${category === undefined ? "" : `&CategorySlug=${category}`}`);
        let posts = response.data?.data;

        featuredArticle.value = null;
        oldArticles.value = [];

        if (posts.length > 0) {
            featuredArticle.value = {
                id: posts[0].id,
                slug: posts[0].slug,
                title: posts[0].title,
                details: posts[0].excerpt,
                image: store.parseMetadataImage(posts[0].metadata),
                video: store.parseMetadataVideo(posts[0].metadata),
                category: posts[0].category,
                publishedAt: getDayFromDate(posts[0].publishedAt),
                userName: posts[0].userName,
                excerpt: posts[0].excerpt,
            };

            oldArticles.value = posts.slice(1).map((post) => ({
                id: post.id,
                title: post.title,
                slug: post.slug,
                details: post.excerpt,
                image: store.parseMetadataImage(post.metadata),
                video: store.parseMetadataVideo(post.metadata),
                category: post.category,
                publishedAt: getDayFromDate(post.publishedAt),
                userName: post.userName,
                excerpt: post.excerpt,
            }));
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
    } finally {
        if (category === undefined) {
            store.setBreadcrumb([
                {
                    name: {
                        vn: "Kiến thức CNTT - Sinh viên",
                        en: "Information Knowledge - Student",
                    },
                    path: "/categories",
                },
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
                {
                    name: {
                        vn: "Kiến thức CNTT - Sinh viên",
                        en: "Information Knowledge - Student",
                    },
                    path: "/categories",
                },
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
