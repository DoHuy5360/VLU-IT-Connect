<template>
    <div class="gap-3" style="display: grid; grid-template-rows: 550px 1fr">
        <div
            class="w-100 h-100"
            style="
                display: flex;
                flex-direction: column;
                background-image: url('../../../assets/media/brand/vlu_landscape.png');
                background-repeat: no-repeat;
                background-size: cover;
                background-position: center;
            "
        >
            <div
                class="w-100 h-100"
                style="
                    background: rgba(0, 0, 0, 0.3);
                    display: grid;
                    place-items: center;
                "
            >
                <div class="d-flex flex-column align-items-center">
                    <span
                        class="text-white mb-2"
                        style="font-weight: bold; font-size: xx-large"
                        >Bạn cần giúp đỡ vấn đề gì?</span
                    >
                    <div class="bg-white rounded-pill px-2 py-1">
                        <input
                            type="text"
                            style="
                                outline: none;
                                border: none;
                                width: 400px;
                            "
                            autofocus
                        />
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                                stroke="#171717"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M22 22L20 20"
                                stroke="#171717"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </div>
                </div>
            </div>
            <div
                class="w-100 bg-gray position-relative"
                style="bottom: 0; height: 100px"
            >
                <div class="position-absolute w-100" style="bottom: 15px;">
                    <div class="container">
                        <div
                            class="row justify-content-center bg-white rounded"
                        >
                            <div class="col-4 p-3">
                                <img
                                    src="https://images.unsplash.com/photo-1580795479225-c50ab8c3348d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    style="
                                        object-fit: cover;
                                        display: block;
                                        width: 100%;
                                        height: 100px;
                                    "
                                    alt=""
                                />
                                <div class="d-flex flex-column">
                                    <b>Yêu cầu hỗ trợ</b>
                                    <span style=""
                                        >Hỗ trợ nhanh theo các danh mục dịch
                                        vụ Công nghệ thông tin sẵn có.</span
                                    >
                                </div>
                            </div>
                            <div class="col-4 p-3">
                                <img
                                    src="https://images.unsplash.com/photo-1495427513693-3f40da04b3fd?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    style="
                                        object-fit: cover;
                                        display: block;
                                        width: 100%;
                                        height: 100px;
                                    "
                                    alt=""
                                />
                                <div class="d-flex flex-column">
                                    <b>Trợ giúp</b>
                                    <span style=""
                                        >Bạn không tìm thấy những thông tin
                                        cần thiết trên đây? Hãy liên hệ với
                                        bộ phận Hỗ trợ dịch vụ CNTT.</span
                                    >
                                </div>
                            </div>
                            <div class="col-4 p-3">
                                <img
                                    src="https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?q=80&w=1468&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    style="
                                        object-fit: cover;
                                        display: block;
                                        width: 100%;
                                        height: 100px;
                                    "
                                    alt=""
                                />
                                <div class="d-flex flex-column">
                                    <b>Kiến thức Công nghệ thông tin</b>
                                    <span style=""
                                        >Tìm kiếm thông tin để khắc phục sự
                                        cố hoặc tìm hiểu cách thực hiện
                                        những gì bạn cần.</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex flex-column gap-3">
            <div class="container py-2">
                <div class="row gap-4">
                    <div class="col rounded p-4 bg-white shadow-sm">
                        <h4 class="mb-3" style="font-weight: bold">
                            Các câu hỏi thường gặp
                        </h4>
                        <div class="d-flex flex-column gap-3">
                            <div
                                v-for="(
                                    question, index
                                ) in frequentlyAskedQuestions"
                                :key="index"
                            >
                                <div class="d-flex gap-2">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z"
                                            fill="#171717"
                                        />
                                        <path
                                            d="M10.74 16.28C10.55 16.28 10.36 16.21 10.21 16.06C9.91999 15.77 9.91999 15.29 10.21 15L13.21 12L10.21 9.00003C9.91999 8.71003 9.91999 8.23003 10.21 7.94003C10.5 7.65003 10.98 7.65003 11.27 7.94003L14.8 11.47C15.09 11.76 15.09 12.24 14.8 12.53L11.27 16.06C11.12 16.21 10.93 16.28 10.74 16.28Z"
                                            fill="#171717"
                                        />
                                    </svg>
                                    <b class="hover_underline" style="cursor: pointer;">{{ question }}</b>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col rounded p-4 bg-white shadow-sm">
                        <h4 class="mb-3" style="font-weight: bold">
                            Thông báo
                        </h4>
                        <div class="d-flex flex-column gap-3">
                            <div
                                v-for="(notice, index) in notifications"
                                :key="index"
                            >
                                <div class="d-flex gap-2">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M8.91 19.92L15.43 13.4C16.2 12.63 16.2 11.37 15.43 10.6L8.91 4.07996"
                                            stroke="#171717"
                                            stroke-width="1.5"
                                            stroke-miterlimit="10"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                    <b class="hover_underline" style="cursor: pointer;">
                                        {{ notice }}
                                    </b>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container py-2 bg-white rounded mb-3">
                <div class="d-flex justify-content-between">
                    <h4 class="mb-3" style="font-weight: bold">
                        Clip hướng dẫn sử dụng
                    </h4>
                    <b class="text-danger hover_underline" style="cursor: pointer;">Xem tất cả</b>
                </div>
                <div class="row">
                    <div class="col-4">
                        <iframe width="100%" height="200px" src="https://www.youtube.com/embed/u31qwQUeGuM?si=9IaKmebZwgbysBE6" frameborder="0" allowfullscreen class="rounded"></iframe>
                        <div>
                            <strong>Hướng dẫn</strong>
                            <div>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maxime aliquid iusto tempore recusandae obcaecati</div>
                        </div>
                    </div>
                    <div class="col-4">
                        <iframe width="100%" height="200px" src="https://www.youtube.com/embed/u31qwQUeGuM?si=9IaKmebZwgbysBE6" frameborder="0" allowfullscreen class="rounded"></iframe>
                        <div>
                            <strong>Hướng dẫn</strong>
                            <div>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maxime aliquid iusto tempore recusandae obcaecati</div>
                        </div>
                    </div>
                    <div class="col-4">
                        <iframe width="100%" height="200px" src="https://www.youtube.com/embed/u31qwQUeGuM?si=9IaKmebZwgbysBE6" frameborder="0" allowfullscreen class="rounded"></iframe>
                        <div>
                            <strong>Hướng dẫn</strong>
                            <div>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maxime aliquid iusto tempore recusandae obcaecati</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useTemplateStore } from "@/stores/template";
const store = useTemplateStore();

const frequentlyAskedQuestions = [
    "Truy cập Wifi Văn Lang như thế nào?",
    "Địa chỉ email của em là gì và sử dụng như thế nào?",
    "Tài khoản các dịch vụ CNTT của sinh viên bao gồm những tài khoản nào?",
    "Em muốn thay đổi mật khẩu các dịch vụ CNTT thì làm như thế nào?",
    "Sử dụng Microsoft Teams như thế nào?",
    "Đăng nhập vào trang Elearning như thế nào?",
    "Làm thế nào để tìm được lớp học trên Elearning?",
    "Em không ghi danh được vào lớp học trên trang E-learning thì phải làm sao?",
];

const notifications = [
    "Nâng cấp hệ thống Wifi và dịch vụ CNTT",
    "Lịch thi (lần 1) học kỳ 1 năm học 2024- 2025",
    "Lịch thi xếp lớp tiếng Anh K28",
];
</script>

<style lang="css" scoped>

.hover_underline:hover{
    text-decoration: underline;
}

</style>
