<template>
    <div class="container py-3">
        <div class="bg-white px-4 rounded rounded-lg border border-new-pale-gray">
            <!-- Featured Article -->
            <div class="row gy-2 align-items-stretch">
                <div class="col-lg-6 h-120 d-flex flex-column" v-if="featuredArticle">
                    <div class="rounded py-4 flex-grow-1">
                        <a :href="`/blog/detail/${featuredArticle.slug}`" class="text-black">
                            <div class="featured-article-box d-flex flex-column gap-3" style="cursor: pointer">
                                <img :src="featuredArticle.image" alt="Featured Article Image" class="rounded mb-3" style="width: 100%; height: 300px; object-fit: contain" />
                                <div>
                                    <h4 class="mb-3 clickable-text">{{ featuredArticle.title }}</h4>
                                    <p class="text-muted mb-3">{{ truncateText(featuredArticle.details, 600) }}</p>
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
                        </a>
                    </div>
                </div>
                <!-- Old Articles with Pagination -->
                <div class="col-lg-6 d-flex flex-column" v-if="oldArticles.length">
                    <div class="rounded d-flex flex-column py-4 flex-grow-1">
                        <ul class="list-unstyled flex-grow-1">
                            <li v-for="(article, index) in paginatedArticles" :key="index" class="old-posts p-2 mb-2 rounded" style="cursor: pointer">
                                <a :href="`/blog/detail/${article.slug}`" class="text-black">
                                    <h4 class="mb-2 clickable-text">{{ article.title }}</h4>
                                    <p class="text-muted small mb-1">{{ truncateText(article.details, 200) }}</p>
                                    <div class="d-flex gap-2 text-muted">
                                        <strong>
                                            {{ article.userName }}
                                        </strong>
                                        <span>
                                            {{ article.publishedAt }}
                                        </span>
                                    </div>
                                </a>
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
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useTemplateStore } from "@/stores/template";

const store = useTemplateStore();

import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const category = route.query.category;

const baseURL = "https://localhost:7017/";
const featuredArticle = ref(null);
const oldArticles = ref([]);
const currentPage = ref(1); // Trang hiện tại
const articlesPerPage = 5; // Số bài viết mỗi trang
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

const totalPages = computed(() => Math.ceil(oldArticles.value.length / articlesPerPage));
const paginatedArticles = computed(() => {
    const start = (currentPage.value - 1) * articlesPerPage;
    return oldArticles.value.slice(start, start + articlesPerPage);
});

const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const parseMetadata = (metadata) => {
    try {
        const metaObj = JSON.parse(metadata);
        if (metaObj.Files?.length) {
            let imagePath = metaObj.Files[0].replace(/\\/g, "/");
            return baseURL + imagePath;
        }
        return "https://via.placeholder.com/600x300";
    } catch (error) {
        console.error("Error parsing metadata:", error);
        return "https://via.placeholder.com/600x300";
    }
};


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

function getDayFromDate(stringDate) {
    const date = new Date(stringDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

onMounted(async () => {
    try {
        const response = await axios.get(`/api/posts${category === undefined ? "" : `?category=${category}`}`);
        let posts = response.data?.data;

        if (posts.length > 0) {
            featuredArticle.value = {
                id: posts[0].id,
                slug: posts[0].slug,
                title: posts[0].title,
                details: posts[0].content,
                image: parseMetadata(posts[0].metadata),
                category: posts[0].category,
                publishedAt: getDayFromDate(posts[0].publishedAt),
                userName: posts[0].userName,
            };

            oldArticles.value = posts.slice(1).map((post) => ({
                id: post.id,
                title: post.title,
                slug: post.slug,
                details: post.excerpt,
                image: parseMetadata(post.metadata),
                category: post.category,
                publishedAt: getDayFromDate(post.publishedAt),
                userName: post.userName,
            }));
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
    } finally {
        if(category === undefined){
            store.setBreadcrumb([
                {
                    name: "Kiến thức CNTT - Sinh viên",
                    path: "/categories",
                },
                {
                    name: "Bài viết",
                    path: '/blog',
                },
            ]);
        }else{
            store.setBreadcrumb([
                {
                    name: "Kiến thức CNTT - Sinh viên",
                    path: "/categories",
                },
                {
                    name: featuredArticle.value.category.name,
                    path: `/blog?category=${featuredArticle.value.category.slug}`,
                },
            ]);
        }
    }
});
</script>

<style scoped>
.old-posts:hover {
    background-color: #eff6ff;
}
</style>
