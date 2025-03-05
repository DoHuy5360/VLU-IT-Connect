<template>
  <BaseBlock
    title="THỐNG KÊ SỐ LƯỢNG TRUY CẬP VÀ BÌNH LUẬN"
    class="flex-grow-1 d-flex flex-column"
  >
    <template #options>
      <div class="row justify-content-end">
        <div class="col-4 d-flex gap-2 align-items-center">
          <label for="">Từ</label>
          <FlatPickr
            id="example-flatpickr-default"
            class="form-control"
            placeholder="D-M-Y"
            v-model="fromDate.selectedDate"
            :config="fromDate.config"
          />
        </div>
        <div class="col-4 d-flex gap-2 align-items-center">
          <label for="">Đến</label>
          <FlatPickr
            id="example-flatpickr-default"
            class="form-control"
            placeholder="D-M-Y"
            v-model="toDate.selectedDate"
            :config="toDate.config"
          />
        </div>
      </div>
    </template>
    <template #content>
      <div class="block-content p-1 text-center overflow-hidden">
        <Line
          :data="totalOrdersData"
          :options="totalOrdersOptions"
          style="height: 90px"
        />
      </div>
    </template>
  </BaseBlock>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { Line } from "vue-chartjs";
import FlatPickr from "vue-flatpickr-component";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function getDateTwoMonthsBefore() {
  // Lấy ra ngày hiện tại
  const currentDate = new Date();

  // Tính toán ngày cách ngày hiện tại 2 tháng
  const targetDate = new Date(currentDate);
  targetDate.setMonth(currentDate.getMonth() - 2);

  // Format lại ngày theo định dạng 'dd-mm-yyyy'
  const formattedDate =
    String(targetDate.getDate()).padStart(2, "0") +
    "-" +
    String(targetDate.getMonth() + 1).padStart(2, "0") +
    "-" +
    targetDate.getFullYear();

  return formattedDate;
}

// Flatpickr variables
const fromDate = reactive({
  selectedDate: null,
  config: {
    dateFormat: "d-m-Y",
    minDate: getDateTwoMonthsBefore(),
    maxDate: "today",
  },
});
const toDate = reactive({
  selectedDate: null,
  config: {
    dateFormat: "d-m-Y",
    minDate: getDateTwoMonthsBefore(),
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

// Ví dụ sử dụng
const month = 9; // Tháng 9
const days = getDaysInMonth(month);
console.log(days);

// Hàm lấy token từ localStorage
function getAuthToken() {
  return localStorage.getItem("authToken") || null;
}

// Hàm format ngày cho API
function formatDateForAPI(date) {
  if (!date) return null;
  return new Date(date).toISOString().split("T")[0];
}

// Mẫu
// const dataSample = {
//   daysOfMonth: [
//     "01",
//     "02",
//     "03",
//     "04",
//     "05",
//     "06",
//     "07",
//     "08",
//     "09",
//     "10",
//     "11",
//     "12",
//     "13",
//     "14",
//     "15",
//     "16",
//     "17",
//     "18",
//     "19",
//     "20",
//     "21",
//     "22",
//     "23",
//     "24",
//     "25",
//     "26",
//     "27",
//     "28",
//     "29",
//     "30",
//     "31",
//   ],
//   accessPostVolumn: [10, 40, 40, 39, 10, 40, 39, 10, 40, 30, 10, 40, 12],
//   commentPostVolumn: [
//     403, 394, 10, 40, 39, 20, 40, 320, 10, 40, 40, 39, 10, 440, 39, 80, 40, 310,
//     10, 40, 40, 39, 10, 40, 39, 80, 40, 30, 130, 40, 12,
//   ],
// };

const totalOrdersData = ref({
  labels: getDaysInMonth(9),
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
      data: [25, 15, 10, 34, 39, 80, 40],
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
      data: [10, 19, 1, 10, 29, 20, 30],
    },
  ],
});

async function getChartData() {
  try {
    const authToken = getAuthToken();
    const fromDateAPI = formatDateForAPI(fromDate.selectedDate);
    const toDateAPI = formatDateForAPI(toDate.selectedDate);

    const response = await axios.get(
      `https://localhost:7017/api/Dashboard/access-comment-stats`,
      {
        params: {
          fromDate: fromDateAPI,
          toDate: toDateAPI,
        },
        headers: {
          Authorization: `${authToken}`,
        },
      }
    );

    const data = response.data;
    totalOrdersData.value = {
      labels: data.DaysOfMonth.$values,
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
        display: true,
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
  },
});
</script>

<style lang="scss" scoped></style>
