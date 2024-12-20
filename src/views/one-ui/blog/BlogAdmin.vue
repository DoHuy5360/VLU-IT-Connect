<template>
  <BasePageHeading title="Blog" subtitle="Welcome Admin!">
    <template #extra>
      <button type="button" class="btn btn-success d-flex align-items-center" v-click-ripple @click="$router.push('/administrator/blog/create')">
        <i class="fa fa-plus opacity-50 me-2"></i>
        Thêm bài viết mới
      </button>
    </template>
  </BasePageHeading>

  <BaseBlock title="Blog Overview">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <input v-model="searchTerm" type="text" placeholder="Tìm kiếm bài viết..." class="form-control flex-grow-1 me-2" @input="onSearch" />
      <select v-model="selectedCategory" class="form-control w-25 me-2" @change="onFilter">
        <option value="">Tất cả danh mục</option>
        <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
      </select>
      <select v-model="selectedStatus" class="form-control w-25" @change="onFilter">
        <option value="">Tất cả trạng thái</option>
        <option value="Draft">Draft</option>
        <option value="Visibility">Visibility</option>
        <option value="Published">Published</option>
      </select>
    </div>

    <div v-if="filteredUsers.length === 0 && !loading" class="text-center p-5">
      <p class="text-muted fs-lg">Không tìm thấy kết quả phù hợp.</p>
    </div>
    <div v-else class="table-responsive">
      <table class="table table-bordered table-hover">
        <thead class="bg-primary text-white">
          <tr>
            <th class="text-center" style="width: 80px">ID</th>
            <th>Tác giả</th>
            <th>Tiêu đề</th>
            <th style="width: 15%">Trạng thái</th>
            <th class="text-center" style="width: 120px">Sửa/Xóa</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id" @click="$router.push('/administrator/blog/viewdetail')" class="clickable-row">
            <td class="text-center fw-bold text-primary">#{{ user.id }}</td>
            <td class="fw-semibold fs-sm">{{ user.author }}</td>
            <td class="fs-sm">{{ user.title }}</td>
            <td>
              <span :class="`fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill ${getStatusClass(user.status)}`">
                {{ user.status }}
              </span>
            </td>
            <td class="text-center">
              <div class="btn-group">
                <button type="button" class="btn btn-sm btn-warning" @click.stop="editBlog(user.id)">
                  <i class="fa fa-edit me-1"></i>
                </button>
                <button type="button" class="btn btn-sm btn-danger" @click.stop="swalConfirm(user.id)">
                  <i class="fa fa-trash me-1"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <nav v-if="filteredUsers.length > itemsPerPage" class="mt-3">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Trước</button>
          </li>
          <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
            <button class="page-link" @click="changePage(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Tiếp</button>
          </li>
        </ul>
      </nav>
    </div>
  </BaseBlock>
</template>

<script>
import { ref, computed } from "vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

export default {
  name: "BlogAdmin",
  setup() {
    const router = useRouter();

    const users = ref([
      { id: 1, author: "John Doe", title: "Introduction to Vue 3", category: "Technology", status: "Published", publishDate: "2024-12-01" },
      { id: 2, author: "Jane Smith", title: "Health Benefits of Yoga", category: "Health", status: "Draft", publishDate: "2024-11-28" },
      { id: 3, author: "Alice Johnson", title: "Top 10 Lifestyle Hacks", category: "Lifestyle", status: "Visibility", publishDate: "2024-12-05" },
      { id: 4, author: "Bob Brown", title: "Advanced JavaScript Techniques", category: "Technology", status: "Published", publishDate: "2024-12-10" },
      { id: 5, author: "Carol White", title: "Meditation for Beginners", category: "Health", status: "Draft", publishDate: "2024-11-20" },
      { id: 6, author: "David Green", title: "Minimalist Living Tips", category: "Lifestyle", status: "Visibility", publishDate: "2024-12-15" },
      { id: 7, author: "Eve Black", title: "Understanding TypeScript", category: "Technology", status: "Published", publishDate: "2024-12-18" },
      { id: 8, author: "Frank Blue", title: "Healthy Eating Habits", category: "Health", status: "Draft", publishDate: "2024-11-25" },
      { id: 9, author: "Grace Yellow", title: "Traveling on a Budget", category: "Lifestyle", status: "Visibility", publishDate: "2024-12-20" },
      { id: 10, author: "Hank Purple", title: "React vs Vue: A Comparison", category: "Technology", status: "Published", publishDate: "2024-12-22" },
      { id: 11, author: "Ivy Orange", title: "Yoga for Flexibility", category: "Health", status: "Draft", publishDate: "2024-11-30" },
      { id: 12, author: "Jack Pink", title: "Home Organization Tips", category: "Lifestyle", status: "Visibility", publishDate: "2024-12-25" },
      { id: 13, author: "Karen Red", title: "Building REST APIs with Node.js", category: "Technology", status: "Published", publishDate: "2024-12-28" },
      { id: 14, author: "Leo Gray", title: "Mental Health Awareness", category: "Health", status: "Draft", publishDate: "2024-11-15" },
      { id: 15, author: "Mona Blue", title: "Sustainable Living Practices", category: "Lifestyle", status: "Visibility", publishDate: "2024-12-30" },
      { id: 16, author: "Nina Green", title: "CSS Grid Layout", category: "Technology", status: "Published", publishDate: "2024-12-31" },
      { id: 17, author: "Oscar Brown", title: "Benefits of Regular Exercise", category: "Health", status: "Draft", publishDate: "2024-11-10" },
      { id: 18, author: "Paul White", title: "Decluttering Your Home", category: "Lifestyle", status: "Visibility", publishDate: "2024-12-02" },
      { id: 19, author: "Quincy Black", title: "Introduction to GraphQL", category: "Technology", status: "Published", publishDate: "2024-12-03" },
      { id: 20, author: "Rachel Blue", title: "Healthy Sleep Habits", category: "Health", status: "Draft", publishDate: "2024-11-05" },
      { id: 21, author: "Steve Yellow", title: "Mindfulness Techniques", category: "Lifestyle", status: "Visibility", publishDate: "2024-12-06" },
      { id: 22, author: "Tina Purple", title: "Vue 3 Composition API", category: "Technology", status: "Published", publishDate: "2024-12-07" },
      { id: 23, author: "Uma Orange", title: "Nutrition for Athletes", category: "Health", status: "Draft", publishDate: "2024-11-01" },
      { id: 24, author: "Victor Pink", title: "Creating a Capsule Wardrobe", category: "Lifestyle", status: "Visibility", publishDate: "2024-12-08" },
    ]);

    const categories = ref(["Technology", "Health", "Lifestyle"]);
    const searchTerm = ref("");
    const selectedCategory = ref("");
    const selectedStatus = ref("");
    const itemsPerPage = 20;
    const currentPage = ref(1);

    const filteredUsers = computed(() => {
      const search = searchTerm.value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const matchesSearchTerm = (user) =>
        user.title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(search);
      const matchesCategory = (user) => selectedCategory.value === "" || user.category === selectedCategory.value;
      const matchesStatus = (user) => selectedStatus.value === "" || user.status === selectedStatus.value;

      return users.value.filter((user) => matchesSearchTerm(user) && matchesCategory(user) && matchesStatus(user)).sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
    });

    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return filteredUsers.value.slice(start, start + itemsPerPage);
    });

    const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage));

    const getStatusClass = (status) => {
      switch (status) {
        case "Draft":
          return "bg-warning-light text-warning";
        case "Visibility":
          return "bg-info-light text-info";
        case "Published":
          return "bg-success-light text-success";
        default:
          return "bg-secondary-light text-secondary";
      }
    };

    const swalConfirm = (id) => {
      Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        customClass: {
          confirmButton: "btn btn-danger m-1",
          cancelButton: "btn btn-secondary m-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Deleted!", `Blog with ID: ${id} has been deleted.`, "success");
          // Add deletion logic here
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "The blog remains safe.", "info");
        }
      });
    };

    const viewBlog = (id) => {
      router.push({ name: "AdminBlogView", params: { id } });
    };

    const editBlog = (id) => {
      router.push({ name: "AdminBlogEdit", params: { id } });
    };

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };

    const onSearch = () => {
      currentPage.value = 1;
    };

    const onFilter = () => {
      currentPage.value = 1;
    };

    return {
      users,
      categories,
      searchTerm,
      selectedCategory,
      selectedStatus,
      filteredUsers,
      paginatedUsers,
      totalPages,
      getStatusClass,
      swalConfirm,
      viewBlog,
      editBlog,
      onSearch,
      onFilter,
      changePage,
      currentPage,
    };
  },
};
</script>

<style lang="css" scoped>
@import "sweetalert2/dist/sweetalert2.min.css";

.table-bordered {
  /* Your table styles here */
}

.clickable-row {
  cursor: pointer;
}

.clickable-row:hover {
  background-color: #f8f9fa;
}

.btn-group .btn {
  margin-right: 5px;
}

.pagination .page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
}

.pagination .page-item .page-link {
  color: #007bff;
}

.pagination .page-item.disabled .page-link {
  color: #6c757d;
}

.bg-success-light {
  background-color: #d4edda !important;
  color: #155724 !important;
}

.bg-warning-light {
  background-color: #fff3cd !important;
  color: #856404 !important;
}

.bg-info-light {
  background-color: #d1ecf1 !important;
  color: #0c5460 !important;
}

.bg-secondary-light {
  background-color: #e2e3e5 !important;
  color: #383d41 !important;
}
</style>
