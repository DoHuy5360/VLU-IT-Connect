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
                <form @submit.prevent="createCategory">
                    <!-- Parent Category Dropdown -->
                    <div class="mb-4">
                        <label class="form-label" for="parentCategory"> Chọn thể loại cha </label>
                        <select class="form-select" id="parentCategory" v-model="formData.parentId" @blur="v$.name.$touch" :class="{ 'is-invalid': v$.name.$errors.length }" title="Chọn thể loại cha">
                            <option value="">-- Gốc --</option>
                            <option v-for="category in categories" :key="category.Id" :value="category.Id">
                                {{ `${createIndentsForCategorySelector("-", category.NestDepth)} ${category.Name}` }}
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
                            :class="{ 'is-invalid': v$.name.$errors.length }" />
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
                            :class="{ 'is-invalid': v$.description.$errors.length }" />
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
import { useRouter } from "vue-router";
import { authRequest } from "../accountmanager/service/axiosConfig";
import useVuelidate from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
import { reactive } from "vue";
import { useTemplateStore } from "@/stores/template.js";

const rules = {
    name: { required, maxLengt: maxLength(225) },
    description: { required, maxLengt: maxLength(160) },
    parentId: {},
};
const store = useTemplateStore();
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

const createIndentsForCategorySelector = (char, times) => char.repeat(times);

function spreadCategoryTreeToSelector(categoryJsonTree) {
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
            spreadCategoryTreeToSelector(category.Children.$values);
        }
    }
}

const getCategoryTreeForSelector = async () => {
    try {
        const response = await authRequest.get("/Categories/getallcategories", {
            params: {
                indexPage: 1,
                limitRange: 100,
            },
        });

        if (response.data?.data?.categories?.$values) {
            spreadCategoryTreeToSelector(response.data.data.categories.$values);
        }
    } catch (error) {
        store.alert({ title: "Tải danh sách thể loại thất bại", icon: "error" });
    }
};

function clearCategoryTreeInSelector() {
    categories.value = [];
}

const createCategory = async () => {
    v$.value.$touch();
    if (v$.value.$invalid) {
        store.alert({ title: "Thông tin cần điền chưa hợp lệ", icon: "info" });
        return;
    }

    try {
        const now = new Date().toISOString();
        //= trong payload bên dưới có 2 trường createdAt và updatedAt đang lấy thời gian phía client để gửi về server, bạn hãy cập nhật lại là lấy thời gian trên server để lưu và xóa phần comment này đi
        const payload = {
            ...formData,
            createdAt: now,
            updatedAt: now,
            id: 0,
            slug: generateSlugFormat(formData.name),
            code: generateSlugFormat(formData.name),
            parentId: formData.parentId || null,
            children: [],
        };

        const response = await authRequest.post("/Categories/createCategory", payload);

        if (response.data) {
            await store.confirm({
                title: "Tạo thành công",
                icon: "success",
                callback: () => redirectToCategoryList(),
            });
            clearCategoryTreeInSelector();
            await getCategoryTreeForSelector();
        }
    } catch (error) {
        if (error.response.data.error.details.type == "duplicate") {
            store.alert({ title: "Tạo thất bại", text: "Tên thể loại này đã tồn tại, hãy sử dụng tên khác", icon: "error" });
        }
    }
};

function redirectToCategoryList(){
    router.push("/administrator/category");
}

function generateSlugFormat(originString) {
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

onMounted(async () => {
    await getCategoryTreeForSelector();
});
</script>
