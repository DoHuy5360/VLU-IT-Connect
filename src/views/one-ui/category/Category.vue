<template>
  <BasePageHeading title="Quản Lý Thể Loại" subtitle="">
    <template #extra>
      <button
        type="button"
        class="btn btn-success"
        @click="$router.push('/administrator/category/create')"
      >
        <i class="fa fa-plus opacity-50 me-1"></i> Thêm thể loại
      </button>
    </template>
  </BasePageHeading>

  <div class="content">
    <BaseBlock title="Danh sách thể loại" class="shadow-sm rounded">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div></div>
        <div class="col-md-4">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Tìm kiếm ..."
            class="form-control"
            @input="onSearch"
          />
        </div>
      </div>

      <table
        class="table table-bordered table-striped table-hover table-vcenter"
      >
        <thead class="bg-primary text-light">
          <tr>
            <th class="text-center" style="width: 50px"></th>
            <th class="text-left">Danh mục</th>
            <th class="text-center">Nội dung</th>
            <th class="text-center">Sửa/Xóa</th>
          </tr>
        </thead>
        <tbody v-if="categories.length">
          <CategoryRow
            v-for="category in categories"
            :key="category.id"
            :category="category"
            :expandedCategories="expandedCategories"
            @edit="editCategory"
            @delete="confirmDelete"
            @toggle="toggleCategory"
          />
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="4" class="text-center">Không có dữ liệu.</td>
          </tr>
        </tbody>
      </table>
    </BaseBlock>
  </div>
</template>
<script>
import axios from "axios";
import CategoryRow from "@/views/one-ui/category/compononts/CategoryRow.vue";
import BasePageHeading from "@/components/BasePageHeading.vue";
import BaseBlock from "@/components/BaseBlock.vue";
import Swal from "sweetalert2";

export default {
  name: "SimpleCategoryTable",
  components: {
    CategoryRow,
    BasePageHeading,
    BaseBlock,
  },
  data() {
    return {
      searchTerm: "",
      categories: [],
      currentPage: 1,
      expandedCategories: {}, // Lưu trạng thái mở rộng theo ID danh mục
    };
  },
  async mounted() {
    await this.getCategories();
  },
  methods: {
    async getCategories() {
      try {
        const token = localStorage.getItem("authToken");
        const params = {
          indexPage: this.currentPage || 1,
          limitRange: 20,
        };

        console.log("🔍 Request API:", params);
        console.log("🔑 Token:", token);

        const response = await axios.get("/api/Categories/getallcategories", {
          headers: { Authorization: token },
          params: params,
        });

        console.log("✅ Raw API Response:", response);
        console.log("✅ API Response Data:", response.data);

        // Lấy mảng categories từ response
        const categoriesData = response.data?.data?.categories?.$values || [];
        console.log("✅ Categories from Response:", categoriesData);

        if (categoriesData.length > 0) {
          this.categories = categoriesData.map((category) =>
            this.processCategories(category)
          );
          console.log("📂 Processed Categories:", this.categories);
        } else {
          console.warn("⚠️ No categories found in response");
          this.categories = [];
        }
      } catch (error) {
        console.error("❌ API Error:", error);
        console.error("❌ Error Response:", error.response);
        console.error("❌ Error Message:", error.message);
        this.categories = [];
      }
    },
    processCategories(category) {
      if (!category) return null;

      const newCategory = {
        id: category.Id,
        name: category.Name,
        description: category.Description,
        code: category.Code,
        parentId: category.ParentId,
        nestDepth: category.NestDepth,
        children: [],
      };

      // Xử lý children nếu có
      if (category.Children && category.Children.$values) {
        newCategory.children = category.Children.$values
          .map((child) => this.processCategories(child))
          .filter((child) => child !== null);
      }

      return newCategory;
    },
    toggleCategory(categoryId) {
      // Nếu danh mục đã mở, đóng tất cả danh mục con
      if (this.expandedCategories[categoryId]) {
        this.closeAllChildren(categoryId);
      } else {
        this.expandedCategories = {
          ...this.expandedCategories,
          [categoryId]: !this.expandedCategories[categoryId],
        };
      }
    },
    closeAllChildren(categoryId) {
      // Đóng danh mục cha và tất cả danh mục con
      let updatedCategories = { ...this.expandedCategories };
      delete updatedCategories[categoryId];

      Object.keys(updatedCategories).forEach((id) => {
        if (id.startsWith(categoryId + "-")) {
          delete updatedCategories[id];
        }
      });

      this.expandedCategories = updatedCategories;
    },
    onSearch() {
      this.getCategories();
    },
    editCategory(category) {
      console.log("📝 Chuyển đến trang chỉnh sửa category:", category);
      this.$router.push(`/administrator/category/edit/${category.Code}`);
    },
    async confirmDelete(category) {
      this.getCategories();
      const result = await Swal.fire({
        title: "Xóa thành công",
        icon: "success",
      });
    },
  },
};
</script>
