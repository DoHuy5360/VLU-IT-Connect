<template>
  <div class="hero-static d-flex align-items-center position-relative">
    <div class="position-absolute w-100 h-100" style="background-color: rgba(0, 0, 0, 0.5); z-index: 1"></div>
    <div class="content position-relative" style="z-index: 2">
      <div class="row justify-content-center push">
        <div class="col-md-8 col-lg-6 col-xl-4">
          <BaseBlock title="" class="mb-0">
            <div class="p-sm-3 px-lg-4 px-xxl-5 py-lg-5">
              <div class="text-center mb-4">
                <img src="/assets/media/brand/logo.png" alt="Logo" style="max-width: 35%; height: auto" />
              </div>
              <form @submit.prevent="onSubmit">
                <div class="py-3">
                  <div class="mb-4">
                    <input
                      type="text"
                      class="form-control form-control-alt form-control-lg"
                      v-model="state.username"
                      placeholder="Username"
                      :class="{ 'is-invalid': v$.username.$errors.length }"
                      @blur="v$.username.$touch"
                    />
                    <div v-if="v$.username.$errors.length" class="invalid-feedback">
                      <span v-if="v$.username.$errors[0].$validator === 'required'">Username is required.</span>
                      <span v-if="v$.username.$errors[0].$validator === 'minLength'">Username must be at least 3 characters.</span>
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
                    <button type="button" class="btn btn-alt-primary" @click="signInWithMicrosoft" :disabled="isLoading.microsoft">Log In with Microsoft</button>
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
import { required, minLength } from "@vuelidate/validators";

export default {
  setup() {
    const state = reactive({
      username: "",
      password: "",
    });

    const rules = {
      username: { required, minLength: minLength(3) },
      password: { required, minLength: minLength(5) },
    };

    const v$ = useVuelidate(rules, state);

    const isLoading = reactive({
      login: false,
      microsoft: false,
    });

    const onSubmit = async () => {
      isLoading.login = true;
      try {
        const response = await axios.post("/api/Auth/login", {
          username: state.username,
          password: state.password,
        });
        console.log("Login success:", response.data);
      } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
      } finally {
        isLoading.login = false;
      }
    };

    const signInWithMicrosoft = async () => {
      isLoading.microsoft = true;
      console.log("Microsoft login not yet implemented");
      isLoading.microsoft = false;
    };

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

<style scoped>
/* Add any required styles here */
</style>
