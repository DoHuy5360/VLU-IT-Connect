<template>
  <tr>
    <td class="text-center">
      <input type="checkbox" v-model="selected" @change="emitSelection" />
    </td>
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
</template>

<script>
export default {
  name: "CategoryRow",
  props: {
    category: {
      type: Object,
      required: true,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selected: this.isSelected,
    };
  },
  computed: {
    hasChildren() {
      return this.category.leftChild || this.category.rightChild;
    },
    postCount() {
      return Math.floor(Math.random() * 100); // Replace with actual post count if available
    },
  },
  methods: {
    toggleChildren() {
      this.isExpanded = !this.isExpanded;
    },
    emitSelection() {
      this.$emit("select", { id: this.category.id, selected: this.selected });
    },
  },
};
</script>
