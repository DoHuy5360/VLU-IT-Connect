<template>
  <BasePageHeading
    title="Quản Lý Thông Báo"
    subtitle="Quản lý danh sách các tài khoản đăng ký nhận thông báo bài viết mới nhất"
  >
    <template #extra>
      <div class="d-flex gap-2 align-items-center">
        <!-- Thanh tìm kiếm -->
        <div class="">
          <label hidden for="searchSubscriptionInput">Tìm kiếm</label>
          <input
            id="searchSubscriptionInput"
            type="text"
            class="form-control"
            v-model="searchTerm"
            placeholder="Tìm kiếm email..."
            @input="handleSearch"
          />
        </div>

        <!-- Nút xóa đã chọn - Chỉ hiện khi có đăng ký được chọn -->
        <button
          v-if="selectedSubscriptions.length > 0"
          type="button"
          class="btn btn-danger"
          @click="deleteSelected"
        >
          <i class="fa fa-trash opacity-50 me-1"></i>
          Xóa đã chọn ({{ selectedSubscriptions.length }})
        </button>
      </div>
    </template>
  </BasePageHeading>

  <div class="content">
    <BaseBlock title="Danh sách đăng ký nhận thông báo" class="shadow-sm">
      <!-- Thêm thông tin về số lượng đã chọn -->
      <div
        v-if="selectedSubscriptions.length > 0"
        class="alert alert-info mb-3"
      >
        Đã chọn {{ selectedSubscriptions.length }} đăng ký
      </div>

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
                  <label hidden for="selectAllSubscriptions">Chọn tất cả</label>
                  <input
                    id="selectAllSubscriptions"
                    type="checkbox"
                    class="form-check-input"
                    :checked="isAllSelected"
                    @change="toggleSelectAll"
                  />
                </div>
              </th>
              <th>Email</th>
              <th class="text-center">Danh Mục</th>
              <th class="d-none d-md-table-cell">Ghi Chú</th>
              <th class="d-none d-md-table-cell">Ngày Đăng Ký</th>
              <th class="text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(subscription, index) in subscriptions"
              :key="subscription.Id"
            >
              <td class="text-center">
                <div class="form-check">
                  <label hidden :for="`selectSubscription-${index}`">{{
                    index
                  }}</label>
                  <input
                    :id="`selectSubscription-${index}`"
                    type="checkbox"
                    class="form-check-input"
                    :checked="selectedSubscriptions.includes(subscription.Id)"
                    @change="toggleSubscriptionSelection(subscription.Id)"
                  />
                </div>
              </td>
              <td>{{ subscription.Email }}</td>
              <td class="text-center">{{ subscription.CategoryName }}</td>
              <td class="d-none d-md-table-cell">
                {{ subscription.Notes || "-" }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ formatDate(subscription.CreatedAt) }}
              </td>
              <td class="text-center">
                <button
                  class="btn btn-sm btn-danger"
                  @click="confirmDelete(subscription.Id)"
                >
                  <i class="fa fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="subscriptions.length === 0">
              <td colspan="6" class="text-center">Không có dữ liệu</td>
            </tr>
          </tbody>
        </table>

        <!-- Phân trang -->
        <div class="d-flex justify-content-between align-items-center">
          <div>
            Hiển thị {{ subscriptions.length }} / {{ totalItems }} kết quả
          </div>
          <nav aria-label="Page navigation">
            <ul class="pagination">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a
                  class="page-link"
                  href="#"
                  @click.prevent="changePage(currentPage - 1)"
                  >Trước</a
                >
              </li>
              <li
                v-for="page in displayedPages"
                :key="page"
                class="page-item"
                :class="{ active: currentPage === page }"
              >
                <a
                  class="page-link"
                  href="#"
                  @click.prevent="changePage(page)"
                  >{{ page }}</a
                >
              </li>
              <li
                class="page-item"
                :class="{ disabled: currentPage === totalPages }"
              >
                <a
                  class="page-link"
                  href="#"
                  @click.prevent="changePage(currentPage + 1)"
                  >Sau</a
                >
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </BaseBlock>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { debounce } from "lodash";
import {
  getAllSubscriptions,
  deleteSubscription,
  deleteMultipleSubscriptions,
  getNotificationCategories,
} from "@/service/one-ui/notification/NotificationService";
import Swal from "sweetalert2";
import BaseBlock from "@/components/BaseBlock.vue";
import BasePageHeading from "@/components/BasePageHeading.vue";

// State
const subscriptions = ref([]);
const categories = ref([]);
const selectedSubscriptions = ref([]);
const loading = ref(false);
const error = ref(null);
const currentPage = ref(1);
const pageSize = ref(20);
const totalItems = ref(0);
const totalPages = ref(1);
const searchTerm = ref("");

// Computed properties
const isAllSelected = computed(() => {
  return (
    subscriptions.value.length > 0 &&
    selectedSubscriptions.value.length === subscriptions.value.length
  );
});

// Tính toán các trang hiển thị trong phân trang
const displayedPages = computed(() => {
  if (totalPages.value <= 7) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1);
  }

  let pages = [];
  const current = currentPage.value;

  if (current <= 3) {
    // Gần trang đầu
    pages = [1, 2, 3, 4, 5, "...", totalPages.value];
  } else if (current >= totalPages.value - 2) {
    // Gần trang cuối
    pages = [
      1,
      "...",
      totalPages.value - 4,
      totalPages.value - 3,
      totalPages.value - 2,
      totalPages.value - 1,
      totalPages.value,
    ];
  } else {
    // Ở giữa
    pages = [
      1,
      "...",
      current - 1,
      current,
      current + 1,
      "...",
      totalPages.value,
    ];
  }

  return pages;
});

// Xử lý chọn/bỏ chọn một đăng ký
const toggleSubscriptionSelection = (id) => {
  const updatedSelected = [...selectedSubscriptions.value];
  const index = updatedSelected.indexOf(id);

  if (index === -1) {
    updatedSelected.push(id);
  } else {
    updatedSelected.splice(index, 1);
  }

  nextTick(() => {
    selectedSubscriptions.value = updatedSelected;
  });
};

// Xử lý chọn/bỏ chọn tất cả
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedSubscriptions.value = [];
  } else {
    selectedSubscriptions.value = subscriptions.value.map(
      (subscription) => subscription.Id
    );
  }
};

// Load danh sách đăng ký
const loadSubscriptions = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await getAllSubscriptions(
      currentPage.value,
      pageSize.value
    );

    if (response.success) {
      subscriptions.value = response.data.items || [];
      totalItems.value = response.data.totalItems || 0;
      totalPages.value = response.data.totalPages || 1;
    } else {
      error.value = response.message || "Không thể tải danh sách đăng ký";
    }
  } catch (err) {
    console.error("Lỗi khi tải danh sách đăng ký:", err);
    error.value = "Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.";
  } finally {
    loading.value = false;
  }
};

// Load danh mục
const loadCategories = async () => {
  try {
    categories.value = await getNotificationCategories();
  } catch (err) {
    console.error("Lỗi khi tải danh mục:", err);
  }
};

// Tìm kiếm đăng ký
const searchSubscriptions = async (term) => {
  loading.value = true;
  error.value = null;
  currentPage.value = 1; // Reset về trang 1 khi tìm kiếm

  try {
    const response = await getAllSubscriptions(1, pageSize.value, term);

    if (response.success) {
      subscriptions.value = response.data.items || [];
      totalItems.value = response.data.totalItems || 0;
      totalPages.value = response.data.totalPages || 1;
    } else {
      error.value = response.message || "Không thể tìm kiếm danh sách đăng ký";
    }
  } catch (err) {
    console.error("Lỗi khi tìm kiếm đăng ký:", err);
    error.value = "Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại sau.";
  } finally {
    loading.value = false;
  }
};

// Handle search input with debounce
const handleSearch = debounce(() => {
  if (searchTerm.value) {
    searchSubscriptions(searchTerm.value);
  } else {
    loadSubscriptions(); // Khi xóa hết từ khóa tìm kiếm, load lại tất cả
  }
}, 500);

// Thay đổi trang
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  loadSubscriptions();
};

// Xác nhận xóa một đăng ký
const confirmDelete = (id) => {
  Swal.fire({
    title: "Xác nhận xóa",
    text: "Bạn có chắc chắn muốn xóa đăng ký này không?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await deleteSubscription(id);

        if (response.success) {
          Swal.fire({
            title: "Thành công!",
            text: response.message || "Đã xóa đăng ký thành công",
            icon: "success",
          });

          // Tải lại danh sách
          loadSubscriptions();
        } else {
          Swal.fire({
            title: "Lỗi!",
            text: response.message || "Không thể xóa đăng ký",
            icon: "error",
          });
        }
      } catch (err) {
        console.error("Lỗi khi xóa đăng ký:", err);
        Swal.fire({
          title: "Lỗi!",
          text: "Đã xảy ra lỗi khi xóa đăng ký. Vui lòng thử lại sau.",
          icon: "error",
        });
      }
    }
  });
};

// Xác nhận xóa nhiều đăng ký đã chọn
const deleteSelected = () => {
  if (selectedSubscriptions.value.length === 0) return;

  Swal.fire({
    title: "Xác nhận xóa hàng loạt",
    text: `Bạn có chắc chắn muốn xóa ${selectedSubscriptions.value.length} đăng ký đã chọn không?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Xóa tất cả",
    cancelButtonText: "Hủy",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await deleteMultipleSubscriptions(
          selectedSubscriptions.value
        );

        if (response.success) {
          Swal.fire({
            title: "Thành công!",
            text: response.message || "Đã xóa đăng ký thành công",
            icon: "success",
          });

          // Xóa danh sách đã chọn
          selectedSubscriptions.value = [];

          // Tải lại danh sách
          loadSubscriptions();
        } else {
          Swal.fire({
            title: "Lỗi!",
            text: response.message || "Không thể xóa đăng ký",
            icon: "error",
          });
        }
      } catch (err) {
        console.error("Lỗi khi xóa nhiều đăng ký:", err);
        Swal.fire({
          title: "Lỗi!",
          text: "Đã xảy ra lỗi khi xóa đăng ký. Vui lòng thử lại sau.",
          icon: "error",
        });
      }
    }
  });
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("vi-VN");
};

// Watch for changes
watch(
  () => selectedSubscriptions.value,
  (newValue) => {
    console.log("Selected Subscriptions Changed:", newValue);
  }
);

// Load dữ liệu khi component được tạo
onMounted(async () => {
  await loadCategories();
  await loadSubscriptions();
});
</script>
