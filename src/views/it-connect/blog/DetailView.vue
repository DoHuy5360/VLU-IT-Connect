<template>
    <div class="container my-3">
        <div class="row gx-2 gy-2 bg-white rounded rounded-lg">
            <!-- Left Column: Blog Details -->
            <div class="col-lg-8">
                <div v-if="featuredArticle !== null" class="rounded p-4">
                    <div class="">
                        <div class="d-flex gap-3 text-muted mb-3">
                            <div class="d-flex gap-2 align-items-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        opacity="0.3"
                                        d="M11.3012 3.91593C11.5067 4.43472 11.8639 4.87947 12.3261 5.19208C12.7883 5.50469 13.334 5.67061 13.892 5.66818H17.117C18.1345 5.66797 19.1333 5.94126 20.0089 6.45945C20.8845 6.97764 21.6048 7.72167 22.0942 8.61368C21.9987 7.11255 21.3356 5.704 20.2396 4.67384C19.1435 3.64369 17.6966 3.0691 16.1925 3.06668H10.925L11.3012 3.91593Z"
                                        fill="#D72134"
                                    />
                                    <path
                                        d="M11.3012 3.91601L10.925 3.01301C10.7175 2.49476 10.3602 2.05017 9.89869 1.73611C9.43718 1.42206 8.89248 1.25281 8.33425 1.25001H6.18426C5.53679 1.2486 4.8954 1.3749 4.29681 1.6217C3.69823 1.8685 3.1542 2.23093 2.69587 2.68826C2.23754 3.14559 1.87392 3.68883 1.62581 4.28688C1.37771 4.88493 1.25001 5.52604 1.25001 6.17351V17.074C1.24859 17.8198 1.39444 18.5585 1.67918 19.2478C1.96393 19.9371 2.38196 20.5633 2.90931 21.0907C3.43666 21.618 4.06294 22.0361 4.75222 22.3208C5.4415 22.6056 6.18022 22.7514 6.926 22.75H17.074C17.8198 22.7514 18.5585 22.6056 19.2478 22.3208C19.9371 22.0361 20.5633 21.618 21.0907 21.0907C21.618 20.5633 22.0361 19.9371 22.3208 19.2478C22.6056 18.5585 22.7514 17.8198 22.75 17.074V11.3443C22.75 10.5989 22.6032 9.86079 22.3179 9.17214C22.0327 8.4835 21.6146 7.85778 21.0875 7.33072C20.5605 6.80365 19.9347 6.38556 19.2461 6.10032C18.5575 5.81507 17.8194 5.66826 17.074 5.66826H13.849C13.2984 5.66211 12.762 5.49219 12.3083 5.18013C11.8545 4.86807 11.504 4.42801 11.3012 3.91601Z"
                                        fill="#D72134"
                                    />
                                </svg>
                                <strong>{{ featuredArticle?.date }}</strong>
                            </div>
                            <div class="d-flex gap-2 align-items-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        opacity="0.3"
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M16.1554 2.27951H18.9772C20.4981 2.27951 21.731 3.51241 21.731 5.03326V7.85512C21.731 9.37598 20.4981 10.6089 18.9772 10.6089H16.1554C14.6345 10.6089 13.4016 9.37598 13.4016 7.85512V5.03326C13.4016 3.51241 14.6345 2.27951 16.1554 2.27951ZM5.02375 13.3916H7.84562C9.36647 13.3916 10.5994 14.6245 10.5994 16.1453V18.9672C10.5994 20.4881 9.36647 21.721 7.84562 21.721H5.02375C3.5029 21.721 2.27 20.4881 2.27 18.9672V16.1453C2.27 14.6245 3.5029 13.3916 5.02375 13.3916Z"
                                        fill="#D72134"
                                    />
                                    <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M5.02375 2.25H7.84562C9.36647 2.25 10.5994 3.4829 10.5994 5.00375V7.82561C10.5994 9.34647 9.36647 10.5794 7.84562 10.5794H5.02375C3.5029 10.5794 2.27 9.34647 2.27 7.82561V5.00375C2.27 3.4829 3.5029 2.25 5.02375 2.25ZM16.1554 13.4206H18.9772C20.4981 13.4206 21.731 14.6535 21.731 16.1744V18.9963C21.731 20.5171 20.4981 21.75 18.9772 21.75H16.1554C14.6345 21.75 13.4016 20.5171 13.4016 18.9963V16.1744C13.4016 14.6535 14.6345 13.4206 16.1554 13.4206Z"
                                        fill="#D72134"
                                    />
                                </svg>
                                <RouterLink :to="`/blog?category=${featuredArticle?.category?.slug}`" class="hover_underline text-primary clickable-text">{{
                                    featuredArticle?.category?.name
                                }}</RouterLink>
                            </div>
                        </div>
                        <div class="d-flex justify-content-start">
                            <img
                                :src="featuredArticle?.image"
                                alt="Blog Article Image"
                                class="w-100 rounded mb-3"
                                style="object-fit: contain"
                                @error="
                                    () => {
                                        featuredArticle.image = store.getBrandAsset('/30_years_vertical_version.png');
                                    }
                                "
                            />
                        </div>
                        <h4 class="mb-3">{{ featuredArticle?.title }}</h4>
                        <div class="mb-3" id="blogContent" v-html="featuredArticle?.details"></div>
                        <div v-if="featuredArticle?.video !== null" class="" style="height: 50vh">
                            <iframe :src="featuredArticle?.video" width="100%" height="100%" frameborder="0" allowfullscreen class="rounded" title="Guiding clips"></iframe>

                            <div style="text-align: center">
                                <i>Video đính kèm</i>
                            </div>
                        </div>
                        <br />
                        <strong> {{ featuredArticle?.author }}</strong>
                    </div>
                    <hr />
                    <!-- <div class="mt-4">
                        <h3>{{ store.isVietNamese() ? "Đánh giá nội dung bài viết" : "Rating" }}</h3>
                        <RatingBlog />
                    </div>
                    <hr /> -->
                    <div class="mt-4">
                        <CommentView :postId="featuredArticle?.id" :allowComment="featuredArticle.allowComment" :commentCensorship="featuredArticle.commentCensorship" />
                    </div>
                </div>
                <div v-else class="h-100 d-grid align-items-center" style="text-align: center">{{ store.isVietNamese() ? "Bài viết không tồn tại" : "No content" }}</div>
            </div>
            <!-- Right Column: Category List -->
            <div class="position-relative col-lg-4">
                <div class="d-flex flex-column gap-3 p-4" style="position: sticky; top: 0.5rem">
                    <div>
                        <RouterLink to="/categories" class="hover_underline text-black">
                            <h4 class="mb-3 fw-bold">{{ store.isVietNamese() ? "Danh Mục" : "Category" }}</h4>
                        </RouterLink>
                        <ul v-if="categories.length" class="list-unstyled" style="overflow-y: scroll; height: 250px">
                            <li v-for="(category, index) in categories" :key="index" class="hover_underline mb-1" style="cursor: pointer; padding-right: 1rem">
                                <RouterLink :to="`/blog?category=${category.Slug}`" class="text-black d-flex justify-content-between">
                                    <span>
                                        {{ store.truncateText(category.Name, 30) }}
                                    </span>
                                    <strong>
                                        {{ category.AmountOfPosts }}
                                    </strong>
                                </RouterLink>
                            </li>
                        </ul>
                        <p v-else class="text-muted">{{ store.isVietNamese() ? "Không có danh mục nào để hiển thị." : "No content" }}</p>
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
                                                    article.image = store.getBrandAsset('/logo-khong-chu.png');
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
import { ref, watch, onMounted, reactive } from "vue";
import { useTemplateStore } from "@/stores/template";
import { guestRequest } from "../../one-ui/accountmanager/service/axiosConfig";
import RatingBlog from "./components/RatingBlog.vue";
import CommentView from "./components/CommentView.vue";

const props = defineProps(["postSlug"]);
const store = useTemplateStore();
const featuredArticle = ref({});
const categories = ref([]);
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
                title: post.title,
                category: post.category,
                details: post.contentHtml,
                date: store.formatDate(post.publishedAt),
                author: post.userName,
                image: store.parseMetadataImage(post.metadata),
                video: store.parseMetadataVideo(post.metadata),
                allowComment: post.allowComment,
                commentCensorship: post.commentCensorship,
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
                    disabled: true,
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
            vn: "Kiến thức Công Nghệ Thông Tin<br>Dành cho Sinh viên",
            en: "Information Knowledge - Student",
        });
    }
};

function spreadCategory(categoryJsonTree) {
    for (let index = 0; index < categoryJsonTree.length; index++) {
        const category = categoryJsonTree[index];
        if (category.AmountOfPosts !== 0) {
            if (category.Children.values.$values.length === 0) {
                categories.value.push({
                    Id: category.Id,
                    Name: category.Name,
                    Slug: category.Slug,
                    NestDepth: category.NestDepth,
                    AmountOfPosts: category.AmountOfPosts,
                });
            } else {
                categories.value.push({
                    Id: category.Id,
                    Name: category.Name,
                    Slug: category.Slug,
                    NestDepth: category.NestDepth,
                    AmountOfPosts: category.AmountOfPosts,
                });
                spreadCategory(category.Children.values.$values);
            }
        }
    }
}

const getCategories = async () => {
    try {
        const response = await guestRequest.get("/posts/getallcategories");
        spreadCategory(response.data.data.categories.values.$values);
    } catch (error) {
        console.error("Error fetching categories:", error.response?.data || error.message);
        // categories.value = null;
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
