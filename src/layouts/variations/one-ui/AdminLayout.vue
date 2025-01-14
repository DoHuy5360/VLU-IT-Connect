<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useTemplateStore } from "@/stores/template";

import BaseLayout from "@/layouts/BaseLayout.vue";
import BaseNavigation from "@/components/BaseNavigation.vue";

// Main store
const store = useTemplateStore();
const router = useRouter();
const isLoading = ref(false);

// Set default elements for this layout
store.setLayout({
  header: true,
  sidebar: true,
  sideOverlay: true,
  footer: true,
});

// Set various template options for this layout variation
store.headerStyle({ mode: "light" });
store.mainContent({ mode: "narrow" });

function handleLogout() {
  isLoading.value = true;

  // Perform logout
  localStorage.removeItem("authToken"); // Remove token from localStorage
  router.push("/auth/signin"); // Redirect to signin page

  isLoading.value = false; // Reset loading state
}
</script>

<template>
  <BaseLayout>
    <!-- Side Overlay Content -->
    <template #side-overlay-content>
      <div class="content-side">
        <button
          type="button"
          class="btn btn-lg btn-alt-danger d-flex align-items-center gap-2"
          @click="handleLogout"
          :disabled="isLoading"
        >
          <i class="si si-logout"></i>
          <span v-if="!isLoading">Logout</span>
          <span v-else>Logging out...</span>
        </button>
      </div>
    </template>
    <!-- END Side Overlay Content -->

    <!-- Sidebar Content -->
    <template #sidebar-content>
      <div class="content-side">
        <BaseNavigation
          :nodes="[{
              name: 'Bài viết',
              icon: 'si si-note',
              to: 'AdminBlog'
            },
            {
              name: 'Thể loại',
              icon: 'si si-layers',
              to: 'AdminCategory'
            },
            {
              name: 'Tài khoản',
              icon: 'si si-users',
              to: 'AdminAccount'
            },
            {
              name: 'Quyền hạn',
              icon: 'si si-lock',
              to: 'AdminAccountManager'
            }
          ]"
        />
      </div>
    </template>
    <!-- END Sidebar Content -->

    <!-- Header Content Left -->
    <template #header-content-left>
      <button
        type="button"
        class="btn btn-sm btn-alt-secondary me-2 d-lg-none"
        @click="store.sidebar({ mode: 'toggle' })"
      >
        <i class="fa fa-fw fa-bars"></i>
      </button>
      <button
        type="button"
        class="btn btn-sm btn-alt-secondary me-2 d-none d-lg-inline-block"
        @click="store.sidebarMini({ mode: 'toggle' })"
      >
        <i class="fa fa-fw fa-ellipsis-v"></i>
      </button>
    </template>
    <!-- END Header Content Left -->

    <!-- Header Content Right -->
    <template #header-content-right>
      <button
        type="button"
        class="btn btn-sm btn-alt-secondary ms-2"
        @click="store.sideOverlay({ mode: 'toggle' })"
      >
        <i class="fa fa-fw fa-list-ul fa-flip-horizontal"></i>
      </button>
    </template>
    <!-- END Header Content Right -->

    <!-- Footer Content Left -->
    <template #footer-content-left>
      <strong>My App</strong>
      &copy; {{ store.app.copyright }}
    </template>
    <!-- END Footer Content Left -->
  </BaseLayout>
</template>
