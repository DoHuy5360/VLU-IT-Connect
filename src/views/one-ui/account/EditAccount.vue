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
        <div class="mb-4">
          <label class="form-label" for="name">Họ và Tên*</label>
          <input type="text" class="form-control" id="name" v-model="formData.name" placeholder="Họ và Tên..." required />
        </div>
        <div class="mb-4">
          <label class="form-label" for="email">Email*</label>
          <input type="email" class="form-control" id="email" v-model="formData.email" placeholder="Email..." required />
        </div>
        <div class="mb-4">
          <label class="form-label" for="role">Role*</label>
          <select class="form-select" v-model="formData.role" @change="handleRoleChange" required>
            <option value="" disabled>Chọn Role</option>
            <option v-for="group in groups" :key="group.value" :value="group.value">
              {{ group.label }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label class="form-label" for="roleName">Selected Role</label>
          <input type="text" class="form-control" id="roleName" v-model="formData.roleName" placeholder="Role Name" readonly />
        </div>

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
      role: "",
      roleName: "",
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
  const id = route.params.id; // Ensure we have the ID to fetch details
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`/api/UserManagement/user-detail/${id}`, {
      headers: { Authorization: token },
    });
    const account = response.data.data;

    formData.value.id = account.Id;
    formData.value.name = account.UserName;
    formData.value.email = account.Email;
    formData.value.role = account.GroupName; // Đặt giá trị Role từ API
    formData.value.roleName = groups.value.find((group) => group.value === account.Role)?.label || ""; // Đặt RoleName tương ứng
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

        // Kiểm tra dữ liệu đầy đủ và thông báo lỗi chi tiết
        if (!formData.value.name) {
          alert("Thiếu thông tin: Họ và Tên");
          return;
        }
        if (!formData.value.email) {
          alert("Thiếu thông tin: Email");
          return;
        }
        if (!formData.value.role) {
          alert("Thiếu thông tin: Role");
          return;
        }

        if (isEditMode.value) {
          // Update account
          if (!formData.value.id) {
            alert("ID là bắt buộc khi cập nhật tài khoản!");
            return;
          }

          const payload = {
            Id: formData.value.id,
            Email: formData.value.email,
            FullName: formData.value.name,
            Role: formData.value.roleName,
          };

          console.log("Payload (PUT):", payload);

          await axios.put(`/api/UserManagement/users/${formData.value.id}`, payload, {
            headers: { Authorization: token },
          });
          alert("Cập nhật tài khoản thành công!");
        } else {
          // Create account
          const payload = {
            Id: formData.value.id || "00000000-0000-0000-0000-000000000000",
            Email: formData.value.email,
            FullName: formData.value.name,
            Role: formData.value.role,
          };

          console.log("Payload (POST):", payload);

          await axios.post("/api/UserManagement/users", payload, {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          });
          alert("Tạo tài khoản thành công!");
        }

        router.push("/administrator/account");
      } catch (error) {
        console.error("Error submitting form:", error);
        alert(`Đã xảy ra lỗi: ${error.response?.data?.message || error.message}`);
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
/* Add specific styles here if needed */
</style>
