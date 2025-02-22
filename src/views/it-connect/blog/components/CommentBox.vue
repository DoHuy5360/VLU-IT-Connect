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
import { guestRequest } from "../../../one-ui/accountmanager/service/axiosConfig";

const store = useTemplateStore();

const props = defineProps({
    postId: {
        type: Number,
        default: null,
    },
    parentId: {
        type: Number,
        default: null,
    },
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

    console.log(props.postId, props.parentId, props.replyTo, comment.value);

    const formData = new FormData();
    formData.append("PostId", props.postId);
    formData.append("ParentId", props.parentId);
    formData.append("ReplyTo", props.replyTo);
    formData.append("Content", comment.value);

    const response = await guestRequest.post("/comment", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(response);

    store.alert({ title: "Bình luận thành công", text: "Bình luận đang được phê duyệt, vui lòng đợi." });
}
</script>

<style lang="scss" scoped></style>
