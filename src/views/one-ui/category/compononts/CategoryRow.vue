<template>
    <tr>
        <td class="text-center">
            <label hidden :for="`categoryRow${category.Id}`">Thể loại</label>
            <input
                :id="`categoryRow${category.Id}`"
                type="checkbox"
                :value="category.Id"
                @change="
                    (event) => {
                        if (event.target.checked) {
                            categoryStore.addToSelectedList(category.Id);
                        } else {
                            categoryStore.removeFromSelectedList(category.Id);
                        }
                    }
                "
                class="form-check-input" />
        </td>

        <td class="text-left">
            <div @click="isExpanded = !isExpanded" class="d-flex" style="cursor: pointer; width: fit-content; user-select: none">
                <span v-if="hasChildren" class="btn btn-sm btn-link p-0 me-2" :style="{ marginLeft: `${20 * category.NestDepth}px` }">
                    <i :class="isExpanded ? 'fa fa-chevron-down' : 'fa fa-chevron-right'"></i>
                </span>
                <span v-else class="btn btn-sm btn-link p-0 me-2" :style="{ marginLeft: `${20 * category.NestDepth}px` }"> </span>
                <span>{{ category.Name }}</span>
            </div>
        </td>

        <td class="text-center">{{ category.Description }}</td>
        <td class="">
            <div class="d-flex gap-2 justify-content-center">
                <button class="btn btn-sm btn-alt-danger" @click="$router.push(`/administrator/category/edit/${category.Code}`)"><i class="fa fa-edit"></i> Sửa</button>
                <button class="btn btn-sm btn-danger" @click="deleteCategory"><i class="fa fa-trash"></i> Xóa</button>
            </div>
        </td>
    </tr>

    <template v-if="hasChildren && isExpanded">
        <CategoryRow v-for="child in category.Children.$values" :key="child.Id" :category="child"/>
    </template>
</template>

<script setup>
import { ref, computed, defineProps, inject, onBeforeUnmount } from "vue";
import { authRequest } from "../../../one-ui/accountmanager/service/axiosConfig";
import { useTemplateStore } from "@/stores/template.js";
import { useCategoryStore } from "@/stores/category.js";

const props = defineProps({
    category: { type: Object, required: true },
    isShow: { type: Boolean, default: false },
});
const categoryStore = useCategoryStore();
const isExpanded = ref(false);
const store = useTemplateStore();
const hasChildren = computed(() => props.category.Children.$values.length != 0);
const refreshCategoryList = inject("refresh");

const deleteCategory = async () => {
    store.confirm({
        title: "Xác nhận xóa",
        callback: async () => {
            try {
                await authRequest.delete("/Categories/deleteCategory", {
                    params: { id: props.category.Id },
                });

                await store.alert({ title: "Xóa thành công" });
            } catch (error) {
                console.error("Lỗi khi xóa danh mục:", error.response?.data || error.message);
                await store.alert({ title: "Xóa thất bại", icon: "error" });
            } finally {
                refreshCategoryList();
            }
        },
    });
};
onBeforeUnmount(()=>{
    //= Khi thực hiện đóng thẻ cha
    //= Nếu thẻ con bên trong đang được chọn thì xóa nó khỏi danh sách được chọn
    //= Vì khi đóng thẻ cha thì thẻ con sẽ bị xóa nhưng danh sách thể loại đã chọn không tự động cập nhật.
   categoryStore.removeFromSelectedList(props.category.Id)
})
</script>
