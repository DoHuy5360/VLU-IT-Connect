<template>
    <div class="container py-4">
        <div class="row g-2 border border-new-gray rounded-3 bg-white">
            <div v-for="blog in data.paginated" :key="blog.id" class="col-sm-4">
                <div class="gy-2 p-sm-4">
                    <div v-if="blog.video !== null" class="col-auto col-sm">
                        <video v-if="store.isMP4(blog.video)" :src="blog.video" controls class="w-100"></video>
                        <iframe v-else width="100%" height="200px" :src="blog.video" frameborder="0" allowfullscreen class="rounded" title="Guiding clips"></iframe>
                        <RouterLink :to="`/blog/detail/${blog.slug}`" class="hover_underline text-black">
                            <strong>{{ store.truncateText(blog.title, 100) }}</strong>
                            <div>
                                {{ store.truncateText(blog.excerpt, 100) }}
                            </div>
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-4">
            <Pagination v-model="data" />
        </div>
    </div>
</template>

<script setup>
import { useTemplateStore } from "@/stores/template";
import { ref, reactive, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { guestRequest } from "../one-ui/accountmanager/service/axiosConfig";
import Pagination from "@/components/custom/Pagination.vue";

const data = reactive({
    origin: [],
    paginated: [],
    size: 9,
});

const route = useRoute();
const store = useTemplateStore();
let category = route.query.category;

store.setHeroTitleName({
    vn: "Video Clips Công Nghệ Thông Tin",
    en: "Video Clips of Information Technology",
});

watch(
    () => route.query.category,
    (newCategory) => {
        getBlogs(newCategory);
    }
);

// const origin = ref([]);

async function getBlogs(category) {
    const hasFilterByCategory = category || false;
    const response = await guestRequest.get(`/posts?HasVideo=true&${hasFilterByCategory ? `CategorySlug=${category}` : ""}`);
    let posts = response.data?.data;

    if (posts.length != 0) {
        data.origin = posts.map((post) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            video: store.parseMetadataVideo(post.metadata),
            excerpt: post.excerpt,
        }));

        const breadcrumb = [
            {
                name: {
                    vn: "Video Clips hướng dẫn",
                    en: "Guide Video & Clips",
                },
                path: "/videos",
            },
        ];
        if (hasFilterByCategory) {
            breadcrumb.push({
                name: {
                    vn: posts[0].category.name,
                    en: posts[0].category.name,
                },
                path: `/videos?category=${posts[0].category.slug}`,
            });
        }

        store.setBreadcrumb(breadcrumb);
    }
}
getBlogs(category);
</script>
