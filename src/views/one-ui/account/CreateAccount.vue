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
        <div class="mb-4">
          <label class="form-label" for="name">Họ và Tên</label>
          <input type="text" class="form-control" id="name" v-model="formData.name" placeholder="Họ và Tên..." :maxlength="maxLengths.name" required />
          <small v-if="errors.name" class="text-danger">{{ errors.name }}</small>
        </div>

        <div class="mb-4">
          <label class="form-label" for="email">Email*</label>
          <input type="email" class="form-control" id="email" v-model="formData.email" placeholder=" VLU Email..." required />
          <small v-if="errors.email" class="text-danger">{{ errors.email }}</small>
        </div>

        <div class="mb-4">
          <label class="form-label" for="password">Mật Khẩu</label>
          <input type="password" class="form-control" id="password" v-model="formData.password" placeholder="Enter Password..." :maxlength="maxLengths.password" required />
          <small v-if="errors.password" class="text-danger">{{ errors.password }}</small>
        </div>

        <div class="mb-4">
          <label class="form-label" for="accountType">Account Type*</label>
          <select class="form-select" id="accountType" v-model="formData.role" required>
            <option value="">Select Account Type</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="viewer">Viewer</option>
          </select>
          <small v-if="errors.role" class="text-danger">{{ errors.role }}</small>
        </div>

        <button type="submit" class="btn btn-alt-primary bg-success">Done</button>
      </form>
    </div>
  </BaseBlock>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      formData: {
        name: "",
        email: "",
        password: "",
        role: "",
      },
      errors: {},
      maxLengths: {
        name: 50,
        password: 20,
      },
    };
  },
  methods: {
    async handleSubmit() {
      this.clearErrors();

      // Validate email
      if (!this.formData.email.endsWith("@vlu.edu.vn")) {
        this.errors.email = "Email must belong to the VLU domain.";
        return;
      }

      try {
        const response = await axios.post("/api/users", this.formData);
        if (response.data.success) {
          alert("User created successfully!");
          this.$router.push("/administrator/account");
        }
      } catch (error) {
        if (error.response?.status === 409) {
          this.errors.email = "This email already exists.";
        } else {
          alert("An error occurred while creating the user.");
        }
      }
    },
    clearErrors() {
      this.errors = {};
    },
  },
};
</script>
