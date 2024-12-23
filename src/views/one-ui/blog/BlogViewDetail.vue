<template>
  <BasePageHeading title="Blog Detail" subtitle="Details of the selected blog">
    <template #extra>
      <button type="button" class="btn btn-alt-primary" @click="$router.push('/administrator/blog')">
        <i class="fa fa-arrow-left opacity-50 me-1"></i>
        Back
      </button>
    </template>
  </BasePageHeading>
  <div v-if="loading" class="text-center py-5">
    <p>Loading...</p>
  </div>
  <div v-else>
    <h4>{{ post.title }}</h4>
    <p>Author: {{ post.author }}</p>
    <p>Content: {{ post.content }}</p>
    <p>Status: {{ post.state === 1 ? "Public" : "Unpublic" }}</p>
    <!-- Add more fields as needed -->
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
    const post = ref(null);
    const loading = ref(true);

    onMounted(async () => {
      const id = route.params.id;
      try {
        const response = await axios.get(`https://localhost:7017/api/admin/posts/${id}`);
        post.value = response.data.data;
      } catch (error) {
        console.error("Error fetching blog details:", error);
      } finally {
        loading.value = false;
      }
    });

    return { post, loading };
  },
};
</script>
