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
import { ref, watch, defineEmits } from "vue";

// Emitting data to parent component
const emit = defineEmits();

// Receiving props from parent component
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

// Create a reactive reference for slug
const slug = ref(props.modelValue);

// Watch for changes in the title and generate the slug
watch(
  () => props.title,
  (newTitle) => {
    if (!slug.value || slug.value === generateSlug(props.modelValue)) {
      slug.value = generateSlug(newTitle);
      emit("update:modelValue", slug.value); // Emit updated slug value to parent
    }
  },
  { immediate: true }
);

// Function to handle manual input changes
function onInputChange() {
  emit("update:modelValue", slug.value);
}

// Function to generate a slug from a title
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .trim()
    .replace(/\s+/g, "-"); // Replace spaces with dashes
}
</script>

<style scoped>
/* Custom styles (if any) */
</style>
