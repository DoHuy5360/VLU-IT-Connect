<template>
    <BasePageHeading title="Quản Lý Thể Loại" subtitle="">
        <template #extra>
            <button type="button" class="btn btn-success" @click="$router.push('/administrator/category/create')">
                <i class="fa fa-plus opacity-50 me-1"></i> Thêm thể loại
            </button>
        </template>
    </BasePageHeading>

    <div class="content">
        <BaseBlock title="Danh sách thể loại" class="shadow-sm rounded">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div></div>
                <div class="col-md-4">
                    <input v-model="searchTerm" type="text" placeholder="Tìm kiếm ..." class="form-control" @input="onSearch" />
                </div>
            </div>

            <table class="table table-bordered table-striped table-hover table-vcenter">
                <thead class="bg-primary text-light">
                    <tr>
                        <th class="text-center" style="width: 50px"></th>
                        <th class="text-left">Danh mục</th>
                        <th class="text-center">Nội dung</th>
                        <th class="text-center">Sửa/Xóa</th>
                    </tr>
                </thead>
                <tbody v-if="categories.length">
                    <CategoryRow 
                        v-for="category in categories" 
                        :key="category.id" 
                        :category="category" 
                        :expandedCategories="expandedCategories"
                        @edit="editCategory" 
                        @delete="confirmDelete"
                        @toggle="toggleCategory"
                    />
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="4" class="text-center">Không có dữ liệu.</td>
                    </tr>
                </tbody>
            </table>
        </BaseBlock>
    </div>
</template>
<script>
import axios from "axios";
import CategoryRow from "@/views/one-ui/category/compononts/CategoryRow.vue";
import BasePageHeading from "@/components/BasePageHeading.vue";
import BaseBlock from "@/components/BaseBlock.vue";

export default {
    name: "SimpleCategoryTable",
    components: {
        CategoryRow,
        BasePageHeading,
        BaseBlock,
    },
    data() {
        return {
            searchTerm: "",
            categories: [],
            currentPage: 1,
            expandedCategories: {}, // Lưu trạng thái mở rộng theo ID danh mục
        };
    },
    async mounted() {
        await this.getCategories();
    },
    methods: {
        async getCategories() {
            try {
                const token = localStorage.getItem("authToken");
                const params = {
                    indexPage: this.currentPage || 1,
                    limitRange: 20,
                };

                console.log("🔍 Request API:", params);

                const response = await axios.get("https://localhost:7017/api/Categories/getallcategories", {
                    headers: { Authorization: token },
                    params: params,
                });

                console.log("✅ API Response:", response.data);

                if (response.data?.data?.categories) {
                    this.categories = this.processCategories(response.data.data.categories);
                    console.log("📂 Processed Categories:", this.categories);
                }
            } catch (error) {
                console.error("❌ API Error:", error.response?.data || error.message);
            }
        },
        processCategories(category, parentId = null) {
        if (!category) return [];

        let newCategory = {
            id: category.Id,
            name: category.Name,
            description: category.Description,
            code: category.Code,
            parentId: parentId,
            nestDepth: category.NestDepth,
            children: [],
        };

        // Xử lý tất cả danh mục con (LeftChild + RightChild) để hiển thị đúng
        if (category.LeftChild) {
            newCategory.children.push(...this.processCategories(category.LeftChild, newCategory.id));
        }
        if (category.RightChild) {
            newCategory.children.push(...this.processCategories(category.RightChild, newCategory.id));
        }

        return [newCategory]; 
    },
        toggleCategory(categoryId) {
            // Nếu danh mục đã mở, đóng tất cả danh mục con
            if (this.expandedCategories[categoryId]) {
                this.closeAllChildren(categoryId);
            } else {
                this.expandedCategories = {
                    ...this.expandedCategories,
                    [categoryId]: !this.expandedCategories[categoryId],
                };
            }
        },
        closeAllChildren(categoryId) {
            // Đóng danh mục cha và tất cả danh mục con
            let updatedCategories = { ...this.expandedCategories };
            delete updatedCategories[categoryId];

            Object.keys(updatedCategories).forEach(id => {
                if (id.startsWith(categoryId + "-")) {
                    delete updatedCategories[id];
                }
            });

            this.expandedCategories = updatedCategories;
        },
        onSearch() {
            this.getCategories();
        },
        editCategory(category) {
            console.log("📝 Edit category:", category);
        },
        confirmDelete(category) {
            if (confirm(`❌ Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`)) {
                alert("Danh mục đã được xóa!");
            }
        },
    },
};
</script>
