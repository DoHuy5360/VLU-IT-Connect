<template>
    <BaseBlock class="d-flex flex-column h-100 mb-0">
        <template #content>
            <div class="block-content block-content-full flex-grow-1 d-flex justify-content-between align-items-center">
                <dl class="mb-0">
                    <dt class="fs-3 fw-bold">{{ value }}</dt>
                    <dd class="fs-sm fw-medium fs-sm fw-medium text-muted mb-0">{{ label }}</dd>
                </dl>
                <div class="item item-rounded-lg bg-body-light">
                    <slot></slot>
                </div>
            </div>
            <div v-if="canRedirect" class="bg-body-light rounded-bottom">
                <a class="block-content block-content-full block-content-sm fs-sm fw-medium d-flex align-items-center justify-content-between" href="javascript:void(0)">
                    <span>Xem</span>
                    <i class="fa fa-arrow-alt-circle-right ms-1 opacity-25 fs-base"></i>
                </a>
            </div>
        </template>
    </BaseBlock>
</template>

<script setup>
const props = defineProps({
    value: {
        type: Number,
    },
    label: {
        type: String,
    },
    canRedirect: {
        type: Boolean,
    },
});
</script>

<style lang="scss" scoped></style>
