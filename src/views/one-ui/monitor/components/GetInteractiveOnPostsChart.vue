<template>
    <BaseBlock title="THỐNG KÊ SỐ LƯỢNG TRUY CẬP VÀ BÌNH LUẬN" class="flex-grow-1 d-flex flex-column">
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
            <div class="block-content p-1 text-center overflow-hidden">
                <Line :data="totalOrdersData" :options="totalOrdersOptions" style="height: 90px" />
            </div>
        </template>
    </BaseBlock>
</template>

<script setup>
import { reactive } from "vue";
import { Line } from "vue-chartjs";
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

// Ví dụ sử dụng
const month = 9; // Tháng 9
const days = getDaysInMonth(month);
console.log(days);

const totalOrdersData = reactive({
    labels: getDaysInMonth(9),
    datasets: [
        {
            label: "Total Orders",
            // fill: false,
            // backgroundColor: "rgba(220, 38, 38, .15)",
            // borderColor: "transparent",
            pointBackgroundColor: "rgba(220, 38, 38, 1)",
            // pointBorderColor: "#000",
            // pointHoverBackgroundColor: "#fff",
            // pointHoverBorderColor: "rgba(220, 38, 38, 1)",
            data: [40, 39, 10, 40, 39, 80, 40],
        },
    ],
});
const totalOrdersOptions = reactive({
    maintainAspectRatio: false,
    // tension: 0.4,
    scales: {
        x: {
            display: true,
        },
        y: {
            display: true,
        },
    },
    interaction: {
        intersect: false,
    },
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            callbacks: {
                label: function (context) {
                    return " " + context.parsed.y + " Orders";
                },
            },
        },
    },
});
</script>

<style lang="scss" scoped></style>
