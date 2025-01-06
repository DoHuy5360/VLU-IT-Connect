<template>
  <div class="hero-static d-flex align-items-center" style="position: relative; min-height: 100vh; background: url('/assets/media/brand/sign.png') no-repeat center center; background-size: cover">
    <!-- Dark Overlay -->
    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1"></div>

    <!-- Content -->
    <div class="content" style="position: relative; z-index: 2">
      <div class="row justify-content-center push">
        <div class="col-md-8 col-lg-6 col-xl-4">
          <!-- Sign In Block -->
          <BaseBlock title="Sign In" class="mb-0">
            <div class="p-sm-3 px-lg-4 px-xxl-5 py-lg-5">
              <div class="text-center mb-4">
                <img src="/assets/media/brand/vlu_logo_final_vlu_logo_ngang_eng.png" alt="VLU Logo" style="max-width: 40%; height: auto" />
              </div>
              <p class="fw-medium text-muted">Welcome, please login.</p>
              <form @submit.prevent="onSubmit">
                <div class="py-3">
                  <div class="mb-4">
                    <input
                      type="email"
                      class="form-control form-control-alt form-control-lg"
                      v-model="state.email"
                      placeholder="Email"
                      :class="{ 'is-invalid': v$.email.$errors.length }"
                      @blur="v$.email.$touch"
                    />
                    <div v-if="v$.email.$errors.length" class="invalid-feedback">
                      <span v-if="v$.email.$errors[0].$validator === 'required'">Email is required.</span>
                      <span v-if="v$.email.$errors[0].$validator === 'email'">Enter a valid email address.</span>
                    </div>
                  </div>
                  <div class="mb-4">
                    <input
                      type="password"
                      class="form-control form-control-alt form-control-lg"
                      v-model="state.password"
                      placeholder="Password"
                      :class="{ 'is-invalid': v$.password.$errors.length }"
                      @blur="v$.password.$touch"
                    />
                    <div v-if="v$.password.$errors.length" class="invalid-feedback">
                      <span v-if="v$.password.$errors[0].$validator === 'required'">Password is required.</span>
                      <span v-if="v$.password.$errors[0].$validator === 'minLength'">Password must be at least 5 characters.</span>
                    </div>
                  </div>
                  <div class="mb-4 d-flex justify-content-between align-items-center">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" />
                      <label class="form-check-label">Remember Me</label>
                    </div>
                    <button type="submit" class="btn btn-alt-success" :disabled="isLoading.login">Log In</button>
                  </div>
                  <div class="text-center my-3">
                    <hr class="my-4" />
                    <span class="bg-white px-3">OR</span>
                  </div>
                  <div class="text-center">
                    <button type="button" class="btn btn-alt-primary btn-lg px-4" :disabled="isLoading.microsoft" @click="signInWithMicrosoft">
                      <i class="fab fa-microsoft me-3"></i>
                      Log In with Microsoft
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

<script>
import axios from "axios";
import { reactive } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, minLength, email } from "@vuelidate/validators";

export default {
  setup() {
    const state = reactive({
      email: "",
      password: "",
    });

    const rules = {
      email: { required, email },
      password: { required, minLength: minLength(5) },
    };

    const v$ = useVuelidate(rules, state);

    const isLoading = reactive({
      login: false,
      microsoft: false,
    });
    // const startTokenRefresh = (refreshToken) => {
    //   // Set an interval to refresh the token every 30 minutes
    //   refreshInterval = setInterval(async () => {
    //     try {
    //       const response = await axios.post("https://localhost:7017/refresh", { refreshToken });
    //       const { tokenType, accessToken } = response.data;

    //       // Update the token in localStorage
    //       localStorage.setItem("authToken", `${tokenType} ${accessToken}`);
    //       console.log("Access token refreshed.");
    //     } catch (error) {
    //       console.error("Token refresh failed:", error.response?.data || error.message);
    //     }
    //   }, 30 * 60 * 1000); // 30 minutes
    // };

    const onSubmit = async () => {
      isLoading.login = true;
      try {
        const response = await axios.post("https://localhost:7017/login", {
          email: state.email,
          password: state.password,
          twoFactorCode: "string",
          twoFactorRecoveryCode: "string",
        });
        alert("Login successful!");
        console.log("Login success:", response.data);

        // Save token to a shared state/store or localStorage
        const { tokenType, accessToken } = response.data;
        localStorage.setItem("authToken", `${tokenType} ${accessToken}`);
        // localStorage.setItem("refreshToken", refreshToken);
      } catch (error) {
        alert("Login failed. Please check your email and password.");
        console.error("Login failed:", error.response?.data || error.message);
      } finally {
        isLoading.login = false;
      }
    };

    const signInWithMicrosoft = async () => {
      // isLoading.microsoft = true;
      // try {
      //   const response = await axios.get("/api/Auth/loginMicrosoft");
      //   console.log("Microsoft login started:", response.data);
      // } catch (error) {
      //   alert("Microsoft login failed.");
      //   console.error("Microsoft login failed:", error.response?.data || error.message);
      // } finally {
      //   isLoading.microsoft = false;
      // }
    };
    // onMounted(() => {
    //   const storedRefreshToken = localStorage.getItem("refreshToken");
    //   if (storedRefreshToken) {
    //     startTokenRefresh(storedRefreshToken);
    //   }
    // });

    // onBeforeUnmount(() => {
    //   if (refreshInterval) clearInterval(refreshInterval);
    // });

    return {
      state,
      v$,
      isLoading,
      onSubmit,
      signInWithMicrosoft,
    };
  },
};
</script>
