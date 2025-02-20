<template>
    <!-- <div class="row mb-3">
        <div class="col-3">
        </div>
    </div> -->
    <BaseBlock title="THỐNG KÊ SỐ LƯỢNG BÀI VIẾT THEO THỂ LOẠI" class="flex-grow-1 d-flex flex-column">
        <template #options>
            <div class="row justify-content-end">
                <div class="col-4 d-flex gap-2 align-items-center">
                    <label for="">Từ</label>
                    <FlatPickr id="example-flatpickr-default" class="form-control" placeholder="D-M-Y" v-model="fromDate.selectedDate" :config="fromDate.config" />
                </div>
                <div class="col-4 d-flex gap-2 align-items-center">
                    <label for="">Đến</label>
                    <FlatPickr id="example-flatpickr-default" class="form-control" placeholder="D-M-Y" v-model="toDate.selectedDate" :config="toDate.config" />
                </div>
            </div>
        </template>
        <template #content>
            <div class="block-content block-content-full flex-grow-1 d-flex items-center">
                <Bar ref="chartRef" :data="earningsData" :options="totalEarningsOptions" :plugins="plugins" class="w-100" />
            </div>
        </template>
    </BaseBlock>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import { Bar } from "vue-chartjs";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { guestRequest } from "../../accountmanager/service/axiosConfig";
import FlatPickr from "vue-flatpickr-component";

function getDateTwoMonthsBefore() {
    // Lấy ra ngày hiện tại
    const currentDate = new Date();

    // Tính toán ngày cách ngày hiện tại 2 tháng
    const targetDate = new Date(currentDate);
    targetDate.setMonth(currentDate.getMonth() - 2);

    // Format lại ngày theo định dạng 'dd-mm-yyyy'
    const formattedDate = String(targetDate.getDate()).padStart(2, "0") + "-" + String(targetDate.getMonth() + 1).padStart(2, "0") + "-" + targetDate.getFullYear();

    return formattedDate;
}

// Flatpickr variables
const fromDate = reactive({
    selectedDate: null,
    config: { dateFormat: "d-m-Y", minDate: getDateTwoMonthsBefore(), maxDate: "today" },
});
const toDate = reactive({
    selectedDate: null,
    config: { dateFormat: "d-m-Y", minDate: getDateTwoMonthsBefore(), maxDate: "today" },
});

// Tuỳ chọn biểu đồ
const totalEarningsOptions = {
    maintainAspectRatio: false,
    tension: 0.4,
    indexAxis: "y",
    scales: {
        x: { display: true },
        y: { display: true },
    },
    plugins: {
        legend: { display: true },
        datalabels: {
            anchor: "end",
            align: "left",
            color: "#fff",
            font: { weight: "bold", size: 12 },
            formatter: (value) => `$${value}`,
        },
    },
};

// Đăng ký plugin
const plugins = [ChartDataLabels];

// Tham chiếu đến biểu đồ
const chartRef = ref(null);

// Dữ liệu biểu đồ (CẦN `ref()`, KHÔNG `reactive()`)
const earningsData = ref({
    labels: [],
    datasets: [],
});

// Hàm cập nhật dữ liệu
const updateChartData = (labels, values) => {
    // Kiểm tra dữ liệu hợp lệ
    if (!labels.length || !values.length) {
        console.warn("Dữ liệu trống!");
        return;
    }

    // Cập nhật toàn bộ object (Không dùng `.push()`)
    earningsData.value = {
        labels: [...labels],
        datasets: [
            {
                label: "Tổng số bài viết được tạo",
                fill: true,
                backgroundColor: "rgba(100, 116, 139, .7)",
                borderColor: "transparent",
                data: [...values],
                barThickness: 20,
            },
            {
                label: "Tổng số bài viết được công bố",
                fill: true,
                backgroundColor: "rgba(100, 116, 139, .7)",
                borderColor: "transparent",
                data: [...values],
                barThickness: 20,
            },
        ],
    };

    // Đảm bảo biểu đồ cập nhật lại
    if (chartRef.value?.chart) {
        chartRef.value.chart.update();
    } else {
        console.warn("chartRef chưa sẵn sàng!");
    }
};

// Trích xuất dữ liệu từ API
const spreadCategory = (categoryJsonTree, labels, values) => {
    for (const category of categoryJsonTree) {
        labels.push(category.Name);
        values.push(category.AmountOfPosts);

        if (category.Children?.values?.$values?.length) {
            spreadCategory(category.Children.values.$values, labels, values);
        }
    }
};

// Gọi API và cập nhật dữ liệu
const getCategories = async () => {
    try {
        const response = await guestRequest.get("/posts/getallcategories");

        const labels = [];
        const values = [];
        spreadCategory(response.data.data.categories.values.$values, labels, values);

        updateChartData(labels, values);
    } catch (error) {
        console.error("Lỗi API:", error.response?.data || error.message);
    }
};

// Gọi API khi component được mount
onMounted(getCategories);
</script>
