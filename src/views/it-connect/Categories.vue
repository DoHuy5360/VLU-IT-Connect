<template>
    <div class="container">
        <div class="row my-4 gy-4">
            <div v-for="category in categories" :key="category.id" class="col-sm-4 col">
                <CategoryBox :dataProps="category" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useTemplateStore } from "@/stores/template";
import CategoryBox from "@/views/it-connect/components/CategoryBox.vue";
import axios from "axios";

const store = useTemplateStore();
store.setBreadcrumb([
    {
        name: "Kiến thức CNTT - Sinh viên",
        path: "/categories",
    },
]);


const categories = ref([]);
async function getCategoryAndPosts() {
    const res = await axios.get("/api/posts/categories-with-posts?limit=4")
    console.log(res);
    
    categories.value = res.data
}
getCategoryAndPosts()
</script>