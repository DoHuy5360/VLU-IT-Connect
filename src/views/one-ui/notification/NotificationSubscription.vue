<template>
  <BasePageHeading
    title="Đăng Ký Nhận Thông Báo"
    subtitle="Đăng ký để nhận thông báo khi có bài viết mới"
  >
  </BasePageHeading>

  <div class="content">
    <div class="block block-rounded">
      <div class="block-content">
        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <label class="form-label" for="email"
              >Email <span class="text-danger">*</span></label
            >
            <input
              type="email"
              class="form-control"
              id="email"
              name="email"
              placeholder="Nhập email của bạn"
              v-model="formData.Email"
              :class="{ 'is-invalid': errors.Email }"
              required
              maxlength="100"
            />
            <div class="invalid-feedback" v-if="errors.Email">
              {{ errors.Email }}
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label" for="category"
              >Danh mục bài viết quan tâm
              <span class="text-danger">*</span></label
            >
            <select
              class="form-select"
              id="category"
              name="category"
              v-model="formData.CategoryId"
              :class="{ 'is-invalid': errors.CategoryId }"
              required
            >
              <option value="" disabled selected>Chọn danh mục</option>
              <option
                v-for="category in categories"
                :key="category.Id"
                :value="category.Id"
              >
                {{ category.Name }}
              </option>
            </select>
            <div class="invalid-feedback" v-if="errors.CategoryId">
              {{ errors.CategoryId }}
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label" for="notes">Ghi chú</label>
            <textarea
              class="form-control"
              id="notes"
              name="notes"
              placeholder="Nhập ghi chú nếu có"
              v-model="formData.Notes"
              rows="3"
            ></textarea>
          </div>
          <div class="mb-4">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="submitting"
            >
              <i class="fa fa-paper-plane me-1" v-if="!submitting"></i>
              <i class="fa fa-spinner fa-spin me-1" v-else></i>
              Đăng Ký
            </button>
          </div>
        </form>

        <!-- Thông báo kết quả -->
        <div
          v-if="notification.show"
          :class="`alert alert-${notification.type}`"
          role="alert"
        >
          {{ notification.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import {
  getNotificationCategories,
  subscribeNotification,
} from "../../../service/one-ui/notification/NotificationService";

// State
const categories = ref([]);
const submitting = ref(false);
const errors = reactive({});
const notification = reactive({
  show: false,
  type: "success",
  message: "",
});

// Form data
const formData = reactive({
  Email: "",
  CategoryId: "",
  Notes: "",
});

// Validate email
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.Email = "Vui lòng nhập địa chỉ email";
    return false;
  } else if (!regex.test(email)) {
    errors.Email = "Vui lòng nhập địa chỉ email hợp lệ";
    return false;
  } else if (email.length > 100) {
    errors.Email = "Email không được vượt quá 100 ký tự";
    return false;
  }

  errors.Email = "";
  return true;
};

// Validate form
const validateForm = () => {
  let isValid = true;

  // Validate email
  isValid = validateEmail(formData.Email) && isValid;

  // Validate category
  if (!formData.CategoryId) {
    errors.CategoryId = "Vui lòng chọn danh mục bài viết";
    isValid = false;
  } else {
    errors.CategoryId = "";
  }

  return isValid;
};

// Submit form
const submitForm = async () => {
  if (!validateForm()) {
    return;
  }

  submitting.value = true;
  notification.show = false;

  try {
    const response = await subscribeNotification(formData);

    if (response.success) {
      notification.type = "success";
      notification.message =
        response.message || "Đăng ký nhận thông báo thành công";
      notification.show = true;

      // Reset form
      formData.Email = "";
      formData.CategoryId = "";
      formData.Notes = "";
    } else {
      notification.type = "danger";
      notification.message = response.message || "Đăng ký không thành công";
      notification.show = true;
    }
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    notification.type = "danger";
    notification.message = "Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.";
    notification.show = true;
  } finally {
    submitting.value = false;
  }
};

// Load categories
onMounted(async () => {
  try {
    categories.value = await getNotificationCategories();
  } catch (error) {
    console.error("Lỗi khi tải danh mục:", error);
    notification.type = "danger";
    notification.message =
      "Không thể tải danh mục bài viết. Vui lòng thử lại sau.";
    notification.show = true;
  }
});
</script>
