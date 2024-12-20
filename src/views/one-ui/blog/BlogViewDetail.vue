<template>
  <BasePageHeading title="Master" subtitle="Welcome Admin!">
    <template #extra>
      <button type="button" class="btn btn-alt-primary" v-click-ripple @click="$router.push('/administrator/blog')">
        <i class="fa fa-arrow-left opacity-50 me-1"></i>
        Back
      </button>
    </template>
  </BasePageHeading>

  <div class="content">
    <h4>Tiêu đề bài viết</h4>
    <table class="table table-bordered table-striped table-vcenter">
      <thead>
        <tr>
          <th style="width: 10%">Tác giả</th>
          <th style="width: 30%">Ngày tạo</th>
          <th style="width: 15%">Ngày đăng</th>
          <th style="width: 15%">Hiển thị</th>
          <th style="width: 15%">Trạng thái</th>
          <th style="width: 15%">Duyệt bình luận</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <!-- Author with avatar -->
          <td class="text-center">
            <name>{{ user.name }}</name>
          </td>

          <!-- Creation date -->
          <td class="fw-semibold fs-sm">{{ user.createdDate }}</td>

          <!-- Publish date -->
          <td class="fs-sm">
            {{ user.publishedDate || "Chưa đăng" }}
          </td>

          <!-- Visibility -->
          <td>
            <span :class="`fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-${user.visibility ? 'success' : 'warning'}-light text-${user.visibility ? 'success' : 'warning'}`">
              {{ user.visibility ? "Hiển thị" : "Ẩn" }}
            </span>
          </td>

          <!-- Status -->
          <td>
            <span
              :class="`fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-${user.status === 'approved' ? 'primary' : 'danger'}-light text-${user.status === 'approved' ? 'primary' : 'danger'}`"
            >
              {{ user.status === "approved" ? "Đã duyệt" : "Chưa duyệt" }}
            </span>
          </td>

          <!-- Comment Approval -->
          <td>
            {{ user.commentApproval === "manual" ? "Thủ công" : "Tự động" }}
          </td>

          <!-- Actions -->
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [
        {
          id: 1,
          avatar: "author1",
          name: "Nguyen Van A",
          createdDate: "2024-12-01",
          publishedDate: "2024-12-10",
          visibility: true,
          status: "approved",
          commentApproval: "manual",
        },
      ],
    };
  },
  methods: {
    editUser(id) {
      console.log(`Editing user with ID: ${id}`);
      // Add routing or editing logic here
    },
    deleteUser(id) {
      console.log(`Deleting user with ID: ${id}`);
      // Add deletion logic here
    },
  },
};
</script>

<style scoped>
.table {
  margin-top: 20px;
}

.img-avatar48 {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.btn-group button {
  margin-right: 5px;
}
</style>
