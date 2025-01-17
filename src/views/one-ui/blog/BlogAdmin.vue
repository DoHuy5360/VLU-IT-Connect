<template>
    <BasePageHeading title="Bài viết" subtitle="">
        <template #extra>
            <button type="button" class="btn btn-success d-flex align-items-center" @click="$router.push('/administrator/blog/create')">
                <i class="fa fa-plus opacity-50 me-2"></i>
                Thêm bài viết mới
            </button>
        </template>
    </BasePageHeading>

    <div class="content">
        <!-- Filters and Search -->
        <div class="row mb-4">
            <div class="col-md-8">
                <input type="text" class="form-control" v-model="searchTerm" placeholder="Tìm kiếm bài viết..." @input="onSearch" />
            </div>
            <div class="col-md-4">
                <select class="form-select" v-model="selectedStatus" @change="onFilter">
                    <option value="">Tất cả trạng thái</option>
                    <option value="1">Public</option>
                    <option value="0">Unpublic</option>
                </select>
            </div>
        </div>

        <!-- Loading Spinner -->
        <div v-if="loading" class="text-center">
            <p>Đang tải dữ liệu...</p>
        </div>

        <!-- Blog Table -->
        <div v-else>
            <BaseBlock title="Danh sách bài viết" class="shadow-sm rounded">
                <p class="fs-sm text-muted mb-4">Danh sách bài viết hiển thị theo thứ tự thời gian, bài viết mới nhất ở đầu danh sách.</p>
                <div v-if="paginatedUsers.length">
                    <table class="table table-bordered table-striped table-vcenter align-middle">
                        <thead class="bg-primary-light">
                            <tr>
                                <th class="text-center" style="width: 50px">
                                    <input type="checkbox" :checked="isAllSelected" @click="selectAll($event)" />
                                </th>
                                <th class="text-center">#</th>
                                <th>Tiêu đề</th>
                                <th>Tác giả</th>
                                <th>Trạng thái</th>
                                <th class="text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(user, index) in paginatedUsers" :key="user.id">
                                <td class="text-center">
                                    <input type="checkbox" :value="user.id" v-model="selectedUsers" @click.stop />
                                </td>
                                <td class="text-center">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                                <td>{{ user.title }}</td>
                                <td>{{ user.author }}</td>
                                <td>
                                    <span :class="`badge bg-${user.state === 1 ? 'success' : 'warning'}`">
                                        {{ user.state === 1 ? "Public" : "Unpublic" }}
                                    </span>
                                </td>
                                <td class="text-center">
                                    <button class="btn btn-sm btn-alt-warning" @click.stop="editBlog(user.id)">
                                        <i class="fa fa-fw fa-pencil-alt"></i>
                                    </button>
                                    <button type="button" class="btn btn-sm btn-danger" title="Xóa bài viết" @click="swalConfirm(user.id)">
                                        <i class="fa fa-fw fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!-- Pagination -->
                    <nav v-if="filteredUsers.length > itemsPerPage" class="mt-3">
                        <ul class="pagination justify-content-center">
                            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                <button class="page-link" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Trước</button>
                            </li>
                            <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
                                <button class="page-link" @click="changePage(page)">
                                    {{ page }}
                                </button>
                            </li>
                            <li class="page-item" :class="{ disabled: currentPage === totalPages.value }">
                                <button class="page-link" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages.value">Tiếp</button>
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

<script>
import { ref, computed, onMounted, watch } from "vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
    name: "BlogAdmin",
    setup() {
        const router = useRouter();
        const users = ref([]);
        const searchTerm = ref("");
        const selectedStatus = ref("");
        const itemsPerPage = ref(10);
        const currentPage = ref(1);
        const loading = ref(true);
        const selectedUsers = ref([]);

        onMounted(async () => {
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.get("/api/admin/posts", {
                    headers: {
                        Authorization: token,
                    },
                });
                users.value = response.data.data.$values.map((post) => ({
                    id: post.id,
                    author: post.author,
                    slug: post.slug,
                    title: post.title,
                    state: post.published ? 1 : 0,
                    publishDate: post.publishedAt,
                }));
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                loading.value = false;
            }
        });

        const filteredUsers = computed(() => {
            const search = searchTerm.value.toLowerCase();
            return users.value
                .filter((user) => user.title.toLowerCase().includes(search) && (selectedStatus.value === "" || user.state.toString() === selectedStatus.value))
                .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
        });

        const paginatedUsers = computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage.value;
            return filteredUsers.value.slice(start, start + itemsPerPage.value);
        });

        const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value));

        const getStatusClass = (state) => (state === 1 ? "bg-success-light text-success" : "bg-warning-light text-warning");

        const isAllSelected = computed(() => {
            return paginatedUsers.value.length > 0 && paginatedUsers.value.every((user) => selectedUsers.value.includes(user.id));
        });

        const selectAll = (event) => {
            if (event.target.checked) {
                selectedUsers.value = paginatedUsers.value.map((user) => user.id);
            } else {
                selectedUsers.value = [];
            }
        };

        const deleteMultiple = async () => {
            if (selectedUsers.value.length === 0) {
                Swal.fire("Thông báo", "Vui lòng chọn ít nhất một bài viết để xóa!", "info");
                return;
            }

            const confirmation = await Swal.fire({
                title: "Bạn có chắc chắn?",
                text: `Bạn sẽ xóa ${selectedUsers.value.length} bài viết đã chọn.`,
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
                    loading.value = true;

                    await axios.request({
                        url: "/api/admin/posts/multiple",
                        method: "DELETE",
                        headers: { Authorization: token },
                        data: selectedUsers.value, // Direct array as the body
                    });
                    users.value = users.value.filter((user) => !selectedUsers.value.includes(user.id));
                    selectedUsers.value = [];

                    Swal.fire("Thành công", "Các bài viết đã được xóa.", "success");
                } catch (error) {
                    console.error("Error deleting multiple posts:", error);
                    Swal.fire("Lỗi", "Xóa bài viết thất bại. Vui lòng thử lại.", "error");
                } finally {
                    loading.value = false;
                }
            }
        };

        const swalConfirm = async (id) => {
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
                const token = localStorage.getItem("authToken");
                if (result.isConfirmed) {
                    try {
                        loading.value = true;
                        await axios.delete(`/api/admin/posts/${id}`, {
                            headers: {
                                Authorization: token,
                            },
                        });
                        users.value = users.value.filter((user) => user.id !== id);
                        Swal.fire("Đã xóa!", `Bài viết với ID: ${id} đã được xóa.`, "success");
                    } catch (error) {
                        Swal.fire("Lỗi", "Xóa bài viết thất bại. Vui lòng thử lại.", "error");
                        console.error("Error deleting post:", error);
                    } finally {
                        loading.value = false;
                    }
                }
            });
        };

        const viewBlog = (id) => {
            router.push({ name: "AdminBlogViewDetail", params: { id: String(id) } });
        };
        const editBlog = (id) => router.push({ name: "AdminBlogEdit", params: { id: String(id) } });
        const detailBlog = (id) => router.push({ name: "AdminBlogDetail", params: { id: String(id) } });        

        const changePage = (page) => {
            if (page >= 1 && page <= totalPages.value) {
                currentPage.value = page;
            }
        };
        const onSearch = () => (currentPage.value = 1);
        const onFilter = () => (currentPage.value = 1);

        return {
            users,
            searchTerm,
            selectedStatus,
            filteredUsers,
            paginatedUsers,
            totalPages,
            getStatusClass,
            swalConfirm,
            viewBlog,
            editBlog,
            onSearch,
            onFilter,
            changePage,
            currentPage,
            loading,
            itemsPerPage,
            selectAll,
            selectedUsers,
            isAllSelected,
            deleteMultiple,
        };
    },
};
</script>

<style lang="css" scoped>
@import "sweetalert2/dist/sweetalert2.min.css";

.table-bordered {
    border: 1px solid #dee2e6;
}

.table-bordered th,
.table-bordered td {
    border: 1px solid #dee2e6;
}

.table-hover tbody tr:hover {
    background-color: #f1f1f1;
}

.table thead th {
    vertical-align: bottom;
    border-bottom: 2px solid #dee2e6;
}

.table th,
.table td {
    padding: 0.75rem;
    vertical-align: top;
}

.table-responsive {
    margin-top: 20px;
}

.table th {
    background-color: #007bff;
    color: white;
}

.table td {
    background-color: #f8f9fa;
}

.clickable-row {
    cursor: pointer;
}

.clickable-row:hover {
    background-color: #f8f9fa;
}

.btn-group .btn {
    margin-right: 5px;
}

.pagination .page-item.active .page-link {
    background-color: #007bff;
    border-color: #007bff;
}

.pagination .page-item .page-link {
    color: #007bff;
}

.pagination .page-item.disabled .page-link {
    color: #6c757d;
}

.bg-success-light {
    background-color: #d4edda !important;
    color: #155724 !important;
}

.bg-warning-light {
    background-color: #fff3cd !important;
    color: #856404 !important;
}

.bg-info-light {
    background-color: #d1ecf1 !important;
    color: #0c5460 !important;
}

.bg-secondary-light {
    background-color: #e2e3e5 !important;
    color: #383d41 !important;
}
</style>
