<template>
    <div class="container">
        <div class="py-10 d-grid text-center">
            Dịch vụ đang được phát triển
        </div>
    </div>
    <!-- <div class="container">
        <div class="py-3">
            <div class="row">
                <div class="col">
                    <div>
                        <label for="" class="form-label">Đơn vị yêu cầu <RequiredStar /> </label>
                        <select id="" class="form-select">
                            <option value="">Khoa A</option>
                        </select>
                    </div>
                    <br>
                    <div class="col">
                        <label for="" class="form-label">Số điện thoại liên lạc <RequiredStar /></label>
                        <input id="" type="text" class="form-control" />
                    </div>
                    <br>
                    <div class="col">
                        <label for="" class="form-label">Email</label>
                        <input id="" type="text" class="form-control" />
                    </div>
                </div>
                <div class="col">
                    <label for="" class="form-label">Loại sự cố <RequiredStar /></label>
                    <select id="" v-model="selectedProblem" class="form-select">
                        <option v-for="problem in problemOptions" :key="problem.name" :value="problem.name">
                            {{ problem.name }}
                        </option>
                    </select>
                    <br />
                    <textarea v-if="selectedProblem == 'Khác'" id="" class="form-control" rows="6" placeholder="Nhập loại sự cố..."></textarea>
                </div>
            </div>
            <br />
            <div>
                <div class="btn btn-md btn-success">Gửi yêu cầu</div>
            </div>
        </div>
    </div> -->
</template>

<script setup>
import { useTemplateStore } from "@/stores/template";
import RequiredStar from "../../components/custom/RequiredStar.vue";
import { ref } from "vue";

const store = useTemplateStore();

const problemOptions = ref([
    { name: "Phần cứng", value: "Phần cứng" },
    { name: "Phần mềm", value: "Phần mềm" },
    { name: "Mạng", value: "Mạng" },
    { name: "Khác", value: "Khác" },
]);
const selectedProblem = ref();

store.setBreadcrumb([
    {
        name: {
            vn: "Hỗ trợ",
            en: "Support",
        },
        path: "/support",
    },
]);

store.setHeroTitleName({
    vn: "Hỗ trợ",
    en: "Support",
});
</script>

<style lang="scss" scoped></style>
