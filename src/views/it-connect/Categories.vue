<template>
    <div class="container">
        <div class="row my-4 gy-4">
            <div v-for="category in categories" :key="category.id" class="col-sm-4 col">
                <CategoryBox :name="category.categoryName" :blogs="category.posts" @click="() => openRelativeBlog(category.categoryName)" />
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
function openRelativeBlog(name) {
    store.setBreadcrumb([
        {
            name: "Kiến thức CNTT - Sinh viên",
            path: "/categories",
        },
        {
            name: `${name}`,
            path: `/categories/${name}`,
        },
    ]);
}

const categories = ref([]);
async function getCategoryAndPosts() {
    const res = await axios.get("/api/posts/categories-with-posts")
    console.log(res);
    
    console.log(res.data);
    
    categories.value = res.data
}
getCategoryAndPosts()
</script>