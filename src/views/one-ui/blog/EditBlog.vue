<template>
    <BasePageHeading title="Chỉnh sửa bài viết" subtitle="">
        <template #extra>
            <button type="button" class="btn btn-alt-primary" @click="$router.push('/administrator/blog')">
                <i class="fa fa-arrow-left opacity-50 me-1"></i>
                Quay lại
            </button>
        </template>
    </BasePageHeading>

    <div class="content">
        <BaseBlock title="">
            <div class="space-y-5 w-full pb-4">
                <form @submit.prevent="submitForm" class="w-full">
                    <!-- Title Field -->
                    <div class="mb-4">
                        <label class="form-label" for="title">Tiêu đề</label>
                        <input type="text" class="form-control" id="title" v-model="formData.title" placeholder="Enter blog title" required />
                    </div>

                    <!-- Slug Field -->
                    <SlugInput :title="formData.title" v-model="formData.slug" />

                    <!-- Excerpt Field -->
                    <div class="mb-4">
                        <label class="form-label" for="excerpt">Đoạn trích</label>
                        <textarea class="form-control" id="excerpt" v-model="formData.excerpt" placeholder="Enter excerpt"></textarea>
                    </div>

                    <!-- Category Field -->
                    <div class="mb-4">
                        <label class="form-label" for="example-select">Thể loại</label>
                        <select class="form-select" id="example-select" v-model="formData.categoryId" required>
                            <option value="" disabled>-- Chọn --</option>
                            <option v-for="category in categories" :key="category.id" :value="category.name">
                                {{ category.name }}
                            </option>
                        </select>
                    </div>

                    <!-- Video Upload Option -->
                    <div class="mb-4">
                        <label class="form-label">Video</label>
                        <div class="form-check">
                            <input type="radio" class="form-check-input" id="upload-link" value="link" v-model="uploadOption.type" />
                            <label class="form-check-label" for="upload-link">Link</label>
                        </div>
                        <div class="form-check">
                            <input type="radio" class="form-check-input" id="upload-file" value="file" v-model="uploadOption.type" />
                            <label class="form-check-label" for="upload-file">Upload File</label>
                        </div>
                    </div>

                    <!-- Conditional Inputs for Video Upload -->
                    <div v-if="uploadOption.type === 'link'" class="mb-4">
                        <label class="form-label" for="video-link">Video Link</label>
                        <input type="url" class="form-control" id="video-link" v-model="formData.videoUrl" placeholder="Enter video link" />
                    </div>

                    <div v-if="uploadOption.type === 'file'" class="mb-4">
                        <VideoDropzone />
                    </div>

                    <!-- Blog Content -->
                    <ckeditor :editor="ClassicEditor" :config="editorConfig" v-model="formData.contentHtml" />

                    <div class="my-4">
                        <!-- Visibility Switch -->
                        <div class="d-flex gap-2 align-items-center">
                            <span class="text-muted">Công bố</span>
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="visibility-switch" v-model="formData.published" />
                            </div>
                        </div>

                        <!-- Auto Comments Switch -->
                        <div class="d-flex gap-2 align-items-center">
                            <span class="text-muted">Cho phép bình luận</span>
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="auto-comments-switch" v-model="formData.enableComments" />
                            </div>
                        </div>
                    </div>
                    <!-- Submit Buttons -->
                    <div class="col-6">
                        <button type="submit" class="btn btn-success">Lưu</button>
                    </div>
                </form>
            </div>
        </BaseBlock>
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SlugInput from "./components/SlugInput.vue";
import VideoDropzone from "./components/VideoDropzone.vue";

export default {
    components: {
        SlugInput,
        VideoDropzone,
    },
    setup() {
        const router = useRouter();
        const route = useRoute();

        const formData = ref({
            title: "",
            slug: "",
            categoryId: "",
            contentHtml: "",
            excerpt: "",
            videoType: "",
            videoUrl: "",
            published: false,
            enableComments: false,
            image: "",
        });

        const uploadOption = ref({
            type: "", // "link" hoặc "file"
        });

        const categories = ref([]);

        // Hàm lấy dữ liệu dựa vào ID
        const fetchDataById = async () => {
            try {
                const id = route.params.id; // Lấy ID từ route
                if (!id) {
                    console.error("ID không tồn tại trong route.");
                    return;
                }

                const token = localStorage.getItem("authToken");
                if (!token) {
                    alert("Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn.");
                    router.push("/login");
                    return;
                }

                const response = await axios.get(`/api/admin/posts/${id}`, {
                    headers: { Authorization: token },
                });

                if (response.data?.data) {
                    const data = response.data.data;

                    // Gán dữ liệu vào form
                    formData.value = {
                        title: data.title || "",
                        slug: data.slug || "",
                        categoryId: data.categoryName || "",
                        contentHtml: data.contentHtml || "",
                        excerpt: data.excerpt || "",
                        videoType: data.metadata?.Video?.type || "",
                        videoUrl: data.metadata?.Video?.url || "",
                        published: data.published || false,
                        enableComments: JSON.parse(data.metadata)?.EnableComments || false,
                        image: "", // Nếu có ảnh, bổ sung logic lấy ảnh
                    };

                    // Xác định kiểu tải video
                    uploadOption.value.type = formData.value.videoType === "file" ? "file" : "link";

                    console.log("Dữ liệu bài viết:", formData.value);
                } else {
                    console.error("Không tìm thấy dữ liệu bài viết.");
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };

        // Lấy danh mục từ API
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    console.error("Token không tồn tại.");
                    return;
                }

                const response = await axios.get("/api/Categories/getallcategories", {
                    params: {
                        cateName: "",
                        indexPage: 1,
                        limitRange: 100,
                    },
                    headers: { Authorization: token },
                });

                if (response.data?.data?.categories) {
                    const mainCategory = response.data.data.categories;
                    const allCategories = [];

                    if (mainCategory) {
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
                    }

                    categories.value = allCategories;
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh mục:", error);
            }
        };

        // Khi component được tải
        onMounted(() => {
            fetchDataById(); // Lấy dữ liệu bài viết
            fetchCategories(); // Lấy danh mục
        });

        const submitForm = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    alert("Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn.");
                    router.push("/login");
                    return;
                }

                if (!formData.value.title.trim()) {
                    alert("Tiêu đề không được để trống.");
                    return;
                }

                const formDataToSend = new FormData();
                formDataToSend.append("Title", formData.value.title);
                formDataToSend.append("Slug", formData.value.slug);
                formDataToSend.append("CategoryIds[0]", categories.value.find((category) => category.name === formData.value.categoryId)?.id);
                formDataToSend.append("ContentHtml", formData.value.contentHtml);
                formDataToSend.append("Excerpt", formData.value.excerpt || "");
                formDataToSend.append("Published", formData.value.published.toString());
                formDataToSend.append("EnableComments", formData.value.enableComments.toString());

                const response = await axios.put(`/api/admin/posts/${route.params.id}`, formDataToSend, {
                    headers: { Authorization: token },
                });

                alert("Bài viết đã được cập nhật thành công.");
                router.push("/administrator/blog");
            } catch (error) {
                console.error("Lỗi khi cập nhật bài viết:", error);
            }
        };

        return {
            formData,
            uploadOption,
            categories,
            ClassicEditor,
            submitForm,
        };
    },
};
</script>

<style scoped>
.ck-editor__editable {
    min-height: 300px;
}
</style>
