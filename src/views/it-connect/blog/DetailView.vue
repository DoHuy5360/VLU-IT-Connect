<template>
    <div class="container my-3">
        <div class="row gx-2 gy-2 bg-white rounded rounded-lg">
            <!-- Left Column: Blog Details -->
            <div class="col-lg-8">
                <div class="rounded p-4">
                    <div class="blog-detail-box">
                        <div class="text-muted mb-3">
                            <strong>{{ featuredArticle?.date }}</strong> |
                            <span class="text-primary clickable-text">{{ featuredArticle?.category.name }}</span>
                        </div>
                        <div class="d-flex justify-content-start">
                            <img :src="featuredArticle?.image" alt="Blog Article Image" class="w-100 border border-new-pale-gray rounded mb-3" style="object-fit: contain" />
                        </div>
                        <h4 class="mb-3">{{ featuredArticle?.title }}</h4>
                        <div class="text-muted mb-3" v-html="featuredArticle?.details"></div>
                        <div class="text-muted"><strong>Tác giả:</strong> {{ featuredArticle?.author }}</div>
                    </div>
                </div>
            </div>
            <!-- Right Column: Category List -->
            <div class="position-relative col-lg-4">
                <div class="d-flex flex-column gap-3 p-4" style="position: sticky; top: 1rem;">
                    <div class="">
                        <h4 class="mb-3 fw-bold">Danh Mục</h4>
                        <ul v-if="categories.length" class="list-unstyled">
                            <li v-for="(category, index) in categories" :key="index" class="hover_underline mb-1" style="cursor: pointer">
                                <a :href="`/blog?category=${category.slug}`" class="text-black d-flex justify-content-between">
                                    <span>
                                        {{ category.categoryName }}
                                    </span>
                                    <strong>
                                        {{ category.posts.length }}
                                    </strong>
                                </a>
                            </li>
                        </ul>
                        <p v-else class="text-muted">Không có danh mục nào để hiển thị.</p>
                    </div>

                    <!-- Related Posts -->
                    <div class="">
                        <h4 class="mb-3 fw-bold">Các bài Viết Liên Quan</h4>
                        <div v-if="relatedArticles.length" class="d-flex flex-column gap-2">
                            <div v-for="(article, index) in relatedArticles" :key="index">
                                <a :href="`/blog/detail/${article.slug}`" class="relative-posts row py-2 text-black" style="cursor: pointer">
                                    <div class="col-4 d-flex">
                                        <img :src="article.image" alt="Related Post Image" class="rounded border w-100 h-100" style="object-fit: contain" />
                                    </div>
                                    <div class="col-8">
                                        <h6 class="mb-1 clickable-text text-truncate" :title="article.title">
                                            {{ truncateText(article.title, 30) }}
                                        </h6>
                                        <p class="text-muted small mb-1">
                                            {{ truncateText(article.excerpt, 60) }}
                                        </p>
                                        <div class="text-muted small">
                                            <strong>{{ article.author }}</strong>
                                            <span>{{ article.date }}</span>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <p v-else class="text-muted">Không có bài viết liên quan nào.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import axios from "axios";
import { useTemplateStore } from "@/stores/template";

const props = defineProps(["postSlug", "category"]);
const store = useTemplateStore();

const featuredArticle = ref(null);
const categories = ref({});
const relatedArticles = ref([]);
const baseURL = ref("https://localhost:7017/");
let currentPostId;
let categoryOfThisPost;

const fetchFeaturedArticle = async () => {
    try {
        const response = await axios.get(`/api/posts/by-slug/${props.postSlug}`);
        const post = response.data.data[0];
        categoryOfThisPost = post.category;
        console.log(categoryOfThisPost);

        currentPostId = post.id;

        if (post) {
            featuredArticle.value = {
                id: post.id,
                title: post.title || "No Title Available",
                category: post.category || "No Category",
                details: post.contentHtml || "No details available.",
                date: new Date(post.publishedAt).toLocaleDateString(),
                author: post.userName || "Unknown author",
                image: parseMetadata(post.metadata),
            };
            store.setBreadcrumb([
                { name: "Kiến thức CNTT - Sinh viên", path: "/blog" },
                { name: categoryOfThisPost.name, path: `/blog?category=${categoryOfThisPost.slug}` },
                { name: featuredArticle.value?.title, path: `/blog/detail/${featuredArticle.value?.id}` },
            ]);
        } else {
            featuredArticle.value = null;
        }
    } catch (error) {
        console.error("Error fetching article:", error.message);
    } finally {
    }
};

const getCategories = async () => {
    try {
        const response = await axios.get("/api/posts/categories-with-posts");
        categories.value = response.data;
    } catch (error) {
        console.error("Error fetching categories:", error.response?.data || error.message);
        categories.value = null;
    }
};

const getRelatedArticles = async () => {
    try {
        const response = await axios.get(`/api/posts/categories-with-posts?categorySlug=${categoryOfThisPost.slug}&limit=5`);
        let categoryAndPosts = response.data[0];
        console.log(categoryAndPosts);

        const posts = categoryAndPosts.posts.filter((post) => post.id !== currentPostId);

        relatedArticles.value = posts.map((post) => ({
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            image: parseMetadata(post.image),
            slug: post.slugPost
        }));
    } catch (error) {
        console.error("Error fetching related articles:", error);
    }
};

const parseMetadata = (metadata) => {
    try {
        const metaObj = JSON.parse(metadata);
        if (metaObj.Files?.length) {
            let imagePath = metaObj.Files[0].replace(/\\/g, "/");
            return baseURL.value + imagePath;
        }
        return "https://via.placeholder.com/600x300";
    } catch (error) {
        console.error("Error parsing metadata:", error);
        return "https://via.placeholder.com/600x300";
    }
};

const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

// Watcher để theo dõi slug
watch(() => props.postSlug, fetchFeaturedArticle);

// Lifecycle hook
onMounted(async () => {
    await fetchFeaturedArticle();
    await getCategories();
    await getRelatedArticles();
});
</script>

<style>
.relative-posts:hover {
    background-color: #eff6ff;
}
</style>
