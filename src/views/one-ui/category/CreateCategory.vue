<template>
    <BasePageHeading title="Tạo Thể Loại" subtitle="">
        <template #extra>
            <button type="button" class="btn btn-alt-primary" @click="$router.push('/administrator/category')">
                <i class="fa fa-arrow-left opacity-50 me-1"></i>
                Quay về
            </button>
        </template>
    </BasePageHeading>

    <div class="content">
        <BaseBlock title="">
            <div class="space-y-5">
                <form @submit.prevent="handleSubmit">
                    <!-- Parent Category Dropdown -->
                    <div class="mb-4">
                        <label class="form-label" for="parentCategory">Chọn thể loại cha</label>
                        <select class="form-select" id="parentCategory" v-model="formData.parentCategory" @change="checkParentCategory">
                            <option value="">-- Chọn --</option>
                            <option v-for="category in allCategories" :key="category.id" :value="category.id">
                                {{ category.name }}
                            </option>
                        </select>
                        <small v-if="errors.parentCategory" class="text-danger">{{ errors.parentCategory }}</small>
                    </div>

                    <!-- Category Name -->
                    <div class="mb-4">
                        <label class="form-label" for="categoryName">Tên thể loại</label>
                        <input type="text" class="form-control" id="categoryName" v-model="formData.categoryName" placeholder="Nhập tên thể loại" maxlength="50" required />
                        <small v-if="errors.categoryName" class="text-danger">{{ errors.categoryName }}</small>
                    </div>

                    <!-- Detail -->
                    <div class="mb-4">
                        <label class="form-label" for="categoryDetail">Mô tả</label>
                        <input type="text" class="form-control" id="categoryDetail" v-model="formData.categoryDetail" placeholder="Nhập mô tả" required />
                        <small v-if="errors.categoryDetail" class="text-danger">{{ errors.categoryDetail }}</small>
                    </div>

                    <div class="mb-4">
                        <button type="submit" class="btn btn-success">Tạo</button>
                    </div>
                </form>
            </div>
        </BaseBlock>
    </div>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";

export default {
    data() {
        return {
            formData: {
                parentCategory: "",
                categoryName: "",
                categoryDetail: "",
            },
            errors: {},
            allCategories: [], // Danh sách tất cả danh mục lấy từ API
        };
    },
    methods: {
        async getCategories() {
            try {
                const token = localStorage.getItem("authToken");
                const params = {
                    indexPage: 1,
                    limitRange: 20,
                };

                console.log("🔍 Request API:", params);

                const response = await axios.get("/api/Categories/getallcategories", {
                    headers: { Authorization: token },
                    params: params,
                });

                console.log("✅ API Response Raw:", response.data);

                if (response.data?.data?.categories) {
                    let rootCategory = response.data.data.categories; // Dữ liệu là object, không phải array

                    // ✅ Chuyển từ object cây sang danh sách mảng
                    this.allCategories = this.convertTreeToArray(rootCategory);

                    console.log("📂 Processed Categories:", this.allCategories);
                } else {
                    console.warn("⚠ Không tìm thấy danh mục trong API response!");
                }
            } catch (error) {
                console.error("❌ API Error:", error.response?.data || error.message);
            }
        },

        // 🛠 Chuyển từ cây danh mục sang mảng
        convertTreeToArray(node, parentId = null, result = []) {
            if (!node) return result;

            // ✅ Định dạng lại object danh mục
            let formattedNode = {
                id: node.Id,
                name: node.Name,
                parentId: parentId, // Lưu ID danh mục cha
                description: node.Description,
            };

            result.push(formattedNode);

            // ✅ Đệ quy xử lý LeftChild và RightChild
            if (node.LeftChild) {
                this.convertTreeToArray(node.LeftChild, node.Id, result);
            }
            if (node.RightChild) {
                this.convertTreeToArray(node.RightChild, node.Id, result);
            }

            return result;
        },

        checkParentCategory() {
            console.log("🛠 Danh mục cha được chọn:", this.formData.parentCategory);
        },

        async handleSubmit() {
            const toast = useToast();
            this.errors = {};

            if (!this.formData.categoryName) {
                this.errors.categoryName = "Tên thể loại là bắt buộc.";
            }
            if (!this.formData.categoryDetail) {
                this.errors.categoryDetail = "Mô tả là bắt buộc.";
            }

            if (Object.keys(this.errors).length > 0) return;

            const payload = {
                name: this.formData.categoryName,
                slug: this.formData.categoryName.toLowerCase().replace(/\s+/g, "-"),
                code: this.formData.categoryName.toLowerCase().replace(/\s+/g, "-"),
                description: this.formData.categoryDetail,
                parentId: this.formData.parentCategory || null, // Lấy `id` của danh mục cha từ dropdown
                nestLeft: 0,
                nestRight: 0,
                nestDepth: 0,
            };

            try {
                const token = localStorage.getItem("authToken");
                await axios.post("/api/Categories/createcategory", payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                toast.success("Tạo thể loại thành công!");

                // 🔄 Cập nhật danh sách danh mục ngay sau khi tạo mới
                this.getCategories();
                this.$router.push("/administrator/category");

                this.clearForm();
            } catch (error) {
                toast.error("Tạo thể loại thất bại. Vui lòng thử lại.");
                console.error("❌ API Error:", error.response?.data || error.message);
            }
        },

        clearForm() {
            this.formData = {
                parentCategory: "",
                categoryName: "",
                categoryDetail: "",
            };
        },
    },
    mounted() {
        this.getCategories();
    },
};
</script>

<style scoped>
.text-danger {
    font-size: 0.875rem;
}
</style>
