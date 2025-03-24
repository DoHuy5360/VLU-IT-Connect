<template>
    <nav v-if="data.origin.length != 0" aria-label="Paginate" style="width: fit-content; user-select: none">
        <ul class="pagination pagination-sm">
            <li class="page-item">
                <a @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="page-link" href="javascript:void(0)" tabindex="-1" aria-label="Previous"> &laquo; </a>
            </li>

            <template v-for="page in visiblePages" :key="page">
                <li v-if="page !== '...'" @click="changePage(page)" :class="{ active: currentPage === page }" class="page-item">
                    <a class="page-link" href="javascript:void(0)">
                        {{ page }}
                    </a>
                </li>
                <li v-else class="page-item">
                    <a href="javascript:void(0)">...</a>
                </li>
            </template>

            <li class="page-item">
                <a @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="page-link" href="javascript:void(0)" aria-label="Next"> &raquo; </a>
            </li>
        </ul>
    </nav>
</template>

<script setup>
import { ref, computed } from "vue";

const data = defineModel();

const perPage = data.value.size;
const currentPage = ref(1);

const totalPages = computed(() => Math.ceil(data.value.origin.length / perPage));
data.value.paginated = computed(() => {
    const start = (currentPage.value - 1) * perPage;
    return data.value.origin.slice(start, start + perPage);
});

const visiblePages = computed(() => {
    const pages = [];
    if (totalPages.value <= 7) {
        for (let i = 1; i <= totalPages.value; i++) pages.push(i);
    } else {
        if (currentPage.value <= 3) {
            pages.push(1, 2, 3, 4, "...", totalPages.value);
        } else if (currentPage.value >= totalPages.value - 2) {
            pages.push(1, "...", totalPages.value - 3, totalPages.value - 2, totalPages.value - 1, totalPages.value);
        } else {
            pages.push(1, "...", currentPage.value - 1, currentPage.value, currentPage.value + 1, "...", totalPages.value);
        }
    }
    return pages;
});

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};
</script>

<style lang="scss" scoped></style>
