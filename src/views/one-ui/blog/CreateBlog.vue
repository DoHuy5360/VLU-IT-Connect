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
                        <label class="form-label">Tiêu đề</label>
                        <input v-model="state.title" @input="generateSlug" @blur="v$.title.$touch" class="form-control" :class="{ 'is-invalid': v$.title.$errors.length }" />
                        <div v-if="v$.title.$errors.length" class="invalid-feedback">
                            <span v-if="v$.title.$errors[0].$validator === 'required'"> Hãy nhập tiêu đề </span>
                        </div>
                    </div>

                    <div>
                        <label class="form-label" for="slug">Slug</label>
                        <input type="text" v-model="state.slug" class="form-control" />
                    </div>

                    <div>
                        <label class="form-label">Thể loại</label>
                        <select v-model="state.categoryId" class="form-control" @blur="v$.categoryId.$touch" :class="{ 'is-invalid': v$.categoryId.$errors.length }">
                            <option value="">Chọn thể loại</option>
                            <option value="1">de</option>
                            <option v-for="category in categories" :key="category.id" :value="category.id">
                                {{ category.name }}
                            </option>
                        </select>
                        <div v-if="v$.categoryId.$errors.length" class="invalid-feedback">
                            <span v-if="v$.categoryId.$errors[0].$validator === 'required'"> Hãy chọn thể loại </span>
                        </div>
                    </div>
                    <div>
                        <label class="form-label">Mô tả ngắn</label>
                        <textarea v-model="formData.excerpt" class="form-control" placeholder="Mô tả ngắn bài viết"></textarea>
                    </div>
                    <div>
                        <label for="pic-file">Hình ảnh</label>
                        <input
                            @blur="v$.image.$touch"
                            :class="{ 'is-invalid': v$.image.$errors.length }"
                            type="file"
                            id="image-file"
                            accept="image/*"
                            @change="createImageBlob"
                            class="form-control"
                            ref="selectedImageFile"
                        />
                        <div v-if="v$.image.$errors.length" class="invalid-feedback">
                            <span v-if="v$.image.$errors[0].$validator === 'required'"> Hãy chọn ảnh bìa </span>
                        </div>
                        <span v-if="v$.image.$errors.some((e) => e.$validator === 'maxSize')"> Kích thước file không được vượt quá 5MB. </span>
                    </div>

                    <div>
                        <label class="form-label">Nội dung</label>
                        <ckeditor :editor="editor" :config="editorConfig" v-model="formData.contentHtml" required></ckeditor>
                    </div>

                    <div>
                        <label class="form-label">Loại Video</label>
                        <select v-model="formData.videoType" class="form-select">
                            <option value="link">Link</option>
                            <option value="file">File</option>
                        </select>
                    </div>

                    <div v-if="formData.videoType == 'link'">
                        <label class="form-label">Video link</label>
                        <input v-model="formData.videoUrl" class="form-control" />
                    </div>

                    <div v-if="formData.videoType == 'file'">
                        <label class="form-label">Video file</label>
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
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SlugInput from "./components/SlugInput.vue";
import Swal from "sweetalert2";
import { CustomUploadAdapter } from "./uploadAdapter";
import useVuelidate from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
import authRequest from "../accountmanager/service/axiosConfig";

// Validate
const state = reactive({
    title: "",
    slug: "",
    excerpt: "",
    categoryId: "",
    image: null,
});
const maxSize = (size) => (value) => {
    return !value || value.size <= size;
};
const rules = {
    title: { required, maxLengt: maxLength(225) },
    slug: { required, maxLengt: maxLength(200) },
    excerpt: { maxLengt: maxLength(160) },
    categoryId: { required },
    image: { required, maxSize: maxSize(5 * 1024 * 1024) },
};

const v$ = useVuelidate(rules, state);

// Slug
function generateSlug() {
    state.slug = state.title
        .toLowerCase()
        .normalize("NFD") // Chuyển thành dạng decomposed để tách dấu
        .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
        .replace(/đ/g, "d")
        .replace(/Đ/g, "d") // Chuyển đ -> d
        .replace(/[^a-z0-9\s-]/g, "") // Loại bỏ ký tự đặc biệt
        .trim()
        .replace(/\s+/g, "-"); // Chuyển khoảng trắng thành dấu gạch ngang
}

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
    v$.value.$touch(); // Đánh dấu tất cả các trường
    if (v$.value.$invalid) {
        console.log("khong hop le");

        return;
    } else {
        console.log("hop le");
        console.log(state);
    }
    try {
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

        await authRequest.post("/api/admin/posts", formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        const userConfirmed = await Swal.fire({
            title: "Tạo bài viết thành công",
            text: "",
            icon: "success",
            showCancelButton: true,
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Hủy",
        });

        if (userConfirmed.isConfirmed) {
            router.push("/administrator/blog");
        }

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

        state.image = file ? file : null; // Cập nhật state
        v$.value.image.$touch(); // Kích hoạt kiểm tra lỗi ngay sau khi chọn file
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
