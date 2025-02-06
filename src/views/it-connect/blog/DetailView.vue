<template>
    <div class="container my-3">
        <div class="row gx-2 gy-2 bg-white rounded rounded-lg">
            <!-- Left Column: Blog Details -->
            <div class="col-lg-8">
                <div class="rounded p-4">
                    <div class="blog-detail-box">
                        <div class="d-flex gap-3 text-muted mb-3">
                            <strong>{{ featuredArticle?.date }}</strong>
                            <span class="text-primary clickable-text">{{ featuredArticle?.category.name }}</span>
                        </div>
                        <div class="d-flex justify-content-start">
                            <img :src="featuredArticle?.image" alt="Blog Article Image" class="w-100 border border-new-pale-gray rounded mb-3" style="object-fit: contain" />
                        </div>
                        <h4 class="mb-3">{{ featuredArticle?.title }}</h4>
                        <div class="text-muted mb-3" v-html="featuredArticle?.details"></div>
                        <div v-if="featuredArticle?.video !== null" class="">
                            <video :src="featuredArticle?.video" controls class="w-100"></video>
                            <div style="text-align: center;">
                                <i>Video đính kèm</i>
                            </div>
                        </div>
                        <br>
                        <strong>{{ featuredArticle?.author }}</strong>
                    </div>
                </div>
            </div>
            <!-- Right Column: Category List -->
            <div class="position-relative col-lg-4">
                <div class="d-flex flex-column gap-3 p-4" style="position: sticky; top: 1rem">
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
                                <a :href="`/blog/detail/${article.slug}`" class="hover_underline row py-2 text-black" style="cursor: pointer">
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
const baseURL = "https://localhost:7017/";
const featuredArticle = ref(null);
const categories = ref({});
const relatedArticles = ref([]);
let currentPostId;
let categoryOfThisPost;

function getDayFromDate(stringDate) {
    const date = new Date(stringDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

const fetchFeaturedArticle = async () => {
    try {
        const response = await axios.get(`/api/posts/by-slug/${props.postSlug}`);
        const post = response.data.data[0];
        categoryOfThisPost = post.category;

        currentPostId = post.id;

        if (post) {
            featuredArticle.value = {
                id: post.id,
                title: post.title || "No Title Available",
                category: post.category || "No Category",
                details: post.contentHtml || "No details available.",
                date: getDayFromDate(post.publishedAt),
                author: post.userName || "Unknown author",
                image: parseMetadata(post.metadata),
                video: parseMetadataVideo(post.metadata),
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
        let categoryAndPosts = response.data;

        for (let categoryIndex = 0; categoryIndex < categoryAndPosts.length; categoryIndex++) {
            const category = categoryAndPosts[categoryIndex];
            for (let postIndex = 0; postIndex < category.posts.length; postIndex++) {
                const post = category.posts[postIndex];
                if(post.id !== currentPostId){
                    relatedArticles.value.push({
                        id: post.id,
                        title: post.title,
                        excerpt: post.excerpt,
                        image: parseMetadata(post.image),
                        slug: post.slugPost,
                    });
                }
            }
        }
    } catch (error) {
        console.error("Error fetching related articles:", error);
    }
};

const parseMetadata = (metadata) => {
    try {
        const metaObj = JSON.parse(metadata);
        if (metaObj.Files?.length) {
            let imagePath = metaObj.Files[0].replace(/\\/g, "/");
            return baseURL + imagePath;
        }
        return "";
    } catch (error) {
        console.error("Error parsing metadata:", error);
        return "";
    }
};
const parseMetadataVideo = (metadata) => {
    try {
        const metaObj = JSON.parse(metadata);

        let path = "";
        switch (metaObj.Video?.type) {
            case "file":
                path = baseURL + metaObj.Video.file.replace(/\\/g, "/");
                break;
            case "link":
                path = metaObj.Video.url;
                break;
            default:
                console.log("Missing video type in response");
                return null;
        }
        return path;
    } catch (error) {
        console.error("Error parsing metadata:", error);
        return "";
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
