<template>
  <BasePageHeading title="Master" subtitle="Welcome Admin!">
    <template #extra>
      <button type="button" class="btn btn-alt-primary" @click="$router.push('/administrator/accountmanager')">
        <i class="fa fa-arrow-left opacity-50 me-1"></i>
        Quay về
      </button>
    </template>
  </BasePageHeading>

  <div class="content">
    <BaseBlock class="text-center">
      <p>Content always takes up all the available width of the main container. A maximum width is set for extra large screen widths.</p>
      <div class="mb-4">
        <label class="form-label" for="categoryName">Tên Nhóm</label>
        <input type="text" class="form-control" id="categoryName" placeholder="Enter New Category Name..." maxlength="50" required />
      </div>
      <label class="form-label">Chọn quyền hạn</label>
      <div class="table-responsive">
        <table class="table table-bordered table-striped table-vcenter">
          <thead>
            <tr>
              <th class="text-center" style="width: 100px">
                <i>#</i>
              </th>
              <th>Chức năng</th>
              <th style="width: 10%">Xem</th>
              <th style="width: 12%">Xem chi tiết</th>
              <th style="width: 10%">Thêm</th>
              <th style="width: 10%">Sửa</th>
              <th style="width: 10%">Xóa</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(func, index) in functions" :key="func.id">
              <td class="text-center">{{ index + 1 }}</td>
              <td>{{ func.description }}</td>
              <td class="text-center">
                <input type="checkbox" v-model="func.permissions.view" />
              </td>
              <td class="text-center">
                <input type="checkbox" v-model="func.permissions.viewDetails" />
              </td>
              <td class="text-center">
                <input type="checkbox" v-model="func.permissions.add" />
              </td>
              <td class="text-center">
                <input type="checkbox" v-model="func.permissions.edit" />
              </td>
              <td class="text-center">
                <input type="checkbox" v-model="func.permissions.delete" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseBlock>
  </div>
</template>

<script>
export default {
  name: "FunctionTable",
  data() {
    return {
      functions: [
        {
          id: 1,
          description: "Quyền kiểm soát danh mục",
          permissions: { view: false, viewDetails: false, add: false, edit: false, delete: false },
        },
        {
          id: 2,
          description: "Quyền kiểm soát bải viết",
          permissions: { view: false, viewDetails: false, add: false, edit: false, delete: false },
        },
        {
          id: 3,
          description: "Quyền kiểm soát người dùng",
          permissions: { view: false, viewDetails: false, add: false, edit: false, delete: false },
        },
      ],
    };
  },
  methods: {
    goBack() {
      // Add your logic for the back button
      console.log("Go back clicked");
    },
  },
};
</script>

<style scoped>
/* Add specific styles here if needed */
</style>
