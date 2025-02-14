<template>
    <div class="mb-4">
        <label class="form-label" for="category-select">Thể Loại</label>
        <select class="form-select" id="category-select" v-model="selectedCategory" required>
            <option value="">Chọn Thể Loại</option>
            <option v-for="category in categories" :key="category.Id" :value="category.Id">
                {{ category.Name }}
            </option>
        </select>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";

const categories = ref([]);
const selectedCategory = ref("");

const token = localStorage.getItem("authToken");

onMounted(() => {
    axios
        .get("/Categories/getallcategories", {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                cateName: "",
                indexPage: 1,
                limitRange: 10,
            },
        })
        .then((response) => {
            const data = response.data;
            categories.value = Array.isArray(data) ? data : data.categories;
        })
        .catch((error) => {
            console.error("Lỗi khi tải thể loại:", error);
            alert("Không thể tải danh sách thể loại. Vui lòng thử lại.");
        });
});

defineProps({
    modelValue: {
        type: String,
        required: true,
    },
});

defineEmits(["update:modelValue"]);

watch(selectedCategory, (newValue) => {
    emit("update:modelValue", newValue);
});
</script>

<style scoped>
/* Add specific styles here if needed */
</style>
