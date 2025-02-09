<template>
  <BasePageHeading title="Tạo Thể Loại" subtitle="">
    <template #extra>
      <button
        type="button"
        class="btn btn-alt-primary"
        @click="$router.push('/administrator/category')"
      >
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
            <label class="form-label" for="parentCategory"
              >Chọn thể loại cha</label
            >
            <select
              class="form-select"
              id="parentCategory"
              v-model="formData.parentId"
            >
              <option value="">-- Chọn --</option>
              <option
                v-for="category in categories"
                :key="category.Id"
                :value="category.Id"
              >
                {{ category.Name }}
              </option>
            </select>
          </div>

          <!-- Category Name -->
          <div class="mb-4">
            <label class="form-label" for="categoryName">Tên thể loại</label>
            <input
              type="text"
              class="form-control"
              id="categoryName"
              v-model="formData.name"
              placeholder="Nhập tên thể loại"
              required
            />
          </div>

          <!-- Description -->
          <div class="mb-4">
            <label class="form-label" for="categoryDetail">Mô tả</label>
            <input
              type="text"
              class="form-control"
              id="categoryDetail"
              v-model="formData.description"
              placeholder="Nhập mô tả"
              required
            />
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
      categories: [], // Danh sách categories để hiển thị trong dropdown
      formData: {
        name: "",
        description: "",
        parentId: "", // ID của category cha
        slug: "",
        code: "",
        nestLeft: 0,
        nestRight: 0,
        nestDepth: 0,
        children: [],
        createdAt: "",
        updatedAt: "",
      },
    };
  },
  methods: {
    async getCategories() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("❌ Không tìm thấy token xác thực!");
          this.$router.push("/login");
          return;
        }

        const response = await axios.get("/api/Categories/getallcategories", {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          params: {
            indexPage: 1,
            limitRange: 100,
          },
        });

        // Xử lý dữ liệu từ API
        if (response.data?.data?.categories?.$values) {
          this.categories = response.data.data.categories.$values;
          console.log("📂 Danh sách thể loại:", this.categories);
        } else {
          console.warn("⚠ Không tìm thấy dữ liệu categories!");
          this.categories = [];
        }
      } catch (error) {
        if (error.response?.status === 302 || error.response?.status === 401) {
          console.error(
            "❌ Phiên làm việc đã hết hạn, vui lòng đăng nhập lại!"
          );
          this.$router.push("/login");
          return;
        }
        console.error("❌ Lỗi khi tải danh sách thể loại:", error);
        this.categories = [];
      }
    },

    async handleSubmit() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("❌ Không tìm thấy token xác thực!");
          this.$router.push("/login");
          return;
        }

        // Chuẩn bị dữ liệu gửi đi
        const now = new Date().toISOString();
        const payload = {
          ...this.formData,
          createdAt: now,
          updatedAt: now,
          id: 0,
          slug: this.formData.name.toLowerCase().replace(/ /g, "-"),
          code: this.formData.name.toLowerCase().replace(/ /g, "-"),
          parentId: this.formData.parentId || null,
          children: [],
        };

        const response = await axios.post(
          "/api/Categories/createcategory",
          payload,
          {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          console.log("✅ Tạo thể loại thành công!");
          this.$router.push("/administrator/category");
        }
      } catch (error) {
        console.error("❌ Lỗi khi tạo thể loại:", error);
      }
    },
  },
  mounted() {
    this.getCategories();
  },
};
</script>
