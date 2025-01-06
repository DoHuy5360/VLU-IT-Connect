<template>
  <div class="mb-4">
    <label class="form-label" for="slug">Slug</label>
    <input
      type="text"
      class="form-control"
      id="slug"
      v-model="slug"
      @input="onInputChange"
      placeholder="Slug"
      required
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

// Nhận các props từ component cha
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
});

// Sử dụng `emit` để cập nhật giá trị slug cho cha
const emit = defineEmits(["update:modelValue"]);

// Local state của slug
const slug = ref(props.modelValue);

// Hàm tạo slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
    .replace(/[^a-z0-9\s-]/g, "") // Loại bỏ ký tự đặc biệt
    .trim()
    .replace(/\s+/g, "-"); // Thay khoảng trắng bằng dấu gạch ngang
}

// Watcher cho `title` để cập nhật slug tự động
watch(
  () => props.title,
  (newTitle) => {
    if (!slug.value || slug.value === generateSlug(props.modelValue)) {
      slug.value = generateSlug(newTitle);
      emit("update:modelValue", slug.value); // Đồng bộ giá trị về cha
    }
  },
  { immediate: true } // Kích hoạt ngay khi component được mount
);

// Xử lý khi người dùng chỉnh sửa slug thủ công
function onInputChange() {
  emit("update:modelValue", slug.value);
}
</script>

<style scoped>
/* Style tùy chỉnh */
</style>
