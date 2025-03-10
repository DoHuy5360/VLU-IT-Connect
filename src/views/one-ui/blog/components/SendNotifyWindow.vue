<template>
    <div style="height: 0; overflow-y: scroll;flex-grow: 1;">
        <SelectSubscription/>
        <SelectEmail/>
        <div class="d-flex justify-content-end p-3">
            <div class="btn btn-sm btn-success" @click="sendEmail">Gửi</div>
        </div>
    </div>
</template>

<script setup>
import SelectEmail from './SelectEmail.vue';
import SelectSubscription from './SelectSubscription.vue';
import { useTemplateStore } from '@/stores/template';

const store = useTemplateStore()

async function sendEmail() {
    console.log(1);
    store.confirm({
        title: "Xác nhạn gửi",
        callback: ()=>{
            alert("Gửi thành công")
        }
    })
}

</script>

<style lang="scss" scoped>

</style>