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
        <BaseBlock title="Danh sách bài viết" content-full>
            <Dataset v-slot="{ ds }" :ds-data="posts" :ds-sortby="sortBy" :ds-search-in="['title', 'author']">
                <div class="row" :data-page-count="ds.dsPagecount">
                    <div id="datasetLength" class="col-md-8 py-2">
                        <DatasetShow />
                    </div>
                    <div class="col-md-4 py-2">
                        <DatasetSearch ds-search-placeholder="Search..." />
                    </div>
                </div>
                <hr />
                <div class="row">
                    <div class="col-md-12">
                        <div class="table-responsive">
                            <table class="table table-striped mb-0">
                                <thead>
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th v-for="(th, index) in cols" :key="th.field" :class="['sort', th.sort]" @click="onSort($event, index)">{{ th.name }} <i class="gg-select float-end"></i></th>
                                    </tr>
                                </thead>
                                <DatasetItem tag="tbody" class="fs-sm">
                                    <template #default="{ row, rowIndex }">
                                        <tr>
                                            <th scope="row">{{ rowIndex + 1 }}</th>
                                            <td style="min-width: 150px">
                                                <RouterLink :to="`/administrator/blog/viewdetail/${row.id}`" class="hover_underline text-black" style="cursor: pointer">{{
                                                    truncateText(row.title, 50)
                                                }}</RouterLink>
                                            </td>
                                            <td>{{ row.author }}</td>
                                            <td style="min-width: 150px">{{ row.isPublished ? "Có" : "Không" }}</td>
                                            <td style="min-width: 150px">{{ isAllowComment(row.metadata) ? "Có" : "Không" }}</td>
                                            <td style="min-width: 150px">
                                                <div class="d-flex gap-2 justify-content-center">
                                                    <RouterLink :to="`/administrator/blog/edit/${row.id}`" class="btn btn-sm btn-alt-warning">
                                                        <i class="fa fa-fw fa-pencil-alt"></i>
                                                    </RouterLink>
                                                    <button type="button" class="btn btn-sm btn-danger" title="Xóa bài viết" @click="swalConfirm(row.id)">
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
import axios from "axios";
import { Dataset, DatasetItem, DatasetInfo, DatasetPager, DatasetSearch, DatasetShow } from "vue-dataset";
import authRequest from "../accountmanager/service/axiosConfig";

const router = useRouter();
const posts = ref([]);
const loading = ref(true);

const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

onMounted(async () => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await authRequest.get("/admin/posts?PageNumber=1&PageSize=99999");
        posts.value = response.data.data.$values.map((post) => ({
            id: post.id,
            author: post.author,
            slug: post.slug,
            title: post.title,
            isPublished: post.published,
            publishDate: post.publishedAt,
            metadata: post.metadata,
        }));
    } catch (error) {
        switch (error.code) {
            case "ERR_NETWORK":
                handleLogout();
                break;
            default:
                console.error("Error fetching posts:", error);
                break;
        }
    } finally {
        loading.value = false;
    }
});

function handleLogout() {
    localStorage.removeItem("authToken"); // Xóa token khỏi localStorage
    router.push("/auth/signin?msg=timeout"); // Chuyển hướng về trang đăng nhập
}

const isAllowComment = (metadata) => {
    try {
        const metaObj = JSON.parse(metadata);
        return metaObj.EnableComments;
    } catch (error) {
        console.error("Error parsing metadata:", error);
        return false;
    }
};

const navigateToCreate = () => router.push("/administrator/blog/create");

const swalConfirm = async (id) => {
    const confirmation = await Swal.fire({
        title: "Bạn có chắc chắn?",
        text: "Hành động này không thể hoàn tác.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đồng ý xóa!",
        cancelButtonText: "Hủy",
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
            posts.value = posts.value.filter((user) => user.id !== id);
            Swal.fire("Đã xóa!", `Bài viết với ID: ${id} đã được xóa.`, "success");
        } catch (error) {
            Swal.fire("Lỗi", "Xóa bài viết thất bại. Vui lòng thử lại.", "error");
            console.error("Error deleting post:", error);
        } finally {
            loading.value = false;
        }
    }
};
// Helper variables
const cols = reactive([
    {
        name: "Tiêu đề",
        field: "title",
        sort: "",
    },
    {
        name: "Tác giả",
        field: "author",
        sort: "",
    },
    {
        name: "Hiển thị",
        field: "visible",
        sort: "",
    },
    {
        name: "Bình luận",
        field: "comment",
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
