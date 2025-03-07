<template>
    <BaseBlock title="THỐNG KÊ SỐ LƯỢNG TRUY CẬP VÀ BÌNH LUẬN" class="flex-grow-1 d-flex flex-column">
        <template #options>
            <div class="row justify-content-end">
                <div class="col-4 d-flex gap-2 align-items-center">
                    <label for="">Từ</label>
                    <FlatPickr id="example-flatpickr-default" class="form-control" placeholder="D-M-Y" v-model="fromDate.selectedDate" :config="fromDate.config" @change="getChartData"/>
                </div>
                <div class="col-4 d-flex gap-2 align-items-center">
                    <label for="">Đến</label>
                    <FlatPickr id="example-flatpickr-default" class="form-control" placeholder="D-M-Y" v-model="toDate.selectedDate" :config="toDate.config" @change="getChartData"/>
                </div>
            </div>
        </template>
        <template #content>
            <div class="block-content p-1 text-center overflow-hidden">
                <Line v-if="totalOrdersData.labels.length != 0" :data="totalOrdersData" :options="totalOrdersOptions" />
                <div v-else class="w-100 text-center py-5">
                    Không có dữ liệu thống kê từ <strong>{{ fromDate.selectedDate }}</strong> đến <strong>{{ toDate.selectedDate }}</strong>
                </div>
            </div>
        </template>
    </BaseBlock>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { Line } from "vue-chartjs";
import FlatPickr from "vue-flatpickr-component";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { authRequest } from "../../accountmanager/service/axiosConfig";

import { useTemplateStore } from "../../../../stores/template";

const store = useTemplateStore();

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
const { day, month, year } = store.getCurrentDateObject();
// Flatpickr variables
const fromDate = reactive({
    selectedDate: `01-${month}-${year}`,
    config: {
        dateFormat: "d-m-Y",
        maxDate: "today",
    },
});
const toDate = reactive({
    selectedDate: `${day}-${month}-${year}`,
    config: {
        dateFormat: "d-m-Y",
        maxDate: "today",
    },
});

function getDaysInMonth(month) {
    const year = new Date().getFullYear(); // Lấy năm hiện tại
    const daysInMonth = new Date(year, month, 0).getDate(); // Lấy số ngày trong tháng

    const daysArray = Array.from(
        { length: daysInMonth },
        (_, index) => String(index + 1).padStart(2, "0")
        // + "/" + String(month).padStart(2, "0")
    );

    return daysArray;
}
function getDaysBetween(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = [];

    // Duyệt từ start đến end
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        // Lấy ngày và tháng
        const day = d.getDate().toString().padStart(2, '0'); // Định dạng ngày
        const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Định dạng tháng
        const year = d.getFullYear()
        days.push(`${day}-${month}-${year}`); // Thêm vào mảng
    }

    return days;
}

const totalOrdersData = ref({
    labels: [],
    datasets: [
        {
            label: "Lượng truy cập",
            // fill: false,
            // backgroundColor: "rgba(220, 38, 38, .15)",
            // borderColor: "transparent",
            pointBackgroundColor: "rgba(220, 38, 38, 1)",
            // pointBorderColor: "#000",
            // pointHoverBackgroundColor: "#fff",
            // pointHoverBorderColor: "rgba(220, 38, 38, 1)",
            data: [],
        },
        {
            label: "Lượng bình luận",
            // fill: false,
            // backgroundColor: "rgba(220, 38, 38, .15)",
            // borderColor: "transparent",
            pointBackgroundColor: "rgba(0, 38, 255, 1)",
            // pointBorderColor: "#000",
            // pointHoverBackgroundColor: "#fff",
            // pointHoverBorderColor: "rgba(220, 38, 38, 1)",
            data: [],
        },
    ],
});

async function getChartData() {
    try {
        const params = {
            fromDate: store.YYYYmmddFormat(fromDate.selectedDate),
            toDate: store.YYYYmmddFormat(toDate.selectedDate),
        };

        const response = await authRequest.get(`/Dashboard/access-comment-stats`, {
            params,
        });

        const data = response.data;
        totalOrdersData.value = {
            labels: getDaysBetween(params.fromDate, params.toDate),
            datasets: [
                {
                    label: "Lượng truy cập",
                    pointBackgroundColor: "rgba(220, 38, 38, 1)",
                    data: data.AccessPostVolumn.$values,
                },
                {
                    label: "Lượng bình luận",
                    pointBackgroundColor: "rgba(0, 38, 255, 1)",
                    data: data.CommentPostVolumn.$values,
                },
            ],
        };
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
    }
}

onMounted(() => {
    getChartData();
});

const totalOrdersOptions = reactive({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            display: true,
            title: {
                display: false,
                text: "Ngày trong tháng",
            },
        },
        y: {
            display: true,
            title: {
                display: true,
                text: "Số lượng",
            },
            beginAtZero: true,
        },
    },
    interaction: {
        mode: "nearest",
        intersect: false,
    },
    plugins: {
        legend: {
            display: true,
            position: "top",
        },
        tooltip: {
            enabled: true,
            callbacks: {
                label: function (context) {
                    let label = context.dataset.label || "";
                    if (label) {
                        label += ": ";
                    }
                    if (context.parsed.y !== null) {
                        label += context.parsed.y;
                    }
                    return label;
                },
            },
        },
        datalabels: {
            display: false, // Nếu bạn đang sử dụng plugin datalabels
        }
    },
});
</script>

<style lang="scss" scoped></style>
