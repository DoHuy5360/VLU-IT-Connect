<template>
  <BasePageHeading title="Quản lý nhóm phân quyền">
    <template #extra>
      <div class="d-flex gap-2 align-items-center">
        <!-- Thanh tìm kiếm -->
        <div class="">
          <input
            type="text"
            class="form-control"
            v-model="searchTerm"
            placeholder="Tìm kiếm nhóm..."
            @input="handleSearch"
          />
        </div>
        <!-- Nút thêm mới -->
        <button
          type="button"
          class="btn btn-success"
          @click="$router.push('/administrator/accountmanager/create')"
        >
          <i class="fa fa-plus opacity-50 me-1"></i>
          Thêm nhóm phân quyền
        </button>
        <button
          type="button"
          class="btn btn-alt-success"
          @click="$router.push('/administrator/accountmanager/addaccount')"
        >
          <i class="fa fa-plus opacity-50 me-1"></i>
          Thêm người dùng vào nhóm
        </button>
      </div>
    </template>
  </BasePageHeading>

  <div class="content">
      <BaseBlock title="Phân Quyền Nhóm" class="shadow-sm">
        <template #options>
          <div class="d-flex align-items-center">
            <button
              v-if="selectedGroups.length > 0"
              type="button"
              class="btn btn-danger me-2"
              @click="deleteSelected"
            >
              <i class="fa fa-trash opacity-50 me-1"></i>
              Xóa đã chọn ({{ selectedGroups.length }})
            </button>
          </div>
        </template>
    
        <div v-if="loading" class="text-center my-4">
          <i class="fa fa-spinner fa-spin"></i> Đang tải dữ liệu...
        </div>
    
        <div v-else-if="error" class="text-center my-4">
          {{ error }}
        </div>
    
        <div v-else>
          <table class="table table-bordered table-striped table-vcenter">
            <thead>
              <tr>
                <th class="text-center" style="width: 50px">
                  <div class="form-check">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      :checked="isAllSelected"
                      @change="toggleSelectAll"
                    />
                  </div>
                </th>
                <th>Tên Nhóm</th>
                <th class="d-none d-md-table-cell">Mô Tả</th>
                <th class="text-center">Quyền Hạn</th>
                <th class="text-center">Số Lượng</th>
                <th class="d-none d-md-table-cell">Ngày Tạo</th>
                <th class="text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="group in groups" :key="group.id">
                <td class="text-center">
                  <div class="form-check">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      :checked="selectedGroups.includes(group.id)"
                      @change="toggleGroupSelection(group.id)"
                    />
                  </div>
                </td>
                <td>{{ group.name }}</td>
                <td class="d-none d-md-table-cell">
                  {{ group.description || "-" }}
                </td>
                <td class="text-center">{{ group.permissionCount }}</td>
                <td class="text-center">{{ group.accountCount }}</td>
                <td class="d-none d-md-table-cell">
                  {{ formatDate(group.createdDate) }}
                </td>
                <td class="text-center">
                  <button
                    class="btn btn-sm btn-alt-danger me-2"
                    @click="
                      $router.push(`/administrator/accountmanager/edit/${group.id}`)
                    "
                  >
                    <i class="fa fa-pencil"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-danger"
                    @click="confirmDelete(group.id)"
                  >
                    <i class="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="groups.length === 0">
                <td colspan="7" class="text-center">Không có dữ liệu</td>
              </tr>
            </tbody>
          </table>
    
          <!-- Phân trang -->
          <div class="d-flex justify-content-between align-items-center">
            <div>Hiển thị {{ groups.length }} / {{ totalItems }} kết quả</div>
            <nav aria-label="Page navigation">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a class="page-link" @click="changePage(currentPage - 1)"
                    >Trước</a
                  >
                </li>
                <li
                  v-for="page in totalPages"
                  :key="page"
                  class="page-item"
                  :class="{ active: currentPage === page }"
                >
                  <a class="page-link" @click="changePage(page)">{{ page }}</a>
                </li>
                <li
                  class="page-item"
                  :class="{ disabled: currentPage === totalPages }"
                >
                  <a class="page-link" @click="changePage(currentPage + 1)">Sau</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </BaseBlock>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { debounce } from "lodash";
import accountGroupService from "@/views/one-ui/accountmanager/service/accountGroupService";
import Swal from "sweetalert2";
import BaseBlock from "@/components/BaseBlock.vue";
import BasePageHeading from "@/components/BasePageHeading.vue";

const groups = ref([]);
const selectedGroups = ref([]);
const loading = ref(false);
const error = ref(null);
const currentPage = ref(1);
const pageSize = ref(20);
const totalItems = ref(0);
const totalPages = ref(1);
const searchTerm = ref("");

// Tính toán trạng thái "chọn tất cả"
const isAllSelected = computed(() => {
  return (
    groups.value.length > 0 &&
    selectedGroups.value.length === groups.value.length
  );
});

// Xử lý chọn/bỏ chọn một nhóm
const toggleGroupSelection = (groupId) => {
  const index = selectedGroups.value.indexOf(groupId);
  if (index === -1) {
    selectedGroups.value.push(groupId);
  } else {
    selectedGroups.value.splice(index, 1);
  }
};

// Xử lý chọn/bỏ chọn tất cả
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedGroups.value = [];
  } else {
    selectedGroups.value = groups.value.map((group) => group.id);
  }
};

// Load groups
const loadGroups = async () => {
  loading.value = true;
  error.value = null;
  try {
    console.log("Loading groups...");
    const response = await accountGroupService.getList(
      currentPage.value,
      pageSize.value
    );

    console.log("API Response:", response);

    if (response.success) {
      groups.value = response.data.items || [];
      totalItems.value = response.data.totalItems || 0;
      totalPages.value = response.data.totalPages || 1;
    } else {
      throw new Error(response.message || "Failed to load groups");
    }
  } catch (err) {
    console.error("Error loading groups:", err);
    error.value = err.message || "Có lỗi xảy ra khi tải danh sách nhóm";
    groups.value = [];
    totalItems.value = 0;
    totalPages.value = 1;
  } finally {
    loading.value = false;
  }
};

// Search groups by name
const searchGroups = async (term) => {
  if (!term.trim()) {
    return loadGroups();
  }
  loading.value = true;
  error.value = null;
  try {
    const response = await accountGroupService.getList(
      currentPage.value,
      pageSize.value,
      term
    );
    if (response.success) {
      groups.value = response.data.items || [];
      totalItems.value = response.data.totalItems || 0;
      totalPages.value = response.data.totalPages || 1;
    } else {
      error.value = "Không tìm thấy kết quả";
      groups.value = [];
      totalItems.value = 0;
      totalPages.value = 1;
    }
  } catch (err) {
    console.error("Search error:", err);
    error.value = err.response?.data?.message || "Lỗi khi tìm kiếm nhóm";
    groups.value = [];
    totalItems.value = 0;
    totalPages.value = 1;
  } finally {
    loading.value = false;
  }
};

// Handle search input with debounce
const handleSearch = debounce(() => {
  if (searchTerm.value) {
    searchGroups(searchTerm.value);
  } else {
    loadGroups();
  }
}, 300);

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    loadGroups();
  }
};

const confirmDelete = async (id) => {
  if (!id) {
    Swal.fire({
      title: "Lỗi",
      text: "Không tìm thấy ID nhóm",
      icon: "error",
    });
    return;
  }

  try {
    const result = await Swal.fire({
      title: "Xác nhận xóa",
      text: "Bạn có chắc muốn xóa nhóm này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      console.log("Deleting group with ID:", id); // Debug log
      const response = await accountGroupService.deleteGroup(id);

      if (response.success) {
        Swal.fire({
          title: "Thành công",
          text: "Xóa nhóm thành công",
          icon: "success",
        });
        loadGroups(); // Refresh the list
      } else {
        throw new Error("Delete failed");
      }
    }
  } catch (error) {
    console.error("Delete error:", error); // Debug log
    let errorMessage = "Đã có lỗi xảy ra khi xóa nhóm";

    if (error.response?.status === 403) {
      errorMessage = "Bạn không có quyền xóa nhóm";
    } else if (error.response?.status === 404) {
      errorMessage = "Không tìm thấy nhóm để xóa";
    }

    Swal.fire({
      title: "Lỗi",
      text: errorMessage,
      icon: "error",
    });
  }
};

const deleteSelected = async () => {
  if (selectedGroups.value.length === 0) {
    Swal.fire({
      title: "Thông báo",
      text: "Vui lòng chọn ít nhất một nhóm để xóa",
      icon: "warning",
    });
    return;
  }

  try {
    const result = await Swal.fire({
      title: "Xác nhận xóa",
      text: `Bạn có chắc muốn xóa ${selectedGroups.value.length} nhóm đã chọn?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      console.log("Deleting groups with IDs:", selectedGroups.value);
      const response = await accountGroupService.deleteMultipleGroups(
        selectedGroups.value
      );

      if (response.success) {
        Swal.fire({
          title: "Thành công",
          text: `Đã xóa ${selectedGroups.value.length} nhóm thành công`,
          icon: "success",
        });
        selectedGroups.value = [];
        loadGroups();
      } else {
        throw new Error(response.message || "Delete failed");
      }
    }
  } catch (error) {
    console.error("Delete multiple error:", error);
    let errorMessage = "Đã có lỗi xảy ra khi xóa các nhóm";

    if (error.response?.status === 403) {
      errorMessage = "Bạn không có quyền xóa nhóm";
    } else if (error.response?.status === 404) {
      errorMessage = "Không tìm thấy một số nhóm để xóa";
    }

    Swal.fire({
      title: "Lỗi",
      text: errorMessage,
      icon: "error",
    });
  }
};

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("vi-VN", options);
};

onMounted(() => {
  loadGroups();
});
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header button {
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
}

.modal-body {
  max-height: 400px;
  overflow-y: auto;
}

.badge {
  margin: 4px;
  padding: 8px;
}

.pagination .page-link {
  cursor: pointer;
}

.table th {
  white-space: nowrap;
}

.shadow-sm {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}
</style>
