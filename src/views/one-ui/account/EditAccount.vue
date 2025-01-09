<template>
  <BasePageHeading :title="isEditMode ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản'" subtitle="">
    <template #extra>
      <button type="button" class="btn btn-alt-primary" @click="$router.push('/administrator/account')">
        <i class="fa fa-arrow-left opacity-50 me-1"></i>
        Về danh sách
      </button>
    </template>
  </BasePageHeading>

  <BaseBlock :title="isEditMode ? 'Edit User' : 'Create New User'">
    <div class="col-lg-8 space-y-5">
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
        <div class="mb-4">
          <label class="form-label" for="roleName">Selected Role</label>
          <input type="text" class="form-control" id="roleName" v-model="formData.roleName" placeholder="Role Name" readonly />
        </div>

        <!-- Submit Button -->
        <button type="submit" class="btn btn-alt-primary bg-success">
          {{ isEditMode ? "Cập nhật" : "Tạo mới" }}
        </button>
      </form>
    </div>
  </BaseBlock>
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
        formData.value.name = account.FullName;
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

        const payload = {
          Id: formData.value.id || "00000000-0000-0000-0000-000000000000",
          Email: formData.value.email,
          FullName: formData.value.name,
          PhoneNumber: formData.value.phone,
          RoleId: formData.value.role,
          UserName: formData.value.email,
        };

        if (isEditMode.value) {
          await axios.put(`/api/UserManagement/users/${formData.value.id}`, payload, {
            headers: { Authorization: token },
          });
          alert("Cập nhật tài khoản thành công!");
        } else {
          await axios.post("/api/UserManagement/users", payload, {
            headers: { Authorization: token },
          });
          alert("Tạo tài khoản thành công!");
        }

        router.push("/administrator/account");
      } catch (error) {
        if (error.response?.data?.errors) {
          formData.value.errors = error.response.data.errors;
        } else {
          alert(`Đã xảy ra lỗi: ${error.response?.data?.message || error.message}`);
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