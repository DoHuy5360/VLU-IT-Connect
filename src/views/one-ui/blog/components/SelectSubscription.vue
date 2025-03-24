<template>
    <div class="">
        <BaseBlock :title="`Danh sách ${config.name}`" content-full>
            <Dataset v-slot="{ ds }" :ds-data="searchingListData.length == 0 ? originListData : searchingListData" :ds-sortby="sortBy" :ds-search-in="[]">
                <div class="row" :data-page-count="ds.dsPagecount">
                    <div id="datasetLength" class="col-md-1 py-2">
                        <DatasetShow />
                    </div>
                    <div class="col"></div>
                    <div class="col-md-4 py-2">
                        <!-- <DatasetSearch ds-search-placeholder="Tìm kiếm..." /> -->
                        <label hidden for="searchBlogInput">Tìm kiếm {{ config.name }}</label>
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
                                            <label hidden for="checkAll">Chọn tất cả</label>
                                            <input id="checkAll" type="checkbox" class="form-check-input" @click="selectAll($event)" />
                                        </th>
                                        <th scope="col">#</th>
                                        <th v-for="(th, index) in cols" :key="th.field" :class="['sort', th.sort]" @click="onSort($event, index)">
                                            <div class="d-flex gap-2" style="white-space: nowrap">{{ th.name }} <i class="gg-select float-end"></i></div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody v-if="(searchingListData.length == 0 ? originListData : searchingListData)?.length == 0">
                                    <tr>
                                        <td :colspan="cols.length+1" class="text-center">Không có dữ liệu</td>
                                    </tr>
                                </tbody>
                                <DatasetItem tag="tbody" class="fs-sm">
                                    <template #default="{ row, rowIndex }">
                                        <tr>
                                            <td class="text-center">
                                                <label hidden :for="`accountCheckbox-${rowIndex}`">{{ rowIndex }}</label>
                                                <input :id="`accountCheckbox-${rowIndex}`" type="checkbox" :value="row.Id" class="form-check-input" v-model="selectedSubscriptions" @click.stop />
                                            </td>
                                            <th scope="row">{{ rowIndex + 1 }}</th>
                                            <td>{{ row.Email }}</td>
                                            <td>{{ row.Notes }}</td>
                                            <td>{{ row.CreatedAt }}</td>
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
import { ref, computed, onMounted, reactive, watch } from "vue";
import Swal from "sweetalert2";
import { RouterLink, useRouter } from "vue-router";
import { Dataset, DatasetItem, DatasetInfo, DatasetPager, DatasetSearch, DatasetShow } from "vue-dataset";
import { useTemplateStore } from "@/stores/template";
import { authRequest } from '../../accountmanager/service/axiosConfig';

const config = reactive({
    name: "Đăng ký",
});

const data = defineModel()

const store = useTemplateStore();
const selectedSubscriptions = ref([]);

watch(()=>selectedSubscriptions.value.length, ()=>{
    console.log(1);
    data.value.subscriptionList = selectedSubscriptions.value
})

const originListData = ref([]);
const loading = ref(false);
const searchingListData = ref([]);

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
        searchingListData.value = [];
    } else {
        if (originListData.value.length != 0) {
            searchingListData.value = originListData.value.filter((data) => containsSubstring(searchValue, data.Email));
        }
    }
}
const selectAll = (event) => {
    if (event.target.checked) {
        selectedSubscriptions.value = (searchingListData.value.length === 0 ? originListData : searchingListData).value.map((user) => user.Id);
    } else {
        selectedSubscriptions.value = [];
    }
};

async function getSubscriptions(){
   const response = await authRequest.get("/Notification/subscriptions-by-category?categoryId=1085")
   originListData.value = response.data.$values
}

getSubscriptions()
onMounted(async () => {
    loading.value = true;
    try {
        // Fetch and set value here
    } catch (error) {
        console.log(error);
        store.alert({ title: "Không thành công", text: "Có lỗi đã xảy ra", icon: "error" });
    } finally {
        loading.value = false;
    }
});

// Helper variables
const cols = reactive([
    {
        name: "Email",
        field: "Email",
        sort: "",
    },
    {
        name: "Ghi chú",
        field: "Notes",
        sort: "",
    },
    {
        name: "Ngày đăng ký",
        field: "CreatedAt",
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