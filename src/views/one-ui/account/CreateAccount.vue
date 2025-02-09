<template>
  <BasePageHeading title="Tạo Tài Khoản" subtitle="">
    <template #extra>
      <button
        type="button"
        class="btn btn-alt-primary"
        @click="$router.push('/administrator/account')"
      >
        <i class="fa fa-arrow-left opacity-50 me-1"></i>
        Quay lại
      </button>
    </template>
  </BasePageHeading>

  <div class="content">
    <BaseBlock title="">
      <div class="space-y-5 pb-4">
        <form @submit.prevent="handleSubmit">
          <!-- Email -->
          <div class="mb-4">
            <label class="form-label" for="email">Email*</label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="formData.email"
              placeholder="Email..."
              required
            />
            <small v-if="errors.email" class="text-danger">{{
              errors.email
            }}</small>
          </div>

          <!-- Full Name -->
          <div class="mb-4">
            <label class="form-label" for="fullName">Họ và Tên*</label>
            <input
              type="text"
              class="form-control"
              id="fullName"
              v-model="formData.fullName"
              placeholder="Họ và Tên..."
              required
            />
            <small v-if="errors.fullName" class="text-danger">{{
              errors.fullName
            }}</small>
          </div>

          <!-- Username -->
          <div class="mb-4">
            <label class="form-label" for="userName">Tên đăng nhập*</label>
            <input
              type="text"
              class="form-control"
              id="userName"
              v-model="formData.userName"
              placeholder="Tên đăng nhập..."
              required
            />
            <small v-if="errors.userName" class="text-danger">{{
              errors.userName
            }}</small>
          </div>

          <!-- Role -->
          <div class="mb-4">
            <label class="form-label" for="roleId">Vai trò*</label>
            <select
              class="form-select"
              id="roleId"
              v-model="formData.roleId"
              required
            >
              <option value="">-- Chọn vai trò --</option>
              <option v-for="role in roles" :key="role.id" :value="role.id">
                {{ role.name }}
              </option>
            </select>
            <small v-if="errors.roleId" class="text-danger">{{
              errors.roleId
            }}</small>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn btn-success">
            <i class="fa fa-check opacity-50 me-1"></i> Tạo tài khoản
          </button>
        </form>
      </div>
    </BaseBlock>
  </div>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";

// Cấu hình base URL cho axios
const apiClient = axios.create({
  baseURL: "https://localhost:7017",
  headers: {
    "Content-Type": "application/json",
  },
});

export default {
  name: "CreateAccount",
  data() {
    return {
      formData: {
        email: "",
        fullName: "",
        userName: "",
        roleId: "",
      },
      errors: {},
      roles: [], // Danh sách vai trò sẽ được tải từ API
    };
  },
  methods: {
    // Tải danh sách vai trò
    async fetchRoles() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          const toast = useToast();
          toast.error("Vui lòng đăng nhập lại!");
          this.$router.push("/login");
          return;
        }

        console.log("🔍 Đang tải danh sách vai trò...");
        const response = await apiClient.get("/api/AccountGroup/list", {
          headers: { Authorization: token },
        });

        console.log("📥 Response data:", response.data);

        if (response.data?.data?.$values) {
          // Map dữ liệu từ API sang định dạng cần thiết
          this.roles = response.data.data.$values.map((role) => ({
            id: role.Id,
            name: role.GroupName || role.Name, // Sử dụng GroupName hoặc Name tùy theo API trả về
          }));
          console.log("✅ Đã xử lý danh sách vai trò:", this.roles);
        } else {
          console.error("❌ Cấu trúc dữ liệu không đúng:", response.data);
          const toast = useToast();
          toast.error("Không thể tải danh sách vai trò!");
        }
      } catch (error) {
        console.error(
          "❌ Lỗi khi tải danh sách vai trò:",
          error.response || error
        );
        const toast = useToast();
        toast.error("Không thể tải danh sách vai trò!");
      }
    },

    // Xử lý submit form
    async handleSubmit() {
      try {
        // Xóa các thông báo lỗi cũ
        this.clearErrors();

        const token = localStorage.getItem("authToken");
        if (!token) {
          const toast = useToast();
          toast.error("Vui lòng đăng nhập lại!");
          this.$router.push("/login");
          return;
        }

        // Chuẩn bị dữ liệu gửi đi theo yêu cầu của BE
        const payload = {
          Email: this.formData.email,
          FullName: this.formData.fullName,
          UserName: this.formData.userName,
          RoleId: this.formData.roleId,
        };

        console.log("📤 Đang gửi dữ liệu:", payload);

        const response = await apiClient.post(
          "/api/UserManagement/users/add",
          payload,
          {
            headers: { Authorization: token },
          }
        );

        if (response.data?.success) {
          const toast = useToast();
          toast.success("Tạo tài khoản thành công!");
          this.$router.push("/administrator/account");
        }
      } catch (error) {
        console.error("❌ Lỗi khi tạo tài khoản:", error.response?.data);

        if (error.response?.status === 400) {
          // Xử lý lỗi validation
          const errors = error.response.data?.errors;
          if (errors) {
            // Hiển thị lỗi cho từng trường
            Object.keys(errors).forEach((field) => {
              const fieldName = field.toLowerCase();
              this.errors[fieldName] = errors[field][0]; // Lấy thông báo lỗi đầu tiên

              // Hiển thị toast cho mỗi lỗi
              const toast = useToast();
              toast.error(errors[field][0]);
            });
          }
        } else if (error.response?.status === 409) {
          const toast = useToast();
          toast.error("Email hoặc tên đăng nhập đã tồn tại!");
        } else {
          const toast = useToast();
          toast.error("Không thể tạo tài khoản!");
        }
      }
    },

    // Xóa thông báo lỗi
    clearErrors() {
      this.errors = {};
    },
  },
  mounted() {
    this.fetchRoles(); // Tải danh sách vai trò khi component được mount
  },
};
</script>
