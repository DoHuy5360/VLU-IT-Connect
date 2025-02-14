<template>
    <BasePageHeading title="Chỉnh Sửa Tài Khoản" subtitle="">
        <template #extra>
            <button type="button" class="btn btn-alt-primary" @click="$router.push('/administrator/account')">
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
                        <input type="email" class="form-control" id="email" v-model="formData.email" placeholder="Email..." required />
                        <small v-if="errors.email" class="text-danger">{{ errors.email }}</small>
                    </div>

                    <!-- Full Name -->
                    <div class="mb-4">
                        <label class="form-label" for="fullName">Họ và Tên*</label>
                        <input type="text" class="form-control" id="fullName" v-model="formData.fullName" placeholder="Họ và Tên..." required />
                        <small v-if="errors.fullName" class="text-danger">{{ errors.fullName }}</small>
                    </div>

                    <!-- Username -->
                    <div class="mb-4">
                        <label class="form-label" for="userName">Tên đăng nhập*</label>
                        <input type="text" class="form-control" id="userName" v-model="formData.userName" placeholder="Tên đăng nhập..." required />
                        <small v-if="errors.userName" class="text-danger">{{ errors.userName }}</small>
                    </div>

                    <!-- Role -->
                    <div class="mb-4">
                        <label class="form-label" for="roleId">Vai trò*</label>
                        <select class="form-select" id="roleId" v-model="formData.roleId" required>
                            <option value="">-- Chọn vai trò --</option>
                            <option v-for="role in roles" :key="role.id" :value="role.id">
                                {{ role.name }}
                            </option>
                        </select>
                        <small v-if="errors.roleId" class="text-danger">{{ errors.roleId }}</small>
                    </div>

                    <!-- Submit Button -->
                    <button type="submit" class="btn btn-success"><i class="fa fa-save opacity-50 me-1"></i> Lưu thay đổi</button>
                </form>
            </div>
        </BaseBlock>
    </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from "vue";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import { authRequest } from "../accountmanager/service/axiosConfig";

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
});

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
        const response = await authRequest.get("/AccountGroup/list");

        if (response.data?.data?.$values) {
            roles.value = response.data.data.$values.map((role) => ({
                id: role.Id,
                name: role.GroupName,
            }));
            console.log("✅ Danh sách vai trò:", roles.value);
        }
    } catch (error) {
        console.error("❌ Lỗi khi tải danh sách vai trò:", error);
        toast.error("Không thể tải danh sách vai trò!");
    }
};

const fetchAccountDetails = async () => {
    try {
        const response = await authRequest.get("/UserManagement/users");

        if (response.data?.success && response.data?.data?.$values) {
            const userData = response.data.data.$values.find((user) => user.Id === props.id);
            if (userData) {
                formData.value = {
                    email: userData.Email,
                    fullName: userData.FullName,
                    userName: userData.Email,
                    roleId: userData.Role === "quản lý bài viết" ? "2" : "1",
                };
                console.log("✅ Thông tin tài khoản:", formData.value);
            } else {
                throw new Error("Không tìm thấy thông tin tài khoản");
            }
        }
    } catch (error) {
        console.error("❌ Lỗi khi tải thông tin tài khoản:", error);
        toast.error(error.message || "Không thể tải thông tin tài khoản!");
        router.push("/administrator/account");
    }
};

const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
        toast.error("Vui lòng đăng nhập lại!");
        router.push("/login");
        return;
    }

    toast.info("Đang cập nhật tài khoản...");

    const payload = {
        Email: formData.value.email,
        FullName: formData.value.fullName,
        UserName: formData.value.userName,
        RoleId: formData.value.roleId,
    };

    console.log("📤 Đang gửi dữ liệu:", payload);

    try {
        const response = await authRequest.put(`/UserManagement/users/${props.id}`, payload);

        if (response.data?.success) {
            toast.success("Cập nhật tài khoản thành công!");
            setTimeout(() => {
                router.push("/administrator/account");
            }, 1000);
        } else {
            toast.error("Cập nhật tài khoản thất bại. Vui lòng thử lại!");
        }
    } catch (error) {
        console.error("❌ Lỗi khi cập nhật tài khoản:", error.response?.data);

        if (error.response?.status === 400) {
            const validationErrors = error.response.data?.errors;
            if (validationErrors) {
                Object.keys(validationErrors).forEach((field) => {
                    const fieldName = field.toLowerCase();
                    errors.value[fieldName] = validationErrors[field][0];
                    toast.error(`Lỗi: ${validationErrors[field][0]}`);
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
            router.push("/login");
        } else {
            toast.error("Có lỗi xảy ra khi cập nhật tài khoản. Vui lòng thử lại sau!");
        }
    }
};

const clearErrors = () => {
    errors.value = {};
};

onMounted(async () => {
    await fetchRoles();
    await fetchAccountDetails();
});
</script>
