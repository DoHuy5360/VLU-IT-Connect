<template>
    <div class="container">
        <div class="row my-4 gy-4">
            <div v-for="category in categories" :key="category.id" class="col-sm-4 col">
                <CategoryBox :name="category.name" :blogs="category.blogs" @click="() => openBlog(category.name)" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useTemplateStore } from "@/stores/template";
import CategoryBox from "@/views/it-connect/components/CategoryBox.vue";

const store = useTemplateStore();
store.setBreadcrumb([
    {
        name: "Kiến thức CNTT - Sinh viên",
        path: "/categories",
    },
]);
function openBlog(name) {
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

const categories = ref([
    {
        id: "c1",
        name: "VLID",
        blogs: [
            { id: "b1", title: "Blog 1" },
            { id: "b2", title: "Blog 2" },
        ],
    },
    {
        id: "c2",
        name: "Online",
        blogs: [
            { id: "b3", title: "Blog 3" },
            { id: "b4", title: "Blog 4" },
            { id: "b5", title: "Blog 5" },
            { id: "b6", title: "Blog 6" },
            { id: "b7", title: "Blog 7" },
            { id: "b8", title: "Blog 8" },
            { id: "b9", title: "Blog 9" },
        ],
    },
    {
        id: "c3",
        name: "Development",
        blogs: [
            { id: "b10", title: "Blog 10" },
            { id: "b11", title: "Blog 11" },
        ],
    },
    {
        id: "c4",
        name: "Design",
        blogs: [
            { id: "b12", title: "Blog 12" },
            { id: "b13", title: "Blog 13" },
        ],
    },
    {
        id: "c5",
        name: "Marketing",
        blogs: [
            { id: "b14", title: "Blog 14" },
            { id: "b15", title: "Blog 15" },
            { id: "b14", title: "Blog 14" },
            { id: "b15", title: "Blog 15" },
            { id: "b12", title: "Blog 12" },
            { id: "b13", title: "Blog 13" },
        ],
    },
    {
        id: "c6",
        name: "Business",
        blogs: [
            { id: "b16", title: "Blog 16" },
            { id: "b17", title: "Blog 17" },
        ],
    },
    {
        id: "c7",
        name: "Finance",
        blogs: [
            { id: "b18", title: "Blog 18" },
            { id: "b19", title: "Blog 19" },
        ],
    },
    // Add more categories as needed
]);
</script>

<style scoped>
/* Add specific styles here if needed */
</style>
