<template>
  <li>
    <div class="d-flex justify-content-between align-items-center clickable-text" @click="toggleCategory">
      <span>{{ category.name }}</span>
      <span v-if="category.postCount !== undefined" class="custom-badge">
        {{ category.postCount || "0" }}
      </span>
    </div>
    <ul v-if="isExpanded && category.children.length" class="list-unstyled ms-3">
      <CategoryItem v-for="(child, childIndex) in category.children" :key="childIndex" :category="child" />
    </ul>
  </li>
</template>

<script>
export default {
  name: "CategoryItem",
  props: {
    category: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isExpanded: false,
    };
  },
  methods: {
    toggleCategory() {
      this.isExpanded = !this.isExpanded;
    },
  },
};
</script>
