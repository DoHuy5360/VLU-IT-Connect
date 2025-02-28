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
        <CardData
          :value="amountOfBlog || 'chưa cập nhật'"
          label="Tổng số bài viết"
        >
          <i class="si si-note fs-3 text-primary"></i>
        </CardData>
      </div>
      <div class="col-sm-6 col-xxl-3">
        <CardData
          :value="amountOfview || 'chưa cập nhật'"
          label="Tổng số lượt truy cập"
        >
          <i class="si si-eye fs-3 text-primary"></i>
        </CardData>
      </div>
      <div class="col-sm-6 col-xxl-3">
        <CardData
          :value="amountOfcomment || 'chưa cập nhật'"
          label="Tổng số bình luận"
        >
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
  const response = await guestRequest.get(
    `/posts?PageNumber=1&PageSize=9999&IsAdmin=true`
  );
  amountOfBlog.value = response.data.data.length;
  //   console.log("bai viet", response.data.data.length);
}
getPosts();
const amountOfcomment = ref(0);

async function getComments() {
  const response = await guestRequest.get(`/admin/comment`);

  //   console.log("giá trị", response.data.$values.length);
  amountOfcomment.value = response.data.$values.length;
}
getComments();

const getviews = async () => {
  try {
    const response = await guestRequest.get(
      `https://localhost:7017/api/admin/posts/view-statistics`,
      {
        headers: {
          Authorization: `CfDJ8LWa87ctXNBGutK_qDpzLpdbZZTEkpIlXkdwr-VBnHmTVyiJORESqpc-JVwbEN2zKYUodI-D2nQ2srqzjrgOIGJdKCYZ2pJzW_2DCvEkRgwexenpp2i82stxrn25IusVrXTME6s4nM5zz7IZJQOht8XSf2cZ2B2EHLZdykTwNtpL5bbITOROS9SfBPYeV8FvDdUyJlqp6Hc5KSVf4w5RQpN4CV17tBHhnZasd00vu60zhLHM0HMcgkp05y2F6y94pQoDqzuDyX4wlvbsjmG0pwzBW3h1XMSnpd68S0U36Xs5ShciuMYVhepfyy8iP8PGFW0MbxDuvwsn0V-6DAzP99D8cUWyWwAz0c1hTdaH07OQungULbHpFcw1pOwbcf__P4zAXk0mxn-gkGt0cF5H1lwCiMLlKpEaVpVofmv2pqHsrGVXHwkKKXHT6ugDflKSOfRQlHGUzZlw6_cRUEqhlo0dyNWeQu1MG9ziHmU9FfEJ1yhfAiDTzeJkvANiUBJ1gNbGJ7-9xQZU2qvIT9oWJA4D2D9uNA0ZEMDRZ-CQUGR5igJpyYWD3HwcElWudHSiDWTZrsNNAg55eAjpnZYsp8xsoHGd95A6j9VeMpS4kOSF2k6WWsbJPam6ERRfEtyt9G9xyGglyMJK4AucT6jDuk5AD1MKrbm6orAMNKUrv-GRB3n4ib8Nx0E21GrWd1qEMRSccgHb2dXgrgpno6xjuQXN6ewWMhhB_URwOZLgnt2CE4UgPeJb-ap-Ik9rxZv8CjVNrcz8bix3g8W-7AE2KlnRlOGx7G5ATqxGjRF5ah1eo4stEYzLtoC5cR4jTwJ10KBzMkFGI5c3B6N6gvroc65gEXFUrWL3LN7f82u4OKN_WfmTOH3quI2c4JIWeVhrDSSicBs3WDAiJ-7oFR7gsLH9xea7-xC7RrzKOASIreNatrQudu4yMQde3Lk1hOHWL7_IhoMz9u1EHbi1-N2BCPKL4tfr6RSOTgicRB8mLV76TD4bheKKzkegKZaq6SIFMce-QpSAiB2G8hXshZ3HoaMclERjUjR0QaXzC5_gGDaBNLbbI-kvAtGt8artc0pEdW6ColVWGd_pAnVeUn_VfAP7CoBuWNdGyRjftshp5vQ-koZQvsj8qcHyZ3fmDSvAe31Nj0GCC1LchCoeSjOrhXdQKG0U4bNCa_YpFoCU15pxUcJq6mNw6x-Q8V_HV7AeWohoOZ7E5fSCErd-wZfFJ3sRCfasWmSNmnO2UCYdfUWmngKR6_kEYOLP5cXCjFbI__VxEsEihP-hSfeUd_1Ry10ecFbZkInNCq3B_Gn7oSQf6l3duy3YZplwprqcsOcs_Jk1Y7o_euc0FHJLRlBhSRXyBZuFCKGjI_kW9g3GNSFhzxqCZh6pNKV-vepQe3mKMhjY1A0IcC5uk0j6XxfgSHiJ5f4ZPBSI2iqLYer1x2psdm_2R0yNxW3U7DC0Hg7cGmO-AbrFnGs9AKcwJ2Tsf7ig-m3bzPuyJ-dBX9UJ0n32Zi2X1Jp_NfNaJdjjKHjFRtcKvP8ZqdPqRDRL4BZ3RU73Zs8FaMS6k3vHoxzs1IBrNuW492aTWvlr21mt4ndkj1eRdxblLvkViYKpQAUgK0RtjrB18CZksACV9GXZpdhLM7W-tYVJwlsB-RaXZQAzJh36cFl0Wkz0q9ee3mYNztNCHqAt7hJaWg344xSmALkpSjOAUZJyIZd3LKXDBiolnY71dtrbZdUSjzKjioRHdpcw9eb1LqW4Fa41tpKER79VwJYkosA_3EvR1YJSnRcnWIdnSeLAFBjHW1KTVJj25yTfzJImovaGuHA_0oRUb0JPgGaZ0EwMVaK9BVRzbmz56s59SBC780JMFIMdd5INGrY`,
        },
      }
    );

    console.log("📥 Dữ liệu API trả về:", response); // Log toàn bộ response
  } catch (error) {
    console.error("❌ Lỗi khi lấy dữ liệu lượt xem:", error);
  }
};

getviews();
</script>

<style lang="scss" scoped></style>
