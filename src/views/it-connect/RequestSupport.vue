<template>
    <div class="container">
        <div class="bg-white my-4 p-3">
            <div>
                <h1>{{ store.isVietNamese() ? "Các kênh hỗ trợ" : "Support Channels" }}</h1>
                <p>
                    1. {{ store.isVietNamese() ? "Đến" : "Visit" }} <span class="bg-success text-white rounded p-1">{{ store.isVietNamese() ? "trực tiếp" : "directly" }}</span>
                    {{ store.isVietNamese() ? "Phòng Công nghệ Thông tin để được hỗ trợ" : "the IT Department for support" }}
                </p>
                <p>
                    2. {{ store.isVietNamese() ? "Liên hệ qua" : "Contact via" }} <span class="bg-success text-white rounded p-1">{{ store.isVietNamese() ? "số điện thoại" : "phone number" }}</span
                    >: <strong>028 7109 9131</strong>
                </p>
                <p>
                    3. {{ store.isVietNamese() ? "Truy cập các" : "Access the following" }}
                    <span class="bg-success text-white rounded p-1">{{ store.isVietNamese() ? "kênh online" : "online channels" }}</span
                    >: <span class="text-danger">({{ store.isVietNamese() ? "Lưu ý: Nhấp vào các nút dưới đây để truy cập" : "Note: Click the buttons below to access" }})</span>
                </p>
            </div>
            <br />
            <div class="row">
                <a href="javascript:window.open('https://teams.microsoft.com/l/chat/0/0?users=hotro@vlu.edu.vn')" class="hover_underline col-lg py-4 text-black">
                    <div class="mb-2" style="font-size: 1.5rem">{{ store.isVietNamese() ? "Trò chuyện" : "Chat" }}</div>
                    <div>{{ store.isVietNamese() ? "Trao đổi cùng kỹ thuật viên qua MS Team" : "Communicate with technicians via MS Teams" }}</div>
                </a>
                <a href="javascript:window.open('mailto:p.cntt@vlu.edu.vn')" class="hover_underline col-lg py-4 text-black" style="border-left: 1px solid lightgray">
                    <div class="mb-2" style="font-size: 1.5rem">{{ store.isVietNamese() ? "Gửi email" : "Send Email" }}</div>
                    <div>{{ store.isVietNamese() ? "Gửi yêu cầu hỗ trợ đến email P.CNTT" : "Send a support request to the IT Department email" }}</div>
                </a>
                <a href="javascript:window.open('https://ticket.vlu.edu.vn/')" class="hover_underline col-lg py-4 text-black" style="border-left: 1px solid lightgray">
                    <div class="mb-2" style="font-size: 1.5rem">{{ store.isVietNamese() ? "Báo hỏng phòng máy" : "Report Computer Lab Issues" }}</div>
                    <div>{{ store.isVietNamese() ? "Truy cập gửi thông tin về hư hỏng, sự cố thiết bị tại phòng máy" : "Access to report issues with equipment in computer labs" }}</div>
                </a>
                <a href="javascript:window.open('https://forms.office.com/r/AxMrb45fku/')" class="hover_underline col-lg py-4 text-black" style="border-left: 1px solid lightgray">
                    <div class="mb-2" style="font-size: 1.5rem">{{ store.isVietNamese() ? "Cài đặt phần mềm" : "Software Installation" }}</div>
                    <div>{{ store.isVietNamese() ? "Truy cập gửi thông tin yêu cầu hỗ trợ cài đăt phần mềm" : "Access to submit a request for software installation support" }}</div>
                </a>
            </div>
            <br />
            <br />
            <div>
                <div class="d-flex justify-content-between align-items-center flex-wrap">
                    <h1>{{ store.isVietNamese() ? "Hệ sinh thái hỗ trợ kỹ thuật" : "Technical Support Ecosystem" }}</h1>
                    <div class="d-flex gap-3">
                        <h4 class="text-primary">VLU</h4>
                        <h4>VLSC</h4>
                        <h4>BETU</h4>
                    </div>
                </div>
                <div class="">
                    <div class="hover_underline mb-3">
                        <a class="text-info" href="javascript:window.open('https://vanlangunivn.sharepoint.com/sites/Qunllchhpskin')">{{
                            store.isVietNamese() ? "Quản lý lịch công tác đơn vị" : "Unit Work Schedule Management"
                        }}</a>
                    </div>
                    <div class="hover_underline mb-3">
                        <a class="text-info" href="javascript:window.open('https://vanlangunivn.sharepoint.com/sites/HtroKTPmay')">{{
                            store.isVietNamese() ? "Hỗ trợ kỹ thuật phòng máy" : "Computer Lab Technical Support"
                        }}</a>
                    </div>
                    <div class="hover_underline mb-3">
                        <a class="text-info" href="javascript:window.open('https://vanlangunivn.sharepoint.com/sites/daotaonoibo')">{{
                            store.isVietNamese() ? "LMS - Trung tâm Đào tạo và Phát triển" : "LMS - Training and Development Center"
                        }}</a>
                    </div>
                    <div class="hover_underline mb-3">
                        <a class="text-info" href="javascript:window.open('https://vanlangunivn.sharepoint.com/sites/PSCOT')">{{
                            store.isVietNamese() ? "PSC Operation Tracking" : "PSC Operation Tracking"
                        }}</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useTemplateStore } from "@/stores/template";

const store = useTemplateStore();

store.setBreadcrumb([
    {
        name: "Hỗ trợ",
        path: "/support",
    },
]);
</script>
