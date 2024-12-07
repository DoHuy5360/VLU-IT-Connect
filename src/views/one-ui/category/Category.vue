<template>
  <BasePageHeading title="Category" subtitle="Welcome Admin!">
    <template #extra>
      <button type="button" class="btn btn-alt-primary bg-success" v-click-ripple @click="$router.push('/administrator/category/create')">
        <i class="fa fa-plus opacity-50 me-1"></i>
        Add
      </button>
    </template>
  </BasePageHeading>

  <BaseBlock title="Category Overview">
    <table class="table table-bordered table-striped table-hover table-vcenter">
      <thead class="bg-primary text-light">
        <tr>
          <th class="text-center" style="width: 50px">#</th>
          <th>Category</th>
          <th>Slug</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- Render each category -->
        <CategoryRow
          v-for="(category, index) in flattenedCategories"
          :key="category.nestLeft"
          :category="category"
          :index="index + 1"
          :depth="category.nestDepth"
          :is-visible="category.visible"
          @toggle="toggleVisibility(category)"
          @delete="swalConfirm"
        />
      </tbody>
    </table>
  </BaseBlock>
</template>

<script>
import { ref } from "vue";
import Swal from "sweetalert2";
import CategoryRow from "./CategoryRow.vue";
import BasePageHeading from "@/components/BasePageHeading.vue";
import BaseBlock from "@/components/BaseBlock.vue";

export default {
  components: { CategoryRow },
  setup() {
    const rawData = {
      categories: [
        {
          name: "Root Category 1",
          slug: "root-1",
          parentID: null,
          nestLeft: 1,
          nestRight: 14,
          nestDepth: 0,
        },
        {
          name: "Child 1-1",
          slug: "child-1-1",
          parentID: "root-1",
          nestLeft: 2,
          nestRight: 7,
          nestDepth: 1,
        },
        {
          name: "Grandchild 1-1-1",
          slug: "grandchild-1-1-1",
          parentID: "child-1-1",
          nestLeft: 3,
          nestRight: 4,
          nestDepth: 2,
        },
        {
          name: "Grandchild 1-1-2",
          slug: "grandchild-1-1-2",
          parentID: "child-1-1",
          nestLeft: 5,
          nestRight: 6,
          nestDepth: 2,
        },
        {
          name: "Child 1-2",
          slug: "child-1-2",
          parentID: "root-1",
          nestLeft: 8,
          nestRight: 13,
          nestDepth: 1,
        },
        {
          name: "Grandchild 1-2-1",
          slug: "grandchild-1-2-1",
          parentID: "child-1-2",
          nestLeft: 9,
          nestRight: 10,
          nestDepth: 2,
        },
        {
          name: "Grandchild 1-2-2",
          slug: "grandchild-1-2-2",
          parentID: "child-1-2",
          nestLeft: 11,
          nestRight: 12,
          nestDepth: 2,
        },
        {
          name: "Root Category 2",
          slug: "root-2",
          parentID: null,
          nestLeft: 15,
          nestRight: 20,
          nestDepth: 0,
        },
        {
          name: "Child 2-1",
          slug: "child-2-1",
          parentID: "root-2",
          nestLeft: 16,
          nestRight: 19,
          nestDepth: 1,
        },
        {
          name: "Grandchild 2-1-1",
          slug: "grandchild-2-1-1",
          parentID: "child-2-1",
          nestLeft: 17,
          nestRight: 18,
          nestDepth: 2,
        },
        {
          name: "Root Category 3",
          slug: "root-3",
          parentID: null,
          nestLeft: 21,
          nestRight: 26,
          nestDepth: 0,
        },
        {
          name: "Child 3-1",
          slug: "child-3-1",
          parentID: "root-3",
          nestLeft: 22,
          nestRight: 25,
          nestDepth: 1,
        },
        {
          name: "Grandchild 3-1-1",
          slug: "grandchild-3-1-1",
          parentID: "child-3-1",
          nestLeft: 23,
          nestRight: 24,
          nestDepth: 2,
        },
      ],
    };
    const flattenedCategories = ref(
      rawData.categories.map((category) => ({
        ...category,
        visible: category.nestDepth === 0, // Initially, only root categories are visible
      }))
    );

    const toggleVisibility = (category) => {
      flattenedCategories.value.forEach((cat) => {
        if (cat.nestLeft > category.nestLeft && cat.nestRight < category.nestRight) {
          cat.visible = !cat.visible;
        }
      });
    };

    const swalConfirm = (category) => {
      Swal.fire({
        title: `Are you sure to delete "${category.name}"?`,
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        customClass: { confirmButton: "btn btn-danger m-1", cancelButton: "btn btn-secondary m-1" },
        buttonsStyling: false,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Deleted!", `"${category.name}" has been deleted.`, "success");
        }
      });
    };

    return { flattenedCategories, toggleVisibility, swalConfirm };
  },
};
</script>
