<template>
    <BasePageHeading title="Quản Lý Tài Khoản" subtitle="">
        <template #extra>
            <button v-if="selectedUsers.length > 0" type="button" class="btn btn-danger me-2" @click="deleteMultiple">
                <i class="fa fa-trash opacity-50 me-1"></i>
                Xóa đã chọn ({{ selectedUsers.length }})
            </button>

            <button type="button" class="btn btn-success" v-click-ripple @click="$router.push('/administrator/account/create')">
                <i class="fa fa-plus opacity-50 me-1"></i>
                Tạo tài khoản
            </button>
        </template>
    </BasePageHeading>

    <div class="content">
        <BaseBlock title="Danh sách tài khoản" content-full>
            <Dataset v-slot="{ ds }" :ds-data="accountFiltered.length == 0 ? users : accountFiltered" :ds-sortby="sortBy" :ds-search-in="['status', 'name', 'email', 'accountGroup']">
                <div class="row" :data-page-count="ds.dsPagecount">
                    <div id="datasetLength" class="col-md-4 py-2">
                        <DatasetShow />
                    </div>
                    <div class="col-md-4 py-2">
                        <select @change="onFilterGroup" class="form-select" title="Lọc tài khoản theo thể loại">
                            <option value="">Hiển thị tất cả</option>
                            <option v-for="group in groupRoles" :key="group.id" :value="group.name">{{ group.name }}</option>
                        </select>
                    </div>
                    <div class="col-md-4 py-2">
                        <!-- <DatasetSearch ds-search-placeholder="Tìm kiếm..." /> -->
                        <label hidden for="searchBlogInput">Tìm kiếm bài viết</label>
                        <input id="searchBlogInput" type="text" @input="search" class="form-control" placeholder="Tìm kiếm..." />
                    </div>
                </div>
                <hr />
                <div class="row">
                    <div class="col-md-12">
                        <div class="table-responsive">
                            <table class="table table-striped mb-0">
                                <thead>
                                    <tr>
                                        <th class="text-center" style="width: 50px">
                                            <label hidden for="checkAllAccount">Chọn tất cả</label>
                                            <input id="checkAllAccount" type="checkbox" class="form-check-input" @click="selectAll($event)" />
                                        </th>
                                        <th scope="col">#</th>
                                        <th v-for="(th, index) in cols" :key="th.field" :class="['sort', th.sort]" @click="onSort($event, index)">
                                            <div class="d-flex gap-2" style="white-space: nowrap">{{ th.name }} <i class="gg-select float-end"></i></div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody v-if="accountFiltered.length === 0">
                                    <tr>
                                        <td colspan="6" class="text-center">Không có dữ liệu</td>
                                    </tr>
                                </tbody>
                                <DatasetItem v-else tag="tbody" class="fs-sm">
                                    <template #default="{ row, rowIndex }">
                                        <tr>
                                            <td class="text-center">
                                                <label hidden :for="`accountCheckbox-${rowIndex}`">{{ rowIndex }}</label>
                                                <input :id="`accountCheckbox-${rowIndex}`" type="checkbox" :value="row.id" class="form-check-input" v-model="selectedUsers" @click.stop />
                                            </td>
                                            <td scope="row">{{ rowIndex + 1 }}</td>
                                            <td>
                                                <span :class="`badge bg-${row.status === 'Active' ? 'success' : 'danger'}`">
                                                    {{ row.status }}
                                                </span>
                                            </td>
                                            <td>{{ row.FullName }}</td>
                                            <td>{{ row.Email }}</td>
                                            <td>{{ row.Role }}</td>
                                            <td class="text-center">
                                                <div class="d-flex gap-2 justify-content-center">
                                                    <button class="btn btn-sm btn-alt-warning" @click.stop="editAccount(row.id)">
                                                        <i class="fa fa-fw fa-pencil-alt"></i>
                                                    </button>
                                                    <button type="button" class="btn btn-sm btn-danger" title="Xóa tài khoản" @click="deleteUser(row.id)">
                                                        <i class="fa fa-fw fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </template>
                                </DatasetItem>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="d-flex flex-md-row flex-column justify-content-between align-items-center">
                    <DatasetInfo class="py-3 fs-sm" />
                    <DatasetPager class="flex-wrap py-3 fs-sm" />
                </div>
            </Dataset>
        </BaseBlock>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import Swal from "sweetalert2";
import { RouterLink, useRouter } from "vue-router";
import { Dataset, DatasetItem, DatasetInfo, DatasetPager, DatasetSearch, DatasetShow } from "vue-dataset";
import { authRequest } from "../../one-ui/accountmanager/service/axiosConfig";
const router = useRouter();
const loading = ref(true);
const accountFiltered = ref([]);

const users = ref([]);
const groupRoles = ref([]);
const selectedUsers = ref([]);

// Fetch Groups
const fetchGroups = async () => {
    try {
        const response = await authRequest.get("/AccountGroup/list");
        groupRoles.value = response.data.data.$values.map((group) => ({
            value: group.Id,
            name: group.GroupName,
        }));
    } catch (error) {
        console.error("Error fetching groups:", error);
    }
};

// Fetch Users
const fetchUsers = async () => {
    try {
        const response = await authRequest.get("/UserManagement/users");
        users.value = response.data.data.$values
            .map((user) => ({
                id: user.Id,
                FullName: user.FullName,
                Email: user.Email,
                Role: user.Role.toString(),
                status: user.state ? "Active" : "Inactive",
            }))
            .reverse();
        accountFiltered.value = users.value;
    } catch (error) {
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

function onFilterGroup(e) {
    const filterName = e.target.value.trim();
    console.log(filterName);
    accountFiltered.value = [];
    if (filterName === "") {
        accountFiltered.value = users.value;
    } else {
        const resultFilter = users.value.filter((account) => account.Role.trim() === filterName);
        if (resultFilter.length === 0) {
            accountFiltered.value = [];
        } else {
            accountFiltered.value = resultFilter;
        }
    }
}

const editAccount = (id) => {
    router.push({ name: "AdminAccountEdit", params: { id } });
};

const selectAll = (event) => {
    if (event.target.checked) {
        selectedUsers.value = (accountFiltered.value.length === 0 ? users : accountFiltered).value.map((user) => user.id);
    } else {
        selectedUsers.value = [];
    }
};

function normalizeString(str) {
    // Chuyển đổi thành chữ thường và loại bỏ dấu
    return str
        .toLowerCase()
        .normalize("NFD") // Chuyển đổi các ký tự có dấu thành ký tự không dấu cộng với dấu
        .replace(/[\u0300-\u036f]/g, ""); // Loại bỏ các dấu
}

function containsSubstring(x, y) {
    const sanitizedX = normalizeString(x);
    const sanitizedY = normalizeString(y);

    return sanitizedY.includes(sanitizedX);
}
function search(input) {
    const searchValue = input.target.value;
    if (searchValue === "") {
        accountFiltered.value = users.value;
    } else {
        if (users.value.length != 0) {
            accountFiltered.value = users.value.filter((post) => containsSubstring(searchValue, post.FullName) || containsSubstring(searchValue, post.Email));
        }
    }
}

const deleteUser = async (id) => {
    Swal.fire({
        title: "Bạn có chắc chắn?",
        text: "Hành động này không thể hoàn tác.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đồng ý xóa!",
        cancelButtonText: "Hủy",
        customClass: {
            confirmButton: "btn btn-danger m-1",
            cancelButton: "btn btn-secondary m-1",
        },
        buttonsStyling: false,
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await authRequest.delete(`/UserManagement/users/${id}`);
                await fetchUsers();
                selectedUsers.value = [];
                accountFiltered.value = [];
                Swal.fire("Deleted!", "Tài khoản đã được xóa.", "success");
            } catch (error) {
                Swal.fire("Error", "Không thể xóa tài khoản.", "error");
                console.error("Error deleting user:", error);
            }
        }
    });
};

const deleteMultiple = async () => {
    if (selectedUsers.value.length === 0) return;

    Swal.fire({
        title: `Xóa ${selectedUsers.value.length} tài khoản?`,
        text: "Hành động này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đồng ý xóa!",
        cancelButtonText: "Hủy",
        customClass: {
            confirmButton: "btn btn-danger m-1",
            cancelButton: "btn btn-secondary m-1",
        },
        buttonsStyling: false,
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                // Sử dụng DELETE method và truyền trực tiếp mảng ID
                const response = await authRequest.delete("/UserManagement/users/delete-multiple", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: selectedUsers.value, // Truyền trực tiếp mảng ID
                });

                if (response.data.success) {
                    Swal.fire({
                        title: "Đã xóa!",
                        text: `Đã xóa ${selectedUsers.value.length} tài khoản.`,
                        icon: "success",
                    });

                    // Refresh user list and clear selection
                    await fetchUsers();
                    selectedUsers.value = [];
                    accountFiltered.value = [];
                }
            } catch (error) {
                console.error("Error response:", error.response?.data);
                Swal.fire({
                    title: "Lỗi!",
                    text: error.response?.data?.message || "Không thể xóa tài khoản. Vui lòng thử lại.",
                    icon: "error",
                });
            }
        }
    });
};

// Helper variables
const cols = reactive([
    {
        name: "Tình trạng",
        field: "status",
        sort: "",
    },
    {
        name: "Họ tên",
        field: "FullName",
        sort: "",
    },
    {
        name: "Email",
        field: "Email",
        sort: "",
    },
    {
        name: "Nhóm tài khoản",
        field: "Role",
        sort: "",
    },
]);
// Apply a few Bootstrap 5 optimizations
onMounted(() => {
    // Remove labels from
    document.querySelectorAll("#datasetLength label").forEach((el) => {
        el.remove();
    });

    // Replace select classes
    let selectLength = document.querySelector("#datasetLength select");

    selectLength.classList = "";
    selectLength.classList.add("form-select");
    selectLength.style.width = "80px";
});
// Sort by functionality
const sortBy = computed(() => {
    return cols.reduce((acc, o) => {
        if (o.sort) {
            o.sort === "asc" ? acc.push(o.field) : acc.push("-" + o.field);
        }
        return acc;
    }, []);
});
// On sort th click
function onSort(event, i) {
    let toset;
    const sortEl = cols[i];

    if (!event.shiftKey) {
        cols.forEach((o) => {
            if (o.field !== sortEl.field) {
                o.sort = "";
            }
        });
    }

    if (!sortEl.sort) {
        toset = "asc";
    }

    if (sortEl.sort === "desc") {
        toset = event.shiftKey ? "" : "asc";
    }

    if (sortEl.sort === "asc") {
        toset = "desc";
    }

    sortEl.sort = toset;
}
</script>

<style lang="scss" scoped>
.gg-select {
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(1);
    width: 22px;
    height: 22px;
}
.gg-select::after,
.gg-select::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
    width: 8px;
    height: 8px;
    left: 7px;
    transform: rotate(-45deg);
}
.gg-select::before {
    border-left: 2px solid;
    border-bottom: 2px solid;
    bottom: 4px;
    opacity: 0.3;
}
.gg-select::after {
    border-right: 2px solid;
    border-top: 2px solid;
    top: 4px;
    opacity: 0.3;
}
th.sort {
    cursor: pointer;
    user-select: none;
    &.asc {
        .gg-select::after {
            opacity: 1;
        }
    }
    &.desc {
        .gg-select::before {
            opacity: 1;
        }
    }
}
</style>
