<template>
  <BasePageHeading title="Category" subtitle="Welcome Admin!">
    <template #extra>
      <button type="button" class="btn btn-alt-primary bg-success text-white" @click="$router.push('/administrator/category/create')"><i class="fa fa-plus opacity-50 me-1"></i> Thêm danh mục</button>
    </template>
  </BasePageHeading>

  <BaseBlock>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h5 class="mb-0">Bảng danh mục</h5>
      <div class="col-md-4">
        <input v-model="searchTerm" type="text" placeholder="Tìm kiếm (Tên danh mục)..." class="form-control" @input="onSearch" />
      </div>
    </div>

    <table class="table table-bordered table-striped table-hover table-vcenter">
      <thead class="bg-primary text-light">
        <tr>
          <!-- <th class="text-center">#</th> -->
          <th class="text-left">Danh mục</th>
          <th class="text-center">Nội dung</th>
          <th class="text-center">Số lượng bài viết</th>
          <th class="text-center">Sửa/Xóa</th>
        </tr>
      </thead>
      <tbody v-if="categories">
        <CategoryRow v-if="categories" :category="categories" :index="1" @edit="toggleVisibility" @delete="swalConfirm" />
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="5" class="text-center">Không có dữ liệu.</td>
        </tr>
      </tbody>
    </table>
    <nav>
      <ul class="pagination justify-content-center mt-4">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="changePage(currentPage - 1)">Trước</button>
        </li>
        <li v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }" class="page-item">
          <button class="page-link" @click="changePage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="changePage(currentPage + 1)">Tiếp</button>
        </li>
      </ul>
    </nav>
  </BaseBlock>
</template>

<script>
import axios from "axios";
import CategoryRow from "@/views/one-ui/category/compononts/CategoryRow.vue";
import BasePageHeading from "@/components/BasePageHeading.vue";
import BaseBlock from "@/components/BaseBlock.vue";

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
      categories: null,
    };
  },
  mounted() {
    this.getCategories();
  },
  methods: {
    async getCategories() {
      try {
        const res = await axios.get("/api/Categories/getallcategories", {
          params: {
            cateName: this.searchTerm || "",
            indexPage: 1,
            limitRange: 10,
          },
        });
        this.totalPages = res.data?.data?.totalPages || 1;
        this.categories = res.data?.data?.categories || null;
      } catch (error) {
        console.error("Error fetching categories:", error.response?.data || error.message);
        this.categories = null;
      }
    },
    onSearch() {
      this.getCategories();
    },
    toggleVisibility(category) {
      console.log("Toggling visibility:", category);
    },
    swalConfirm(category) {
      if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`)) {
        alert("Danh mục đã được xóa!");
      }
    },
  },
};
</script>
