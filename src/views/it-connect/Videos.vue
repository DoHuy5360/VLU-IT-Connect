<template>
    <div class="container py-4">
        <div class="row g-2 border border-new-gray rounded-3 shadow-sm">
            <div v-for="blog in blogs" :key="blog.id" class="col-sm-4">
                <div class="gy-2 p-sm-4">
                    <div v-if="blog.video !== null" class="col-auto col-sm">
                        <video v-if="store.isMP4(blog.video)" :src="blog.video" controls class="w-100"></video>
                        <iframe v-else width="100%" height="200px" :src="blog.video" frameborder="0" allowfullscreen class="rounded" title="Guiding clips"></iframe>
                        <RouterLink :to="`/blog/detail/${blog.slug}`" class="hover_underline text-black">
                            <strong>{{ blog.title }}</strong>
                            <div>
                                {{ truncateText(blog.excerpt, 100) }}
                            </div>
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useTemplateStore } from "@/stores/template";
import axios from "axios";
import { ref } from "vue";
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();
const category = route.query.category;
const store = useTemplateStore();
const categoryName = ref("");

store.setBreadcrumb([
    {
        name: "Video Clips hướng dẫn",
        path: "/videos",
    },
    {
        name: categoryName,
        path: `/videos?category=${category}`,
    },
]);

store.setHeroTitleName({
    vn: "Video và Clips",
    en: "Video & Clips",
});

const blogs = ref([]);

async function getBlogs() {
    const response = await axios.get(`/api/posts?HasVideo=true&${category === undefined ? "" : `CategorySlug=${category}`}`);
    let posts = response.data?.data;

    if (posts.length > 0) {
        blogs.value = posts.map((post) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            video: store.parseMetadataVideo(post.metadata),
            excerpt: post.excerpt,
        }));

        categoryName.value = posts[0].category.name;
    }
}
getBlogs();

const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};
</script>
