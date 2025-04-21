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
        <div class="row g-4 mb-4">
            <div class="col-sm-6 col-xxl-3">
                <CardData :value="amountOfBlog" label="Tổng số bài viết">
                    <i class="si si-note fs-3 text-primary"></i>
                </CardData>
            </div>
            <div class="col-sm-6 col-xxl-3">
                <CardData :value="totalViews" label="Tổng số lượt truy cập">
                    <i class="si si-eye fs-3 text-primary"></i>
                </CardData>
            </div>
            <div class="col-sm-6 col-xxl-3">
                <CardData :value="totalComments" label="Tổng số bình luận">
                    <i class="si si-bubbles fs-3 text-primary"></i>
                </CardData>
            </div>
        </div>
        <div class="row">
            <div class="col-xxl-12 d-flex flex-column">
                <GetAmountOfPostsByCategoryChart />
            </div>
        </div>

        <GetInteractiveOnPostsChart />
        <!-- <LineChart /> -->
    </div>
</template>

<script setup>
import { ref } from "vue";
import { authRequest } from "../accountmanager/service/axiosConfig";
import GetInteractiveOnPostsChart from "./components/GetInteractiveOnPostsChart.vue";
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
const totalViews = ref(0);

async function getTotalBlogs() {
    const response = await authRequest.get(`/Dashboard/total-blogs`);
    amountOfBlog.value = response.data
}
getTotalBlogs();
const totalComments = ref(0);

async function getComments() {
    const response = await authRequest.get(`/Dashboard/total-comments`);

    totalComments.value = response.data;
}
getComments();

const getTotalViews = async () => {
    try {
        const response = await authRequest.get(`/Dashboard/total-views`);

        totalViews.value = response.data
    } catch (error) {
        console.error(error);
    }
};

getTotalViews();
</script>

<style lang="scss" scoped></style>
