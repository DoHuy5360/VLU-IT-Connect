<template>
    <div class="d-flex flex-column gap-2 mb-2 align-items-end">
        <div class="w-100">
            <textarea
                v-model="comment"
                :class="{ 'is-invalid': v$.comment.$errors.length }"
                class="form-control w-100"
                style="resize: vertical; min-height: 5rem"
                placeholder="Ý kiến gì đó..."
            ></textarea>
            <div v-if="v$.comment.$errors.length" class="invalid-feedback">
                <span v-if="v$.comment.$errors[0].$validator === 'required'">Bình luận không được để trống.</span>
            </div>
            <div v-if="v$.comment.$errors.length" class="invalid-feedback">
                <span v-if="v$.comment.$errors[0].$validator === 'maxLength'">Bình luận không được vượt quá {{ MAX_COMMENT_LENGTH }} ký tự.</span>
            </div>
        </div>
        <div class="d-flex gap-2 align-items-center">
            <slot></slot>
            <div class="btn btn-sm btn-secondary" @click="createComment">Lưu bình luận</div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, minLength, maxLength, url } from "@vuelidate/validators";
import { useTemplateStore } from "@/stores/template";

const store = useTemplateStore();

const props = defineProps({
    replyTo: {
        type: String,
        default: null,
    },
});

// Comment box
const MAX_COMMENT_LENGTH = 1000;
const comment = ref("");

const commentRule = {
    comment: {
        required,
        maxLength: maxLength(MAX_COMMENT_LENGTH),
    },
};

const v$ = useVuelidate(commentRule, { comment });

async function createComment() {
    v$.value.$touch(); // Đánh dấu trường đã được kiểm tra
    if (v$.value.$invalid) {
        return; // Nếu không hợp lệ, không gửi bình luận
    }

    console.log("Bình luận hợp lệ:", comment.value);
    console.log("Trả lời", props.replyTo);

    store.alert({ title: "Bình luận thành công", text: "Bình luận đang được phê duyệt, vui lòng đợi." });
}
</script>

<style lang="scss" scoped></style>
