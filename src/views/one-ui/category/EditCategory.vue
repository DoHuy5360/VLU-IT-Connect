<template>
    <BasePageHeading title="Chỉnh Sửa Thể Loại" subtitle="">
        <template #extra>
            <button type="button" class="btn btn-alt-primary" @click="$router.push('/administrator/category')"><i class="fa fa-arrow-left opacity-50 me-1"></i> Quay về</button>
        </template>
    </BasePageHeading>

    <div class="content">
        <BaseBlock title="">
            <div class="space-y-5">
                <form @submit.prevent="updateCategory">
                    <!-- Parent Category Dropdown -->
                    <div class="mb-4">
                        <label class="form-label" for="parentCategory">Thể loại cha</label>
                        <select class="form-select" id="parentCategory" v-model="formData.parentId" title="Chọn thể loại cha">
                            <option value="">-- Không có thể loại cha --</option>
                            <option v-for="category in categories" :key="category.Id" :value="category.Id">
                                {{ `${repeatChar("-", category.NestDepth)} ${category.Name}` }}
                            </option>
                        </select>
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
                        <button type="submit" class="btn btn-success">Cập nhật</button>
                    </div>
                </form>
            </div>
        </BaseBlock>
    </div>
</template>

<script setup>
import { ref, onMounted, toRefs } from "vue";
import axios from "axios";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import { defineProps } from "vue";
import authRequest from "../accountmanager/service/axiosConfig";
import useVuelidate from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
import { reactive } from "vue";

const rules = {
    name: { required, maxLengt: maxLength(225) },
    description: { required, maxLengt: maxLength(160) },
    parentId: {},
};

// Nhận props
const props = defineProps({
    code: {
        type: String,
        required: true,
    },
});

// Khai báo biến trạng thái
const categories = ref([]);
const formData = reactive({
    id: null,
    name: "",
    description: "",
    parentId: null,
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

// Khởi tạo router và toast
const router = useRouter();
const toast = useToast();

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
            params: {
                indexPage: 1,
                limitRange: 20,
            },
        });

        if (response.data?.data?.categories?.$values) {
            spreadCategory(response.data.data.categories.$values);
            console.log("📂 Danh sách thể loại:", categories.value);
        }
    } catch (error) {
        console.error("❌ Lỗi khi tải danh sách thể loại:", error);
        toast.error("Không thể tải danh sách thể loại!");
    }
};

// Hàm lấy thông tin thể loại theo code
const getCategoryByCode = async () => {
    try {
        const encodedCateCode = encodeURIComponent(props.code);
        console.log("🔍 Đang tải thông tin thể loại với code:", encodedCateCode);

        const response = await authRequest.get("/Categories/getcategorybycode", {
            params: {
                cateCode: encodedCateCode,
            },
        });

        if (response.data?.data?.category) {
            const category = response.data.data.category;

            formData.id = category.Id;
            formData.name = category.Name;
            formData.description = category.Description;
            formData.parentId = category.ParentId;
            formData.slug = category.Slug;
            formData.code = category.Code;
            formData.nestLeft = category.NestLeft;
            formData.nestRight = category.NestRight;
            formData.nestDepth = category.NestDepth;
            formData.children = category.Children?.$values || [];
            formData.createdAt = category.CreatedAt;
            formData.updatedAt = new Date().toISOString();

            console.log("✅ Đã tải thông tin thể loại:", formData);
        } else {
            toast.error("Không tìm thấy thông tin thể loại!");
            router.push("/administrator/category");
        }
    } catch (error) {
        console.error("❌ Lỗi khi tải thông tin thể loại:", error);
        if (error.response?.status === 404) {
            toast.error("Không tìm thấy thể loại với mã này!");
        } else {
            toast.error("Không thể tải thông tin thể loại!");
        }
        router.push("/administrator/category");
    }
};

// Hàm cập nhật thể loại
const updateCategory = async () => {
    v$.value.$touch(); // Đánh dấu tất cả các trường
    if (v$.value.$invalid) {
        console.log("khong hop le");

        return;
    } else {
        console.log("hop le");
        console.log(formData);
    }
    try {
        const payload = {
            ...formData,
            updatedAt: new Date().toISOString(),
        };

        console.log("🚀 Đang cập nhật thể loại:", payload);

        const response = await authRequest.put("/Categories/updatecategory", payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.data) {
            toast.success("Cập nhật thể loại thành công!");
            router.push("/administrator/category");
        }
    } catch (error) {
        console.error("❌ Lỗi khi cập nhật thể loại:", error);
        toast.error("Cập nhật thể loại thất bại!");
    }
};

// Gọi hàm khi component được mount
onMounted(async () => {
    await getCategories();
    await getCategoryByCode();
});
</script>
