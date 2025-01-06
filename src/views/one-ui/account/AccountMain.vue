<template>
  <BasePageHeading title="Quản lý tài khoản" subtitle="Hiển thị danh sách tài khoản chi tiết">
    <template #extra>
      <button
        type="button"
        class="btn btn-success"
        v-click-ripple
        @click="$router.push('/administrator/account/create')"
      >
        <i class="fa fa-plus opacity-50 me-1"></i>
        Thêm tài khoản
      </button>
    </template>
  </BasePageHeading>

  <div class="content">
    <!-- Filters and Search -->
    <div class="row mb-4">
      <div class="col-md-8">
        <input
          type="text"
          class="form-control"
          v-model="searchTerm"
          placeholder="Tìm kiếm (Tên, Email, Nhóm tài khoản)..."
          @input="onSearch"
        />
      </div>
      <div class="col-md-4">
        <select class="form-select" v-model="selectedGroup" @change="onFilterGroup">
          <option value="">Tất cả nhóm tài khoản</option>
          <option v-for="group in groups" :key="group.value" :value="group.value">
            {{ group.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <BaseBlock title="Danh sách tài khoản" class="shadow-sm rounded">
      <p class="fs-sm text-muted mb-4">
        Danh sách tài khoản hiển thị theo thứ tự thời gian, tài khoản mới nhất ở đầu danh sách.
      </p>
      <div v-if="paginatedAccounts.length">
        <table class="table table-bordered table-striped table-vcenter align-middle">
          <thead class="bg-primary-light">
            <tr>
              <th class="text-center">#</th>
              <th>Tình trạng</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Nhóm tài khoản</th>
              <th class="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in paginatedAccounts" :key="user.id">
              <td class="text-center">{{ currentPageIndex + index + 1 }}</td>
              <td>
                <span :class="`badge bg-${user.status === 'Active' ? 'success' : 'danger'}`">
                  {{ user.status }}
                </span>
              </td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.group }}</td>
              <td class="text-center">
                <button
                  class="btn btn-sm btn-alt-warning"
                  @click="$router.push(`/administrator/account/edit/${user.id}`)"
                >
                  <i class="fa fa-fw fa-pencil-alt"></i>
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-danger"
                  title="Xóa tài khoản"
                  @click="swalConfirm(user.id)"
                >
                  <i class="fa fa-fw fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <nav>
          <ul class="pagination justify-content-center mt-4">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="changePage(currentPage - 1)">Trước</button>
            </li>
            <li
              v-for="page in totalPages"
              :key="page"
              :class="{ active: currentPage === page }"
              class="page-item"
            >
              <button class="page-link" @click="changePage(page)">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="changePage(currentPage + 1)">Tiếp</button>
            </li>
          </ul>
        </nav>
      </div>
      <div v-else class="text-center">
        <p class="text-muted">Không tìm thấy kết quả phù hợp</p>
      </div>
    </BaseBlock>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import axios from "axios";

const users = ref([]);
const searchTerm = ref("");
const selectedGroup = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(20);
const loading = ref(true);

// Groups for filtering
const groups = [
  { label: "Admin", value: "Admin" },
  { label: "Admin 2", value: "Admin 2" },
  { label: "Editor", value: "Editor" },
];

// Fetch users on mount
onMounted(async () => {
  try {
    const token = localStorage.getItem("authToken");
    console.log(token)

    const response = await axios.get("/api/UserManagement/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    users.value = response.data.data.$values.map((user) => ({
      id: user.id,
      name: user.fullName,
      email: user.email,
      group: user.role,
      status: user.state ? "Active" : "Inactive",
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    loading.value = false;
  }
});

// Computed Properties
const filteredUsers = computed(() => {
  let result = [...users.value];

  // Filter by group
  if (selectedGroup.value) {
    result = result.filter((user) => user.group === selectedGroup.value);
  }

  // Search functionality
  if (searchTerm.value) {
    const keyword = searchTerm.value.toLowerCase();
    result = result.filter(
      (user) =>
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.group.toLowerCase().includes(keyword)
    );
  }

  return result;
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value));
const paginatedAccounts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredUsers.value.slice(start, start + itemsPerPage.value);
});
const currentPageIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);

// Methods
const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const onSearch = () => (currentPage.value = 1);
const onFilterGroup = () => (currentPage.value = 1);

const deleteUser = (userId) => {
  users.value = users.value.filter((user) => user.id !== userId);
  Swal.fire("Deleted!", "The user has been deleted.", "success");
};

const swalConfirm = (id) => {
  Swal.fire({
    title: "Bạn có chắc chắn?",
    text: "Hành động này không thể hoàn tác.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
    customClass: {
      confirmButton: "btn btn-danger m-1",
      cancelButton: "btn btn-secondary m-1",
    },
    buttonsStyling: false,
  }).then((result) => {
    if (result.isConfirmed) {
      deleteUser(id);
    }
  });
};
</script>

<style scoped>
.table th {
  white-space: nowrap;
}

.pagination .page-link {
  cursor: pointer;
}
</style>
