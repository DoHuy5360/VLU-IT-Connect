<template>
  <BasePageHeading title="Chỉnh Sửa Tài Khoản" subtitle="">
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
            <i class="fa fa-save opacity-50 me-1"></i> Lưu thay đổi
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
  name: "EditAccount",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
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
        const response = await apiClient.get("/api/AccountGroup/list", {
          headers: { Authorization: token },
        });

        if (response.data?.data?.$values) {
          this.roles = response.data.data.$values.map((role) => ({
            id: role.Id,
            name: role.GroupName,
          }));
          console.log("✅ Danh sách vai trò:", this.roles);
        }
      } catch (error) {
        console.error("❌ Lỗi khi tải danh sách vai trò:", error);
        const toast = useToast();
        toast.error("Không thể tải danh sách vai trò!");
      }
    },

    // Tải thông tin tài khoản
    async fetchAccountDetails() {
      try {
        const token = localStorage.getItem("authToken");
        const response = await apiClient.get("/api/UserManagement/users", {
          headers: { Authorization: token },
        });

        if (response.data?.success && response.data?.data?.$values) {
          // Tìm user theo id
          const userData = response.data.data.$values.find(
            (user) => user.Id === this.id
          );

          if (userData) {
            this.formData = {
              email: userData.Email,
              fullName: userData.FullName,
              userName: userData.Email, // Sử dụng email làm username
              roleId: userData.Role === "quản lý bài viết" ? "2" : "1", // Map role name to id
            };
            console.log("✅ Thông tin tài khoản:", this.formData);
          } else {
            throw new Error("Không tìm thấy thông tin tài khoản");
          }
        }
      } catch (error) {
        console.error("❌ Lỗi khi tải thông tin tài khoản:", error);
        const toast = useToast();
        toast.error(error.message || "Không thể tải thông tin tài khoản!");
        this.$router.push("/administrator/account");
      }
    },

    // Xử lý submit form
    async handleSubmit() {
      const toast = useToast();
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("Vui lòng đăng nhập lại!");
          this.$router.push("/login");
          return;
        }

        // Hiển thị thông báo đang xử lý
        toast.info("Đang cập nhật tài khoản...");

        // Chuẩn bị dữ liệu gửi đi theo yêu cầu của BE
        const payload = {
          Email: this.formData.email,
          FullName: this.formData.fullName,
          UserName: this.formData.userName,
          RoleId: this.formData.roleId,
        };

        console.log("📤 Đang gửi dữ liệu:", payload);

        // Gọi API với id trong URL
        const response = await apiClient.put(
          `/api/UserManagement/users/${this.id}`,
          payload,
          {
            headers: { Authorization: token },
          }
        );

        if (response.data?.success) {
          toast.success("Cập nhật tài khoản thành công!");
          // Đợi 1 giây để người dùng thấy thông báo thành công
          setTimeout(() => {
            this.$router.push("/administrator/account");
          }, 1000);
        } else {
          toast.error("Cập nhật tài khoản thất bại. Vui lòng thử lại!");
        }
      } catch (error) {
        console.error("❌ Lỗi khi cập nhật tài khoản:", error.response?.data);

        if (error.response?.status === 400) {
          // Xử lý lỗi validation
          const errors = error.response.data?.errors;
          if (errors) {
            Object.keys(errors).forEach((field) => {
              const fieldName = field.toLowerCase();
              this.errors[fieldName] = errors[field][0];
              toast.error(`Lỗi: ${errors[field][0]}`);
            });
          } else {
            toast.error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại!");
          }
        } else if (error.response?.status === 409) {
          toast.error("Email hoặc tên đăng nhập đã tồn tại!");
        } else if (error.response?.status === 404) {
          toast.error("Không tìm thấy tài khoản cần cập nhật!");
        } else if (error.response?.status === 401) {
          toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
          this.$router.push("/login");
        } else {
          toast.error(
            "Có lỗi xảy ra khi cập nhật tài khoản. Vui lòng thử lại sau!"
          );
        }
      }
    },

    // Xóa thông báo lỗi
    clearErrors() {
      this.errors = {};
    },
  },
  async mounted() {
    await this.fetchRoles();
    await this.fetchAccountDetails();
  },
};
</script>
