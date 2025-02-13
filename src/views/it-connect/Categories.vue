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
import { guestRequest } from "../one-ui/accountmanager/service/axiosConfig";

const store = useTemplateStore();
store.setBreadcrumb([
    {
        name: "Kiến thức CNTT - Sinh viên",
        path: "/categories",
    },
]);

store.setHeroTitleName({
    vn: "Thể loại",
    en: "Categories",
});

const categories = ref([]);
async function getCategoryAndPosts() {
    const res = await guestRequest.get("/posts/categories-with-posts?limit=4");

    categories.value = res.data;
}
getCategoryAndPosts();
</script>
