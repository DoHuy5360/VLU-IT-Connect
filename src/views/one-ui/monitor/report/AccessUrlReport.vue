<template>
    <BasePageHeading title="Báo Cáo Chuyển Hướng URL" subtitle="">
        <template #extra>
            <button type="button" class="btn btn-success d-flex align-items-center" @click="exportReport">
                <i class="fa fa-file-excel opacity-50 me-2"></i>
                Xuất kết quả
            </button>
        </template>
    </BasePageHeading>

    <div class="content">
        <BaseBlock title="Danh sách chuyển hướng URL" content-full>
            <Dataset v-slot="{ ds }" :ds-data="searchingPosts.length == 0 ? posts : searchingPosts" :ds-sortby="sortBy" :ds-search-in="[]">
                <div class="row" :data-page-count="ds.dsPagecount">
                    <div id="datasetLength" class="col-md-2 py-2">
                        <DatasetShow />
                    </div>
                    <div class="col-3 d-flex gap-2 align-items-center">
                        <label for="">Từ</label>
                        <FlatPickr id="example-flatpickr-default" class="form-control" placeholder="D-M-Y" v-model="fromDate.selectedDate" :config="fromDate.config" @change="getRedirects" />
                    </div>
                    <div class="col-3 d-flex gap-2 align-items-center">
                        <label for="">Đến</label>
                        <FlatPickr id="example-flatpickr-default" class="form-control" placeholder="D-M-Y" v-model="toDate.selectedDate" :config="toDate.config" @change="getRedirects" />
                    </div>
                    <div class="col-md-4 py-2">
                        <label hidden for="searchBlogInput">Tìm kiếm URL</label>
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
                                <tbody v-if="posts.length == 0">
                                    <tr>
                                        <td colspan="4" class="text-center">Không có dữ liệu</td>
                                    </tr>
                                </tbody>
                                <DatasetItem v-else tag="tbody" class="fs-sm">
                                    <template #default="{ row, rowIndex }">
                                        <tr>
                                            <th scope="row">{{ rowIndex + 1 }}</th>
                                            <td class="truncate-cell">
                                                <div class="truncate-text" :title="row.ToUrl">
                                                    {{ row.Url }}
                                                </div>
                                            </td>
                                            <td>{{ row.HitCount }}</td>
                                            <td>{{ store.formatDateTime(row.LastAccess) }}</td>
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
import { Dataset, DatasetItem, DatasetInfo, DatasetPager, DatasetSearch, DatasetShow } from "vue-dataset";
import { authRequest } from "../../accountmanager/service/axiosConfig";
import { useTemplateStore } from "@/stores/template";
import FlatPickr from "vue-flatpickr-component";

const store = useTemplateStore();
const posts = ref([]);
const loading = ref(true);
const searchingPosts = ref([]);

const { day, month, year } = store.getCurrentDateObject();

function getTimeParams() {
    return {
        fromDate: store.YYYYmmddFormat(fromDate.selectedDate),
        toDate: store.YYYYmmddFormat(toDate.selectedDate),
    };
}

async function getRedirects() {
    try {
        loading.value = true;
        const response = await authRequest.get("/Report/redirects", { params: getTimeParams() });

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

async function exportReport() {
    try {
        const response = await authRequest.get("/ExportExcel/redirects", {
            params: getTimeParams(),
            headers: {
                Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
            responseType: "blob",
        });

        const fileName = (fromDate.selectedDate==null || toDate.selectedDate==null ? `${day}-${month}-${year}` : `${fromDate.selectedDate}_${toDate.selectedDate}`) + "-IT-Connect-Báo_cáo_tần_suất_truy_cập_URL.xlsx"

        store.downloadFile(response.data, fileName);
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
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
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
            searchingPosts.value = posts.value.filter((post) => containsSubstring(searchValue, post.Url) || containsSubstring(searchValue, post.HitCount));
        }
    }
}

const fromDate = reactive({
    selectedDate: null,
    config: { dateFormat: "d-m-Y", maxDate: "today" },
});
const toDate = reactive({
    selectedDate: `${day}-${month}-${year}`,
    config: { dateFormat: "d-m-Y", maxDate: "today" },
});

onMounted(() => {
    getRedirects();

    document.querySelectorAll("#datasetLength label").forEach((el) => {
        el.remove();
    });

    let selectLength = document.querySelector("#datasetLength select");

    if (selectLength) {
        selectLength.classList = "";
        selectLength.classList.add("form-select");
        selectLength.style.width = "80px";
    }
});

const cols = reactive([
    {
        name: "URL",
        field: "Url",
        sort: "",
    },
    {
        name: "Số lượt truy cập",
        field: "HitCount",
        sort: "",
    },
    {
        name: "Lần cuối truy cập",
        field: "LastAccess",
        sort: "",
    },
]);

const sortBy = computed(() => {
    return cols.reduce((acc, o) => {
        if (o.sort) {
            o.sort === "asc" ? acc.push(o.field) : acc.push("-" + o.field);
        }
        return acc;
    }, []);
});

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
}
th.sort.asc .gg-select::before {
    opacity: 1;
}
th.sort.desc .gg-select::after {
    opacity: 1;
}
</style>
