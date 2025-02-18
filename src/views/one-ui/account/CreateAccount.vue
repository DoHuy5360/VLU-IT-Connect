<template>
  <BasePageHeading title="Thêm Tài Khoản" subtitle="">
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
            <i class="fa fa-check opacity-50 me-1"></i> Thêm tài khoản
          </button>
        </form>
      </div>
    </BaseBlock>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import { authRequest } from "../accountmanager/service/axiosConfig";
import Swal from "sweetalert2";

const router = useRouter();
const toast = useToast();

const formData = ref({
  email: "",
  fullName: "",
  userName: "",
  roleId: "",
});
const errors = ref({});
const roles = ref([]);

const fetchRoles = async () => {
  try {
    console.log("🔍 Đang tải danh sách vai trò...");
    const response = await authRequest.get("/AccountGroup/list");

    console.log("📥 Response data:", response.data);

    if (response.data?.data?.$values) {
      roles.value = response.data.data.$values.map((role) => ({
        id: role.Id,
        name: role.GroupName || role.Name,
      }));
      console.log("✅ Đã xử lý danh sách vai trò:", roles.value);
    } else {
      console.error("❌ Cấu trúc dữ liệu không đúng:", response.data);
      toast.error("Không thể tải danh sách vai trò!");
    }
  } catch (error) {
    console.error("❌ Lỗi khi tải danh sách vai trò:", error.response || error);
    toast.error("Không thể tải danh sách vai trò!");
  }
};

const handleSubmit = async () => {
  try {
    clearErrors();
    toast.info("Đang xử lý yêu cầu...");

    const payload = {
      Email: formData.value.email,
      FullName: formData.value.fullName,
      UserName: formData.value.email,
      RoleId: formData.value.roleId,
    };

    console.log("📤 Đang gửi dữ liệu:", payload);

    const response = await authRequest.post(
      "/UserManagement/users/add",
      payload
    );

    if (response.data?.success) {
      Swal.fire({
        title: "Thành công!",
        text: "Thêm tài khoản mới thành công",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-success m-1",
        },
        buttonsStyling: false,
      }).then(() => {
        router.push("/administrator/account");
      });
    }
  } catch (error) {
    console.error("❌ Lỗi khi tạo tài khoản:", error.response?.data);

    if (error.response?.status === 400) {
      const validationErrors = error.response.data?.errors;
      if (validationErrors) {
        Object.keys(validationErrors).forEach((field) => {
          const fieldName = field.toLowerCase();
          errors.value[fieldName] = validationErrors[field][0];
          toast.error(`Lỗi: ${validationErrors[field][0]}`);
        });
      } else {
        Swal.fire({
          title: "Lỗi!",
          text: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại!",
          icon: "error",
          confirmButtonText: "Đóng",
          customClass: {
            confirmButton: "btn btn-danger m-1",
          },
          buttonsStyling: false,
        });
      }
    } else if (error.response?.status === 409) {
      Swal.fire({
        title: "Lỗi!",
        text: "Email đã tồn tại trong hệ thống!",
        icon: "error",
        confirmButtonText: "Đóng",
        customClass: {
          confirmButton: "btn btn-danger m-1",
        },
        buttonsStyling: false,
      });
    } else {
      Swal.fire({
        title: "Lỗi!",
        text: "Không thể thêm tài khoản. Vui lòng thử lại sau!",
        icon: "error",
        confirmButtonText: "Đóng",
        customClass: {
          confirmButton: "btn btn-danger m-1",
        },
        buttonsStyling: false,
      });
    }
  }
};

const clearErrors = () => {
  errors.value = {};
};

onMounted(() => {
  fetchRoles(); // Tải danh sách vai trò khi component được mount
});
</script>
