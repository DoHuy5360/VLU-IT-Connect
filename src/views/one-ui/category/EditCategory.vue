<template>
  <BasePageHeading title="Chỉnh Sửa Thể Loại" subtitle="">
    <template #extra>
      <button
        type="button"
        class="btn btn-alt-primary"
        @click="$router.push('/administrator/category')"
      >
        <i class="fa fa-arrow-left opacity-50 me-1"></i> Quay về
      </button>
    </template>
  </BasePageHeading>

  <div class="content">
    <BaseBlock title="">
      <div class="space-y-5">
        <form @submit.prevent="updateCategory">
          <!-- Parent Category Dropdown -->
          <div class="mb-4">
            <label class="form-label" for="parentCategory">Thể loại cha</label>
            <select
              class="form-select"
              id="parentCategory"
              v-model="formData.parentId"
            >
              <option value="">-- Không có thể loại cha --</option>
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
            <button type="submit" class="btn btn-success">Cập nhật</button>
          </div>
        </form>
      </div>
    </BaseBlock>
  </div>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";

// Cấu hình base URL cho axios
const apiClient = axios.create({
  baseURL: "https://localhost:7017",
  headers: {
    "Content-Type": "application/json",
  },
});

export default {
  name: "EditCategory",
  props: {
    code: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      categories: [], // Danh sách tất cả categories
      formData: {
        id: null,
        name: "",
        description: "",
        parentId: null,
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
  async mounted() {
    await this.getCategories();
    await this.getCategoryByCode();
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

        const response = await apiClient.get(
          "/api/Categories/getallcategories",
          {
            headers: { Authorization: token },
            params: {
              indexPage: 1,
              limitRange: 20,
            },
          }
        );

        if (response.data?.data?.categories?.$values) {
          this.categories = response.data.data.categories.$values;
          console.log("📂 Danh sách thể loại:", this.categories);
        }
      } catch (error) {
        console.error("❌ Lỗi khi tải danh sách thể loại:", error);
        const toast = useToast();
        toast.error("Không thể tải danh sách thể loại!");
      }
    },

    async getCategoryByCode() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("❌ Không tìm thấy token xác thực!");
          this.$router.push("/login");
          return;
        }

        const encodedCateCode = encodeURIComponent(this.code);
        console.log(
          "🔍 Đang tải thông tin thể loại với code:",
          encodedCateCode
        );

        const response = await apiClient.get(
          "/api/Categories/getcategorybycode",
          {
            headers: { Authorization: token },
            params: {
              cateCode: encodedCateCode,
            },
          }
        );

        if (response.data?.data?.category) {
          const category = response.data.data.category;
          this.formData = {
            id: category.Id,
            name: category.Name,
            description: category.Description,
            parentId: category.ParentId,
            slug: category.Slug,
            code: category.Code,
            nestLeft: category.NestLeft,
            nestRight: category.NestRight,
            nestDepth: category.NestDepth,
            children: category.Children?.$values || [],
            createdAt: category.CreatedAt,
            updatedAt: new Date().toISOString(),
          };

          console.log("✅ Đã tải thông tin thể loại:", this.formData);
        } else {
          const toast = useToast();
          toast.error("Không tìm thấy thông tin thể loại!");
          this.$router.push("/administrator/category");
        }
      } catch (error) {
        console.error("❌ Lỗi khi tải thông tin thể loại:", error);
        const toast = useToast();

        if (error.response?.status === 404) {
          toast.error("Không tìm thấy thể loại với mã này!");
        } else {
          toast.error("Không thể tải thông tin thể loại!");
        }

        this.$router.push("/administrator/category");
      }
    },

    async updateCategory() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("❌ Không tìm thấy token xác thực!");
          this.$router.push("/login");
          return;
        }

        const toast = useToast();

        // Chuẩn bị dữ liệu gửi đi
        const payload = {
          ...this.formData,
          updatedAt: new Date().toISOString(),
        };

        console.log("🚀 Đang cập nhật thể loại:", payload);

        const response = await apiClient.put(
          "/api/Categories/updatecategory",
          payload,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          toast.success("Cập nhật thể loại thành công!");
          this.$router.push("/administrator/category");
        }
      } catch (error) {
        const toast = useToast();
        console.error("❌ Lỗi khi cập nhật thể loại:", error);
        toast.error("Cập nhật thể loại thất bại!");
      }
    },
  },
};
</script>
