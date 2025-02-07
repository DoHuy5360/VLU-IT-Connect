<template>
    <BasePageHeading title="Tạo Bài Viết" subtitle="">
        <template #extra>
            <button type="button" class="btn btn-alt-primary" @click="$router.push('/administrator/blog')">
                <i class="fa fa-arrow-left opacity-50 me-1"></i>
                Quay lại
            </button>
        </template>
    </BasePageHeading>

    <div class="content" :style="`display: ${isShowSimulate ? '' : 'none'}`">
        <div class="mb-4">
            <button type="button" class="btn btn-alt-primary" @click="switchToSimulateView(false)">
                <i class="fa fa-arrow-left opacity-50 me-1"></i>
                Quay lại
            </button>
        </div>
        <div class="bg-white rounded mb-4">
            <div class="p-4">
                <div class="blog-detail-box">
                    <div class="d-flex gap-3 text-muted mb-3">
                        <strong>{{ getDayFromDate(new Date()) }}</strong>
                        <span class="text-primary clickable-text">{{ featuredArticle?.categoryName }}</span>
                    </div>
                    <div class="d-flex justify-content-start">
                        <img :src="featuredArticle?.image" alt="Blog Article Image" class="w-100 border border-new-pale-gray rounded mb-3" style="object-fit: contain" />
                    </div>
                    <h4 class="mb-3">{{ featuredArticle?.title }}</h4>
                    <div class="text-muted mb-3" v-html="featuredArticle?.details"></div>
                    <div v-if="featuredArticle?.video !== null" class="">
                        <video :src="featuredArticle?.video" controls class="w-100"></video>
                    </div>
                    <br />
                    <strong>{{ featuredArticle?.author }}</strong>
                </div>
            </div>
        </div>
    </div>
    <div class="content" :style="`display: ${isShowSimulate ? 'none' : ''}`">
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
                        <label for="pic-file">Hình ảnh</label>
                        <input type="file" id="image-file" accept="image/*" @change="createImageBlob" class="form-control" ref="selectedImageFile" />
                    </div>

                    <div>
                        <label>Nội dung</label>
                        <ckeditor :editor="editor" :config="editorConfig" v-model="formData.contentHtml" required></ckeditor>
                    </div>

                    <div>
                        <label>Loại Video</label>
                        <select v-model="formData.videoType" class="form-select">
                            <option value="link">Link</option>
                            <option value="file">File</option>
                        </select>
                    </div>

                    <div v-if="formData.videoType == 'link'">
                        <label>Video link</label>
                        <input v-model="formData.videoUrl" class="form-control" />
                    </div>

                    <div v-if="formData.videoType == 'file'">
                        <label>Video file</label>
                        <input type="file" id="video-file" accept="video/*" @change="createVideoBlob" class="form-control" ref="selectedVideoFile" />
                    </div>

                    <div style="user-select: none">
                        <div class="form-check">
                            <label class="form-check-label" for="allowComment">Cho phép bình luận</label>
                            <input class="form-check-input" type="checkbox" v-model="formData.enableComments" id="allowComment" />
                        </div>
                        <br />
                        <div class="form-check">
                            <label class="form-check-label" for="publish">Công bố</label>
                            <input class="form-check-input" type="checkbox" v-model="formData.published" id="publish" />
                        </div>
                    </div>
                    <button type="submit" class="btn btn-success">Hoàn tất</button>
                    <button type="button" class="btn btn-alt-secondary ms-2" @click="navigateToSimulation">Xem trước</button>
                </form>
            </div>
        </BaseBlock>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SlugInput from "./components/SlugInput.vue";
import Swal from "sweetalert2";
import { CustomUploadAdapter } from "./uploadAdapter";

const editorConfig = ref({
    placeholder: "Start typing your blog content...",
    extraPlugins: [CustomUploadAdapterPlugin], // Kích hoạt plugin upload
});

function CustomUploadAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return new CustomUploadAdapter(loader);
    };
}

const selectedImageFile = ref(null);
const selectedVideoFile = ref(null);

const router = useRouter();

const formData = ref({
    title: "",
    slug: "",
    categoryId: "",
    contentHtml: "",
    excerpt: "",
    file: "",
    videoType: "link",
    videoUrl: "",
    published: true,
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

fetchCategories();

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
        formDataToSend.append("ContentHtml", formData.value.contentHtml);
        formDataToSend.append("Files", selectedImageFile.value?.files[0]);
        formDataToSend.append("Excerpt", formData.value.excerpt);
        formDataToSend.append("Published", formData.value.published.toString());
        formDataToSend.append("EnableComments", formData.value.enableComments.toString());
        formDataToSend.append("VideoType", formData.value.videoType);
        formDataToSend.append("VideoUrl", formData.value.videoUrl);
        formDataToSend.append("VideoFile", selectedVideoFile.value?.files[0]);

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

const imageUrl = ref(null);
const videoUrl = ref(null);
const createImageBlob = (event) => {
    const file = event.target.files[0];
    if (file) {
        imageUrl.value = URL.createObjectURL(file);
    }
};
const createVideoBlob = (event) => {
    const file = event.target.files[0];
    if (file) {
        videoUrl.value = URL.createObjectURL(file);
    }
};

const featuredArticle = ref();
const isShowSimulate = ref(false);

const navigateToSimulation = () => {
    const selectedCategory = categories.value.filter((category) => category.id === parseInt(formData.value.categoryId));

    featuredArticle.value = {
        title: formData.value.title.trim(),
        details: formData.value.contentHtml,
        categoryName: selectedCategory.length != 0 ? selectedCategory[0].name : "Chưa chọn thể loại bài viết",
        image: imageUrl.value,
        video: formData.value.videoType === "link" ? formData.value.videoUrl : videoUrl.value,
    };
    switchToSimulateView(true);
};

function getDayFromDate(stringDate) {
    const date = new Date(stringDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

function switchToSimulateView(status) {
    isShowSimulate.value = status;
}

const editor = ClassicEditor;
</script>
