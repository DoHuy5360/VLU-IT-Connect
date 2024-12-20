<template>
  <tr>
    <!-- <td class="text-center">{{ formattedId }}</td> -->
    <td class="text-left" :style="{ paddingLeft: `${20 * category.nestDepth}px` }">
      <button v-if="hasChildren" class="btn btn-sm btn-link p-0" @click="toggleChildren">
        <i :class="isExpanded ? 'fa fa-chevron-down' : 'fa fa-chevron-right'"></i>
      </button>
      {{ category.name }}
    </td>
    <td class="text-center">{{ category.description }}</td>
    <td class="text-center">{{ postCount }}</td>
    <td class="text-center">
      <button class="btn btn-sm btn-alt-info" @click="$emit('edit', category)">Sửa</button>
      <button class="btn btn-sm btn-alt-danger" @click="$emit('delete', category)">Xóa</button>
    </td>
  </tr>
  <template v-if="isExpanded">
    <CategoryRow v-if="category.leftChild" :category="category.leftChild" :idPrefix="`${idPrefix}.${childIndex++}`" @edit="$emit('edit', $event)" @delete="$emit('delete', $event)" />
    <CategoryRow v-if="category.rightChild" :category="category.rightChild" :idPrefix="`${idPrefix}.${childIndex}`" @edit="$emit('edit', $event)" @delete="$emit('delete', $event)" />
  </template>
</template>

<script>
export default {
  name: "CategoryRow",
  props: {
    category: {
      type: Object,
      required: true,
    },
    idPrefix: {
      type: String,
      default: "1", // Default ID starts at "1"
    },
  },
  data() {
    return {
      isExpanded: false,
      childIndex: 1, // Tracks the child index for unique IDs
    };
  },
  computed: {
    hasChildren() {
      return this.category.leftChild || this.category.rightChild;
    },
    formattedId() {
      return this.idPrefix; // Use the prefix for hierarchical IDs
    },
    postCount() {
      // Mock post count; replace with real data if available
      return Math.floor(Math.random() * 100); // Random number for demonstration
    },
  },
  methods: {
    toggleChildren() {
      this.isExpanded = !this.isExpanded;
    },
  },
};
</script>
