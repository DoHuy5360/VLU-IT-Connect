<template>
  <BasePageHeading title="Chỉnh Sửa Thể Loại" subtitle="">
    <template #extra>
      <button type="button" class="btn btn-alt-primary" @click="$router.push('/administrator/category')">
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
            <select class="form-select" id="parentCategory" v-model="formData.parentCategory">
              <option value="">-- Không có thể loại cha --</option>
              <option v-for="category in allCategories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
            <small v-if="errors.parentCategory" class="text-danger">{{ errors.parentCategory }}</small>
          </div>

          <!-- Category Name -->
          <div class="mb-4">
            <label class="form-label" for="categoryName">Tên thể loại</label>
            <input
              type="text"
              class="form-control"
              id="categoryName"
              v-model="formData.categoryName"
              placeholder="Nhập tên thể loại"
              required
            />
            <small v-if="errors.categoryName" class="text-danger">{{ errors.categoryName }}</small>
          </div>

          <!-- Detail -->
          <div class="mb-4">
            <label class="form-label" for="categoryDetail">Mô tả</label>
            <input
              type="text"
              class="form-control"
              id="categoryDetail"
              v-model="formData.categoryDetail"
              placeholder="Nhập mô tả"
              required
            />
            <small v-if="errors.categoryDetail" class="text-danger">{{ errors.categoryDetail }}</small>
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

export default {
  props: ["code"], // Nhận `cateCode` từ route params
  data() {
    return {
      formData: {
        id: "",
        parentCategory: "",
        categoryName: "",
        categoryDetail: "",
        code: "",
      },
      errors: {},
      allCategories: [],
    };
  },
  async mounted() {
    await this.getAllCategories(); // Lấy danh sách tất cả thể loại trước
    if (this.code) {
      await this.getCategoryByCode(this.code);
    }
  },
  methods: {
    // 🔍 Lấy danh sách tất cả thể loại (duyệt cây)
    async getAllCategories() {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("https://localhost:7017/api/Categories/getallcategories?indexPage=1&limitRange=20", {
          headers: { Authorization: token },
        });

        if (response.data?.data?.categories) {
          // Chuyển đổi dữ liệu cây thành danh sách phẳng
          this.allCategories = this.flattenCategories(response.data.data.categories);
          console.log("✅ All Categories Loaded:", this.allCategories);
        }
      } catch (error) {
        console.error("❌ Lỗi lấy danh sách thể loại:", error.response?.data || error.message);
      }
    },

    // 🔄 Chuyển đổi danh mục cây thành danh sách phẳng
    flattenCategories(category, depth = 0) {
      let flatList = [];
      if (!category) return flatList;

      // Thêm danh mục hiện tại
      flatList.push({
        id: category.Id,
        name: `${"— ".repeat(depth)}${category.Name}`, // Hiển thị cấp bậc bằng dấu gạch
      });

      // Duyệt cây con (nếu có)
      if (category.LeftChild) {
        flatList = flatList.concat(this.flattenCategories(category.LeftChild, depth + 1));
      }
      if (category.RightChild) {
        flatList = flatList.concat(this.flattenCategories(category.RightChild, depth + 1));
      }

      return flatList;
    },

    // 🔍 Lấy danh mục theo `cateCode`
    async getCategoryByCode(cateCode) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("❌ Không tìm thấy token, hãy đăng nhập lại!");
          return;
        }

        console.log("🔍 Fetching category with cateCode:", cateCode);

        const response = await axios.get("https://localhost:7017/api/Categories/getcategorybycode", {
          headers: { Authorization: token },
          params: { cateCode: cateCode }, // Dùng `params`
        });

        console.log("✅ API Response:", response.data);

        if (response.data?.data?.category) {
          this.populateForm(response.data.data.category);
        } else {
          console.error("❌ Không tìm thấy danh mục.");
        }
      } catch (error) {
        console.error("❌ API Error:", error.response?.data || error.message);
      }
    },

    // Điền dữ liệu vào form
    populateForm(category) {
      this.formData.id = category.Id;
      this.formData.parentCategory = category.ParentId ? category.ParentId.toString() : "";
      this.formData.categoryName = category.Name;
      this.formData.categoryDetail = category.Description;
      this.formData.code = category.Code;

      console.log("✅ Populated Form Data:", this.formData);
    },

    // 🚀 Gửi API cập nhật danh mục
    async updateCategory() {
      const toast = useToast();
      this.errors = {};

      if (!this.formData.categoryName) {
        this.errors.categoryName = "Tên thể loại không được để trống.";
      }
      if (!this.formData.categoryDetail) {
        this.errors.categoryDetail = "Mô tả thể loại không được để trống.";
      }

      if (Object.keys(this.errors).length === 0) {
        try {
          const token = localStorage.getItem("authToken");
          if (!token) {
            console.error("❌ Không tìm thấy token, hãy đăng nhập lại!");
            return;
          }

          const payload = {
            Id: this.formData.id,
            ParentId: this.formData.parentCategory || null,
            Name: this.formData.categoryName,
            Description: this.formData.categoryDetail,
            Code: this.formData.code,
          };

          console.log("🚀 Updating category:", payload);

          const response = await axios.put("https://localhost:7017/api/Categories/updatecategory", payload, {
            headers: { Authorization: token },
          });

          if (response.status === 200) {
            toast.success("Cập nhật danh mục thành công!");
            this.$router.push("/administrator/category");
          }
        } catch (error) {
          console.error("❌ Lỗi cập nhật danh mục:", error.response?.data || error.message);
          toast.error("Cập nhật danh mục thất bại!");
        }
      }
    },
  },
};
</script>
