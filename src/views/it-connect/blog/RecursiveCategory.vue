<template>
  <div class="container py-3">
    <div class="row gx-2 gy-2">
      <!-- Category List -->
      <div class="col-lg-4">
        <div class="rounded p-3 bg-white mb-3">
          <h4 class="mb-3 fw-bold">Danh Mục</h4>
          <ul class="list-unstyled">
            <li v-for="(category, index) in formattedCategories" :key="index" class="mb-2">
              <div class="d-flex justify-content-between align-items-center clickable-text" @click="toggleCategory(category)">
                <span>{{ category.name }}</span>
                <span v-if="category.postCount !== undefined" class="custom-badge">
                  {{ category.postCount || "0" }}
                </span>
              </div>
              <!-- Recursive rendering of children -->
              <ul v-if="category.isExpanded" class="list-unstyled ms-3">
                <li v-for="(child, childIndex) in category.children" :key="childIndex" class="mb-2">
                  <div class="d-flex justify-content-between align-items-center clickable-text" @click="toggleCategory(child)">
                    <span>{{ child.name }}</span>
                    <span v-if="child.postCount !== undefined" class="custom-badge">
                      {{ child.postCount || "0" }}
                    </span>
                  </div>
                  <ul v-if="child.isExpanded" class="list-unstyled ms-3">
                    <li v-for="(grandchild, grandchildIndex) in child.children" :key="grandchildIndex" class="mb-2">
                      <div class="d-flex justify-content-between align-items-center clickable-text">
                        <span>{{ grandchild.name }}</span>
                        <span v-if="grandchild.postCount !== undefined" class="custom-badge">
                          {{ grandchild.postCount || "0" }}
                        </span>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      categories: [],
    };
  },
  computed: {
    formattedCategories() {
      // Filter out "Uncategorized" and format the data with toggle states
      return this.formatCategory(this.categories.leftChild);
    },
  },
  methods: {
    async getCategories() {
      try {
        const response = await axios.get("/api/Categories/getallcategories", {
          params: { cateName: "", indexPage: 1, limitRange: 10 },
        });

        this.categories = response.data?.data?.categories || {};
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    formatCategory(categoryNode) {
      if (!categoryNode) return [];

      const formatted = {
        id: categoryNode.id,
        name: categoryNode.name,
        postCount: categoryNode.code, // Assuming "code" holds post count; adapt as needed
        children: [],
        isExpanded: false,
      };

      if (categoryNode.leftChild) {
        formatted.children.push(...this.formatCategory(categoryNode.leftChild));
      }

      if (categoryNode.rightChild) {
        formatted.children.push(...this.formatCategory(categoryNode.rightChild));
      }

      return [formatted];
    },
    toggleCategory(category) {
      category.isExpanded = !category.isExpanded;
    },
  },
  async created() {
    await this.getCategories();
  },
};
</script>

<style scoped>
.custom-badge {
  background-color: transparent;
  color: black;
  font-size: inherit;
}

.clickable-text {
  cursor: pointer;
}

.clickable-text:hover {
  color: blue;
  transition: color 0.3s ease;
}

.ms-3 {
  margin-left: 1rem;
}
</style>
