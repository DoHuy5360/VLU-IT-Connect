<template>
  <BasePageHeading title="Quản lý tài khoản" subtitle="Hiển thị danh sách tài khoản chi tiết">
    <template #extra>
      <button type="button" class="btn btn-alt-success" v-click-ripple @click="$router.push('/administrator/account/create')">
        <i class="fa fa-plus opacity-50 me-1"></i>
        Thêm tài khoản
      </button>
    </template>
  </BasePageHeading>

  <div class="content">
    <!-- Filters and Search -->
    <div class="row mb-4">
      <div class="col-md-8">
        <input type="text" class="form-control" v-model="searchTerm" placeholder="Tìm kiếm (Tên, Email, Nhóm tài khoản)..." @input="onSearch" />
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
      <p class="fs-sm text-muted mb-4">Danh sách tài khoản hiển thị theo thứ tự thời gian, tài khoản mới nhất ở đầu danh sách.</p>
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
                <button class="btn btn-sm btn-alt-warning" @click="$router.push('/administrator/account/edit')">
                  <i class="fa fa-fw fa-pencil-alt"></i>
                </button>
                <button type="button" class="btn btn-sm btn-danger" title="Delete" @click="swalConfirm(user.id)">
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
            <li v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }" class="page-item">
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
import { ref, computed } from "vue";
import Swal from "sweetalert2";

// User data
const users = ref([
  { id: 1, name: "Nguyễn Văn A", email: "a@vlu.edu.vn", group: "Admin", status: "Active", createdAt: "2024-12-11" },
  { id: 2, name: "Trần Thị B", email: "b@vlu.edu.vn", group: "User", status: "Inactive", createdAt: "2024-12-10" },
  { id: 3, name: "Phạm Văn C", email: "c@vlu.edu.vn", group: "Editor", status: "Active", createdAt: "2024-12-09" },
  { id: 4, name: "Lê Văn D", email: "d@vlu.edu.vn", group: "Admin", status: "Active", createdAt: "2024-12-08" },
  { id: 5, name: "Hoàng Thị E", email: "e@vlu.edu.vn", group: "User", status: "Inactive", createdAt: "2024-12-07" },
  { id: 6, name: "Ngô Văn F", email: "f@vlu.edu.vn", group: "Editor", status: "Active", createdAt: "2024-12-06" },
  { id: 7, name: "Đỗ Thị G", email: "g@vlu.edu.vn", group: "Admin", status: "Inactive", createdAt: "2024-12-05" },
  { id: 8, name: "Phan Văn H", email: "h@vlu.edu.vn", group: "User", status: "Active", createdAt: "2024-12-04" },
  { id: 9, name: "Vũ Thị I", email: "i@vlu.edu.vn", group: "Editor", status: "Inactive", createdAt: "2024-12-03" },
  { id: 10, name: "Bùi Văn J", email: "j@vlu.edu.vn", group: "Admin", status: "Active", createdAt: "2024-12-02" },
  { id: 11, name: "Nguyễn Thị K", email: "k@vlu.edu.vn", group: "User", status: "Inactive", createdAt: "2024-12-01" },
  { id: 12, name: "Trần Văn L", email: "l@vlu.edu.vn", group: "Editor", status: "Active", createdAt: "2024-11-30" },
  { id: 13, name: "Phạm Thị M", email: "m@vlu.edu.vn", group: "Admin", status: "Inactive", createdAt: "2024-11-29" },
  { id: 14, name: "Lê Văn N", email: "n@vlu.edu.vn", group: "User", status: "Active", createdAt: "2024-11-28" },
  { id: 15, name: "Hoàng Thị O", email: "o@vlu.edu.vn", group: "Editor", status: "Inactive", createdAt: "2024-11-27" },
  { id: 16, name: "Ngô Văn P", email: "p@vlu.edu.vn", group: "Admin", status: "Active", createdAt: "2024-11-26" },
  { id: 17, name: "Đỗ Thị Q", email: "q@vlu.edu.vn", group: "User", status: "Inactive", createdAt: "2024-11-25" },
  { id: 18, name: "Phan Văn R", email: "r@vlu.edu.vn", group: "Editor", status: "Active", createdAt: "2024-11-24" },
  { id: 19, name: "Vũ Thị S", email: "s@vlu.edu.vn", group: "Admin", status: "Inactive", createdAt: "2024-11-23" },
  { id: 20, name: "Bùi Văn T", email: "t@vlu.edu.vn", group: "User", status: "Active", createdAt: "2024-11-22" },
  { id: 21, name: "Nguyễn Văn U", email: "u@vlu.edu.vn", group: "Admin", status: "Active", createdAt: "2024-11-21" },
  { id: 22, name: "Trần Thị V", email: "v@vlu.edu.vn", group: "User", status: "Inactive", createdAt: "2024-11-20" },
  { id: 23, name: "Phạm Văn W", email: "w@vlu.edu.vn", group: "Editor", status: "Active", createdAt: "2024-11-19" },
  { id: 24, name: "Lê Văn X", email: "x@vlu.edu.vn", group: "Admin", status: "Inactive", createdAt: "2024-12-18" },
  { id: 25, name: "Hoàng Thị Y", email: "y@vlu.edu.vn", group: "User", status: "Active", createdAt: "2024-11-17" },

  // Add more users here...
]);
// State
const searchTerm = ref("");
const selectedGroup = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(20);

// Groups for filtering
const groups = [
  { label: "Admin", value: "Admin" },
  { label: "User", value: "User" },
  { label: "Editor", value: "Editor" },
];

// Filtered and sorted users
const filteredUsers = computed(() => {
  let result = [...users.value];

  // Filter by group
  if (selectedGroup.value) {
    result = result.filter((user) => user.group === selectedGroup.value);
  }

  // Search functionality
  if (searchTerm.value) {
    const keyword = searchTerm.value.toLowerCase();
    result = result.filter((user) => user.name.toLowerCase().includes(keyword) || user.email.toLowerCase().includes(keyword) || user.group.toLowerCase().includes(keyword));
  }

  // Sort by newest first
  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return result;
});

// Pagination
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value));
const paginatedAccounts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredUsers.value.slice(start, start + itemsPerPage.value);
});
const currentPageIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);

// Methods
function changePage(page) {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

function onSearch() {
  currentPage.value = 1; // Reset to the first page
}

function onFilterGroup() {
  currentPage.value = 1; // Reset to the first page
}

function deleteUser(userId) {
  users.value = users.value.filter((user) => user.id !== userId);
  Swal.fire("Deleted!", "The user has been deleted.", "success");
}
function toggleSelectAll() {
  if (selectAll.value) {
    selectedUsers.value = paginatedAccounts.value.map((user) => user.id); // Select all visible users
  } else {
    selectedUsers.value = []; // Clear selection
  }
}

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
      deleteUser(id); // Call delete method
    } else {
      Swal.fire("Cancelled", "The user was not deleted.", "info");
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
