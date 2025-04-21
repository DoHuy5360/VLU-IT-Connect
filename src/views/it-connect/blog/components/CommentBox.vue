<template>
    <div class="d-flex flex-column gap-2 mb-2 align-items-end">
        <div class="w-100">
            <textarea
                v-model="comment"
                :class="{ 'is-invalid': v$.comment.$errors.length }"
                class="form-control w-100"
                style="resize: vertical; min-height: 5rem"
                :placeholder="store.isVietNamese() ? 'Ý kiến gì đó...' : 'Type something...'"
            ></textarea>
            <div v-if="v$.comment.$errors.length" class="invalid-feedback">
                <span v-if="v$.comment.$errors[0].$validator === 'required'">{{ store.isVietNamese() ? "Bình luận không được để trống." : "Required" }}</span>
            </div>
            <div v-if="v$.comment.$errors.length" class="invalid-feedback">
                <span v-if="v$.comment.$errors[0].$validator === 'maxLength'">{{
                    store.isVietNamese() ? `Bình luận không được vượt quá ${MAX_COMMENT_LENGTH} ký tự.` : `Maximum letter allowed ${MAX_COMMENT_LENGTH}`
                }}</span>
            </div>
        </div>
        <div class="d-flex gap-2 align-items-start align-items-lg-center">
            <slot></slot>
            <div class="btn btn-sm btn-secondary" style="white-space: nowrap" @click="createComment">{{ store.isVietNamese() ? "Đăng bình luận" : "Post comments" }}</div>
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
        type: Number,
        default: null,
    },
    replyToContent: {
        type: String,
        default: null,
    },
    callback: {
        type: Function,
        default: function () {},
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

    try {
        await guestRequest.post(
            "/comment",
            {
                PostId: props.postId,
                ParentId: props.parentId,
                ReplyTo: props.replyTo,
                ReplyToContent: props.replyToContent,
                Content: comment.value,
            },
            {
                headers: { "Content-Type": "application/json" },
            }
        );

        comment.value = "";
        props.callback();
    } catch (error) {
        console.log(error);
        store.alert({ title: "Bình luận thất bại", icon: "error", text: "" });
    }
}
</script>

<style lang="scss" scoped></style>
