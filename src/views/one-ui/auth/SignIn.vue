<template>
    <div
        class="hero-static d-flex align-items-center"
        :style="`position: relative; min-height: 100vh; background: url(${store.getBrandAsset('/sign.png')}) no-repeat center center; background-size: cover`"
    >
        <!-- Dark Overlay -->
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1"></div>

        <!-- Content -->
        <div class="content" style="position: relative; z-index: 2">
            <div class="row justify-content-center push">
                <div class="col-md-8 col-lg-6 col-xl-4">
                    <!-- Sign In Block -->
                    <BaseBlock title="" class="mb-0">
                        <div class="p-sm-3 px-lg-4 px-xxl-5 py-lg-5">
                            <div class="text-center mb-4">
                                <img :src="store.getBrandAsset('/30_years_vertical_version.png')" alt="VLU Logo" style="max-width: 80%; height: auto" />
                            </div>
                            <p class="fw-medium text-muted text-center">Vui lòng đăng nhập</p>
                            <form @submit.prevent="onSubmit">
                                <div class="py-3">
                                    <div class="mb-4">
                                        <label hidden for="email">email</label>
                                        <input
                                            id="email"
                                            type="email"
                                            class="form-control form-control-alt form-control-lg"
                                            v-model="state.email"
                                            placeholder="Email"
                                            :class="{ 'is-invalid': v$.email.$errors.length }"
                                            @blur="v$.email.$touch"
                                        />
                                        <div v-if="v$.email.$errors.length" class="invalid-feedback">
                                            <span v-if="v$.email.$errors[0].$validator === 'required'"> Hãy nhập Email </span>
                                            <span v-if="v$.email.$errors[0].$validator === 'email'"> Email không hợp lệ </span>
                                        </div>
                                    </div>
                                    <div class="mb-4">
                                        <label hidden for="password">password</label>
                                        <input
                                            id="password"
                                            type="password"
                                            class="form-control form-control-alt form-control-lg"
                                            v-model="state.password"
                                            placeholder="Mật khẩu"
                                            :class="{ 'is-invalid': v$.password.$errors.length }"
                                            @blur="v$.password.$touch"
                                        />
                                        <div v-if="v$.password.$errors.length" class="invalid-feedback">
                                            <span v-if="v$.password.$errors[0].$validator === 'required'"> Hãy nhập mật khẩu </span>
                                            <span v-if="v$.password.$errors[0].$validator === 'minLength'"> Password must be at least 5 characters. </span>
                                        </div>
                                    </div>
                                    <div v-if="state.loginError" class="text-danger mt-2 text-center mb-3">Đăng nhập thất bại, vui lòng kiểm tra lại Email và Mật khẩu</div>
                                    <div class="mb-4 d-flex justify-content-between align-items-center">
                                        <div class="form-check">
                                            <!-- <input class="form-check-input" type="checkbox" />
                      <label class="form-check-label">Nhớ tôi</label> -->
                                        </div>
                                        <button type="submit" class="btn btn-alt-success" :disabled="isLoading.login">Đăng nhập</button>
                                    </div>
                                    <div class="text-center my-3">
                                        <hr class="my-4" />
                                        <span class="bg-white px-3">Hoặc</span>
                                    </div>
                                    <div class="text-center">
                                        <button type="button" class="btn btn-alt-primary btn-lg px-4" :disabled="isLoading.microsoft" @click="handleLoginByMicrosoft">
                                            <i class="fab fa-microsoft me-3"></i>
                                            Đăng nhập bằng Microsoft
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </BaseBlock>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, onMounted, inject } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { useRouter } from "vue-router";
import { gateRequest } from "../accountmanager/service/axiosConfig";
import { useTemplateStore } from "@/stores/template";
import { myMSALObj } from "../../../config/msalConfig";
import { useAuth } from "../../../config/useAuth";

const { login, logout, handleRedirect } = useAuth();

const store = useTemplateStore();

const router = useRouter();

const msalInstance = inject("msalInstance"); // Inject từ `main.js`

const handleLoginByMicrosoft = async () => {
    await login();
};

onMounted(async () => {
    await msalInstance.initialize();
    const isAuthenticate = await handleRedirect();
    if (isAuthenticate) {
        router.push({ name: "index" });
    }
});

const state = reactive({
    email: "",
    password: "",
    loginError: false,
});

const rules = {
    email: { required, email },
    password: { required },
};

const v$ = useVuelidate(rules, state);

const isLoading = reactive({
    login: false,
    microsoft: false,
});

const onSubmit = async () => {
    v$.value.$touch();
    if (v$.value.$invalid) {
        return;
    }
    isLoading.login = true;
    state.loginError = false;

    try {
        const response = await gateRequest.post("/login", {
            email: state.email,
            password: state.password,
            twoFactorCode: "string",
            twoFactorRecoveryCode: "string",
        });

        const { tokenType, accessToken } = response.data;
        localStorage.setItem("authToken", `${tokenType} ${accessToken}`);
        router.push({ name: "index" });
    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        state.loginError = true;
    } finally {
        isLoading.login = false;
    }
};
</script>
