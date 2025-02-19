<template>
    <BasePageHeading title="Quản Lý Thống Kê" subtitle="">
        <template #extra>
            <!-- <button type="button" class="btn btn-alt-primary" v-click-ripple>
        <i class="fa fa-plus opacity-50 me-1"></i>
        Add
      </button> -->
        </template>
    </BasePageHeading>
    <div class="content">
        <div class="row g-4 mb-3">
            <div class="col-sm-6 col-xxl-3">
                <CardData :value="amountOfBlog" label="Tổng số bài viết">
                    <i class="si si-note fs-3 text-primary"></i>
                </CardData>
            </div>
            <div class="col-sm-6 col-xxl-3">
                <CardData :value="0" label="Tổng số lượt truy cập">
                    <i class="si si-eye fs-3 text-primary"></i>
                </CardData>
            </div>
            <div class="col-sm-6 col-xxl-3">
                <CardData :value="0" label="Tổng số bình luận">
                    <i class="si si-bubbles fs-3 text-primary"></i>
                </CardData>
            </div>
        </div>
        <div class="row">
            <div class="col-xxl-12 d-flex flex-column">
                <GetAmountOfPostsByCategoryChart />
            </div>
        </div>

        <BarChart />
        <!-- <LineChart /> -->
    </div>
</template>

<script setup>
import { ref } from "vue";
import { guestRequest } from "../accountmanager/service/axiosConfig";
import BarChart from "./components/GetInteractiveOnPostsChart.vue";
import CardData from "./components/CardData.vue";
import { Chart, registerables } from "chart.js";
import GetAmountOfPostsByCategoryChart from "./components/GetAmountOfPostsByCategoryChart.vue";

Chart.register(...registerables);

// Set Global Chart.js configuration
Chart.defaults.color = "#818d96";
Chart.defaults.scale.grid.lineWidth = 0;
Chart.defaults.scale.beginAtZero = true;
Chart.defaults.datasets.bar.maxBarThickness = 45;
Chart.defaults.elements.bar.borderRadius = 4;
Chart.defaults.elements.bar.borderSkipped = false;
Chart.defaults.elements.point.radius = 5;
Chart.defaults.elements.point.hoverRadius = 10;
// Chart.defaults.elements.line.;
Chart.defaults.plugins.tooltip.radius = 3;
Chart.defaults.plugins.legend.labels.boxWidth = 10;

const amountOfBlog = ref(0);

async function getPosts() {
    const response = await guestRequest.get(`/posts?PageNumber=1&PageSize=9999`);
    amountOfBlog.value = response.data.data.length;
}

getPosts();
</script>

<style lang="scss" scoped></style>
