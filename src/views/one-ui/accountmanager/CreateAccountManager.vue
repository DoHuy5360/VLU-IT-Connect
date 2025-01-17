<template>
  <BasePageHeading title="Tạo Nhóm Phân Quyền Mới">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <router-link to="/administrator/accountmanager">
              <i class="fa fa-arrow-left me-1"></i> Quay lại
            </router-link>
          </li>
        </ol>
      </nav>
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
            <label class="col-sm-3 col-form-label" for="groupName">
              Tên Nhóm <span class="text-danger">*</span>
            </label>
            <div class="col-sm-9">
              <input
                type="text"
                class="form-control"
                id="groupName"
                v-model="formData.groupName"
                :class="{ 'is-invalid': v$.groupName.$error }"
                placeholder="Nhập tên nhóm"
              />
              <div class="invalid-feedback" v-if="v$.groupName.$error">
                {{ v$.groupName.$errors[0].$message }}
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="mb-4 row">
            <label class="col-sm-3 col-form-label" for="description">
              Mô Tả <span class="text-danger">*</span>
            </label>
            <div class="col-sm-9">
              <textarea
                class="form-control"
                id="description"
                v-model="formData.description"
                :class="{ 'is-invalid': v$.description.$error }"
                rows="3"
                placeholder="Nhập mô tả nhóm"
              ></textarea>
              <div class="invalid-feedback" v-if="v$.description.$error">
                {{ v$.description.$errors[0].$message }}
              </div>
            </div>
          </div>

          <!-- Permissions -->
          <div class="mb-4 row">
            <label class="col-sm-3 col-form-label"> Phân Quyền </label>
            <div class="col-sm-9">
              <div v-if="loadingPermissions" class="text-center py-3">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading permissions...</span>
                </div>
              </div>
              <div v-else>
                <div
                  v-for="group in permissionGroups"
                  :key="group.groupKey"
                  class="mb-4"
                >
                  <div class="permission-group">
                    <h5 class="mb-3">{{ group.groupName }}</h5>
                    <div class="row g-3">
                      <div
                        v-for="permission in group.permissions.$values"
                        :key="permission.code"
                        class="col-md-6"
                      >
                        <div class="form-check permission-item">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="permission.code"
                            :checked="isPermissionSelected(permission.code)"
                            @change="
                              updatePermissionSelection(
                                $event,
                                permission,
                                group.groupKey
                              )
                            "
                          />
                          <label
                            class="form-check-label"
                            :for="permission.code"
                          >
                            <div class="permission-name">
                              {{ permission.name }}
                            </div>
                            <small class="text-muted d-block">{{
                              permission.description
                            }}</small>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="row mb-4">
            <div
              class="col-sm-9 offset-sm-3"
              style="display: flex; justify-content: end"
            >
              <button
                type="submit"
                class="btn btn-primary me-2"
                :disabled="loading"
              >
                {{ loading ? "Đang xử lý..." : "Tạo Nhóm" }}
              </button>
              <router-link
                to="/administrator/accountmanager"
                class="btn btn-secondary"
              >
                Hủy
              </router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import accountGroupService from "@/views/one-ui/accountmanager/service/accountGroupService";
import Swal from "sweetalert2";
import BasePageHeading from "@/components/BasePageHeading.vue";

const router = useRouter();
const loading = ref(false);
const loadingPermissions = ref(false);
const permissionGroups = ref([]);

const formData = reactive({
  groupName: "",
  description: "",
  userPermissions: [],
  actionPermissions: [],
});

// Validation rules
const rules = {
  groupName: { required, minLength: minLength(3) },
  description: { required },
};

const v$ = useVuelidate(rules, formData);

// Helper function to check if a permission is selected
const isPermissionSelected = (code) => {
  return (
    formData.userPermissions.includes(code) ||
    formData.actionPermissions.includes(code)
  );
};

// Update permission selection
const updatePermissionSelection = (event, permission, groupKey) => {
  const isChecked = event.target.checked;
  const isUserPermission = [
    "user_management",
    "role_management",
    "group_management",
  ].includes(groupKey);
  const permissionArray = isUserPermission
    ? formData.userPermissions
    : formData.actionPermissions;

  if (isChecked) {
    if (!permissionArray.includes(permission.code)) {
      if (isUserPermission) {
        formData.userPermissions.push(permission.code);
      } else {
        formData.actionPermissions.push(permission.code);
      }
    }
  } else {
    if (isUserPermission) {
      formData.userPermissions = formData.userPermissions.filter(
        (p) => p !== permission.code
      );
    } else {
      formData.actionPermissions = formData.actionPermissions.filter(
        (p) => p !== permission.code
      );
    }
  }
};

// Load available permissions
const loadPermissions = async () => {
  loadingPermissions.value = true;
  try {
    const response = await accountGroupService.getAvailablePermissions();
    if (response.success && response.data) {
      permissionGroups.value = [
        {
          groupKey: "post_management",
          groupName: "Quản lý bài viết",
          permissions: {
            $values: [
              {
                code: "view_post",
                name: "Xem bài viết",
                description: "Xem danh sách và chi tiết bài viết",
              },
              {
                code: "create_post",
                name: "Tạo bài viết",
                description: "Tạo bài viết mới",
              },
              {
                code: "edit_post",
                name: "Sửa bài viết",
                description: "Chỉnh sửa nội dung bài viết",
              },
              {
                code: "delete_post",
                name: "Xóa bài viết",
                description: "Xóa một bài viết",
              },
              {
                code: "bulk_delete_post",
                name: "Xóa nhiều bài viết",
                description:
                  "Xóa nhiều bài viết cùng lúc (yêu cầu quyền quản trị)",
              },
              {
                code: "publish_post",
                name: "Xuất bản bài viết",
                description: "Xuất bản hoặc hủy xuất bản bài viết",
              },
            ],
          },
        },
        {
          groupKey: "user_management",
          groupName: "Quản lý người dùng",
          permissions: {
            $values: [
              {
                code: "manage_users",
                name: "Quản lý người dùng",
                description: "Quản lý tổng thể người dùng",
              },
              {
                code: "view_user",
                name: "Xem người dùng",
                description: "Xem danh sách và thông tin người dùng",
              },
              {
                code: "create_user",
                name: "Tạo người dùng",
                description: "Tạo tài khoản người dùng mới",
              },
              {
                code: "edit_user",
                name: "Sửa người dùng",
                description: "Chỉnh sửa thông tin người dùng",
              },
              {
                code: "delete_user",
                name: "Xóa người dùng",
                description: "Xóa tài khoản người dùng",
              },
              {
                code: "assign_roles",
                name: "Gán vai trò",
                description: "Gán vai trò cho người dùng",
              },
            ],
          },
        },
        {
          groupKey: "role_management",
          groupName: "Quản lý vai trò và phân quyền",
          permissions: {
            $values: [
              {
                code: "manage_roles",
                name: "Quản lý vai trò",
                description: "Tạo, sửa, xóa vai trò",
              },
              {
                code: "manage_permissions",
                name: "Quản lý phân quyền",
                description: "Gán, thu hồi quyền",
              },
            ],
          },
        },
        {
          groupKey: "report_management",
          groupName: "Báo cáo và thống kê",
          permissions: {
            $values: [
              {
                code: "view_reports",
                name: "Xem báo cáo",
                description: "Xem các báo cáo thống kê",
              },
            ],
          },
        },
        {
          groupKey: "system_management",
          groupName: "Cài đặt hệ thống",
          permissions: {
            $values: [
              {
                code: "edit_settings",
                name: "Cài đặt hệ thống",
                description: "Thay đổi cấu hình hệ thống",
              },
              {
                code: "access_dashboard",
                name: "Truy cập Dashboard",
                description: "Xem trang tổng quan hệ thống",
              },
            ],
          },
        },
        {
          groupKey: "group_management",
          groupName: "Quản lý nhóm",
          permissions: {
            $values: [
              {
                code: "view_group",
                name: "Xem nhóm",
                description: "Xem danh sách và thông tin nhóm",
              },
              {
                code: "create_group",
                name: "Tạo nhóm",
                description: "Tạo nhóm mới",
              },
              {
                code: "edit_group",
                name: "Sửa nhóm",
                description: "Chỉnh sửa thông tin nhóm",
              },
              {
                code: "delete_group",
                name: "Xóa nhóm",
                description: "Xóa nhóm",
              },
            ],
          },
        },
      ];
    }
  } catch (error) {
    console.error("Error loading permissions:", error);
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: "Không thể tải danh sách quyền. Vui lòng thử lại sau.",
    });
  } finally {
    loadingPermissions.value = false;
  }
};

// Handle form submission
const handleSubmit = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  loading.value = true;
  try {
    const response = await accountGroupService.createGroup({
      GroupName: formData.groupName,
      Description: formData.description,
      UserPermissions: formData.userPermissions,
      ActionPermissions: formData.actionPermissions,
    });

    if (response.status === 200) {
      await Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đã tạo nhóm phân quyền mới",
        showConfirmButton: false,
        timer: 1500,
      });
      router.push("/administrator/accountmanager");
    } else {
      throw new Error(response.data?.message || "Không thể tạo nhóm");
    }
  } catch (error) {
    console.error("Error creating group:", error);
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text:
        error.response?.data?.message ||
        "Không thể tạo nhóm. Vui lòng kiểm tra lại thông tin.",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadPermissions();
});
</script>

<style scoped>
.block-overlay-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.permission-group {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

.permission-group h5 {
  color: #2c3e50;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.permission-item {
  background: white;
  padding: 0.75rem;
  border-radius: 0.25rem;
  border: 1px solid #e9ecef;
}

.permission-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.form-check-label {
  cursor: pointer;
  display: block;
}

.invalid-feedback {
  display: block;
}
</style>
