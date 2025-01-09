<template>
  <BasePageHeading title="Thêm tài khoản" subtitle="">
    <template #extra>
      <button type="button" class="btn btn-alt-primary" @click="$router.push('/administrator/account')">
        <i class="fa fa-arrow-left opacity-50 me-1"></i>
        Về danh sách
      </button>
    </template>
  </BasePageHeading>

  <BaseBlock title="Create New User">
    <div class="col-lg-8 space-y-5">
      <form @submit.prevent="handleSubmit">
        <!-- Full Name -->
        <div class="mb-4">
          <label class="form-label" for="name">Họ và Tên</label>
          <input type="text" class="form-control" id="name" v-model="formData.name" placeholder="Họ và Tên..." :maxlength="maxLengths.name" required />
          <small v-if="errors.name" class="text-danger">{{ errors.name }}</small>
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label class="form-label" for="email">Email*</label>
          <input type="email" class="form-control" id="email" v-model="formData.email" placeholder="VLU Email..." required />
          <small v-if="errors.email" class="text-danger">{{ errors.email }}</small>
        </div>

        <!-- Password -->
        <div class="mb-4">
          <label class="form-label" for="password">Mật khẩu*</label>
          <input type="password" class="form-control" id="password" v-model="formData.password" placeholder="Mật khẩu..." required />
          <small v-if="errors.password" class="text-danger">{{ errors.password }}</small>
        </div>

        <!-- Phone Number -->
        <div class="mb-4">
          <label class="form-label" for="phone">Số điện thoại*</label>
          <input type="text" class="form-control" id="phone" v-model="formData.phone" placeholder="Số điện thoại..." required />
          <small v-if="errors.phone" class="text-danger">{{ errors.phone }}</small>
        </div>

        <!-- Role -->
        <div class="mb-4">
          <label class="form-label" for="accountType">Account Type*</label>
          <select class="form-select" id="accountType" v-model="formData.role" @change="handleRoleChange" required>
            <option value="">Select Account Type</option>
            <option v-for="group in groups" :key="group.value" :value="group.value">
              {{ group.label }}
            </option>
          </select>
          <small v-if="errors.role" class="text-danger">{{ errors.role }}</small>
        </div>

        <!-- Display Selected Role Name -->
        <div class="mb-4">
          <label class="form-label" for="roleName">Selected Role</label>
          <input type="text" class="form-control" id="roleName" v-model="formData.roleName" placeholder="Role Name" readonly />
        </div>

        <!-- Submit Button -->
        <button type="submit" class="btn btn-alt-primary bg-success">Done</button>
      </form>
    </div>
  </BaseBlock>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      formData: {
        name: "",
        email: "",
        password: "",
        phone: "", // Phone number field
        role: "",
        roleName: "", // Role name will auto-fill based on selection
      },
      errors: {},
      maxLengths: {
        name: 50,
      },
      groups: [], // Roles data fetched from API
    };
  },
  methods: {
    // Fetch roles (Account groups) from API
    async fetchGroups() {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("/api/AccountGroup/list", {
          headers: { Authorization: token },
        });

        const groups = response.data.data?.$values || [];
        this.groups = groups.map((group) => ({
          value: group.Id,
          label: group.GroupName,
        }));
      } catch (error) {
        Swal.fire("Error", "Không thể tải danh sách nhóm tài khoản.", "error");
        console.error("Error fetching groups:", error);
      }
    },

    // Handle Role Change
    handleRoleChange() {
      const selectedRole = this.groups.find((group) => group.value === this.formData.role);
      if (selectedRole) {
        this.formData.roleName = selectedRole.label;
      } else {
        this.formData.roleName = "";
      }
    },

    // Handle form submission
    async handleSubmit() {
      this.clearErrors();

      // Validate email domain
      if (!this.formData.email.endsWith("@vlu.edu.vn")) {
        this.errors.email = "Email must belong to the VLU domain.";
        return;
      }

      // Validate phone number
      if (!/^\d{10,15}$/.test(this.formData.phone)) {
        this.errors.phone = "Số điện thoại không hợp lệ. Vui lòng nhập 10-15 chữ số.";
        return;
      }

      try {
        const authToken = localStorage.getItem("authToken") || "Bearer your-auth-token";

        // Prepare payload matching your JSON structure
        const payload = {
          UserName: this.formData.email,
          Email: this.formData.email,
          FullName: this.formData.name,
          Password: this.formData.password,
          PhoneNumber: this.formData.phone,
          EmailConfirmed: true,
          PhoneNumberConfirmed: false,
          TwoFactorEnabled: false,
          LockoutEnd: null,
          LockoutEnabled: false,
          AccessFailedCount: 0,
          RoleId: this.formData.role,
        };

        // Log payload for debugging
        console.log("Payload being sent:", JSON.stringify(payload, null, 2));

        const response = await axios.post("/api/UserManagement/users/add", payload, {
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
        });

        if (response.data.success) {
          Swal.fire("Success", "User created successfully!", "success");
          this.$router.push("/administrator/account");
        }
      } catch (error) {
        if (error.response?.status === 409) {
          this.errors.email = "This email already exists.";
        } else {
          Swal.fire("Error", "An error occurred while creating the user.", "error");
        }
      }
    },

    // Clear validation errors
    clearErrors() {
      this.errors = {};
    },
  },
  mounted() {
    this.fetchGroups(); // Load roles when the component is mounted
  },
};
</script>
