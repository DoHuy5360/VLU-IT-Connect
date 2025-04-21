<template>
    <BasePageHeading title="Thêm Người Dùng Vào Nhóm Phân Quyền">
        <template #extra>
            <button class="btn btn-primary" @click="$router.push('/administrator/accountmanager')"><i class="fa fa-arrow-left opacity-50 me-1"></i> Quay lại</button>
        </template>
    </BasePageHeading>

    <div class="content">
        <div class="block block-rounded">
            <div class="block-content">
                <form @submit.prevent="handleSubmit" class="mb-4">
                    <div class="row">
                        <!-- Danh sách người dùng -->
                        <div class="col-md-6">
                            <div class="mb-4">
                                <div class="table-responsive">
                                    <table class="table table-bordered table-striped table-vcenter">
                                        <thead>
                                            <tr>
                                                <th class="text-center" style="width: 50px">
                                                    <div class="form-check">
                                                        <label hidden for="checkAllAccount">Chọn tất cả</label>
                                                        <input id="checkAllAccount" type="checkbox" class="form-check-input" :checked="isAllUsersSelected" @change="toggleSelectAllUsers" />
                                                    </div>
                                                </th>
                                                <th>Tên</th>
                                                <th>Email</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(user, index) in users" :key="user.id">
                                                <td class="text-center">
                                                    <div class="form-check">
                                                        <label hidden :for="`checkAllAccount-${index}`">{{ index }}</label>
                                                        <input
                                                            :for="`checkAllAccount-${index}`"
                                                            type="checkbox"
                                                            class="form-check-input"
                                                            :checked="selectedUsers.includes(user.id)"
                                                            @change="toggleUserSelection(user.id)"
                                                        />
                                                    </div>
                                                </td>
                                                <td>{{ user.fullName }}</td>
                                                <td>{{ user.email }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <!-- Chọn nhóm -->
                        <div class="col-md-6">
                            <div class="mb-4">
                                <select id="group" class="form-select" v-model="selectedGroup" required title="Chọn nhóm">
                                    <option value="">-- Chọn nhóm --</option>
                                    <option v-for="group in groups" :key="group.id" :value="group.name">
                                        {{ group.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                            <button type="submit" class="btn btn-success" :disabled="!selectedGroup || selectedUsers.length === 0"><i class="fa fa-save me-1"></i> Lưu thay đổi</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
// import userManagementService from "@/services/userManagementService";
// import accountGroupService from "@/services/accountGroupService";
import accountGroupService from "@/views/one-ui/accountmanager/service/accountGroupService";
import userManagementService from "@/views/one-ui/accountmanager/service/userManagementService";
import Swal from "sweetalert2";

const router = useRouter();

// Data
const users = ref([]);
const groups = ref([]);
const selectedUsers = ref([]);
const selectedGroup = ref("");
const loading = ref(false);

// Computed
const isAllUsersSelected = computed(() => {
    return users.value.length > 0 && selectedUsers.value.length === users.value.length;
});

// Methods
const toggleSelectAllUsers = () => {
    if (isAllUsersSelected.value) {
        selectedUsers.value = [];
    } else {
        selectedUsers.value = users.value.map((user) => user.id);
    }
};

const toggleUserSelection = (userId) => {
    const index = selectedUsers.value.indexOf(userId);
    if (index === -1) {
        selectedUsers.value.push(userId);
    } else {
        selectedUsers.value.splice(index, 1);
    }
};

const loadUsers = async () => {
    try {
        loading.value = true;
        const response = await userManagementService.getUsers();
        if (response.success) {
            users.value = response.data.$values.map((user) => ({
                id: user.Id,
                fullName: user.FullName,
                email: user.Email,
            }));
        }
    } catch (error) {
        console.error("Error loading users:", error);
        await Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Không thể tải danh sách người dùng",
        });
    } finally {
        loading.value = false;
    }
};

const loadGroups = async () => {
    loading.value = true;
    try {
        const response = await accountGroupService.getList();
        if (response.success) {
            groups.value = response.data.items;
        }
    } catch (error) {
        console.error("Error loading groups:", error);
        Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Không thể tải danh sách nhóm",
        });
    } finally {
        loading.value = false;
    }
};

const handleSubmit = async () => {
    if (!selectedGroup.value || selectedUsers.value.length === 0) {
        await Swal.fire({
            icon: "warning",
            title: "Cảnh báo",
            text: "Vui lòng chọn nhóm và ít nhất một người dùng",
        });
        return;
    }

    loading.value = true;
    try {
        // Ensure selectedGroup is a string and selectedUsers is an array of strings
        const groupName = String(selectedGroup.value);
        const userIds = selectedUsers.value.map((id) => String(id));

        console.log("Sending data:", {
            GroupName: groupName,
            UserIds: userIds,
        });

        const response = await accountGroupService.assignUsersToGroup(groupName, userIds);

        if (response.success) {
            await Swal.fire({
                icon: "success",
                title: "Thành công",
                text: response.message || "Đã thêm người dùng vào nhóm thành công",
            });
            router.push("/administrator/accountmanager");
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        console.error("Error assigning users:", error);
        await Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: error.message || "Không thể thêm người dùng vào nhóm",
        });
    } finally {
        loading.value = false;
    }
};

// Lifecycle hooks
onMounted(() => {
    loadUsers();
    loadGroups();
});
</script>
