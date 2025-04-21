<template>
    <BasePageHeading title="Quản Lý Thể Loại" subtitle="">
        <template #extra>
            <div class="d-flex gap-3">
                <button v-if="showDeleteManyButton" type="button" class="btn btn-danger" @click="deleteMultipleCategories">
                    <i class="fa fa-trash opacity-50 me-1"></i> Xóa thể loại đã chọn và con của nó
                </button>
                <button type="button" class="btn btn-success" @click="router.push('/administrator/category/create')"><i class="fa fa-plus opacity-50 me-1"></i> Thêm thể loại</button>
            </div>
        </template>
    </BasePageHeading>

    <div class="content">
        <BaseBlock title="Danh sách thể loại" class="shadow-sm rounded">
            <div class="d-flex justify-content-end align-items-center mb-4">
                <label hidden for="searchCategoryInput">Tìm kiếm thể loại</label>
                <div class="col-md-4">
                    <input id="searchCategoryInput" v-model="searchValue" type="text" placeholder="Tìm kiếm ..." class="form-control" @input="onSearch" />
                </div>
            </div>

            <table class="table table-bordered table-striped table-hover table-vcenter">
                <thead class="bg-primary text-light">
                    <tr>
                        <th class="text-center" style="width: 50px"></th>
                        <th class="text-left">Danh mục</th>
                        <th class="text-center" style="width: 30%;">Mô tả</th>
                        <th class="text-center" style="width: 20%;"></th>
                    </tr>
                </thead>
                <tbody v-if="categories.length">
                    <template v-if="searchValue.trim().length">
                        <template v-if="searchingCategoryList.length">
                            <tr v-for="category, index in searchingCategoryList">
                                <td>{{ index+1 }}</td>
                                <td>{{ category.Name }}</td>
                                <td>{{ category.Description }}</td>
                                <td class="">
                                    <div class="d-flex gap-2 justify-content-center">
                                        <button class="btn btn-sm btn-alt-danger" @click="$router.push(`/administrator/category/edit/${category.Code}`)"><i class="fa fa-edit"></i> Sửa</button>
                                    </div>
                                </td>
                            </tr>
                        </template>
                        <template v-else>
                            <tr>
                                <td colspan="4" style="text-align: center;">không tìm thấy thể loại <strong>{{ searchValue }}</strong></td>
                            </tr>
                        </template>
                    </template>
                    <template v-else>
                        <CategoryRow v-for="category in categories" :key="category.Id" :category="category" />
                    </template>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="4" class="text-center">{{ loading ? "Đang tải dữ liệu" : "Không có dữ liệu." }}</td>
                    </tr>
                </tbody>
            </table>
        </BaseBlock>
    </div>
</template>

<script setup>
import { ref, onMounted, provide, watch } from "vue";
import { useRouter } from "vue-router";
import { authRequest } from "@/views/one-ui/accountmanager/service/axiosConfig";
import CategoryRow from "@/views/one-ui/category/compononts/CategoryRow.vue";
import BasePageHeading from "@/components/BasePageHeading.vue";
import BaseBlock from "@/components/BaseBlock.vue";
import { useCategoryStore } from "@/stores/category.js";
import { useTemplateStore } from "@/stores/template.js";

const store = useTemplateStore();
const categoryStore = useCategoryStore();
const router = useRouter();
const searchValue = ref("");
const categories = ref([]);
const currentPage = ref(1);
const showDeleteManyButton = ref(false);
const loading = ref(false);
const searchingCategoryList = ref([])
const spreadCategoryList = ref([])

function spreadCategory(categoryJsonTree) {
    for (let index = 0; index < categoryJsonTree.length; index++) {
        const category = categoryJsonTree[index];
        if (category.Children.$values.length === 0) {
            spreadCategoryList.value.push({
                Id: category.Id,
                Name: category.Name,
                Description: category.Description,
                NestDepth: category.NestDepth,
                Code: category.Code,
            });
        } else {
            spreadCategoryList.value.push({
                Id: category.Id,
                Name: category.Name,
                Description: category.Description,
                NestDepth: category.NestDepth,
                Code: category.Code,
            });
            spreadCategory(category.Children.$values);
        }
    }
}

const getCategoryList = async () => {
    try {
        loading.value = true

        const params = { indexPage: currentPage.value, limitRange: 9999 };
        const response = await authRequest.get("/Categories/getAllCategories", { params });
        categories.value = response.data?.data?.categories?.$values;
        spreadCategory(categories.value)
    } catch (error) {
        store.alert({title: "Không tải được danh sách thể loại", icon: "info"})
    }finally{
        loading.value = false
    }
};

async function deleteMultipleCategories() {
    store.confirm({
        title: "Xác nhận xóa",
        callback: async () => {
            try {
                await authRequest.post("/Categories/deleteCategory/multiple", categoryStore.getSelectedList());

                await store.alert({ title: "Xóa thành công" });
            } catch (error) {
                await store.alert({ title: "Xóa thất bại", icon: "error" });
            } finally {
                categoryStore.removeAll()
                getCategoryList();
            }
        },
    });
}

const onSearch = () => {
    if(searchValue.value.length){
        searchingCategoryList.value = spreadCategoryList.value.filter(category => 
            category.Name.includes(searchValue.value)
        )
    }else{
        searchingCategoryList.value = []
    }
};

//= Kiểm tra nếu chọn từ 2 thể loại trở lên thì hiện nút xóa nhiều
watch(
    () => categoryStore.selectedList.length,
    (totalSelectedCategories) => {
        if (totalSelectedCategories > 1) {
            showDeleteMultipleButton(true);
        } else {
            showDeleteMultipleButton(false);
        }
    }
);

function showDeleteMultipleButton(state){
    showDeleteManyButton.value = state;
}

//== Đoạn này truyền cho các hàng loại hàm làm mới sau khi xóa danh sách thể loại
provide("refresh", getCategoryList); //= Đoạn này phải nằm sau hàm khởi tạo để tránh lỗi bí ẩn

onMounted(getCategoryList);
</script>
