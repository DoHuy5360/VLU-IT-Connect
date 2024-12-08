<template>
  <tr v-show="isVisible">
    <th class="text-center" scope="row">{{ index }}</th>
    <td :style="{ paddingLeft: depth * 20 + 'px' }" class="fw-semibold fs-sm">
      <span v-if="hasChildren" class="text-primary me-2" style="cursor: pointer" @click="$emit('toggle', category)">
        <i :class="category.visible ? 'fa fa-chevron-down' : 'fa fa-chevron-right'"></i>
      </span>
      {{ category.name }}
    </td>
    <td class="fw-normal fs-sm">{{ category.slug }}</td>
    <td class="text-center">
      <div class="btn-group">
        <button type="button" class="btn btn-sm btn-warning" title="Edit" v-click-ripple @click="$router.push(`/administrator/category/edit`)">
          <i class="fa fa-fw fa-pencil-alt"></i>
        </button>
        <button type="button" class="btn btn-sm btn-danger" title="Delete" @click="$emit('delete', category)">
          <i class="fa fa-fw fa-times"></i>
        </button>
      </div>
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    category: { type: Object, required: true },
    index: { type: Number, required: true },
    depth: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  computed: {
    hasChildren() {
      return this.category.nestRight - this.category.nestLeft > 1;
    },
  },
};
</script>
