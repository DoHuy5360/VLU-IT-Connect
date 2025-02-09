<template>
    <BasePageHeading title="Tạo Thể Loại" subtitle="">
        <template #extra>
            <button type="button" class="btn btn-alt-primary" @click="$router.push('/administrator/category')">
                <i class="fa fa-arrow-left opacity-50 me-1"></i>
                Quay về
            </button>
        </template>
    </BasePageHeading>

    <div class="content">
        <BaseBlock title="">
            <div class="space-y-5">
                <form @submit.prevent="handleSubmit">
                    <!-- Parent Category Dropdown -->
                    <div class="mb-4">
                        <label class="form-label" for="parentCategory"> Chọn thể loại cha </label>
                        <select class="form-select" id="parentCategory" v-model="formData.parentId" @blur="v$.name.$touch" :class="{ 'is-invalid': v$.name.$errors.length }">
                            <option value="">-- Chọn --</option>
                            <option v-for="category in categories" :key="category.Id" :value="category.Id">
                                {{ `${repeatChar("-", category.NestDepth)} ${category.Name}` }}
                            </option>
                        </select>
                        <div v-if="v$.parentId.$errors.length" class="invalid-feedback">
                            <span v-if="v$.parentId.$errors[0].$validator === 'required'"> Hãy nhập tên thể loại </span>
                        </div>
                    </div>

                    <!-- Category Name -->
                    <div class="mb-4">
                        <label class="form-label" for="categoryName">Tên thể loại</label>
                        <input
                            type="text"
                            class="form-control"
                            id="categoryName"
                            v-model="formData.name"
                            placeholder="Nhập tên thể loại"
                            @blur="v$.name.$touch"
                            :class="{ 'is-invalid': v$.name.$errors.length }"
                        />
                        <div v-if="v$.name.$errors.length" class="invalid-feedback">
                            <span v-if="v$.name.$errors[0].$validator === 'required'"> Hãy nhập tên thể loại </span>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="mb-4">
                        <label class="form-label" for="categoryDetail">Mô tả</label>
                        <input
                            type="text"
                            class="form-control"
                            id="categoryDetail"
                            v-model="formData.description"
                            placeholder="Nhập mô tả"
                            @blur="v$.description.$touch"
                            :class="{ 'is-invalid': v$.description.$errors.length }"
                        />
                        <div v-if="v$.description.$errors.length" class="invalid-feedback">
                            <span v-if="v$.description.$errors[0].$validator === 'required'"> Hãy nhập mô tả </span>
                        </div>
                    </div>

                    <div class="mb-4">
                        <button type="submit" class="btn btn-success">Tạo</button>
                    </div>
                </form>
            </div>
        </BaseBlock>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import authRequest from "../accountmanager/service/axiosConfig";
import useVuelidate from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
import { reactive } from "vue";

const rules = {
    name: { required, maxLengt: maxLength(225) },
    description: { required, maxLengt: maxLength(160) },
    parentId: {},
};

const router = useRouter();
const categories = ref([]);
const formData = reactive({
    name: "",
    description: "",
    parentId: "",
    slug: "",
    code: "",
    nestLeft: 0,
    nestRight: 0,
    nestDepth: 0,
    children: [],
    createdAt: "",
    updatedAt: "",
});

const v$ = useVuelidate(rules, formData);

const repeatChar = (char, times) => char.repeat(times);

function spreadCategory(categoryJsonTree) {
    for (let index = 0; index < categoryJsonTree.length; index++) {
        const category = categoryJsonTree[index];
        if (category.Children.$values.length === 0) {
            categories.value.push({
                Id: category.Id,
                Name: category.Name,
                NestDepth: category.NestDepth,
            });
        } else {
            categories.value.push({
                Id: category.Id,
                Name: category.Name,
                NestDepth: category.NestDepth,
            });
            spreadCategory(category.Children.$values);
        }
    }
}

// Hàm lấy danh sách categories
const getCategories = async () => {
    try {
        const response = await authRequest.get("/Categories/getallcategories", {
            headers: {
                "Content-Type": "application/json",
            },
            params: {
                indexPage: 1,
                limitRange: 100,
            },
        });

        if (response.data?.data?.categories?.$values) {
            spreadCategory(response.data.data.categories.$values);
            console.log("📂 Danh sách thể loại:", categories.value);
        } else {
            console.warn("⚠ Không tìm thấy dữ liệu categories!");
            categories.value = [];
        }
    } catch (error) {
        if (error.response?.status === 302 || error.response?.status === 401) {
            console.error("❌ Phiên làm việc đã hết hạn, vui lòng đăng nhập lại!");
            router.push("/login");
            return;
        }
        console.error("❌ Lỗi khi tải danh sách thể loại:", error);
        categories.value = [];
    }
};

// Hàm xử lý khi gửi form
const handleSubmit = async () => {
    v$.value.$touch(); // Đánh dấu tất cả các trường
    if (v$.value.$invalid) {
        console.log("khong hop le");

        return;
    } else {
        console.log("hop le");
        console.log(formData);
    }
    try {
        const now = new Date().toISOString();
        const payload = {
            ...formData,
            createdAt: now,
            updatedAt: now,
            id: 0,
            slug: generateSlug(formData.name),
            code: generateSlug(formData.name),
            parentId: formData.parentId || null,
            children: [],
        };

        const response = await authRequest.post("/Categories/createcategory", payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.data) {
            console.log("✅ Tạo thể loại thành công!");
            router.push("/administrator/category");
        }
    } catch (error) {
        console.error("❌ Lỗi khi tạo thể loại:", error);
    }
};

function generateSlug(originString) {
    return originString
        .toLowerCase()
        .normalize("NFD") // Chuyển thành dạng decomposed để tách dấu
        .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
        .replace(/đ/g, "d")
        .replace(/Đ/g, "d") // Chuyển đ -> d
        .replace(/[^a-z0-9\s-]/g, "") // Loại bỏ ký tự đặc biệt
        .trim()
        .replace(/\s+/g, "-"); // Chuyển khoảng trắng thành dấu gạch ngang
}

// Gọi hàm lấy danh sách categories khi component được mount
onMounted(() => {
    getCategories();
});
</script>
