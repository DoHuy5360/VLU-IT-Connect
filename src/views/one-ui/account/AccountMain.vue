<template>
    <BasePageHeading title="Tài khoản" subtitle="">
        <template #extra>
            <button type="button" class="btn btn-success" v-click-ripple @click="$router.push('/administrator/account/create')">
                <i class="fa fa-plus opacity-50 me-1"></i>
                Thêm tài khoản
            </button>
        </template>
    </BasePageHeading>

    <div class="content">
        <!-- Filters and Search -->
        <div class="row mb-4">
            <div class="col-md-8">
                <input type="text" class="form-control" v-model="searchTerm" placeholder="Tìm kiếm (Tên, Email, Nhóm tài khoản)..." @input="onSearch" />
            </div>
            <div class="col-md-4">
                <select class="form-select" v-model="selectedGroup" @change="onFilterGroup">
                    <option value="">Tất cả nhóm tài khoản</option>
                    <option v-for="group in groups" :key="group.value" :value="group.value">
                        {{ group.label }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Loading Spinner -->
        <div v-if="loading" class="text-center">
            <p>Đang tải dữ liệu...</p>
        </div>

        <!-- User Table -->
        <div v-else>
            <BaseBlock title="Danh sách tài khoản" class="shadow-sm rounded">
                <p class="fs-sm text-muted mb-4">Danh sách tài khoản hiển thị theo thứ tự thời gian, tài khoản mới nhất ở đầu danh sách.</p>
                <div v-if="paginatedAccounts.length">
                    <table class="table table-bordered table-striped table-vcenter align-middle">
                        <thead class="bg-primary-light">
                            <tr>
                                <th class="text-center" style="width: 50px">
                                    <input type="checkbox" :checked="isAllSelected" @click="selectAll($event)" />
                                </th>
                                <th class="text-center">#</th>
                                <th>Tình trạng</th>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>Nhóm tài khoản</th>
                                <th class="text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(user, index) in paginatedAccounts" :key="user.id">
                                <td class="text-center">
                                    <input type="checkbox" :value="user.id" v-model="selectedUsers" @click.stop />
                                </td>
                                <td class="text-center">{{ currentPageIndex + index + 1 }}</td>
                                <td>
                                    <span :class="`badge bg-${user.status === 'Active' ? 'success' : 'danger'}`">
                                        {{ user.status }}
                                    </span>
                                </td>
                                <td>{{ user.FullName }}</td>
                                <td>{{ user.Email }}</td>
                                <td>{{ user.Role }}</td>
                                <td class="text-center">
                                    <div class="d-flex gap-2 justify-content-center">
                                        <button class="btn btn-sm btn-alt-warning" @click.stop="editAccount(user.id)">
                                            <i class="fa fa-fw fa-pencil-alt"></i>
                                        </button>
                                        <button type="button" class="btn btn-sm btn-danger" title="Xóa tài khoản" @click="deleteUser(user.id)">
                                            <i class="fa fa-fw fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!-- Pagination -->
                    <nav>
                        <ul class="pagination justify-content-center mt-4">
                            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                <button class="page-link" @click="changePage(currentPage - 1)">Trước</button>
                            </li>
                            <li v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }" class="page-item">
                                <button class="page-link" @click="changePage(page)">{{ page }}</button>
                            </li>
                            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                <button class="page-link" @click="changePage(currentPage + 1)">Tiếp</button>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div v-else class="text-center">
                    <p class="text-muted">Không tìm thấy kết quả phù hợp</p>
                </div>
            </BaseBlock>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

const users = ref([]);
const searchTerm = ref("");
const selectedGroup = ref("");
const currentPage = ref(1);
const itemsPerPage = 20;
const groups = ref([]);
const loading = ref(true);
const selectedUsers = ref([]);

// Fetch Groups
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
        Swal.fire("Error", "Không thể tải danh sách nhóm tài khoản.", "error");
        console.error("Error fetching groups:", error);
    }
};

// Fetch Users
const fetchUsers = async () => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("/api/UserManagement/users", {
            headers: { Authorization: token },
        });
        users.value = response.data.data.$values.map((user) => ({
            id: user.Id,
            FullName: user.FullName,
            Email: user.Email,
            Role: user.Role.toString(),
            status: user.state ? "Active" : "Inactive",
        }));
    } catch (error) {
        Swal.fire("Error", "Không thể tải dữ liệu tài khoản.", "error");
        console.error("Error fetching users:", error);
    } finally {
        loading.value = false;
    }
};

// Lifecycle Hooks
onMounted(() => {
    fetchGroups();
    fetchUsers();
});

// Computed Properties
const filteredUsers = computed(() => {
    return users.value
        .filter((user) => !selectedGroup.value || user.Role === selectedGroup.value)
        .filter((user) => {
            const keyword = searchTerm.value.trim().toLowerCase();
            return !keyword || user.FullName.toLowerCase().includes(keyword) || user.Email.toLowerCase().includes(keyword) || user.Role.toLowerCase().includes(keyword);
        });
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage));
const paginatedAccounts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredUsers.value.slice(start, start + itemsPerPage);
});
const currentPageIndex = computed(() => (currentPage.value - 1) * itemsPerPage);

// Methods
const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) currentPage.value = page;
};

const onSearch = () => (currentPage.value = 1);
const onFilterGroup = () => (currentPage.value = 1);

const deleteUser = async (id) => {
    try {
        const token = localStorage.getItem("authToken");
        await axios.delete(`/api/UserManagement/users/${id}`, {
            headers: { Authorization: token },
        });
        users.value = users.value.filter((user) => user.id !== id);
        Swal.fire("Deleted!", "Tài khoản đã được xóa.", "success");
    } catch (error) {
        Swal.fire("Error", "Không thể xóa tài khoản.", "error");
        console.error("Error deleting user:", error);
    }
};

const deleteMultiple = async () => {
    if (selectedUsers.value.length === 0) {
        Swal.fire("Thông báo", "Vui lòng chọn ít nhất một tài khoản để xóa!", "info");
        return;
    }

    const confirmation = await Swal.fire({
        title: "Bạn có chắc chắn?",
        text: `Bạn sẽ xóa ${selectedUsers.value.length} tài khoản đã chọn.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        customClass: {
            confirmButton: "btn btn-danger m-1",
            cancelButton: "btn btn-secondary m-1",
        },
        buttonsStyling: false,
    });

    if (confirmation.isConfirmed) {
        try {
            const token = localStorage.getItem("authToken");
            await axios.post("/api/UserManagement/users/delete-multiple", selectedUsers.value, {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            });
            users.value = users.value.filter((user) => !selectedUsers.value.includes(user.id));
            selectedUsers.value = [];
            Swal.fire("Thành công", "Các tài khoản đã được xóa.", "success");
        } catch (error) {
            Swal.fire("Lỗi", "Xóa tài khoản thất bại. Vui lòng thử lại.", "error");
            console.error("Error deleting multiple users:", error);
        }
    }
};

const editAccount = (id) => {
    router.push({ name: "AdminAccountEdit", params: { id } });
};

const selectAll = (event) => {
    if (event.target.checked) {
        selectedUsers.value = paginatedAccounts.value.map((user) => user.id);
    } else {
        selectedUsers.value = [];
    }
};
</script>

<style scoped>
.table th {
    white-space: nowrap;
}
.pagination .page-link {
    cursor: pointer;
}
</style>
