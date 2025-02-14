<template>
    <div class="container my-3">
        <div class="row gx-2 gy-2 bg-white rounded rounded-lg">
            <!-- Left Column: Blog Details -->
            <div class="col-lg-8">
                <div v-if="featuredArticle !== null" class="rounded p-4">
                    <div class="blog-detail-box">
                        <div class="d-flex gap-3 text-muted mb-3">
                            <strong>{{ featuredArticle?.date }}</strong>
                            <span class="text-primary clickable-text">{{ featuredArticle?.category?.name }}</span>
                        </div>
                        <div class="d-flex justify-content-start">
                            <img
                                :src="featuredArticle?.image"
                                alt="Blog Article Image"
                                class="w-100 rounded mb-3"
                                style="object-fit: contain"
                                @error="
                                    () => {
                                        featuredArticle.image = '/../assets/media/brand/30_years_vertical_version.png';
                                    }
                                "
                            />
                        </div>
                        <h4 class="mb-3">{{ featuredArticle?.title }}</h4>
                        <div class="text-muted mb-3" id="blogContent" v-html="featuredArticle?.details"></div>
                        <div v-if="featuredArticle?.video !== null" class="" style="height: 50vh">
                            <iframe :src="featuredArticle?.video" width="100%" height="100%" frameborder="0" allowfullscreen class="rounded" title="Guiding clips"></iframe>

                            <div style="text-align: center">
                                <i>Video đính kèm</i>
                            </div>
                        </div>
                        <br />
                        <strong>{{ featuredArticle?.author }}</strong>
                    </div>
                </div>
                <div v-else class="h-100 d-grid align-items-center" style="text-align: center">Bài viết không tồn tại</div>
            </div>
            <!-- Right Column: Category List -->
            <div class="position-relative col-lg-4">
                <div class="d-flex flex-column gap-3 p-4" style="position: sticky; top: 1rem">
                    <div class="">
                        <RouterLink to="/categories" class="hover_underline text-black">
                            <h4 class="mb-3 fw-bold">{{ store.isVietNamese() ? "Danh Mục" : "Category" }}</h4>
                        </RouterLink>
                        <ul v-if="categories.length" class="list-unstyled">
                            <li v-for="(category, index) in categories" :key="index" class="hover_underline mb-1" style="cursor: pointer">
                                <RouterLink :to="`/blog?category=${category.slug}`" class="text-black d-flex justify-content-between">
                                    <span>
                                        {{ category.categoryName }}
                                    </span>
                                    <strong>
                                        {{ category.posts.length }}
                                    </strong>
                                </RouterLink>
                            </li>
                        </ul>
                        <p v-else class="text-muted">{{ store.isVietNamese() ? "Không có danh mục nào để hiển thị." : "Nothing to show" }}</p>
                    </div>

                    <!-- Related Posts -->
                    <div class="">
                        <h4 class="mb-3 fw-bold">{{ store.isVietNamese() ? "Các bài Viết Liên Quan" : "Related blogs" }}</h4>
                        <div v-if="relatedArticles.length" class="d-flex flex-column gap-2">
                            <div v-for="(article, index) in relatedArticles" :key="index">
                                <RouterLink :to="`/blog/detail/${article.slug}`" class="hover_underline row py-2 text-black" style="cursor: pointer">
                                    <div class="col-4 d-flex">
                                        <img
                                            :src="article.image"
                                            alt="Related Post Image"
                                            class="rounded border w-100 h-100"
                                            style="object-fit: contain"
                                            @error="
                                                () => {
                                                    article.image = '/../assets/media/brand/logo-khong-chu.png';
                                                }
                                            "
                                        />
                                    </div>
                                    <div class="col-8">
                                        <h6 class="mb-1 clickable-text text-truncate" :title="article.title">
                                            {{ store.truncateText(article.title, 30) }}
                                        </h6>
                                        <p class="text-muted small mb-1">
                                            {{ store.truncateText(article.excerpt, 60) }}
                                        </p>
                                        <div class="text-muted small">
                                            <strong>{{ article.author }}</strong>
                                            <span>{{ article.date }}</span>
                                        </div>
                                    </div>
                                </RouterLink>
                            </div>
                        </div>
                        <p v-else class="text-muted">
                            {{ store.isVietNamese() ? "Không có bài viết liên quan nào." : "Nothing to show" }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useTemplateStore } from "@/stores/template";
import { guestRequest } from "../../one-ui/accountmanager/service/axiosConfig";
const props = defineProps(["postSlug"]);
const store = useTemplateStore();
const featuredArticle = ref({});
const categories = ref({});
const relatedArticles = ref([]);
let currentPostId;
let categoryOfThisPost;

const getPost = async () => {
    try {
        const response = await guestRequest.get(`/posts/by-slug/${props.postSlug}`);
        const post = response.data.data[0];
        categoryOfThisPost = post.category;

        currentPostId = post.id;

        if (post) {
            featuredArticle.value = {
                id: post.id,
                title: post.title || "No Title Available",
                category: post.category || "No Category",
                details: post.contentHtml || "No details available.",
                date: store.formatDate(post.publishedAt),
                author: post.userName || "Unknown author",
                image: store.parseMetadataImage(post.metadata),
                video: store.parseMetadataVideo(post.metadata),
            };
            store.setBreadcrumb([
                {
                    name: {
                        vn: "Kiến thức CNTT - Sinh viên",
                        en: "Information Technology - Student",
                    },
                    path: "/blog",
                },
                {
                    name: {
                        vn: categoryOfThisPost.name,
                        en: categoryOfThisPost.name,
                    },
                    path: `/blog?category=${categoryOfThisPost.slug}`,
                },
                {
                    name: {
                        vn: featuredArticle.value?.title,
                        en: featuredArticle.value?.title,
                    },
                    path: `/blog/detail/${featuredArticle.value?.id}`,
                },
            ]);
        } else {
            featuredArticle.value = null;
        }
    } catch (error) {
        console.log(error);
        featuredArticle.value = null;
    } finally {
        store.setHeroTitleName({
            vn: "Nội dung",
            en: "Content",
        });
    }
};

const getCategories = async () => {
    try {
        const response = await guestRequest.get("/posts/categories-with-posts");
        categories.value = response.data;
    } catch (error) {
        console.error("Error fetching categories:", error.response?.data || error.message);
        categories.value = null;
    }
};

const getRelatedArticles = async () => {
    try {
        const response = await guestRequest.get(`/posts/categories-with-posts?categorySlug=${categoryOfThisPost.slug}&limit=5`);
        let categoryAndPosts = response.data;

        for (let categoryIndex = 0; categoryIndex < categoryAndPosts.length; categoryIndex++) {
            const category = categoryAndPosts[categoryIndex];
            for (let postIndex = 0; postIndex < category.posts.length; postIndex++) {
                const post = category.posts[postIndex];
                if (post.id !== currentPostId) {
                    relatedArticles.value.push({
                        id: post.id,
                        title: post.title,
                        excerpt: post.excerpt,
                        image: store.parseMetadataImage(post.image),
                        slug: post.slugPost,
                    });
                }
            }
        }
    } catch (error) {
        console.error("Error fetching related articles:", error);
    }
};

// Watcher để theo dõi slug
watch(
    () => props.postSlug,
    () => {
        getPost();
    }
);

// Lifecycle hook
onMounted(async () => {
    await getPost();
    await getCategories();
    await getRelatedArticles();
});
</script>
<style>
#blogContent img {
    max-width: 100%;
}
</style>
