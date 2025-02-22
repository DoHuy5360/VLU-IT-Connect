<template>
    <h3>Bình luận</h3>
    <CommentBox />
    <div>
        <div v-for="comment in commentList" :key="comment.id">
            <div class="border p-2 rounded">
                <div class="d-flex flex-column">
                    <div class="d-flex gap-2">
                        <div class="fw-bold">Ẩn danh</div>
                        <div class="text-muted">{{ comment.createdAt }}</div>
                    </div>
                    <div class="fs-4">{{ comment.content }}</div>
                    <div class="d-flex gap-3 justify-content-end px-2">
                        <div class="d-flex gap-1 fw-semibold" style="cursor: pointer">
                            <div class="hover_blue_text">
                                <i class="si si-like"></i>
                            </div>
                            {{ comment.likeCount }}
                        </div>
                        <div @click="commentSelectedForReply = comment.id" class="hover_red_text fw-semibold" style="cursor: pointer"><i class="si si-action-undo"></i> Trả lời</div>
                    </div>
                    <div v-if="commentSelectedForReply == comment.id">
                        <CommentBox :replyTo="comment.content">
                            <div @click="commentSelectedForReply = null" class="btn btn-sm btn-primary">Hủy</div>
                        </CommentBox>
                    </div>
                </div>
                <div class="mt-2 d-flex flex-column gap-2">
                    <div v-for="comment in comment.replyComments" :key="comment.id">
                        <div class="border p-2 rounded">
                            <div class="d-flex align-items-center gap-1 border rounded px-1 bg-light mb-1">
                                <i class="si si-action-redo"></i>
                                {{ store.truncateText(comment.replyTo, 70) }}
                            </div>
                            <div class="d-flex gap-2">
                                <div class="fw-bold">Ẩn danh</div>
                                <div class="text-muted">{{ comment.createdAt }}</div>
                            </div>
                            <div class="fs-4">{{ comment.content }}</div>
                            <div class="d-flex gap-3 justify-content-end">
                                <div class="d-flex gap-1 fw-semibold" style="cursor: pointer">
                                    <div class="hover_blue_text">
                                        <i class="si si-like"></i>
                                    </div>
                                    {{ comment.likeCount }}
                                </div>
                                <div @click="commentSelectedForReply = comment.id" class="hover_red_text fw-semibold" style="cursor: pointer"><i class="si si-action-undo"></i> Trả lời</div>
                            </div>
                            <div v-if="commentSelectedForReply == comment.id">
                                <CommentBox :replyTo="comment.content">
                                    <div @click="commentSelectedForReply = null" class="btn btn-sm btn-primary">Hủy</div>
                                </CommentBox>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useTemplateStore } from "@/stores/template";
import CommentBox from "./CommentBox.vue";
import { onMounted, ref, watch } from "vue";
import { reactive } from "vue";
import { guestRequest } from "../../../one-ui/accountmanager/service/axiosConfig";

const props = defineProps({
    postId: {
        type: Number,
    },
});

const store = useTemplateStore();

const commentSelectedForReply = ref(null);

const commentList = [
    {
        id: 1,
        content: "đã thử nhưng ko được nhé. bạn đính kèm video hướng dẫn được ko?",
        createdAt: "19/02/2025 - 18:20:30",
        likeCount: 243,
        replyComments: [
            {
                id: 2,
                content: "Được nhé, chờ mình một lát!",
                createdAt: "19/02/2025 - 18:20:30",
                likeCount: 2367,
                replyTo: "đã thử nhưng ko được nhé. bạn đính kèm video hướng dẫn được ko?",
            },
            {
                id: 3,
                content: "Mãi vẫn chưa thấy đâu? Làm ăn chán thật.",
                createdAt: "20/02/2025 - 18:20:30",
                likeCount: 235,
                replyTo: "Được nhé, chờ mình một lát!",
            },
        ],
    },
];

async function getComments() {
    const response = await guestRequest(`/comment?PostId=${props.postId}`);
}

watch(
    () => props.postId,
    (newPostId) => {
        getComments(newPostId);
    }
);
</script>

<style lang="scss" scoped></style>
