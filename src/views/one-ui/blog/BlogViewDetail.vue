<template>
    <BasePageHeading title="Chi Tiết Bài Viết" subtitle="">
        <template #extra>
            <button type="button" class="btn btn-alt-primary" @click="goBack">
                <i class="fa fa-arrow-left opacity-50 me-1"></i>
                Quay lại
            </button>
        </template>
    </BasePageHeading>

    <div v-if="loading" class="text-center py-5">
        <p>Đang tải...</p>
    </div>
    <div v-else class="content">
        <div class="rounded overflow-hidden">
            <table class="table table-bordered">
                <tbody>
                    <tr>
                        <td style="white-space: nowrap">Ảnh bìa</td>
                        <td>
                            <img
                                :src="post.imageUrl"
                                alt="Ảnh bìa bài viết"
                                class="w-25"
                                @error="
                                    () => {
                                        post.imageUrl = store.getBrandAsset('/logo-khong-chu.png');
                                    }
                                "
                            />
                        </td>
                    </tr>
                    <tr>
                        <td style="white-space: nowrap">Tác giả</td>
                        <td>{{ post.userName }}</td>
                    </tr>
                    <tr>
                        <td style="white-space: nowrap">Tiêu đề</td>
                        <td>{{ post.title }}</td>
                    </tr>
                    <tr>
                        <td style="white-space: nowrap">slug</td>
                        <td>{{ post.slug }}</td>
                    </tr>
                    <tr>
                        <td style="white-space: nowrap">Đoạn trích</td>
                        <td>{{ post.excerpt }}</td>
                    </tr>
                    <tr>
                        <td style="white-space: nowrap">Nội dung</td>
                        <td>
                            <div style="height: 20rem; overflow-y: scroll">
                                <div v-html="post.contentHtml"></div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="white-space: nowrap">Video</td>
                        <td :style="`height: ${post.videoUrl ? '100vh' : ''}`">
                            <video v-if="store.isMP4(post.videoUrl)" :src="post.videoUrl" controls class="rounded w-100"></video>
                            <iframe v-else width="100%" height="100%" :src="post.videoUrl" frameborder="0" allowfullscreen class="rounded" title="Guiding clips"></iframe>
                        </td>
                    </tr>
                    <tr>
                        <td style="white-space: nowrap">Công bố lúc</td>
                        <td>{{ post.publishedAt }}</td>
                    </tr>
                    <tr>
                        <td style="white-space: nowrap">Hiển thị</td>
                        <td>{{ post.published ? "Có" : "Không" }}</td>
                    </tr>
                    <tr>
                        <td style="white-space: nowrap">Thể loại</td>
                        <td>{{ post.category.name }}</td>
                    </tr>
                </tbody>
            </table>
            <div class="mb-4">
                <button type="button" class="btn btn-alt-primary" @click="goBack">
                    <i class="fa fa-arrow-left opacity-50 me-1"></i>
                    Quay lại
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useTemplateStore } from "../../../stores/template";
import { authRequest } from "../accountmanager/service/axiosConfig";
import { reactive } from "vue";

const store = useTemplateStore();

const route = useRoute();
const router = useRouter();
const post = reactive({});
const loading = ref(true);

const goBack = () => {
    router.push("/administrator/blog");
};

function getDayFromDate(stringDate) {
    const date = new Date(stringDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

onMounted(async () => {
    const id = route.params.id;
    try {
        const response = await authRequest.get(`/admin/posts/${id}`);

        post.userName = response.data.userName;
        post.title = response.data.title;
        post.slug = response.data.slug;
        post.excerpt = response.data.excerpt;
        post.contentHtml = response.data.contentHtml;
        post.published = response.data.published;
        post.publishedAt = getDayFromDate(response.data.publishedAt);
        post.category = response.data.category;
        post.imageUrl = store.parseMetadataImage(response.data.metadata);
        post.videoUrl = store.parseMetadataVideo(response.data.metadata);
    } catch (error) {
        console.error("Error fetching blog details:", error);
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.table th,
.table td {
    text-align: left;
    vertical-align: middle;
}
</style>
