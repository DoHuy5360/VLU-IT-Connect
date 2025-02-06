<template>
    <BasePageHeading title="Chỉnh Sửa Bài Viết" subtitle="">
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
                    <div class="mb-4">
                        <div>
                            <img :src="formData.image" class="img-fluid" style="" alt="" />
                        </div>
                        <br>
                        <div>Hình ảnh</div>
                        <input type="file" id="image-file" accept="image/*" class="form-control" ref="selectedImageFile" />
                    </div>

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
                        <label>Video file</label>
                        <input type="file" id="video-file" accept="video/*" class="form-control" ref="selectedVideoFile" />
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

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SlugInput from "./components/SlugInput.vue";

const baseURL = "https://localhost:7017/"
const router = useRouter();
const route = useRoute();
const selectedImageFile = ref(null);
const selectedVideoFile = ref(null);

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

const uploadOption = ref({ type: "" });
const categories = ref([]);

function getTypeOfVideo(metadata) {
    
}

const parseMetadata = (metadata) => {
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
const parseMetadataVideo = (metadata) => {
    try {
        const metaObj = JSON.parse(metadata);
        
        if (metaObj.Video.file) {
            let path = metaObj.Video.file.replace(/\\/g, "/");
            return baseURL + path;
        }
        return "";
    } catch (error) {
        console.error("Error parsing metadata:", error);
        return "";
    }
};

const fetchDataById = async () => {
    try {
        const id = route.params.id;
        if (!id) return console.error("ID không tồn tại trong route.");

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
                image: parseMetadata(data.metadata),
            };
            uploadOption.value.type = formData.value.videoType === "file" ? "file" : "link";
        }
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
    }
};

const fetchCategories = async () => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) return console.error("Token không tồn tại.");

        const response = await axios.get("/api/Categories/getallcategories", {
            params: { cateName: "", indexPage: 1, limitRange: 100 },
            headers: { Authorization: token },
        });

        if (response.data?.data?.categories) {
            const mainCategory = response.data.data.categories;
            const allCategories = [];

            if (mainCategory) {
                allCategories.push({ id: mainCategory.Id, name: mainCategory.Name });
                if (mainCategory.LeftChild) {
                    allCategories.push({ id: mainCategory.LeftChild.Id, name: mainCategory.LeftChild.Name });
                }
                if (mainCategory.RightChild) {
                    allCategories.push({ id: mainCategory.RightChild.Id, name: mainCategory.RightChild.Name });
                }
            }

            categories.value = allCategories;
        }
    } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
    }
};

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
        formDataToSend.append("CategoryIds[0]", categories.value.find((c) => c.name === formData.value.categoryId)?.id);
        formDataToSend.append("ContentHtml", formData.value.contentHtml);
        formDataToSend.append("Excerpt", formData.value.excerpt || "");
        formDataToSend.append("Published", formData.value.published.toString());
        formDataToSend.append("EnableComments", formData.value.enableComments.toString());
        formDataToSend.append("Files", selectedImageFile.value?.files[0]);
        formDataToSend.append("VideoFile", selectedVideoFile.value?.files[0]);

        await axios.put(`/api/admin/posts/${route.params.id}`, formDataToSend, {
            headers: { 
                "Content-Type": "multipart/form-data",
                Authorization: token },

        });
        // router.push("/administrator/blog");
    } catch (error) {
        console.error("Lỗi khi cập nhật bài viết:", error);
    }
};

onMounted(() => {
    fetchDataById();
    fetchCategories();
});
</script>
