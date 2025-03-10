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
                                <i>{{ store.isVietNamese() ? "Video đính kèm" : "Attached video"}}</i>
                            </div>
                        </div>
                        <br />
                        <div class="d-flex justify-content-between">
                            <strong> {{ featuredArticle?.author }}</strong>
                            <div class="">
                                <div class="hover_underline text-primary" style="cursor: pointer;">
                                    <div class="btn-notification ms-2" @click="openNotificationSubscriptionForm(true)">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-1">
                                            <path
                                                d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        {{ store.isVietNamese() ? "Đăng ký nhận thông báo" : "Subscribe to receive new notifications" }}
                                    </div>
                                </div>
                                <div v-if="isShowNotificationSubscriptionForm" class="position-fixed w-100 h-100" style="top: 0; left: 0; display: grid; place-items: center; z-index: 100;">
                                  <div class="bg-white w-100 h-100">
                                    <div><div class="m-3 btn btn-sm btn-danger" @click="openNotificationSubscriptionForm(false)">{{ store.isVietNamese() ? "Đóng" : "Close" }}</div></div>
                                    <NotificationSubscription/>
                                  </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div class="mt-4">
                        <h3>{{ store.isVietNamese() ? "Chia sẻ" : "Share" }}</h3>
                        <div class="d-flex gap-3 align-items-center">
                            <div
                                class="hover_underline d-flex gap-2 align-items-center"
                                style="cursor: pointer"
                                @click="() => openWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`)"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16">
                                    <path
                                        d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"
                                    />
                                </svg>
                                Facebook
                            </div>
                            <div
                                class="hover_underline d-flex gap-2 align-items-center"
                                style="cursor: pointer"
                                @click="() => openWindow(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(featuredArticle?.title)}`)"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-twitter-x" viewBox="0 0 16 16">
                                    <path
                                        d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"
                                    />
                                </svg>
                                Twitter
                            </div>
                            <div
                                class="hover_underline d-flex gap-2 align-items-center"
                                style="cursor: pointer"
                                @click="() => openWindow(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`)"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M19 3C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19ZM18.5 18.5V13.2C18.5 12.3354 18.1565 11.5062 17.5452 10.8948C16.9338 10.2835 16.1046 9.94 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17C14.6813 12.17 15.0374 12.3175 15.2999 12.5801C15.5625 12.8426 15.71 13.1987 15.71 13.57V18.5H18.5ZM6.88 8.56C7.32556 8.56 7.75288 8.383 8.06794 8.06794C8.383 7.75288 8.56 7.32556 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19C6.43178 5.19 6.00193 5.36805 5.68499 5.68499C5.36805 6.00193 5.19 6.43178 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56ZM8.27 18.5V10.13H5.5V18.5H8.27Z"
                                        fill="#0077b5"
                                    />
                                </svg>
                                LinkedIn
                            </div>
                            <div class="position-relative">
                              <div v-if="isShowCopiedResult" class="position-absolute" style="top: 0; left: 50%; transform: translate(-50%, -100%); transition: 300ms ease-in-out;">
                                <div class="p-1 rounded bg-success text-white fw-bold">{{ store.isVietNamese() ? 'Đã chép' : 'Copied' }}</div>
                              </div>
                              <div class="hover_underline d-flex gap-2 align-items-center" style="cursor: pointer" @click="copyShareLink">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-1">
                                      <path
                                          d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.12548 15.0077 5.24917 15.0227 5.37061L8.08261 9.84066C7.54305 9.32015 6.80891 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15C6.80891 15 7.54305 14.6798 8.08261 14.1593L15.0227 18.6294C15.0077 18.7508 15 18.8745 15 19C15 20.6569 16.3431 22 18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C17.1911 16 16.457 16.3202 15.9174 16.8407L8.97733 12.3706C8.99229 12.2492 9 12.1255 9 12C9 11.8745 8.99229 11.7508 8.97733 11.6294L15.9174 7.15934C16.457 7.67985 17.1911 8 18 8Z"
                                          fill="currentColor"
                                      />
                                  </svg>
                                  {{ store.isVietNamese() ? 'Sao chép đường dẫn' : 'Copy link of this post' }}
                              </div>
                            </div>
                        </div>
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
                <div v-else class="h-100 d-grid align-items-center" style="text-align: center">
                    {{ store.isVietNamese() ? "Bài viết không tồn tại" : "No content" }}
                </div>
            </div>
            <!-- Right Column: Category List -->
            <div class="position-relative col-lg-4">
                <div class="d-flex flex-column gap-3 p-4" style="position: sticky; top: 0.5rem">
                    <div>
                        <RouterLink to="/categories" class="hover_underline text-black">
                            <h4 class="mb-3 fw-bold">
                                {{ store.isVietNamese() ? "Danh Mục" : "Category" }}
                            </h4>
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
                        <p v-else class="text-muted">
                            {{ store.isVietNamese() ? "Không có danh mục nào để hiển thị." : "No content" }}
                        </p>
                    </div>

                    <!-- Related Posts -->
                    <div class="">
                        <h4 class="mb-3 fw-bold">
                            {{ store.isVietNamese() ? "Các bài Viết Liên Quan" : "Related blogs" }}
                        </h4>
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
import { ref, watch, onMounted, reactive, onUnmounted } from "vue";
import { useTemplateStore } from "@/stores/template";
import { guestRequest } from "../../one-ui/accountmanager/service/axiosConfig";
import RatingBlog from "./components/RatingBlog.vue";
import CommentView from "./components/CommentView.vue";
import NotificationSubscription from "./NotificationSubscription.vue";

const props = defineProps(["postSlug"]);
const store = useTemplateStore();
const featuredArticle = ref({});
const categories = ref([]);
const relatedArticles = ref([]);
let currentPostId;
let categoryOfThisPost;
const shareUrl = ref("");
const isShowCopiedResult = ref(false)
const isShowNotificationSubscriptionForm = ref(false)

function openNotificationSubscriptionForm(isOpen){
  isShowNotificationSubscriptionForm.value = isOpen
  window.document.body.style.overflow = isOpen ? "hidden" : "scroll"
}

function openWindow(url) {
    const width = window.screen.availWidth;
    const height = window.screen.availHeight;
    window.open(url, "_blank", `width=${width},height=${height}`);
}

// Copy link to clipboard
const copyShareLink = async () => {
    try {
        if(isShowCopiedResult.value) return;
        await navigator.clipboard.writeText(shareUrl.value);
        
        isShowCopiedResult.value = true

        setTimeout(()=> {
          isShowCopiedResult.value = false
        }, 1500)
    } catch (err) {
        console.error("Failed to copy: ", err);
    }
};

const getPostDetails = async () => {
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
        getPostDetails();
    }
);

// Lifecycle hook
onMounted(async () => {
    await getPostDetails();
    await getCategories();
    await getRelatedArticles();

    // Set current URL for sharing
    shareUrl.value = window.location.href;
});
</script>
<style>
#blogContent img {
    max-width: 100%;
}
</style>
