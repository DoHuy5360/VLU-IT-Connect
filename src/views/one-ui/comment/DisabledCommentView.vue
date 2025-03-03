<template>
    <BasePageHeading title="Quản Lý Bình Luận Bị Xóa" subtitle="">
        <template #extra>
            <!-- <button type="button" class="btn btn-success d-flex align-items-center" @click="">
                <i class="fa fa-plus opacity-50 me-2"></i>
                Thêm bình luận mới
            </button> -->
        </template>
    </BasePageHeading>

    <div class="content">
        <BaseBlock title="Danh sách bình luận" content-full>
            <Dataset v-slot="{ ds }" :ds-data="searchingPosts.length == 0 ? comments : searchingPosts" :ds-sortby="sortBy" :ds-search-in="[]">
                <div class="row" :data-page-count="ds.dsPagecount">
                    <div id="datasetLength" class="col-md-8 py-2">
                        <DatasetShow />
                    </div>
                    <div class="col-md-4 py-2">
                        <!-- <DatasetSearch ds-search-placeholder="Tìm kiếm..." /> -->
                        <label hidden for="searchBlogInput">Tìm kiếm bình luận</label>
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
                                            <td>{{ store.truncateText(row.Content, 200) }}</td>
                                            <td>{{ row.LikeCount }}</td>
                                            <td>{{ store.formatDateTime(row.CreatedAt) }}</td>
                                            <td>{{ store.truncateText(row.ReplyToContent) }}</td>
                                            <td>{{ row.Approved ? "Có" : "Không" }}</td>
                                            <td style="">
                                                <RouterLink :to="`/administrator/blog/viewdetail/${row.PostId}`" class="btn btn-sm btn-danger" target="_blank" title="Đi đến bài viết">
                                                    <i class="fa fa-fw fa-share"></i>
                                                </RouterLink>
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
import { authRequest } from "../accountmanager/service/axiosConfig";
import { Dataset, DatasetItem, DatasetInfo, DatasetPager, DatasetSearch, DatasetShow } from "vue-dataset";
import Swal from "sweetalert2";
import { useTemplateStore } from "@/stores/template";

const store = useTemplateStore();

const comments = ref([]);
const searchingPosts = ref([]);

async function getComments() {
    const response = await authRequest(`/admin/comment/disabled`);
    comments.value = response.data.$values;
}
getComments();

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
        if (comments.value.length != 0) {
            searchingPosts.value = comments.value.filter((post) => containsSubstring(searchValue, post.Content));
        }
    }
}

// Helper variables
const cols = reactive([
    {
        name: "Nội dung",
        field: "Content",
        sort: "",
    },
    {
        name: "Lượt thích",
        field: "LikeCount",
        sort: "",
    },
    {
        name: "Ngày tạo",
        field: "CreatedAt",
        sort: "",
    },
    {
        name: "Phản hồi cho",
        field: "ReplyToContent",
        sort: "",
    },
    {
        name: "Đã duyệt",
        field: "Approved",
        sort: "",
    },
    {
        name: "Bài viết",
        field: "Blog",
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
