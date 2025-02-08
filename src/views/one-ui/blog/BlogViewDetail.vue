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
                        <td><img :src="getThumbnail(post.metadata)" alt="" class="w-25" /></td>
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
                        <td>
                            <iframe :src="getVideo(post.metadata)" style="height: 20rem; width: 100%" frameborder="0"></iframe>
                        </td>
                    </tr>
                    <tr>
                        <td style="white-space: nowrap">Công bố lúc</td>
                        <td>{{ getDayFromDate(post.publishedAt) }}</td>
                    </tr>
                    <tr>
                        <td style="white-space: nowrap">Công khai</td>
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
import axios from "axios";

const route = useRoute();
const router = useRouter();
const post = ref({});
const loading = ref(true);

const baseURL = "https://localhost:7017/";
const getThumbnail = (metadata) => {
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
const getVideo = (metadata) => {
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
        const token = localStorage.getItem("authToken");
        if (!token) {
            console.error("Token not found");
            return;
        }
        const response = await axios.get(`/api/admin/posts/${id}`, {
            headers: {
                Authorization: token,
            },
        });
        post.value = response.data;
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
