<template>
    <BasePageHeading title="Báo Cáo Chi Tiết Bài Viết" subtitle="">
        <!-- <template #extra>
            <button type="button" class="btn btn-success d-flex align-items-center" @click="navigateToCreate">
                <i class="fa fa-plus opacity-50 me-2"></i>
                Thêm bài viết mới
            </button>
        </template> -->
        <template #extra>
            <button type="button" class="btn btn-success d-flex align-items-center" @click="exportReport">
                <i class="fa fa-file-excel opacity-50 me-2"></i>
                Xuất kết quả
            </button>
        </template>
    </BasePageHeading>

    <div class="content">
        <BaseBlock title="Danh sách bài viết" content-full>
            <Dataset v-slot="{ ds }" :ds-data="searchingPosts.length == 0 ? posts : searchingPosts" :ds-sortby="sortBy" :ds-search-in="[]">
                <div class="row" :data-page-count="ds.dsPagecount">
                    <div id="datasetLength" class="col-md-2 py-2">
                        <DatasetShow />
                    </div>
                    <div class="col-3 d-flex gap-2 align-items-center">
                        <label for="">Từ</label>
                        <FlatPickr id="example-flatpickr-default" class="form-control" placeholder="D-M-Y" v-model="fromDate.selectedDate" :config="fromDate.config" />
                    </div>
                    <div class="col-3 d-flex gap-2 align-items-center">
                        <label for="">Đến</label>
                        <FlatPickr id="example-flatpickr-default" class="form-control" placeholder="D-M-Y" v-model="toDate.selectedDate" :config="toDate.config" />
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
                                        <th scope="col">STT</th>
                                        <th v-for="(th, index) in cols" :key="th.field" :class="['sort', th.sort]" @click="onSort($event, index)">
                                            <div class="d-flex gap-2" style="white-space: nowrap">{{ th.name }} <i class="gg-select float-end"></i></div>
                                        </th>
                                    </tr>
                                </thead>
                                <DatasetItem tag="tbody" class="fs-sm">
                                    <template #default="{ row, rowIndex }">
                                        <tr>
                                            <th scope="row">{{ row.STT }}</th>
                                            <td class="">
                                                <div class="" :title="row.Title">
                                                    {{ row.Title }}
                                                </div>
                                            </td>
                                            <td>{{ row.TotalViewCount }}</td>
                                            <td>{{ row.TotalCommentCount }}</td>
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
import { authRequest } from "../../accountmanager/service/axiosConfig";
import { useTemplateStore } from "@/stores/template";
import FlatPickr from "vue-flatpickr-component";

const store = useTemplateStore();
const posts = ref([]);
const loading = ref(true);
const searchingPosts = ref([]);
const datas = ref(null);

async function getrepsost() {
    try {
        loading.value = true;
        const response = await authRequest.get("/Report/combined-statistics");

        posts.value = response.data.data.$values;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        store.alert({
            title: "Lỗi",
            text: "Không thể tải dữ liệu báo cáo. Vui lòng thử lại sau.",
            icon: "error",
        });
    } finally {
        loading.value = false;
    }
}

// Gọi API khi component được mount
onMounted(() => {
    getrepsost();
});

// xử lý xuất kết quả
async function exportReport() {
    try {
        const response = await authRequest.get("/ExportExcel/most-viewed-posts", {
            headers: {
                Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
            responseType: 'blob'
        });

        store.downloadFile(response.data)
    } catch (error) {
        console.error("Lỗi khi xuất báo cáo:", error);
        store.alert({
            title: "Lỗi xuất báo cáo",
            text: "Không thể xuất báo cáo. Vui lòng thử lại sau.",
            icon: "error",
        });
    }
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
            searchingPosts.value = posts.value.filter((post) => containsSubstring(searchValue, post.Title));
        }
    }
}

// Flatpickr variables
const fromDate = reactive({
    selectedDate: null,
    config: { dateFormat: "d-m-Y", maxDate: "today" },
});
const toDate = reactive({
    selectedDate: null,
    config: { dateFormat: "d-m-Y", maxDate: "today" },
});

// Helper variables
const cols = reactive([
    {
        name: "Tiêu đề",
        field: "Title",
        sort: "",
    },
    {
        name: "Tổng số lượt truy cập",
        field: "TotalViewCount",
        sort: "",
    },
    {
        name: "Tổng số bình luận",
        field: "TotalCommentCount",
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
    transform: scale(var(--ggs, 1));
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

.gg-select::after {
    border-bottom: 2px solid;
    border-left: 2px solid;
    bottom: 4px;
}

.gg-select::before {
    border-top: 2px solid;
    border-right: 2px solid;
    top: 4px;
}

.hover_underline:hover {
    text-decoration: underline;
}

.sort {
    cursor: pointer;
}

.sort.asc .gg-select::after {
    opacity: 1;
}

.sort.asc .gg-select::before {
    opacity: 0.3;
}

.sort.desc .gg-select::after {
    opacity: 0.3;
}

.sort.desc .gg-select::before {
    opacity: 1;
}
</style>
