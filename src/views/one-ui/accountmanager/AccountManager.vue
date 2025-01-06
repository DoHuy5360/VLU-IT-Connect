<template>
  <BasePageHeading title="Account Manager">
    <template #extra>
      <button type="button" class="btn btn-success" @click="$router.push('/administrator/accountmanager/create')">
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

    <div v-if="loading" class="text-center my-4">
      <i class="fa fa-spinner fa-spin"></i> Đang tải dữ liệu...
    </div>

    <table v-else class="table table-bordered table-striped table-vcenter">
      <thead>
        <tr>
          <th class="text-center" style="width: 50px">
            <input type="checkbox" @click="selectAll($event)" />
          </th>
         
          <th>Tên Nhóm</th>
          <th class="d-none d-md-table-cell">Mô Tả</th>
          <th class="text-center" style="width: 100px">Quyền Hạn</th>
          <th class="text-center" style="width: 100px">Số lượng</th>
          <th class="text-center" style="width: 200px">Ngày Tạo</th>
          <th class="text-center" style="width: 100px">Sửa</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td class="text-center">
            <input type="checkbox" :value="user.id" v-model="selectedUsers" />
          </td>
            
          <td>{{ user.GroupName }}</td>
          <td class="d-none d-md-table-cell">{{ user.Description }}</td>
          <td class="text-center">{{ user.PermissionCount }}</td>
          <td class="text-center">{{ user.AccountCount }}</td>
          <td class="text-center">{{ formatDate(user.CreatedDate) }}</td>
          <td class="text-center">
            <button class="btn btn-sm btn-warning" @click="editUser(user.id)">
              <i class="fa fa-edit"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </BaseBlock>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const users = ref([]);
const loading = ref(true);
const selectedUsers = ref([]);

const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get("/api/AccountGroup/list", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    users.value = response.data.data.$values || [];
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    loading.value = false;
  }
};

const selectAll = (event) => {
  if (event.target.checked) {
    selectedUsers.value = users.value.map(user => user.id);
  } else {
    selectedUsers.value = [];
  }
};

const editUser = (id) => {
  // Navigate to the edit user page
  this.$router.push({ name: "EditUser", params: { id } });
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

onMounted(fetchUsers);
</script>

<style scoped>
.table th {
  white-space: nowrap;
}

.pagination .page-link {
  cursor: pointer;
}
</style>