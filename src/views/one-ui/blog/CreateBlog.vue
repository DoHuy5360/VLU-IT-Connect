<template>
    <BasePageHeading title="Tạo Bài Viết" subtitle="">
        <template #extra>
            <button type="button" class="btn btn-alt-primary" @click="$router.push('/administrator/blog')">
                <i class="fa fa-arrow-left opacity-50 me-1"></i>
                Quay lại
            </button>
        </template>
    </BasePageHeading>

    <div class="content">
        <BaseBlock title="">
            <div class="space-y-5 pb-4">
                <form @submit.prevent="submitForm" class="space-y-4">
                    <div>
                        <label>Tiêu đề</label>
                        <input v-model="formData.title" required class="form-control" />
                    </div>

                    <SlugInput :title="formData.title" v-model="formData.slug" />

                    <div>
                        <label>Thể loại</label>
                        <select v-model="formData.categoryId" required class="form-control">
                            <option value="">Chọn thể loại</option>
                            <option v-for="category in categories" :key="category.id" :value="category.id">
                                {{ category.name }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label>Mô tả ngắn</label>
                        <textarea v-model="formData.excerpt" class="form-control" placeholder="Mô tả ngắn bài viết"></textarea>
                    </div>
                    <div>
                        <label for="pic-file">File Hình Ảnh</label>
                        <input type="file" id="image-file" accept="image/*" class="form-control" ref="selectedImageFile" />
                    </div>

                    <div>
                        <label>Nội dung</label>
                        <ckeditor :editor="editor" v-model="formData.contentHtml" required></ckeditor>
                    </div>

                    <div>
                        <label>Loại Video</label>
                        <input v-model="formData.videoType" class="form-control" />
                    </div>

                    <div>
                        <label>URL Video</label>
                        <input v-model="formData.videoUrl" class="form-control" />
                    </div>

                    <div>
                        <label>File Video</label>
                        <input type="file" id="video-file" accept="video/*" class="form-control" ref="selectedVideoFile" />
                    </div>

                    <div class="flex space-x-4">
                        <label>
                            <input type="checkbox" v-model="formData.enableComments" />
                            Cho phép bình luận
                        </label>

                        <label>
                            <input type="checkbox" v-model="formData.published" />
                            Công bố
                        </label>
                    </div>

                    <button type="submit" class="btn btn-success">Hoàn tất</button>
                    <button type="button" class="btn btn-alt-secondary ms-2" @click="navigateToSimulation">Xem trước</button>
                </form>
            </div>
        </BaseBlock>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SlugInput from "./components/SlugInput.vue";
import Swal from "sweetalert2";
const selectedImageFile = ref(null);
const selectedVideoFile = ref(null);

const router = useRouter();
const route = useRoute();

const formData = ref({
    title: "",
    slug: "",
    categoryId: "",
    contentHtml: "",
    excerpt: "",
    file: "",
    videoType: "",
    videoUrl: "",
    published: false,
    enableComments: false,
    image: "",
});

const categories = ref([]);

const fetchCategories = async () => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await axios.get("/api/Categories/getallcategories", {
            params: { cateName: "", indexPage: 1, limitRange: 100 },
            headers: { Authorization: token },
        });
        if (response.data?.data?.categories) {
            const mainCategory = response.data.data.categories;
            const allCategories = [];

            allCategories.push({
                id: mainCategory.Id,
                name: mainCategory.Name,
            });

            if (mainCategory.LeftChild) {
                allCategories.push({
                    id: mainCategory.LeftChild.Id,
                    name: mainCategory.LeftChild.Name,
                });
            }

            if (mainCategory.RightChild) {
                allCategories.push({
                    id: mainCategory.RightChild.Id,
                    name: mainCategory.RightChild.Name,
                });
            }

            categories.value = allCategories;
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
};

onMounted(() => {
    fetchCategories();
    Object.assign(formData.value, {
        title: route.query.title || "",
        slug: route.query.slug || "",
        categoryId: route.query.categoryId || "",
        contentHtml: route.query.contentHtml || "",
        file: route.query.file || "",
        excerpt: route.query.excerpt || "",
        videoType: route.query.videoType || "",
        videoUrl: route.query.videoUrl || "",
        published: route.query.published === "true",
        enableComments: route.query.enableComments === "true",
        image: route.query.image || "",
    });
});

const submitForm = async () => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn");
            router.push("/login");
            return;
        }

        if (!formData.value.title.trim() || !formData.value.contentHtml.trim() || !formData.value.categoryId) {
            alert("Vui lòng nhập đầy đủ thông tin bắt buộc");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("Title", formData.value.title.trim());
        formDataToSend.append("Slug", formData.value.slug || formData.value.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
        formDataToSend.append("CategoryIds[0]", formData.value.categoryId);
        formDataToSend.append("ContentHtml", formData.value.contentHtml.trim());
        formDataToSend.append("Files", selectedImageFile.value?.files[0]);
        formDataToSend.append("Excerpt", formData.value.excerpt || "");
        formDataToSend.append("Published", formData.value.published.toString());
        formDataToSend.append("EnableComments", formData.value.enableComments.toString());
        formDataToSend.append("VideoType", formData.value.videoType || "");
        formDataToSend.append("VideoUrl", formData.value.videoUrl || "");

        await axios.post("/api/admin/posts", formDataToSend, {
            headers: { "Content-Type": "multipart/form-data", Authorization: token },
        });

        router.push("/administrator/blog");
    } catch (error) {
        console.error("Error creating post:", error);
        
        await Swal.fire({
            title: "Lỗi khi tạo bài viết",
            text: error.response.data.error,
            icon: "error",
        });
    }
};

const navigateToSimulation = () => {
    router.push({ path: "/administrator/blog/simulate", query: { ...formData.value } });
};

const editor = ClassicEditor;
</script>
