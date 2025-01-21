<template>
  <BasePageHeading title="Chi tiết bài viết" subtitle="">
    <template #extra>
      <button type="button" class="btn btn-alt-primary" @click="$router.push('/administrator/blog')">
        <i class="fa fa-arrow-left opacity-50 me-1"></i>
        Quay lại
      </button>
    </template>
  </BasePageHeading>
  
  <div v-if="loading" class="text-center py-5">
    <p>Đang tải...</p>
  </div>
  <div v-else class="content">
    <table class="table table-bordered">
      <tbody>
        <tr v-for="(value, key) in post" :key="key">
          <td>{{ key }}</td>
          <td>
            <!-- Xử lý nội dung phức tạp -->
            <div v-if="key === 'contentHtml'" v-html="value"></div>
            <div v-else-if="key === 'metadata'">{{ parseMetadata(value) }}</div>
            <div v-else-if="value === null">Not Available</div>
            <div v-else>{{ value }}</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

export default {
  name: "BlogViewDetail",
  setup() {
    const route = useRoute();
    const post = ref({});
    const loading = ref(true);

    const parseMetadata = (metadata) => {
      try {
        return JSON.stringify(JSON.parse(metadata), null, 2);
      } catch (error) {
        return metadata;
      }
    };

    onMounted(async () => {
      const id = route.params.id;
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("Token not found");
          return;
        }
        const response = await axios.get(`/api/admin/posts/${id}`, {
          headers: {
            Authorization: token,
          },
        });
        post.value = response.data.data;
      } catch (error) {
        console.error("Error fetching blog details:", error);
      } finally {
        loading.value = false;
      }
    });

    return { post, loading, parseMetadata };
  },
};
</script>
<style scoped>
/* Tuỳ chỉnh bảng nếu cần */
.table th, .table td {
  text-align: left;
  vertical-align: middle;
}
</style>