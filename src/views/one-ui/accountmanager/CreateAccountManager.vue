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
   
      <div class="mb-4">
        <label class="form-label" for="categoryName">Tên Nhóm</label>
        <input type="text" class="form-control" id="categoryName" placeholder="Tên Nhóm..." maxlength="50" required />
      </div>
      <div class="mb-4">
        <label class="form-label" for="categoryName">Mô Tả</label>
        <input type="text" class="form-control" id="categoryName" placeholder="Mô Tả Nhóm..." maxlength="50" required />
      </div>
      <label class="form-label">Chọn Quyền người dùng:</label>
      <div class="table-responsive">
        <table class="table table-bordered table-striped table-vcenter">
          <thead>
            <tr>
             
              <th>Chức năng</th>
              <th style="width: 10%">Xem</th>
              <th style="width: 12%">Xem chi tiết</th>
             
            </tr>
          </thead>
          <tbody>
            <tr v-for="(func, index) in functions" :key="func.id">
             
              <td>{{ func.description }}</td>
              <td class="text-center">
                <input type="checkbox" v-model="func.permissions.view" />
              </td>
              <td class="text-center">
                <input type="checkbox" v-model="func.permissions.viewDetails" />
              </td>
          
            </tr>
          </tbody>
        </table>
      </div>
      <label class="form-label">Chọn Quyền hành động:</label>
      <div class="table-responsive">
        <table class="table table-bordered table-striped table-vcenter">
          <thead>
            <tr>
            
              <th>Chức năng</th>
           
              <th style="width: 10%">Thêm</th>
              <th style="width: 10%">Sửa</th>
              <th style="width: 10%">Xóa</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(func, index) in functions" :key="func.id">
             
              <td>{{ func.description }}</td>
         
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
          
          description: "Quyền kiểm soát danh mục",
          permissions: { view: false, viewDetails: false, add: false, edit: false, delete: false },
        },
        {
         
          description: "Quyền kiểm soát bải viết",
          permissions: { view: false, viewDetails: false, add: false, edit: false, delete: false },
        },
        {
          
          description: "Quyền kiểm soát người dùng",
          permissions: { view: false, viewDetails: false, add: false, edit: false, delete: false },
        },
        {
          
          description: "Quyền kiểm soát nhóm phân quyền",
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
