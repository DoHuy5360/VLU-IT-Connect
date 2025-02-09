<template>
    <div class="container py-4">
        <div class="row g-2 border border-new-gray rounded-3 shadow-sm">
            <div v-for="blog in blogs" :key="blog.id" class="col-sm-4">
                <div class="gy-2 p-sm-4">
                    <div class="col-auto col-sm">
                        <iframe width="100%" height="200px" :src="blog.video" frameborder="0" allowfullscreen class="rounded"></iframe>
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

store.setBreadcrumb([
    {
        name: "Video Clips hướng dẫn",
        path: "/videos",
    },
]);

const blogs = ref([]);

async function getBlogs() {
    const response = await axios.get(`/api/posts?HasVideo=true&${category === undefined ? "" : `category=${category}`}`);
    let posts = response.data?.data;

    if (posts.length > 0) {
        blogs.value = posts.map((post) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            video: parseMetadataVideo(post.metadata),
            excerpt: post.excerpt,
        }));
    }
}
getBlogs();

const baseURL = "https://localhost:7017/";
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
</script>
