<template>
    <BasePageHeading title="Thể loại" subtitle="">
        <template #extra>
            <button type="button" class="btn btn-alt-primary" @click="$router.push('/administrator/category')">
                <i class="fa fa-arrow-left opacity-50 me-1"></i>
                Quay về
            </button>
        </template>
    </BasePageHeading>

    <div class="content">
        <BaseBlock title="Create New Category">
            <div class="col-lg-8 space-y-5">
                <form @submit.prevent="handleSubmit">
                    <!-- Parent Category -->
                    <div class="mb-4">
                        <label class="form-label" for="parentCategory">Thể loại cha</label>
                        <select class="form-select" id="parentCategory" v-model="formData.parentCategory" @change="checkParentCategory">
                            <option value="">--Chọn--</option>
                            <option v-for="category in parentCategories" :key="category.id" :value="category.id">
                                {{ category.name }}
                            </option>
                        </select>
                        <small v-if="errors.parentCategory" class="text-danger">{{ errors.parentCategory }}</small>
                    </div>

                    <!-- Child Category -->
                    <div v-if="showChildCategory" class="mb-4">
                        <label class="form-label" for="childCategory">Thể loại con</label>
                        <select class="form-select" id="childCategory" v-model="formData.childCategory" @change="checkChildCategory">
                            <option value="">--Chọn--</option>
                            <option v-for="category in childCategories" :key="category.id" :value="category.id">
                                {{ category.name }}
                            </option>
                        </select>
                        <small v-if="errors.childCategory" class="text-danger">{{ errors.childCategory }}</small>
                    </div>

                    <!-- Grandchild Category -->
                    <div v-if="showGrandchildCategory" class="mb-4">
                        <label class="form-label" for="grandchildCategory">Thể loại cháu</label>
                        <select class="form-select" id="grandchildCategory" v-model="formData.grandchildCategory">
                            <option value="">--Chọn--</option>
                            <option v-for="category in grandchildCategories" :key="category.id" :value="category.id">
                                {{ category.name }}
                            </option>
                        </select>
                        <small v-if="errors.grandchildCategory" class="text-danger">{{ errors.grandchildCategory }}</small>
                    </div>

                    <!-- Category Name -->
                    <div class="mb-4">
                        <label class="form-label" for="categoryName">Tên thể loại</label>
                        <input
                            type="text"
                            class="form-control"
                            id="categoryName"
                            v-model="formData.categoryName"
                            placeholder=""
                            maxlength="50"
                            @input="checkCharacterLimit('categoryName', 50)"
                            required
                        />
                        <small v-if="errors.categoryName" class="text-danger">{{ errors.categoryName }}</small>
                        <small v-if="warnings.categoryName" class="text-warning">{{ warnings.categoryName }}</small>
                    </div>

                    <!-- Detail -->
                    <div class="mb-4">
                        <label class="form-label" for="categoryDetail">Mô tả</label>
                        <input type="text" class="form-control" id="categoryDetail" v-model="formData.categoryDetail" placeholder="" required />
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
                childCategory: "",
                grandchildCategory: "",
                categoryName: "",
                categoryDetail: "",
            },
            errors: {},
            warnings: {},
            categories: [],
            showChildCategory: false,
            showGrandchildCategory: false,
            parentCategories: [],
            childCategories: [],
            grandchildCategories: [],
        };
    },
    methods: {
        async fetchCategories() {
            try {
                const response = await axios.get("/api/Categories/getallcategories");
                this.categories = response.data;
                this.parentCategories = this.categories.filter((category) => !category.parentID);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        },
        checkParentCategory() {
            const parentCategory = this.categories.find((category) => category.id === this.formData.parentCategory);
            if (parentCategory) {
                this.childCategories = this.categories.filter((category) => category.parentID === parentCategory.id);
                this.showChildCategory = this.childCategories.length > 0;
            } else {
                this.showChildCategory = false;
            }
        },
        checkChildCategory() {
            const childCategory = this.categories.find((category) => category.id === this.formData.childCategory);
            if (childCategory) {
                this.grandchildCategories = this.categories.filter((category) => category.parentID === childCategory.id);
                this.showGrandchildCategory = this.grandchildCategories.length > 0;
            } else {
                this.showGrandchildCategory = false;
            }
        },
        checkCharacterLimit(field, maxLength) {
            if (this.formData[field].length > maxLength) {
                this.errors[field] = `Maximum ${maxLength} characters allowed.`;
            } else {
                delete this.errors[field];
            }
        },
        clearForm() {
            this.formData = {
                parentCategory: "",
                childCategory: "",
                grandchildCategory: "",
                categoryName: "",
                categoryDetail: "",
            };
            this.errors = {};
            this.warnings = {};
            this.showChildCategory = false;
            this.showGrandchildCategory = false;
        },
        async handleSubmit() {
            const toast = useToast();
            this.errors = {};

            // Validation
            if (!this.formData.categoryName) {
                this.errors.categoryName = "Category name is required.";
            }
            if (!this.formData.categoryDetail) {
                this.errors.categoryDetail = "Category detail is required.";
            }

            // If no errors, submit the form
            if (Object.keys(this.errors).length === 0) {
                const payload = {
                    name: this.formData.categoryName,
                    slug: this.formData.categoryName.toLowerCase().replace(/\s+/g, "-"),
                    description: this.formData.categoryDetail,
                    parentId: this.formData.parentCategory || null,
                    nestLeft: 0, // Adjust based on your requirements
                    nestRight: 0, // Adjust based on your requirements
                    nestDepth: this.formData.grandchildCategory ? 2 : this.formData.childCategory ? 1 : 0,
                };

                try {
                    const response = await axios.post("/api/Categories/createcategory", payload);
                    console.log("Form submitted:", response.data);
                    toast.success("Category created successfully!");
                    this.clearForm();
                    this.$router.push("/administrator/category");
                } catch (error) {
                    toast.error("Failed to create category. Please try again.");
                    console.error(error);
                }
            }
        },
    },
    mounted() {
        this.fetchCategories();
    },
};
</script>

<style scoped>
.text-danger {
    font-size: 0.875rem;
}
</style>
