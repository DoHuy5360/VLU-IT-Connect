<template>
    <BasePageHeading title="Quản Lý Bài Viết" subtitle="">
        <template #extra>
            <button type="button" class="btn btn-success d-flex align-items-center" @click="navigateToCreate">
                <i class="fa fa-plus opacity-50 me-2"></i>
                Thêm bài viết mới
            </button>
        </template>
    </BasePageHeading>

    <div class="content">
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

        <div v-if="loading" class="text-center">
            <p>Đang tải dữ liệu...</p>
        </div>

        <div v-else>
            <BaseBlock title="Danh sách bài viết" class="shadow-sm rounded">
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
                                <th>Hiển thị</th>
                                <th>Bình luận</th>
                                <th class="text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(user, index) in paginatedUsers" :key="user.id">
                                <td class="text-center">
                                    <input type="checkbox" :value="user.id" v-model="selectedUsers" @click.stop />
                                </td>
                                <td class="text-center">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                                <td class="clickable-row" style="cursor: pointer;" @click="viewBlog(user.id)">{{ user.title }}</td>
                                <td>{{ user.author }}</td>
                                <td>
                                    <span :class="`badge bg-${user.state === 1 ? 'success' : 'warning'}`">
                                        {{ user.state === 1 ? "Yes" : "No" }}
                                    </span>
                                </td>
                                <td>
                                    <span :class="`badge bg-${isAllowComment(user.metadata) ? 'success' : 'warning'}`">
                                        {{ isAllowComment(user.metadata) ? "Yes" : "No" }}
                                    </span>
                                </td>
                                <td class="text-center">
                                    <div class="d-flex gap-2 justify-content-center">
                                        <button class="btn btn-sm btn-alt-warning" @click.stop="editBlog(user.id)">
                                            <i class="fa fa-fw fa-pencil-alt"></i>
                                        </button>
                                        <button type="button" class="btn btn-sm btn-danger" title="Xóa bài viết" @click="swalConfirm(user.id)">
                                            <i class="fa fa-fw fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
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
                            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                <button class="page-link" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Tiếp</button>
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
import { useRouter } from "vue-router";
import axios from "axios";

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
            metadata: post.metadata
        }));
    } catch (error) {
        console.error("Error fetching posts:", error);
    } finally {
        loading.value = false;
    }
});

const isAllowComment = (metadata) => {
    try {
        const metaObj = JSON.parse(metadata);
        console.log(metaObj.EnableComments);
        return metaObj.EnableComments
    } catch (error) {
        console.error("Error parsing metadata:", error);
        return false;
    }
};

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

const isAllSelected = computed(() => {
    return paginatedUsers.value.length > 0 && paginatedUsers.value.every((user) => selectedUsers.value.includes(user.id));
});

const selectAll = (event) => {
    selectedUsers.value = event.target.checked ? paginatedUsers.value.map((user) => user.id) : [];
};

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

const onSearch = () => (currentPage.value = 1);
const onFilter = () => (currentPage.value = 1);

const navigateToCreate = () => router.push('/administrator/blog/create');

const viewBlog = (id) => {
    router.push({ name: "AdminBlogViewDetail", params: { id: String(id) } });
};

const editBlog = (id) => router.push({ name: "AdminBlogEdit", params: { id: String(id) } });

const swalConfirm = async (id) => {
    const confirmation = await Swal.fire({
        title: "Bạn có chắc chắn?",
        text: "Hành động này không thể hoàn tác.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đồng ý xóa!",
        cancelButtonText: "Hủy"
    });

    if (confirmation.isConfirmed) {
        try {
            loading.value = true;
            const token = localStorage.getItem("authToken");
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
};
</script>

<style lang="css" scoped>
/* Your styles here */
</style>