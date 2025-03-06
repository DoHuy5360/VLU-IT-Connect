<script setup>
import { msRequest } from "./accountmanager/service/axiosConfig";

async function fetchProtectedData() {
    const response = await msRequest.get("/api/admin/posts");
    try {
        console.log("Kết quả nhận được:", response.data);
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

fetchProtectedData();
</script>

<template>
    <BasePageHeading title="Chào Mừng Quản Trị Viên" subtitle="">
        <template #extra>
            <!-- <button type="button" class="btn btn-alt-primary" v-click-ripple>
        <i class="fa fa-plus opacity-50 me-1"></i>
        Add
      </button> -->
            <!-- <div>{{ msalConfig.state }}</div> -->
        </template>
    </BasePageHeading>

    <div class="content">
        <div class="row g-4">
            <RouterLink to="/administrator/blog" class="col-3" style="cursor: pointer">
                <div class="navigate-items p-4 bg-white rounded border border-gray">
                    <div class="d-flex justify-content-between">
                        <span>Danh sách bài viết</span>
                        <span><i class="si si-arrow-right"></i></span>
                    </div>
                </div>
            </RouterLink>
            <RouterLink to="/administrator/category" class="col-3" style="cursor: pointer">
                <div class="navigate-items p-4 bg-white rounded border border-gray">
                    <div class="d-flex justify-content-between">
                        <span>Danh sách thể loại</span>
                        <span><i class="si si-arrow-right"></i></span>
                    </div>
                </div>
            </RouterLink>
            <RouterLink to="/administrator/account" class="col-3" style="cursor: pointer">
                <div class="navigate-items p-4 bg-white rounded border border-gray">
                    <div class="d-flex justify-content-between">
                        <span>Danh sách tài khoản</span>
                        <span><i class="si si-arrow-right"></i></span>
                    </div>
                </div>
            </RouterLink>
            <RouterLink to="/administrator/accountmanager" class="col-3" style="cursor: pointer">
                <div class="navigate-items p-4 bg-white rounded border border-gray">
                    <div class="d-flex justify-content-between">
                        <span>Danh sách quyền hạn</span>
                        <span><i class="si si-arrow-right"></i></span>
                    </div>
                </div>
            </RouterLink>
        </div>
    </div>
</template>

<style>
.navigate-items:hover {
    background-color: #eff6ff !important;
}
</style>
