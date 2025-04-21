import { defineStore } from "pinia";
import { ref } from "vue";

export const useCategoryStore = defineStore({
    id: "category",
    state: () => ({
        selectedList: [],
    }),
    actions: {
        addToSelectedList(category) {
            this.selectedList.push(category);
        },
        removeFromSelectedList(categoryId) {
            this.selectedList = this.selectedList.filter((item) => item !== categoryId);
        },
        getSelectedList() {
            return this.selectedList;
        },
        removeAll(){
            this.selectedList = []
        }
    },
});
