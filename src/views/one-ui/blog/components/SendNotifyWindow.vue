<template>
    <div style="height: 0; overflow-y: scroll; flex-grow: 1">
        <SelectSubscription v-model="subscriptionData" />
        <SelectEmail v-model="emailData" />
        <div class="d-flex justify-content-end p-3">
            <div class="btn btn-sm btn-success" @click="sendEmail">Gửi</div>
        </div>
    </div>
</template>

<script setup>
import { reactive } from "vue";
import { authRequest } from "../../accountmanager/service/axiosConfig";
import SelectEmail from "./SelectEmail.vue";
import SelectSubscription from "./SelectSubscription.vue";
import { useTemplateStore } from "@/stores/template";

const data = defineModel();
const subscriptionData = reactive({
    subscriptionList: [],
});
const emailData = reactive({
    emailId: null,
    dataFill: data.value.post
});
const store = useTemplateStore();

async function sendEmail() {
    const params = {
        PostId: data.value.post.Id,
        CategoryId: data.value.post.Category.Id,
        EmailId: emailData.emailId,
        Subscriptions: subscriptionData.subscriptionList,
    };
    if (params.EmailId == null) {
        store.alert({title: "Hãy chọn loại nội dung Email", icon: "warning"});
        return;
    } else if (params.Subscriptions.length == 0) {
        store.alert({title: "Hãy chọn người nhận thông báo", icon: "warning"});
        return;
    } else if (params.PostId == null || params.CategoryId == null) {
        store.alert({title: "Hãy tải lại trang và thử lại", icon: "warning"});
        return;
    }
    try {
        await store.confirm({
            title: "Xác nhận gửi",
            callback: async () => {
                const response = await authRequest.post("/Notification/send-notifications", params);
                await store.alert({title: "Gửi thành công"})
            },
        });
    } catch (error) {
        store.alert({title: "Gửi thất bại", icon: "error"})
    }
}
</script>

<style lang="scss" scoped></style>
