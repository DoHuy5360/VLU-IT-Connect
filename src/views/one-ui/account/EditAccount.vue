<template>
  <BasePageHeading :title="isEditMode ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản'" subtitle="">
    <template #extra>
      <button type="button" class="btn btn-alt-primary" @click="$router.push('/administrator/account')">
        <i class="fa fa-arrow-left opacity-50 me-1"></i>
        Quay lại
      </button>
    </template>
  </BasePageHeading>

  <div class="content">
      <BaseBlock>
        <div class="space-y-5 pb-4">
          <form @submit.prevent="handleSubmit">
            <!-- Full Name -->
            <div class="mb-4">
              <label class="form-label" for="name">Họ và Tên*</label>
              <input type="text" class="form-control" id="name" v-model="formData.name" placeholder="Họ và Tên..." required />
              <small v-if="formData.errors?.FullName" class="text-danger">{{ formData.errors.FullName[0] }}</small>
            </div>
    
            <!-- Email -->
            <div class="mb-4">
              <label class="form-label" for="email">Email*</label>
              <input type="email" class="form-control" id="email" v-model="formData.email" placeholder="Email..." required />
              <small v-if="formData.errors?.UserName" class="text-danger">{{ formData.errors.UserName[0] }}</small>
            </div>
    
            <!-- Phone -->
            <div class="mb-4">
              <label class="form-label" for="phone">Số điện thoại*</label>
              <input type="text" class="form-control" id="phone" v-model="formData.phone" placeholder="Số điện thoại..." required />
            </div>
    
            <!-- Role -->
            <div class="mb-4">
              <label class="form-label" for="role">Role*</label>
              <select class="form-select" v-model="formData.role" @change="handleRoleChange" required>
                <option value="" disabled>Chọn Role</option>
                <option v-for="group in groups" :key="group.value" :value="group.value">
                  {{ group.label }}
                </option>
              </select>
              <small v-if="formData.errors?.RoleId" class="text-danger">{{ formData.errors.RoleId[0] }}</small>
            </div>
    
            <!-- Role Name -->
            <!-- <div class="mb-4">
              <label class="form-label" for="roleName">Selected Role</label>
              <input type="text" class="form-control" id="roleName" v-model="formData.roleName" placeholder="Role Name" readonly />
            </div> -->
    
            <!-- Submit Button -->
            <button type="submit" class="btn btn-success">
              {{ isEditMode ? "Cập nhật" : "Tạo mới" }}
            </button>
          </form>
        </div>
      </BaseBlock>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();

    const isEditMode = computed(() => !!route.params.id);
    const formData = ref({
      id: "",
      name: "",
      email: "",
      phone: "",
      role: "",
      roleName: "",
      errors: {}, // API validation errors
    });
    const groups = ref([]);

    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("/api/AccountGroup/list", {
          headers: { Authorization: token },
        });
        groups.value = response.data.data.$values.map((group) => ({
          value: group.Id,
          label: group.GroupName,
        }));
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    const fetchAccountDetails = async () => {
      if (!isEditMode.value) return;
      const id = route.params.id;
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`/api/UserManagement/user-detail/${id}`, {
          headers: { Authorization: token },
        });
        const account = response.data.data;

        formData.value.id = account.Id;
        formData.value.name = account.UserName;
        formData.value.email = account.Email;
        formData.value.phone = account.PhoneNumber || "";
        formData.value.role = account.Groups?.$values[0]?.GroupId || "";
        formData.value.roleName = account.Groups?.$values[0]?.GroupName || "";
      } catch (error) {
        console.error("Error fetching account details:", error);
      }
    };

    const handleRoleChange = () => {
      const selectedRole = groups.value.find((group) => group.value === formData.value.role);
      formData.value.roleName = selectedRole ? selectedRole.label : formData.value.roleName;
    };

    const handleSubmit = async () => {
  try {
    const token = localStorage.getItem("authToken");

    // Prepare the payload
    const payload = {
      Id: formData.value.id || "00000000-0000-0000-0000-000000000000",
      UserName: formData.value.name,
      Email: formData.value.email,
      FullName: formData.value.name,
      PhoneNumber: formData.value.phone,
      RoleId: formData.value.role,
      EmailConfirmed: true, // Default values
      PhoneNumberConfirmed: true,
      TwoFactorEnabled: false,
      LockoutEnd: null,
      LockoutEnabled: false,
      AccessFailedCount: 0,
    };

    // Validate required fields
    if (!payload.UserName || !payload.Email || !payload.FullName || !payload.RoleId) {
      formData.value.errors = {
        FullName: !payload.FullName ? ["Full name is required."] : null,
        UserName: !payload.UserName ? ["User name is required."] : null,
        Email: !payload.Email ? ["Email is required."] : null,
        RoleId: !payload.RoleId ? ["Role is required."] : null,
      };
      return;
    }

    // Determine the request type (create or update)
    const url = isEditMode.value
      ? `/api/UserManagement/update-user/${formData.value.id}`
      : "/api/UserManagement/create-user";
    const method = isEditMode.value ? "put" : "post";

    // Make API call
    await axios[method](url, payload, {
      headers: { Authorization: token },
    });

    // Redirect on success
    router.push("/administrator/account");
  } catch (error) {
    // Handle server validation errors
    if (error.response && error.response.data && error.response.data.errors) {
      formData.value.errors = error.response.data.errors;
    } else {
      console.error("Error submitting form:", error);
    }
  }
};

    onMounted(async () => {
      await fetchGroups();
      await fetchAccountDetails();
    });

    return {
      formData,
      groups,
      isEditMode,
      handleSubmit,
      handleRoleChange,
    };
  },
};
</script>
<style scoped>
/* Add specific styles if needed */
</style>