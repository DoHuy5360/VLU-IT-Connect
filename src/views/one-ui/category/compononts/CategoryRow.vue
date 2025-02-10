<template>
    <tr>
        <td class="text-center">
            <label hidden for="categoryRow">Thể loại</label>
            <input id="categoryRow" type="checkbox" v-model="selected" @change="emitSelection" />
        </td>

        <td class="text-left">
            <div @click="toggleChildren(category.id)" class="d-flex" style="cursor: pointer; width: fit-content; user-select: none">
                <span v-if="hasChildren" class="btn btn-sm btn-link p-0 me-2" :style="{ marginLeft: `${20 * category.nestDepth}px` }">
                    <i :class="isExpanded ? 'fa fa-chevron-down' : 'fa fa-chevron-right'"></i>
                </span>
                <span v-else class="btn btn-sm btn-link p-0 me-2" :style="{ marginLeft: `${20 * category.nestDepth}px` }"> </span>
                <span>
                    {{ category.name }}
                </span>
            </div>
        </td>

        <td class="text-center">{{ category.description }}</td>
        <td class="">
            <div class="d-flex gap-2 justify-content-center">
                <button class="btn btn-sm btn-alt-danger" @click="$router.push(`/administrator/category/edit/${category.code}`)"><i class="fa fa-edit"></i> Sửa</button>
                <button class="btn btn-sm btn-danger" @click="confirmDelete"><i class="fa fa-trash"></i> Xóa</button>
            </div>
        </td>
    </tr>

    <!-- Hiển thị danh mục con ngay khi danh mục cha mở -->
    <template v-if="hasChildren && isExpanded">
        <CategoryRow
            v-for="child in category.children"
            :key="child.id"
            :category="child"
            :expandedCategories="expandedCategories"
            @edit="$emit('edit', child)"
            @delete="$emit('delete', child)"
            @toggle="toggleChildren"
        />
    </template>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";

export default {
    name: "CategoryRow",
    props: {
        category: { type: Object, required: true },
        expandedCategories: { type: Object, required: true },
    },
    emits: ["edit", "delete", "toggle"],
    data() {
        return {
            selected: false,
        };
    },
    computed: {
        hasChildren() {
            return this.category.children && this.category.children.length > 0;
        },
        isExpanded() {
            return !!this.expandedCategories[this.category.id];
        },
    },
    methods: {
        toggleChildren(categoryId) {
            this.$emit("toggle", categoryId);
        },
        emitSelection() {
            this.$emit("select", { id: this.category.id, selected: this.selected });
        },
        async confirmDelete() {
            const toast = useToast();
            const result = await Swal.fire({
                title: `Bạn có chắc chắn muốn xóa danh mục "${this.category.name}"?`,
                text: "Hành động này không thể hoàn tác!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Xóa ngay",
                cancelButtonText: "Hủy",
            });

            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem("authToken");
                    console.log(`🚀 Deleting category: ${this.category.code}`);

                    const response = await axios.delete("/api/Categories/deletecategory", {
                        headers: { Authorization: token },
                        params: { cateCode: this.category.code }, // Truyền cateCode trong params
                    });

                    if (response.status === 200) {
                        this.$emit("delete", this.category); // Emit event để cập nhật danh sách
                    }
                } catch (error) {
                    console.error("❌ Lỗi khi xóa danh mục:", error.response?.data || error.message);
                    toast.error("Xóa danh mục thất bại!");
                }
            }
        },
    },
};
</script>
