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
      <select v-model="selectedStatus" class="form-control w-25" @change="onFilter">
        <option value="">Tất cả trạng thái</option>
        <option value="1">Public</option>
        <option value="0">Unpublic</option>
      </select>
    </div>

    <div v-if="filteredUsers.length === 0 && !loading" class="text-center p-5">
      <p class="text-muted fs-lg">Không tìm thấy kết quả phù hợp.</p>
    </div>

    <div v-else class="table-responsive">
      <table class="table table-bordered table-hover">
        <thead class="bg-primary text-white">
          <tr>
            <th class="text-center" style="width: 80px">#</th>
            <th>Tác giả</th>
            <th>Tiêu đề</th>
            <th style="width: 15%">Trạng thái</th>
            <th class="text-center" style="width: 120px">Sửa/Xóa</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in paginatedUsers" :key="user.id" @click="viewBlog(user.id)" class="clickable-row">
            <td class="text-center fw-bold text-primary">
              {{ (currentPage - 1) * itemsPerPage + index + 1 }}
            </td>
            <td class="fw-semibold fs-sm">{{ user.author }}</td>
            <td class="fs-sm">{{ user.title }}</td>
            <td>
              <span :class="`fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill ${getStatusClass(user.state)}`">
                {{ user.state === 1 ? "Public" : "Unpublic" }}
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
            <button class="page-link" @click="changePage(page)">
              {{ page }}
            </button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages.value }">
            <button class="page-link" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages.value">Tiếp</button>
          </li>
        </ul>
      </nav>
    </div>
  </BaseBlock>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  name: "BlogAdmin",
  setup() {
    const router = useRouter();
    const users = ref([]);
    const searchTerm = ref("");
    const selectedStatus = ref("");
    const itemsPerPage = ref(10);
    const currentPage = ref(1);
    const loading = ref(true);

    onMounted(async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("/api/admin/posts", {
          headers: {
            Authorization: token,
          },
        });
        users.value = response.data.data.$values.map((post) => ({
          id: post.id,
          author: post.userName,
          title: post.title,
          state: post.published ? 1 : 0,
          publishDate: post.publishedAt,
        }));
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        loading.value = false;
      }
    });

    const filteredUsers = computed(() => {
      const search = searchTerm.value.toLowerCase();
      return users.value
        .filter((user) => user.title.toLowerCase().includes(search) && (selectedStatus.value === "" || user.state.toString() === selectedStatus.value))
        .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
    });

    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return filteredUsers.value.slice(start, start + itemsPerPage.value);
    });

    const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value));

    const getStatusClass = (state) => (state === 1 ? "bg-success-light text-success" : "bg-warning-light text-warning");
    
    const swalConfirm = async (id) => {
      Swal.fire({
        title: "Bạn có chắc chắn?",
        text: "Hành động này không thể hoàn tác.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đồng ý xóa!",
        cancelButtonText: "Hủy",
        customClass: {
          confirmButton: "btn btn-danger m-1",
          cancelButton: "btn btn-secondary m-1",
        },
        buttonsStyling: false,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            loading.value = true;
            await axios.delete(`https://localhost:7017/api/admin/posts/${id}`);
            users.value = users.value.filter((user) => user.id !== id);
            Swal.fire("Đã xóa!", `Bài viết với ID: ${id} đã được xóa.`, "success");
          } catch (error) {
            Swal.fire("Lỗi", "Xóa bài viết thất bại. Vui lòng thử lại.", "error");
            console.error("Error deleting post:", error);
          } finally {
            loading.value = false;
          }
        }
      });
    };

    const viewBlog = (id) => router.push({ name: "AdminBlogView", params: { id } });
    const editBlog = (id) => router.push({ name: "AdminBlogEdit", params: { id } });
    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };
    const onSearch = () => (currentPage.value = 1);
    const onFilter = () => (currentPage.value = 1);

    return {
      users,
      searchTerm,
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
      loading,
      itemsPerPage,
    };
  },
};
</script>

<style lang="css" scoped>
@import "sweetalert2/dist/sweetalert2.min.css";

.table-bordered {
  border: 1px solid #dee2e6;
}

.table-bordered th,
.table-bordered td {
  border: 1px solid #dee2e6;
}

.table-hover tbody tr:hover {
  background-color: #f1f1f1;
}

.table thead th {
  vertical-align: bottom;
  border-bottom: 2px solid #dee2e6;
}

.table th,
.table td {
  padding: 0.75rem;
  vertical-align: top;
}

.table-responsive {
  margin-top: 20px;
}

.table th {
  background-color: #007bff;
  color: white;
}

.table td {
  background-color: #f8f9fa;
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
