<template>
  <BasePageHeading title="Chỉnh Sửa Nhóm Phân Quyền">
    <template #extra>
      <button
        type="button"
        class="btn btn-primary me-1"
        @click="$router.back()"
      >
        <i class="fa fa-arrow-left opacity-50 me-1"></i> Quay lại
      </button>
      <button
        type="button"
        class="btn btn-success"
        @click="handleSave"
        :disabled="loading"
      >
        <i class="fa fa-check opacity-50 me-1"></i> Lưu thay đổi
      </button>
    </template>
  </BasePageHeading>

  <div class="content">
    <div class="block block-rounded">
      <div class="block-header block-header-default">
        <h3 class="block-title">Thông Tin Nhóm</h3>
      </div>
      <div class="block-content">
        <form @submit.prevent="handleSubmit" class="form-horizontal">
          <!-- Loading Overlay -->
          <div v-if="loading" class="block-overlay-loading">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <!-- Group Name -->
          <div class="mb-4 row">
            <label class="col-sm-2 col-form-label" for="groupName">
              Tên Nhóm <span class="text-danger">*</span>
            </label>
            <div class="col-sm-10">
              <input
                type="text"
                class="form-control"
                id="groupName"
                v-model="groupInfo.groupName"
                :class="{ 'is-invalid': v$.groupInfo.groupName.$error }"
                placeholder="Nhập tên nhóm"
              />
              <div
                class="invalid-feedback"
                v-if="v$.groupInfo.groupName.$error"
              >
                Vui lòng nhập tên nhóm
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="mb-4 row">
            <label class="col-sm-2 col-form-label" for="description">
              Mô Tả <span class="text-danger">*</span>
            </label>
            <div class="col-sm-10">
              <textarea
                class="form-control"
                id="description"
                v-model="groupInfo.description"
                rows="3"
                placeholder="Nhập mô tả nhóm"
              ></textarea>
            </div>
          </div>

          <!-- Permissions -->
          <div class="mb-4 row">
            <label class="col-sm-2 col-form-label">Phân Quyền</label>
            <div class="col-sm-10">
              <!-- Search box -->
              <div class="mb-4">
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fa fa-search"></i>
                  </span>
                  <input
                    type="text"
                    class="form-control"
                    v-model="searchText"
                    placeholder="Tìm kiếm quyền..."
                  />
                </div>
              </div>

              <!-- Permission groups -->
              <div v-if="loadingPermissions" class="text-center py-3">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading permissions...</span>
                </div>
              </div>
              <div v-else>
                <div
                  v-for="group in filteredPermissionGroups"
                  :key="group.groupKey"
                  class="mb-4"
                >
                  <div class="permission-group">
                    <div
                      class="d-flex justify-content-between align-items-center mb-3"
                    >
                      <h5 class="mb-0">{{ group.groupName }}</h5>
                      <div class="form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          :id="'group-' + group.groupKey"
                          :checked="isGroupAllSelected(group)"
                          @change="toggleGroupPermissions(group)"
                        />
                        <label
                          class="form-check-label"
                          :for="'group-' + group.groupKey"
                        >
                          Chọn tất cả
                        </label>
                      </div>
                    </div>
                    <div class="row g-3">
                      <div
                        v-for="perm in group.permissions"
                        :key="perm.code"
                        class="col-md-6"
                      >
                        <div class="form-check permission-item">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            :id="perm.code"
                            v-model="perm.isSelected"
                            @change="handlePermissionChange(perm)"
                          />
                          <label class="form-check-label" :for="perm.code">
                            <div class="fw-semibold">{{ perm.name }}</div>
                            <small class="text-muted">{{
                              perm.description
                            }}</small>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-if="!filteredPermissionGroups.length"
                class="text-center text-muted py-3"
              >
                Không tìm thấy quyền nào phù hợp
              </div>
            </div>
          </div>

          <!-- Submit button -->
          <div class="row">
            <div class="col-sm-10 ms-auto">
              <!-- <button type="submit" class="btn btn-primary" :disabled="loading">
                <i class="fa fa-check me-1"></i> Lưu thay đổi
              </button> -->
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import accountGroupService from "@/views/one-ui/accountmanager/service/accountGroupService";
import BaseBlock from "@/components/BaseBlock.vue";
import BasePageHeading from "@/components/BasePageHeading.vue";
import Swal from "sweetalert2";

const route = useRoute();
const router = useRouter();
const groupId = route.params.id;

const loading = ref(false);
const groupInfo = ref({
  groupName: "",
  description: "",
  roleId: "",
});

const permissionGroups = ref([]);
const searchText = ref("");

// Validation rules
const rules = {
  groupInfo: {
    groupName: { required },
  },
};

const v$ = useVuelidate(rules, { groupInfo });

// Lọc và hiển thị nhóm quyền theo tìm kiếm
const filteredPermissionGroups = computed(() => {
  if (!searchText.value) return permissionGroups.value;

  const searchLower = searchText.value.toLowerCase();
  return permissionGroups.value
    .map((group) => ({
      ...group,
      permissions: group.permissions.filter(
        (perm) =>
          perm.name.toLowerCase().includes(searchLower) ||
          perm.description?.toLowerCase().includes(searchLower)
      ),
    }))
    .filter((group) => group.permissions.length > 0);
});

// Kiểm tra xem tất cả quyền trong nhóm có được chọn không
const isGroupAllSelected = (group) => {
  return group.permissions.every((perm) => perm.isSelected);
};

// Toggle tất cả quyền trong một nhóm
const toggleGroupPermissions = (group) => {
  const allSelected = isGroupAllSelected(group);
  group.permissions.forEach((perm) => {
    perm.isSelected = !allSelected;
  });
};

// Xử lý khi thay đổi một quyền
const handlePermissionChange = (permission) => {
  console.log("Permission changed:", permission.code, permission.isSelected);
};

// Khởi tạo dữ liệu
const initializeData = async () => {
  try {
    loading.value = true;

    // Gọi 2 API song song
    const [groupResponse, availablePerms] = await Promise.all([
      accountGroupService.getGroupPermissions(groupId),
      accountGroupService.getAvailablePermissions(),
    ]);

    console.log("Group Permissions:", groupResponse.data);
    console.log("Available Permissions:", availablePerms.data);

    // Xử lý thông tin nhóm và quyền hiện tại
    if (groupResponse.success && groupResponse.data) {
      const groupData = groupResponse.data.data; // Lấy data từ response
      console.log("Group Data:", groupData); // Debug log

      // Cập nhật thông tin nhóm
      groupInfo.value = {
        groupName: groupData.groupName || "",
        description: groupData.description || "",
        roleId: groupData.roleId || groupId,
      };

      // Lấy danh sách quyền hiện tại
      const currentUserPerms = groupData.userPermissions?.$values || [];
      const currentActionPerms = groupData.actionPermissions?.$values || [];

      console.log("RoleId:", groupData.roleId);
      console.log("Current User Permissions:", currentUserPerms);
      console.log("Current Action Permissions:", currentActionPerms);

      // Xử lý danh sách quyền có thể gán
      if (availablePerms.success && availablePerms.data) {
        const availableData = availablePerms.data.data;
        if (availableData && availableData.$values) {
          permissionGroups.value = availableData.$values
            .map((group) => {
              // Map các quyền trong nhóm
              const permissions = group.permissions.$values.map((perm) => ({
                code: perm.code,
                name: perm.name,
                description: perm.description,
                // Kiểm tra xem quyền có trong danh sách quyền hiện tại không
                isSelected:
                  currentUserPerms.includes(perm.code) ||
                  currentActionPerms.includes(perm.code),
              }));

              return {
                groupName: group.groupName,
                groupKey: group.groupKey,
                permissions: permissions.filter((p) => p.code), // Lọc bỏ các quyền không có code
              };
            })
            .filter((group) => group.permissions.length > 0); // Lọc bỏ các nhóm không có quyền
        }
      }
    }

    console.log("Processed Permission Groups:", permissionGroups.value);
  } catch (error) {
    console.error("Error initializing data:", error);
    Swal.fire({
      title: "Lỗi",
      text:
        error.response?.data?.message ||
        "Không thể tải dữ liệu. Vui lòng thử lại sau.",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Validate trước khi lưu
const validateBeforeSave = () => {
  const selectedPerms = permissionGroups.value.flatMap((group) =>
    group.permissions.filter((p) => p.isSelected).map((p) => p.code)
  );

  if (selectedPerms.length === 0) {
    Swal.fire({
      title: "Cảnh báo",
      text: "Vui lòng chọn ít nhất một quyền",
      icon: "warning",
    });
    return false;
  }

  return true;
};

// Xử lý lưu thay đổi
const handleSave = async () => {
  try {
    // Validate form
    const isFormValid = await v$.value.$validate();
    if (!isFormValid || !validateBeforeSave()) return;

    // Xác nhận trước khi lưu
    const result = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn lưu thay đổi?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Lưu thay đổi",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    loading.value = true;

    // Thu thập các quyền được chọn
    const selectedPerms = permissionGroups.value.flatMap((group) =>
      group.permissions.filter((p) => p.isSelected).map((p) => p.code)
    );

    // Phân loại quyền
    const userPerms = selectedPerms.filter((p) => p.startsWith("access_"));
    const actionPerms = selectedPerms.filter((p) => !p.startsWith("access_"));

    // Gọi API cập nhật với format mới
    const response = await accountGroupService.updateGroupPermissions(groupId, {
      groupName: groupInfo.value.groupName,
      description: groupInfo.value.description,
      userPermissions: userPerms,
      actionPermissions: actionPerms,
      roleId: groupInfo.value.roleId,
    });

    if (!response.success) {
      throw new Error(response.message || "Không thể cập nhật nhóm");
    }

    await Swal.fire({
      title: "Thành công",
      text: "Đã cập nhật nhóm thành công",
      icon: "success",
    });

    // Quay về trang danh sách
    router.push("/administrator/accountmanager");
  } catch (error) {
    console.error("Error saving group:", error);
    let errorMessage = "Có lỗi xảy ra, vui lòng thử lại sau";

    if (error.response?.status === 400) {
      errorMessage = error.response.data.message || "Dữ liệu không hợp lệ";
    }

    Swal.fire({
      title: "Lỗi",
      text: errorMessage,
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  initializeData();
});
</script>

<style scoped>
.content {
  position: relative;
  min-height: 200px;
}

.block-overlay-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.permission-group {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 1.5rem;
}

.permission-group-header {
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 1rem;
}

.permission-list {
  padding-top: 1rem;
}

.permission-name {
  font-weight: 500;
}

.form-check-label {
  cursor: pointer;
}
</style>
