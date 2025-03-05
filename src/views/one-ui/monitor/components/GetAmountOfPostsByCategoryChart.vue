<template>
    <BaseBlock title="THỐNG KÊ SỐ LƯỢNG BÀI VIẾT THEO THỂ LOẠI" class="flex-grow-1 d-flex flex-column">
        <template #options>
            <div class="row justify-content-end">
                <div class="col-4 d-flex gap-2 align-items-center">
                    <label for="from-date">Từ</label>
                    <FlatPickr id="from-date" class="form-control" placeholder="D-M-Y" v-model="fromDate.selectedDate" :config="fromDate.config" @on-change="fetchData" />
                </div>
                <div class="col-4 d-flex gap-2 align-items-center">
                    <label for="to-date">Đến</label>
                    <FlatPickr id="to-date" class="form-control" placeholder="D-M-Y" v-model="toDate.selectedDate" :config="toDate.config" @on-change="fetchData" />
                </div>
            </div>
        </template>

        <template #content>
            <div class="block-content-full flex-grow-1 d-flex items-center">
                <Bar v-if="chartData.labels.length != 0" ref="chartRef" :data="chartData" :options="chartOptions" :plugins="plugins" class="w-100" />
                <div v-else class="w-100 text-center py-5">
                    Không có dữ liệu thống kê từ <strong>{{ fromDate.selectedDate }}</strong> đến <strong>{{ toDate.selectedDate }}</strong>
                </div>
            </div>
        </template>
    </BaseBlock>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "vue-chartjs";
import ChartDataLabels from "chartjs-plugin-datalabels";
import FlatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import BaseBlock from "@/components/BaseBlock.vue";
import axios from "axios";
import { authRequest } from "../../accountmanager/service/axiosConfig";
import { useTemplateStore } from "../../../../stores/template";

const store = useTemplateStore()

// Đăng ký Chart.js plugins
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const chartRef = ref(null);
const plugins = [ChartDataLabels];

const chartData = ref({
    labels: [],
    datasets: [
        {
            label: "Tổng số bài viết được tạo",
            backgroundColor: "#6c757d",
            data: [],
            barThickness: 20,
        },
        {
            label: "Tổng số bài viết được công bố",
            backgroundColor: "#0d6efd",
            data: [],
            barThickness: 20,
        },
    ],
});

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    scales: {
        x: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
        },
        y: { grid: { display: false } },
    },
    plugins: {
        legend: { position: "top", align: "start" },
        datalabels: {
            color: "#fff",
            font: { weight: "bold" },
            formatter: (value) => `${value}`,
        },
    },
};

// Hàm lấy ngày trước 2 tháng
function getDateTwoMonthsBefore() {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 2);
    return currentDate.toISOString().split("T")[0];
}

const { day, month, year } = store.getCurrentDateObject();

// Cấu hình date picker
const fromDate = reactive({
    selectedDate: `01-${month}-${year}`,
    config: {
        dateFormat: "d-m-Y",
        maxDate: "today",
        enableTime: false,
        time_24hr: true,
    },
});

const toDate = reactive({
    selectedDate: `${day}-${month}-${year}`,
    config: {
        dateFormat: "d-m-Y",
        // minDate: `01-${month}-${year}`,
        maxDate: "today",
        enableTime: false,
        time_24hr: true,
    },
});

// Hàm fetch dữ liệu từ API với token
const fetchData = async () => {
    try {
        const params = {
            fromDate: store.YYYYmmddFormat(fromDate.selectedDate),
            toDate: store.YYYYmmddFormat(toDate.selectedDate),
        };

        // Log params để debug
        //console.log("Params gửi đi:", params);

        const response = await authRequest.get("/Dashboard/category-statistics", {
            params,
        });

        if (response.data?.Categories?.$values && response.data?.TotalPostsArray?.$values && response.data?.TotalPublishPostsArray?.$values) {
            chartData.value = {
                labels: response.data.Categories.$values,
                datasets: [
                    {
                        label: "Tổng số bài viết được tạo",
                        backgroundColor: "#ff756b",
                        data: response.data.TotalPostsArray.$values,
                        barThickness: 20,
                    },
                    {
                        label: "Tổng số bài viết được công bố",
                        backgroundColor: "#0d6efd",
                        data: response.data.TotalPublishPostsArray.$values,
                        barThickness: 20,
                    },
                ],
            };

            if (chartRef.value?.chart) {
                chartRef.value.chart.update("resize");
            }
        } else {
            console.error("⚠ API trả về dữ liệu không hợp lệ!");
        }
    } catch (error) {
        console.error("❌ Lỗi khi gọi API:", error.response?.data || error);
    }
};

// Khi component mounted, fetch dữ liệu ngay
onMounted(fetchData);
</script>

<style scoped></style>
