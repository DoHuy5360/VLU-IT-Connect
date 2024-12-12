<template>
  <BasePageHeading title="Category" subtitle="Welcome Admin!">
    <template #extra>
      <button type="button" class="btn btn-alt-primary" @click="$router.push('/administrator/category')">
        <i class="fa fa-arrow-left opacity-50 me-1"></i>
        Back
      </button>
    </template>
  </BasePageHeading>

  <BaseBlock title="Create New Category">
    <div class="col-lg-8 space-y-5">
      <form @submit.prevent="handleSubmit">
        <!-- Parent Category -->
        <div class="mb-4">
          <label class="form-label" for="parentCategory">Parent Category</label>
          <select class="form-select" id="parentCategory" v-model="formData.parentCategory" @change="checkParentCategory" required>
            <option value="">Select Parent Category</option>
            <option v-for="category in parentCategories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <small v-if="errors.parentCategory" class="text-danger">{{ errors.parentCategory }}</small>
        </div>

        <!-- Child Category -->
        <div v-if="showChildCategory" class="mb-4">
          <label class="form-label" for="childCategory">Child Category</label>
          <select class="form-select" id="childCategory" v-model="formData.childCategory" @change="checkChildCategory">
            <option value="">Select Child Category</option>
            <option v-for="category in childCategories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <small v-if="errors.childCategory" class="text-danger">{{ errors.childCategory }}</small>
        </div>

        <!-- Grandchild Category -->
        <div v-if="showGrandchildCategory" class="mb-4">
          <label class="form-label" for="grandchildCategory">Grandchild Category</label>
          <select class="form-select" id="grandchildCategory" v-model="formData.grandchildCategory">
            <option value="">Select Grandchild Category</option>
            <option v-for="category in grandchildCategories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <small v-if="errors.grandchildCategory" class="text-danger">{{ errors.grandchildCategory }}</small>
        </div>

        <!-- Category Name -->
        <div class="mb-4">
          <label class="form-label" for="categoryName">Category Name</label>
          <input
            type="text"
            class="form-control"
            id="categoryName"
            v-model="formData.categoryName"
            placeholder="Enter New Category Name..."
            maxlength="50"
            @input="checkCharacterLimit('categoryName', 50)"
            required
          />
          <small v-if="errors.categoryName" class="text-danger">{{ errors.categoryName }}</small>
          <small v-if="warnings.categoryName" class="text-warning">{{ warnings.categoryName }}</small>
        </div>

        <!-- Detail -->
        <div class="mb-4">
          <label class="form-label" for="categoryDetail">Detail</label>
          <input type="text" class="form-control" id="categoryDetail" v-model="formData.categoryDetail" placeholder="Enter Category Detail..." required />
          <small v-if="errors.categoryDetail" class="text-danger">{{ errors.categoryDetail }}</small>
        </div>

        <div class="mb-4">
          <button type="submit" class="btn btn-alt-primary bg-success">Done</button>
        </div>
      </form>
    </div>
  </BaseBlock>
</template>

<script>
import { useToast } from "vue-toastification";

export default {
  data() {
    return {
      formData: {
        parentCategory: "",
        childCategory: "",
        newChildCategory: "",
        grandchildCategory: "",
        newGrandchildCategory: "",
        categoryName: "",
        categoryDetail: "",
      },
      errors: {},
      warnings: {},
      categories: [
        { id: "1", name: "Công nghệ", parentID: null },
        { id: "1.1", name: "Công nghệ thông tin", parentID: "1" },
        { id: "1.1.1", name: "Công nghệ thông tin cơ bản", parentID: "1.1" },
        { id: "1.1.2", name: "Thực hành công nghệ thông tin", parentID: "1.1" },
        { id: "1.2", name: "Thiết bị điện tử", parentID: "1" },
        { id: "2", name: "Xã hội", parentID: null },
        { id: "2.1", name: "Chủ nghĩa", parentID: "2" },
        { id: "2.1.1", name: "Mac Lenin", parentID: "2.1" },
        { id: "3", name: "Kinh tế", parentID: null },
        { id: "3.1", name: "Quản trị kinh doanh", parentID: "3" },
        { id: "3.1.1", name: "Ngân Hàng", parentID: "3.1" },
        { id: "4", name: "Y tế", parentID: null },
        { id: "4.1", name: "Dược phẩm", parentID: "4" },
        { id: "4.2", name: "Thiết bị y tế", parentID: "4" },
        { id: "5", name: "Giáo dục", parentID: null },
        { id: "5.1", name: "Đại học", parentID: "5" },
        { id: "5.2", name: "Trung học", parentID: "5" },
        // Additional categories
        { id: "6", name: "Thể thao", parentID: null },
        { id: "6.1", name: "Bóng đá", parentID: "6" },
        { id: "6.2", name: "Bóng rổ", parentID: "6" },
        { id: "7", name: "Văn hóa", parentID: null },
        { id: "7.1", name: "Âm nhạc", parentID: "7" },
        { id: "7.2", name: "Điện ảnh", parentID: "7" },
        { id: "8", name: "Khoa học", parentID: null },
        { id: "8.1", name: "Vật lý", parentID: "8" },
        { id: "8.2", name: "Hóa học", parentID: "8" },
      ],
      showChildCategory: false,
      showNewChildCategory: false,
      showGrandchildCategory: false,
      showNewGrandchildCategory: false,
      parentCategories: [],
      childCategories: [],
      grandchildCategories: [],
    };
  },
  methods: {
    checkParentCategory() {
      const parentCategory = this.categories.find((category) => category.id === this.formData.parentCategory);
      if (parentCategory) {
        this.childCategories = this.categories.filter((category) => category.parentID === parentCategory.id);
        this.showChildCategory = this.childCategories.length > 0;
        this.showNewChildCategory = !this.showChildCategory;
      } else {
        this.showChildCategory = false;
        this.showNewChildCategory = false;
      }
    },
    checkChildCategory() {
      const childCategory = this.categories.find((category) => category.id === this.formData.childCategory);
      if (childCategory) {
        this.grandchildCategories = this.categories.filter((category) => category.parentID === childCategory.id);
        this.showGrandchildCategory = this.grandchildCategories.length > 0;
        this.showNewGrandchildCategory = !this.showGrandchildCategory;
      } else {
        this.showGrandchildCategory = false;
        this.showNewGrandchildCategory = false;
      }
    },
    checkCharacterLimit(field, maxLength) {
      if (this.formData[field].length > maxLength) {
        this.warnings[field] = `Maximum ${maxLength} characters allowed.`;
      } else {
        this.warnings[field] = null;
      }
    },
    handleSubmit() {
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
        console.log("Form submitted:", this.formData);
        toast.success("Category created successfully!");
        this.$router.push("/administrator/category"); // Redirect
      }
    },
  },
  mounted() {
    this.parentCategories = this.categories.filter((category) => category.parentID === null);
  },
};
</script>

<style scoped>
.text-danger {
  font-size: 0.875rem;
}
</style>
