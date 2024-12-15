<template>
  <BasePageHeading title="Category" subtitle="Welcome Admin!">
    <template #extra>
      <button type="button" class="btn btn-alt-primary bg-success" v-click-ripple @click="$router.push('/administrator/category/create')">
        <i class="fa fa-plus opacity-50 me-1"></i>
        Thêm danh mục
      </button>
    </template>
  </BasePageHeading>
  <div class="row mb-4">
    <div class="col-md-8">
      <input v-model="searchTerm" type="text" placeholder="Tìm kiếm (Tên danh mục, ID)..." class="form-control" @input="onSearch" />
    </div>
  </div>

  <BaseBlock title="Bảng danh mục">
    <table class="table table-bordered table-striped table-hover table-vcenter">
      <thead class="bg-primary text-light">
        <tr>
          <th class="text-center" style="width: 50px">#</th>
          <th class="text-center">Danh mục</th>
          <th class="text-center">Nội dung</th>
          <th class="text-center">Số lượng</th>
          <th class="text-center">Sửa/Xóa</th>
        </tr>
      </thead>
      <tbody>
        <CategoryRow
          v-for="(category, index) in paginatedCategories"
          :key="category.nestLeft"
          :category="category"
          :index="category.id"
          :depth="category.nestDepth"
          :is-visible="category.visible"
          @toggle="toggleVisibility(category)"
          @delete="swalConfirm(category)"
        />
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
import { ref, computed } from "vue";
import Swal from "sweetalert2";
import CategoryRow from "./compononts/CategoryRow.vue";
import BasePageHeading from "@/components/BasePageHeading.vue";
import BaseBlock from "@/components/BaseBlock.vue";

export default {
  components: { CategoryRow, BasePageHeading, BaseBlock },

  setup() {
    const rawData = {
      categories: [
        { id: "1", name: "Công nghệ", slug: "Bài viết về công nghệ", parentID: null, nestLeft: 1, nestRight: 14, nestDepth: 0, visible: true },
        { id: "1.1", name: "Công nghệ thông tin", slug: "Hướng dẫn công nghệ thông tin", parentID: "1", nestLeft: 2, nestRight: 7, nestDepth: 1, visible: true },
        { id: "1.1.1", name: "Công nghệ thông tin cơ bản", slug: "Bài viết và hướng dẫn về công nghệ thông tin cơ bản", parentID: "1.1", nestLeft: 3, nestRight: 4, nestDepth: 2, visible: true },
        { id: "1.1.2", name: "Thực hành công nghệ thông tin", slug: "Bài viết và hướng dẫn về thực tập công nghệ thông tin", parentID: "1.1", nestLeft: 5, nestRight: 6, nestDepth: 2, visible: true },
        { id: "1.2", name: "Thiết bị điện tử", slug: "Bài viết về thiết bị điện tử", parentID: "1", nestLeft: 8, nestRight: 13, nestDepth: 1, visible: true },
        { id: "2", name: "Xã hội", slug: "Bài viết chủ đề xã hội", parentID: null, nestLeft: 15, nestRight: 20, nestDepth: 0, visible: true },
        { id: "2.1", name: "Chủ nghĩa", slug: "Bài viết chủ nghĩa xã hội", parentID: "2", nestLeft: 16, nestRight: 19, nestDepth: 1, visible: true },
        { id: "2.1.1", name: "Mac Lenin", slug: "Chủ nghĩa Mac", parentID: "2.1", nestLeft: 17, nestRight: 18, nestDepth: 2, visible: true },
        { id: "3", name: "Kinh tế", slug: "Bài viết chủ đề kinh tế ", parentID: null, nestLeft: 21, nestRight: 26, nestDepth: 0, visible: true },
        { id: "3.1", name: "Quản trị kinh doanh", slug: "Bài viết quản lí", parentID: "3", nestLeft: 22, nestRight: 25, nestDepth: 1, visible: true },
        { id: "3.1.1", name: "Ngân Hàng", slug: "Bài viết ngân hàng", parentID: "3.1", nestLeft: 23, nestRight: 24, nestDepth: 2, visible: true },
        // Additional categories
        { id: "4", name: "Y tế", slug: "Bài viết về y tế", parentID: null, nestLeft: 27, nestRight: 32, nestDepth: 0, visible: true },
        { id: "4.1", name: "Dược phẩm", slug: "Bài viết về dược phẩm", parentID: "4", nestLeft: 28, nestRight: 29, nestDepth: 1, visible: true },
        { id: "4.2", name: "Thiết bị y tế", slug: "Bài viết về thiết bị y tế", parentID: "4", nestLeft: 30, nestRight: 31, nestDepth: 1, visible: true },
        { id: "5", name: "Giáo dục", slug: "Bài viết về giáo dục", parentID: null, nestLeft: 33, nestRight: 38, nestDepth: 0, visible: true },
        { id: "5.1", name: "Đại học", slug: "Bài viết về đại học", parentID: "5", nestLeft: 34, nestRight: 35, nestDepth: 1, visible: true },
        { id: "5.2", name: "Trung học", slug: "Bài viết về trung học", parentID: "5", nestLeft: 36, nestRight: 37, nestDepth: 1, visible: true },
      ],
      posts: [
        { id: 1, categoryID: "1.1.1" },
        { id: 2, categoryID: "1.1.2" },
        { id: 3, categoryID: "1.2" },
        { id: 4, categoryID: "2.1.1" },
        { id: 5, categoryID: "3.1.1" },
        { id: 6, categoryID: "2.1" },
        { id: 7, categoryID: "4.1" },
        { id: 8, categoryID: "4.2" },
        { id: 9, categoryID: "5.1" },
        { id: 10, categoryID: "5.2" },
      ],
    };
    const searchTerm = ref("");
    const currentPage = ref(1);
    const itemsPerPage = 20;

    const calculatePostCounts = (categories, posts) => {
      const postCounts = categories.reduce((acc, category) => {
        acc[category.id] = 0;
        return acc;
      }, {});

      // Count posts directly associated with each category
      posts.forEach((post) => {
        if (postCounts[post.categoryID] !== undefined) {
          postCounts[post.categoryID] += 1;
        }
      });

      // Aggregate counts for parent categories, only including direct children
      categories
        .slice()
        .sort((a, b) => b.nestDepth - a.nestDepth) // Process from deepest to shallowest
        .forEach((category) => {
          categories.forEach((child) => {
            if (child.parentID === category.id) {
              postCounts[category.id] += postCounts[child.id];
            }
          });
        });

      return postCounts;
    };

    const postCounts = calculatePostCounts(rawData.categories, rawData.posts);

    const flattenedCategories = ref(
      rawData.categories.map((category) => ({
        ...category,
        postCount: postCounts[category.id] || 0,
        detail: category.slug,
        visible: category.nestDepth === 0,
      }))
    );

    const filteredCategories = computed(() => {
      const term = searchTerm.value.toLowerCase();
      return flattenedCategories.value.filter((category) => category.name.toLowerCase().includes(term) || category.slug.toLowerCase().includes(term) || category.id.toLowerCase().includes(term));
    });

    const paginatedCategories = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredCategories.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredCategories.value.length / itemsPerPage);
    });

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };

    const toggleVisibility = (category) => {
      flattenedCategories.value.forEach((cat) => {
        if (cat.nestLeft > category.nestLeft && cat.nestRight < category.nestRight) {
          cat.visible = !cat.visible;
        }
      });
    };

    const swalConfirm = (category) => {
      Swal.fire({
        title: `Are you sure to delete "${category.name}"?`,
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        customClass: { confirmButton: "btn btn-danger m-1", cancelButton: "btn btn-secondary m-1" },
        buttonsStyling: false,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Deleted!", `"${category.name}" has been deleted.`, "success");
        }
      });
    };

    return {
      searchTerm,
      filteredCategories,
      paginatedCategories,
      currentPage,
      totalPages,
      changePage,
      toggleVisibility,
      swalConfirm,
    };
  },
};
</script>
