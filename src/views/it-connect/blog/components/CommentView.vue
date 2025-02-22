<template>
    <h3>Bình luận</h3>
    <CommentBox :postId="postId" />
    <div>
        <div v-for="comment in commentTree" :key="comment.Id">
            <div class="border p-2 rounded">
                <div class="d-flex flex-column">
                    <div class="d-flex gap-2">
                        <div class="fw-bold">Ẩn danh</div>
                        <div class="text-muted">{{ store.formatDateTime(comment.CreatedAt) }}</div>
                    </div>
                    <div class="fs-4">{{ comment.Content }}</div>
                    <div class="d-flex gap-3 justify-content-end px-2" style="user-select: none">
                        <div class="d-flex gap-1 align-items-center fw-semibold" style="cursor: pointer">
                            <div :onclick="() => handleLikeComment(comment)">
                                <CommentLikeSwitch :active="hasLikeTheComment(comment.Id)" />
                            </div>
                            {{ comment.LikeCount }}
                        </div>
                        <div @click="commentSelectedForReply = comment.Id" class="hover_red_text fw-semibold" style="cursor: pointer"><i class="si si-action-undo"></i> Trả lời</div>
                    </div>
                    <div v-if="commentSelectedForReply == comment.Id">
                        <CommentBox :postId="postId" :parentId="comment.Id" :replyTo="comment.Content">
                            <div @click="commentSelectedForReply = null" class="btn btn-sm btn-primary">Hủy</div>
                        </CommentBox>
                    </div>
                </div>
                <div class="mt-2 d-flex flex-column gap-2">
                    <div v-for="comment in comment.NestComment.$values" :key="comment.Id">
                        <div class="border p-2 rounded">
                            <div class="d-flex align-items-center gap-1 border rounded px-1 bg-light mb-1">
                                <i class="si si-action-redo"></i>
                                {{ store.truncateText(comment.ReplyTo, 70) }}
                            </div>
                            <div class="d-flex gap-2">
                                <div class="fw-bold">Ẩn danh</div>
                                <div class="text-muted">{{ store.formatDateTime(comment.CreatedAt) }}</div>
                            </div>
                            <div class="fs-4">{{ comment.Content }}</div>
                            <div class="d-flex gap-3 justify-content-end" style="user-select: none">
                                <div class="d-flex gap-1 align-items-center fw-semibold" style="cursor: pointer">
                                    <div :onclick="() => handleLikeComment(comment)">
                                        <CommentLikeSwitch :active="hasLikeTheComment(comment.Id)" />
                                    </div>
                                    {{ comment.LikeCount }}
                                </div>
                                <div @click="commentSelectedForReply = comment.Id" class="hover_red_text fw-semibold" style="cursor: pointer"><i class="si si-action-undo"></i> Trả lời</div>
                            </div>
                            <div v-if="commentSelectedForReply == comment.Id">
                                <CommentBox :postId="postId" :parentId="comment.Id" :replyTo="comment.Content">
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
import CommentLikeSwitch from "./CommentLikeSwitch.vue";

const props = defineProps({
    postId: {
        type: Number,
    },
});

const store = useTemplateStore();

const commentSelectedForReply = ref(null);

const commentTree = ref([]);

// Handle get comment
async function getComments(postId) {
    const response = await guestRequest(`/comment?PostId=${postId}`);
    commentTree.value = response.data.$values;
}

// Handle like comment
function handleLikeComment(comment) {
    if (hasLikeTheComment(comment.Id)) {
        unLikeTheComment(comment.Id);
        comment.LikeCount++;
    } else {
        likeTheComment(comment.Id);
        if (comment.LikeCount > 0) {
            comment.LikeCount--;
        }
    }
}

function getStateLikeCommentKeyCache(commentId) {
    return `$itc:cmt:${commentId}:lk`;
}

function hasLikeTheComment(commentId) {
    return localStorage.getItem(getStateLikeCommentKeyCache(commentId)) == "true";
}
function likeTheComment(commentId) {
    localStorage.setItem(getStateLikeCommentKeyCache(commentId), "true");
}
function unLikeTheComment(commentId) {
    localStorage.setItem(getStateLikeCommentKeyCache(commentId), "false");
}

watch(
    () => props.postId,
    (newPostId) => {
        getComments(newPostId);
    }
);
</script>

<style lang="scss" scoped></style>
