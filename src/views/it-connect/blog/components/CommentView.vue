<template>
    <h3>{{ store.isVietNamese() ? "Bình luận" : "Comment" }}</h3>
    <div v-if="allowComment">
        <CommentBox :postId="postId" :callback="handleAfterComment">
            <div v-if="commentCensorship" class="text-muted">
                {{ store.isVietNamese() ? "Bình luận của bạn sẽ được kiểm tra trước khi hiển thị" : "Your comment will be moderated before being displayed" }}
            </div>
        </CommentBox>
        <div class="d-flex flex-column gap-2">
            <div v-for="parentComment in commentTree" :key="parentComment.Id">
                <div class="border p-2 rounded">
                    <div class="d-flex gap-1 flex-column">
                        <div class="d-flex gap-2">
                            <div class="fw-bold">{{ store.isVietNamese() ? "Ẩn danh" : "Anonymous" }}</div>
                            <div class="text-muted">{{ store.formatDateTime(parentComment.CreatedAt) }}</div>
                        </div>
                        <div class="fs-6">{{ parentComment.Content }}</div>
                        <div class="d-flex gap-3 justify-content-start px-2" style="user-select: none">
                            <!-- <div class="d-flex gap-1 align-items-center fw-semibold" style="cursor: pointer">
                                <div :onclick="() => handleLikeComment(parentComment)">
                                    <CommentLikeSwitch :active="hasLikeTheComment(parentComment.Id)" />
                                </div>
                                {{ parentComment.LikeCount }}
                            </div> -->
                            <div @click="() => openReplyCommentBox(parentComment.Id)" class="hover_red_text fw-semibold" style="cursor: pointer">
                                <i class="si si-action-undo"></i> {{ store.isVietNamese() ? "Trả lời" : "Reply" }}
                            </div>
                        </div>
                        <div v-if="isReplyThisComment(parentComment.Id)" class="mt-1">
                            <CommentBox :postId="postId" :parentId="parentComment.Id" :replyTo="parentComment.Id" :replyToContent="parentComment.Content" :callback="handleAfterComment">
                                <div v-if="commentCensorship" class="text-muted">
                                    {{ store.isVietNamese() ? "Bình luận của bạn sẽ được kiểm tra trước khi hiển thị" : "Your comment will be moderated before being displayed" }}
                                </div>

                                <div @click="() => closeCurrentReplyCommentBox()" class="btn btn-sm btn-primary">{{ store.isVietNamese() ? "Hủy" : "Cancel" }}</div>
                            </CommentBox>
                        </div>
                    </div>
                    <div class="mt-2 d-flex flex-column gap-2">
                        <div v-for="childComment in parentComment.NestComment.$values" :key="childComment.Id">
                            <div class="border p-2 rounded">
                                <div class="d-flex align-items-center gap-1 border rounded px-1 bg-light mb-1">
                                    <i class="si si-action-redo"></i>
                                    {{ store.truncateText(childComment.ReplyToContent, 70) }}
                                </div>
                                <div class="d-flex gap-2">
                                    <div class="fw-bold">{{ store.isVietNamese() ? "Ẩn danh" : "Anonymous" }}</div>
                                    <div class="text-muted">{{ store.formatDateTime(childComment.CreatedAt) }}</div>
                                </div>
                                <div class="fs-6">{{ childComment.Content }}</div>
                                <div class="d-flex gap-3 justify-content-start" style="user-select: none">
                                    <!-- <div class="d-flex gap-1 align-items-center fw-semibold" style="cursor: pointer">
                                        <div :onclick="() => handleLikeComment(childComment)">
                                            <CommentLikeSwitch :active="hasLikeTheComment(childComment.Id)" />
                                        </div>
                                        {{ childComment.LikeCount }}
                                    </div> -->
                                    <div @click="() => openReplyCommentBox(childComment.Id)" class="hover_red_text fw-semibold" style="cursor: pointer">
                                        <i class="si si-action-undo"></i> {{ store.isVietNamese() ? "Trả lời" : "Reply" }}
                                    </div>
                                </div>
                                <div v-if="isReplyThisComment(childComment.Id)" class="mt-1">
                                    <CommentBox :postId="postId" :parentId="parentComment.Id" :replyTo="childComment.Id" :replyToContent="childComment.Content" :callback="handleAfterComment">
                                        <div v-if="commentCensorship" class="text-muted">
                                            {{ store.isVietNamese() ? "Bình luận của bạn sẽ được kiểm tra trước khi hiển thị" : "Your comment will be moderated before being displayed" }}
                                        </div>

                                        <div @click="() => closeCurrentReplyCommentBox()" class="btn btn-sm btn-primary">{{ store.isVietNamese() ? "Hủy" : "Cancel" }}</div>
                                    </CommentBox>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else>{{ store.isVietNamese() ? "Tính năng bình luận đăng bị tắt" : "Comment is not allowed" }}</div>
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
    allowComment: {
        type: Boolean,
        default: false,
    },
    commentCensorship: {
        type: Boolean,
        default: false,
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

function handleAfterComment() {
    closeCurrentReplyCommentBox();
    if (props.commentCensorship) {
        store.alert({
            title: store.isVietNamese() ? "Bình luận thành công!" : "Success!",
            text: store.isVietNamese() ? "Bình luận của bạn cần được quản trị viên phê duyệt để hiển thị." : "Your comment needs to be approved by an administrator to appear.",
        });
    } else {
        store.alert({
            title: store.isVietNamese() ? "Bình luận thành công!" : "Success!",
        });
    }
    // Update comment
    getComments(props.postId);
}

// Handle reply comment
function openReplyCommentBox(selectedCommentId) {
    commentSelectedForReply.value = selectedCommentId;
}

function closeCurrentReplyCommentBox() {
    commentSelectedForReply.value = null;
}

function isReplyThisComment(trackedCommentId) {
    return commentSelectedForReply.value == trackedCommentId;
}

// Handle like comment
function handleLikeComment(comment) {
    if (hasLikeTheComment(comment.Id)) {
        unLikeTheComment(comment.Id);
        if (comment.LikeCount > 0) {
            comment.LikeCount--;
        }
    } else {
        likeTheComment(comment.Id);
        comment.LikeCount++;
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
