<template>
    <div>
        <BasePageHeading :title="store.isVietNamese() ? 'Đăng Ký Nhận Thông Báo' : 'Subscribe to receive new notifications'" subtitle=""> </BasePageHeading>

        <div class="content bg-white">
            <div class="block block-rounded">
                <div class="block-content">
                    <form @submit.prevent="submitForm">
                        <div class="mb-4">
                            <label class="form-label" for="email">Email <RequiredStar /></label>
                            <input type="email" class="form-control" id="email" name="email" v-model="formData.Email" :class="{ 'is-invalid': errors.Email }" required maxlength="100" />
                            <div class="invalid-feedback" v-if="errors.Email">
                                {{ errors.Email }}
                            </div>
                        </div>

                        <div class="mb-4">
                            <label class="form-label" for="category">
                                {{ store.isVietNamese() ? "Chọn thể loại tin tức bạn quan tâm" : "Select the news category you are interested in" }} <RequiredStar />
                            </label>
                            <select class="form-select" id="category" name="category" v-model="formData.CategoryId" :class="{ 'is-invalid': errors.CategoryId }" required>
                                <option value="" disabled selected>{{ store.isVietNamese() ? "Chọn danh mục" : "Select category"}}</option>
                                <option v-for="category in categories" :key="category.Id" :value="category.Id">
                                    {{ category.Name }}
                                </option>
                            </select>
                            <div class="invalid-feedback" v-if="errors.CategoryId">
                                {{ errors.CategoryId }}
                            </div>
                        </div>

                        <div class="mb-4">
                            <label class="form-label" for="notes">{{ store.isVietNamese() ? "Ghi chú" : "Note" }}</label>
                            <textarea
                                class="form-control"
                                id="notes"
                                name="notes"
                                :placeholder="store.isVietNamese() ? 'Nhập ghi chú nếu có...' : 'Enter message for Administrator if any...'"
                                v-model="formData.Notes"
                                rows="3"
                            ></textarea>
                        </div>
                        <div class="mb-4">
                            <button type="submit" class="btn btn-primary" :disabled="submitting">
                                <i class="fa fa-paper-plane me-1" v-if="!submitting"></i>
                                <i class="fa fa-spinner fa-spin me-1" v-else></i>
                                {{ store.isVietNamese() ? "Đăng Ký" : "Subscribe" }}
                            </button>
                        </div>
                    </form>

                    <!-- Thông báo kết quả -->
                    <div v-if="notification.show" :class="`alert alert-${notification.type}`" role="alert">
                        {{ notification.message }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { getNotificationCategories, subscribeNotification } from "../../../service/one-ui/notification/NotificationService";
import { useTemplateStore } from "@/stores/template";
import RequiredStar from "../../../components/custom/RequiredStar.vue";

const store = useTemplateStore();

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

    try {
        const response = await subscribeNotification(formData);

        if (response.success) {
            
            store.alert({title: store.isVietNamese() ?"Đăng ký nhận thông báo thành công": "Subscribing Successfully"})
            
            // Reset form
            formData.Email = "";
            formData.CategoryId = "";
            formData.Notes = "";
        } else {
            store.alert({title: store.isVietNamese() ?"Đăng ký nhận thông báo thành công": "Subscribing Failure", icon: "warning"})
        }
    } catch (error) {
        console.error("Lỗi khi đăng ký:", error);
        store.alert({title: store.isVietNamese() ?"Đăng ký nhận thông báo thành công": "Subscribing Failure", icon: "warning"})
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
        notification.message = "Không thể tải danh mục bài viết. Vui lòng thử lại sau.";
        notification.show = true;
    }
});
</script>
