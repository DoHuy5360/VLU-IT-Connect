<template>
  <BasePageHeading title="Quản Lý Tài Khoản" subtitle="">
    <template #extra>
      <!-- Nút xóa nhiều tài khoản -->
      <button
        v-if="selectedUsers.length > 0"
        type="button"
        class="btn btn-danger me-2"
        @click="deleteMultiple"
      >
        <i class="fa fa-trash opacity-50 me-1"></i>
        Xóa đã chọn ({{ selectedUsers.length }})
      </button>

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
        <label hidden for="searchAccountInput">Tìm kiếm</label>
        <input
          id="searchAccountInput"
          type="text"
          class="form-control"
          v-model="searchTerm"
          placeholder="Tên, Email, Nhóm tài khoản..."
          @input="onSearch"
        />
      </div>
      <div class="col-md-4">
        <select
          class="form-select"
          v-model="selectedGroup"
          @change="onFilterGroup"
          title="Lọc tài khoản"
        >
          <option value="">Tất cả nhóm tài khoản</option>
          <option
            v-for="group in groups"
            :key="group.value"
            :value="group.label"
          >
            {{ group.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading" class="text-center">
      <p>Đang tải dữ liệu...</p>
    </div>

    <!-- User Table -->
    <div v-else>
      <BaseBlock title="Danh sách tài khoản" class="shadow-sm rounded">
        <div v-if="paginatedAccounts.length">
          <table
            class="table table-bordered table-striped table-vcenter align-middle"
          >
            <thead class="bg-primary-light">
              <tr>
                <th class="text-center" style="width: 50px">
                  <label hidden for="checkAllAccount">Chọn tất cả</label>
                  <input
                    id="checkAllAccount"
                    type="checkbox"
                    :checked="isAllSelected"
                    @click="selectAll($event)"
                  />
                </th>
                <th class="text-center">#</th>
                <th>Tình trạng</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Nhóm tài khoản</th>
                <th class="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in paginatedAccounts" :key="user.id">
                <td class="text-center">
                  <label hidden :for="`accountCheckbox-${index}`">{{
                    index
                  }}</label>
                  <input
                    :id="`accountCheckbox-${index}`"
                    type="checkbox"
                    :value="user.id"
                    v-model="selectedUsers"
                    @click.stop
                  />
                </td>
                <td class="text-center">{{ currentPageIndex + index + 1 }}</td>
                <td>
                  <span
                    :class="`badge bg-${
                      user.status === 'Active' ? 'success' : 'danger'
                    }`"
                  >
                    {{ user.status }}
                  </span>
                </td>
                <td>{{ user.FullName }}</td>
                <td>{{ user.Email }}</td>
                <td>{{ user.Role }}</td>
                <td class="text-center">
                  <div class="d-flex gap-2 justify-content-center">
                    <button
                      class="btn btn-sm btn-alt-warning"
                      @click.stop="editAccount(user.id)"
                    >
                      <i class="fa fa-fw fa-pencil-alt"></i>
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm btn-danger"
                      title="Xóa tài khoản"
                      @click="deleteUser(user.id)"
                    >
                      <i class="fa fa-fw fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- Pagination -->
          <nav>
            <ul class="pagination justify-content-center mt-4">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="changePage(currentPage - 1)">
                  Trước
                </button>
              </li>
              <li
                v-for="page in totalPages"
                :key="page"
                :class="{ active: currentPage === page }"
                class="page-item"
              >
                <button class="page-link" @click="changePage(page)">
                  {{ page }}
                </button>
              </li>
              <li
                class="page-item"
                :class="{ disabled: currentPage === totalPages }"
              >
                <button class="page-link" @click="changePage(currentPage + 1)">
                  Tiếp
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div v-else class="text-center">
          <p class="text-muted">Không có dữ liệu</p>
        </div>
      </BaseBlock>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { authRequest } from "../accountmanager/service/axiosConfig";

const router = useRouter();

const users = ref([]);
const searchTerm = ref("");
const selectedGroup = ref("");
const currentPage = ref(1);
const itemsPerPage = 20;
const groups = ref([]);
const loading = ref(true);
const selectedUsers = ref([]);

// Fetch Groups
const fetchGroups = async () => {
  try {
    const response = await authRequest.get("/AccountGroup/list");
    groups.value = response.data.data.$values.map((group) => ({
      value: group.Id,
      label: group.GroupName,
    }));
  } catch (error) {
    console.error("Error fetching groups:", error);
  }
};

// Fetch Users
const fetchUsers = async () => {
  try {
    const response = await authRequest.get("/UserManagement/users");
    users.value = response.data.data.$values.map((user) => ({
      id: user.Id,
      FullName: user.FullName,
      Email: user.Email,
      Role: user.Role.toString(),
      status: user.state ? "Active" : "Inactive",
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    loading.value = false;
  }
};

// Lifecycle Hooks
onMounted(() => {
  fetchGroups();
  fetchUsers();
});

// Computed Properties
const filteredUsers = computed(() => {
  return users.value.filter(
    (user) => !selectedGroup.value || user.Role === selectedGroup.value
  );
});

const totalPages = computed(() =>
  Math.ceil(filteredUsers.value.length / itemsPerPage)
);
const paginatedAccounts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredUsers.value.slice(start, start + itemsPerPage);
});
const currentPageIndex = computed(() => (currentPage.value - 1) * itemsPerPage);

// Methods
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
};

const onSearch = () => (currentPage.value = 1);
const onFilterGroup = () => {
  currentPage.value = 1;
};

const deleteUser = async (id) => {
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
        await authRequest.delete(`/UserManagement/users/${id}`);
        users.value = users.value.filter((user) => user.id !== id);
        Swal.fire("Deleted!", "Tài khoản đã được xóa.", "success");
      } catch (error) {
        Swal.fire("Error", "Không thể xóa tài khoản.", "error");
        console.error("Error deleting user:", error);
      }
    }
  });
};

const deleteMultiple = async () => {
  if (selectedUsers.value.length === 0) return;

  Swal.fire({
    title: `Xóa ${selectedUsers.value.length} tài khoản?`,
    text: "Hành động này không thể hoàn tác!",
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
        // Sử dụng DELETE method và truyền trực tiếp mảng ID
        const response = await authRequest.delete(
          "/UserManagement/users/delete-multiple",
          {
            headers: {
              "Content-Type": "application/json",
            },
            data: selectedUsers.value, // Truyền trực tiếp mảng ID
          }
        );

        if (response.data.success) {
          Swal.fire({
            title: "Đã xóa!",
            text: `Đã xóa ${selectedUsers.value.length} tài khoản.`,
            icon: "success",
          });

          // Refresh user list and clear selection
          await fetchUsers();
          selectedUsers.value = [];
        }
      } catch (error) {
        console.error("Error response:", error.response?.data);
        Swal.fire({
          title: "Lỗi!",
          text:
            error.response?.data?.message ||
            "Không thể xóa tài khoản. Vui lòng thử lại.",
          icon: "error",
        });
      }
    }
  });
};

const editAccount = (id) => {
  router.push({ name: "AdminAccountEdit", params: { id } });
};

const selectAll = (event) => {
  if (event.target.checked) {
    selectedUsers.value = paginatedAccounts.value.map((user) => user.id);
  } else {
    selectedUsers.value = [];
  }
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
