<template>
  <BasePageHeading title="Master" subtitle="Welcome Admin!">
    <template #extra>
      <button type="button" class="btn btn-alt-success" @click="$router.push('/administrator/accountmanager/create')">
        <i class="fa fa-plus opacity-50 me-1"></i>
        Thêm
      </button>
    </template>
  </BasePageHeading>

  <BaseBlock title="Partial Table">
    <template #options>
      <button type="button" class="btn-block-option" aria-label="Settings">
        <i class="si si-settings"></i>
      </button>
    </template>

    <p class="fs-sm text-muted">
      Use responsive utility CSS classes to hide columns at various screen resolutions. For example, the <strong>Access</strong> column is hidden on small and extra small screens, and the
      <strong>Email</strong> column is hidden on extra small screens.
    </p>

    <table class="table table-bordered table-striped table-vcenter">
      <thead>
        <tr>
          <th class="text-center" style="width: 50px"><input type="checkbox" @click="selectAll($event)" /></th>
          <th class="text-center" style="width: 100px">ID</th>
          <th>Tên Nhóm</th>
          <th class="d-none d-md-table-cell" style="width: 30%">Quyền Hạn</th>
          <th class="text-center" style="width: 100px">Số lượng</th>
          <th class="text-center" style="width: 100px">Sửa</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td class="text-center">
            <input type="checkbox" v-model="selectedUsers" :value="user.id" />
          </td>
          <td class="text-center">
            {{ user.id }}
          </td>
          <td class="fw-semibold fs-sm">
            {{ user.groupName }}
          </td>
          <td class="d-none d-md-table-cell fs-sm">Số lượng quyền thao tác: {{ user.allow }} (tính năng)</td>
          <td class="text-center">
            {{ user.accountCount }}
          </td>
          <td class="text-center">
            <div class="btn-group">
              <button type="button" class="btn btn-sm btn-alt-secondary bg-warning" aria-label="Edit" @click="$router.push('/administrator/accountmanager/edit')">
                <i class="fa fa-fw fa-pencil-alt"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </BaseBlock>
</template>

<script>
export default {
  name: "MasterTable",
  data() {
    return {
      users: [
        {
          id: 1,
          groupName: "Admin",
          allow: 64,
          accountCount: 5,
        },
        {
          id: 2,
          groupName: "Editor",
          allow: 32,
          accountCount: 10,
        },
      ],
      selectedUsers: [],
    };
  },
  methods: {
    selectAll(event) {
      if (event.target.checked) {
        this.selectedUsers = this.users.map((user) => user.id);
      } else {
        this.selectedUsers = [];
      }
    },
  },
};
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>
