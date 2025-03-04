<template>
  <BasePageHeading title="Báo Cáo Chuyển Hướng URL" subtitle="">
    <template #extra>
      <button
        type="button"
        class="btn btn-success d-flex align-items-center"
        @click="exportReport"
      >
        <i class="fa fa-file-excel opacity-50 me-2"></i>
        Xuất kết quả
      </button>
    </template>
  </BasePageHeading>

  <div class="content">
    <BaseBlock title="Danh sách chuyển hướng URL" content-full>
      <Dataset
        v-slot="{ ds }"
        :ds-data="searchingPosts.length == 0 ? posts : searchingPosts"
        :ds-sortby="sortBy"
        :ds-search-in="[]"
      >
        <div class="row" :data-page-count="ds.dsPagecount">
          <div id="datasetLength" class="col-md-2 py-2">
            <DatasetShow />
          </div>
          <div class="col-3 d-flex gap-2 align-items-center">
            <label for="">Từ</label>
            <FlatPickr
              id="example-flatpickr-default"
              class="form-control"
              placeholder="D-M-Y"
              v-model="fromDate.selectedDate"
              :config="fromDate.config"
            />
          </div>
          <div class="col-3 d-flex gap-2 align-items-center">
            <label for="">Đến</label>
            <FlatPickr
              id="example-flatpickr-default"
              class="form-control"
              placeholder="D-M-Y"
              v-model="toDate.selectedDate"
              :config="toDate.config"
            />
          </div>
          <div class="col-md-4 py-2">
            <label hidden for="searchBlogInput">Tìm kiếm URL</label>
            <input
              id="searchBlogInput"
              type="text"
              @input="search"
              class="form-control"
              placeholder="Tìm kiếm..."
            />
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
                    <th
                      v-for="(th, index) in cols"
                      :key="th.field"
                      :class="['sort', th.sort]"
                      @click="onSort($event, index)"
                    >
                      <div class="d-flex gap-2" style="white-space: nowrap">
                        {{ th.name }} <i class="gg-select float-end"></i>
                      </div>
                    </th>
                  </tr>
                </thead>
                <DatasetItem tag="tbody" class="fs-sm">
                  <template #default="{ row, rowIndex }">
                    <tr>
                      <th scope="row">{{ row.STT }}</th>
                      <td class="truncate-cell">
                        <div class="truncate-text" :title="row.FromUrl">
                          {{ row.FromUrl }}
                        </div>
                      </td>
                      <td class="truncate-cell">
                        <div class="truncate-text" :title="row.ToUrl">
                          {{ row.ToUrl }}
                        </div>
                      </td>
                      <td>{{ row.HitCount }}</td>
                      <td>{{ formatDate(row.CreatedAt) }}</td>
                      <td>{{ formatDate(row.LastAccessed) }}</td>
                    </tr>
                  </template>
                </DatasetItem>
              </table>
            </div>
          </div>
        </div>
        <div
          class="d-flex flex-md-row flex-column justify-content-between align-items-center"
        >
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
import {
  Dataset,
  DatasetItem,
  DatasetInfo,
  DatasetPager,
  DatasetSearch,
  DatasetShow,
} from "vue-dataset";
import { authRequest } from "../../accountmanager/service/axiosConfig";
import { useTemplateStore } from "@/stores/template";
import FlatPickr from "vue-flatpickr-component";

const store = useTemplateStore();
const posts = ref([]);
const loading = ref(true);
const searchingPosts = ref([]);

async function getRedirects() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    console.error("Không tìm thấy token xác thực");
    store.alert({
      title: "Lỗi xác thực",
      text: "Vui lòng đăng nhập lại để tiếp tục",
      icon: "error",
    });
    return;
  }

  try {
    loading.value = true;
    const response = await fetch(
      "https://localhost:7017/api/Report/redirects",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Lỗi API: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.success && data.data && Array.isArray(data.data.$values)) {
      posts.value = data.data.$values;
      console.log("Dữ liệu từ API:", posts.value);
    } else {
      console.error("Dữ liệu không đúng định dạng mong đợi");
    }
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

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function exportReport() {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Không tìm thấy token xác thực");
      store.alert({
        title: "Lỗi xác thực",
        text: "Vui lòng đăng nhập lại để tiếp tục",
        icon: "error",
      });
      return;
    }
    const response = await fetch(
      "https://localhost:7017/api/ExportExcel/redirects",
      {
        method: "GET",
        headers: {
          Accept:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          Authorization: token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Lỗi API: ${response.status}`);
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "BaoCaoChuyenHuong.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
      searchingPosts.value = posts.value.filter(
        (post) =>
          containsSubstring(searchValue, post.FromUrl) ||
          containsSubstring(searchValue, post.ToUrl)
      );
    }
  }
}

const fromDate = reactive({
  selectedDate: null,
  config: { dateFormat: "d-m-Y", maxDate: "today" },
});
const toDate = reactive({
  selectedDate: null,
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
    name: "URL Gốc",
    field: "FromUrl",
    sort: "",
  },
  {
    name: "URL Đích",
    field: "ToUrl",
    sort: "",
  },
  {
    name: "Số lượt truy cập",
    field: "HitCount",
    sort: "",
  },
  {
    name: "Ngày tạo",
    field: "CreatedAt",
    sort: "",
  },
  {
    name: "Lần truy cập cuối",
    field: "LastAccessed",
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
.hover_underline:hover {
  text-decoration: underline;
}

.truncate-cell {
  max-width: 300px;
  position: relative;
}

.truncate-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.truncate-text:hover {
  white-space: normal;
  overflow: visible;
  position: relative;
  z-index: 1;
  background-color: #f8f9fa;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 5px;
  transition: all 0.3s ease;
}
</style>
