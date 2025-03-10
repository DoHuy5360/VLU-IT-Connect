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
            <Dataset v-slot="{ ds }" :ds-data="searchingPosts.length == 0 ? posts : searchingPosts" :ds-sortby="sortBy" :ds-search-in="['title', 'author', 'category', 'publishDate', 'createdAt']">
                <div class="row" :data-page-count="ds.dsPagecount">
                    <div id="datasetLength" class="col-md-8 py-2">
                        <DatasetShow />
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
                                        <th scope="col">#</th>
                                        <th v-for="(th, index) in cols" :key="th.field" :class="['sort', th.sort]" @click="onSort($event, index)">
                                            <div class="d-flex gap-2" style="white-space: nowrap">{{ th.name }} <i class="gg-select float-end"></i></div>
                                        </th>
                                    </tr>
                                </thead>
                                <DatasetItem tag="tbody" class="fs-sm">
                                    <template #default="{ row, rowIndex }">
                                        <tr>
                                            <th scope="row">{{ rowIndex + 1 }}</th>
                                            <td style="">
                                                <RouterLink :to="`/administrator/blog/viewdetail/${row.id}`" class="hover_underline text-black" style="cursor: pointer">{{
                                                    store.truncateText(row.title, 50)
                                                }}</RouterLink>
                                            </td>
                                            <td>{{ row.category }}</td>
                                            <td>{{ row.publishDate }}</td>
                                            <td>{{ row.createdAt }}</td>
                                            <td>{{ row.author }}</td>
                                            <td style="">{{ row.isPublished ? "Có" : "Không" }}</td>
                                            <td style="">{{ row.AllowComment ? "Có" : "Không" }}</td>
                                            <td style="">{{ row.CommentCensorship ? "Có" : "Không" }}</td>
                                            <td style="">
                                                <div class="d-flex gap-2 justify-content-center">
                                                    <RouterLink :to="`/administrator/blog/edit/${row.id}`" class="btn btn-sm btn-alt-warning">
                                                        <i class="fa fa-fw fa-pencil-alt"></i>
                                                    </RouterLink>
                                                    <button type="button" class="btn btn-sm btn-danger" title="Xóa bài viết" @click="swalConfirm(row.id)">
                                                        <i class="fa fa-fw fa-trash"></i>
                                                    </button>
                                                    <button type="button" class="btn btn-sm btn-success" title="Gửi thông báo" @click="showSendingNotifyWindow(true)">
                                                        <i class="fa fa-fw fa-share"></i>
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
    <div v-if="isShowingNotifyWindow" class="position-fixed w-100 h-100 bg-white d-flex flex-column" style="top: 0; left: 0; z-index: 1040">
        <div class="p-3 bg-white d-flex justify-content-between align-items-center" style="user-select: none;">
            <strong class="fs-4">Gửi thông báo</strong>
            <div class="btn btn-sm btn-danger" @click="showSendingNotifyWindow(false)">
                <i class="fa fa-fw fa-close"></i>
            </div>
        </div>
        <SendNotifyWindow/>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import Swal from "sweetalert2";
import { RouterLink, useRouter } from "vue-router";
import { Dataset, DatasetItem, DatasetInfo, DatasetPager, DatasetSearch, DatasetShow } from "vue-dataset";
import { authRequest } from "../accountmanager/service/axiosConfig";
import { useTemplateStore } from "../../../stores/template";
import SendNotifyWindow from "./components/SendNotifyWindow.vue";

const store = useTemplateStore();

const router = useRouter();
const posts = ref([]);
const loading = ref(true);
const searchingPosts = ref([]);

const isShowingNotifyWindow = ref(true);

function showSendingNotifyWindow(state) {
    isShowingNotifyWindow.value = state;
    window.document.body.style.overflowY = state ? "hidden" : "scroll";
}

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
        searchingPosts.value = [];
    } else {
        if (posts.value.length != 0) {
            searchingPosts.value = posts.value.filter((post) => containsSubstring(searchValue, post.title));
        }
    }
}

onMounted(async () => {
    try {
        const response = await authRequest.get("/admin/posts?PageNumber=1&PageSize=99999");
        posts.value = response.data.data.$values.map((post) => ({
            id: post.id,
            author: post.author,
            slug: post.slug,
            title: post.title,
            isPublished: post.published,
            publishDate: store.formatDate(post.publishedAt),
            createdAt: store.formatDate(post.createdAt),
            metadata: post.metadata,
            category: post.categoryName,
            AllowComment: post.AllowComment,
            CommentCensorship: post.CommentCensorship,
        }));
    } catch (error) {
        switch (error.code) {
            case "ERR_NETWORK":
                // handleLogout();
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
            await authRequest.delete(`/admin/posts/${id}`);
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
        name: "Thể loại",
        field: "category",
        sort: "",
    },
    {
        name: "Ngày đăng",
        field: "publishDate",
        sort: "",
    },
    {
        name: "Ngày tạo",
        field: "createdAt",
        sort: "",
    },
    {
        name: "Tác giả",
        field: "author",
        sort: "",
    },
    {
        name: "Hiển thị",
        field: "isPublished",
        sort: "",
    },
    {
        name: "Bình luận",
        field: "AllowComment",
        sort: "",
    },
    {
        name: "Kiểm duyệt",
        field: "CommentCensorship",
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
