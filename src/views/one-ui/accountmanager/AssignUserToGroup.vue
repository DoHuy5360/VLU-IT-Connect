<!-- <template>
    <BasePageHeading title="Thêm Người Dùng Vào Nhóm Phân Quyền">
      <template #extra>
        <button class="btn btn-primary" @click="$router.push('/administrator/accountmanager')"><i class="fa fa-arrow-left opacity-50 me-1"></i> Quay lại</button>
      </template>
    </BasePageHeading>
  
    <div class="block block-rounded">
      <div class="block-content">
        <form @submit.prevent="handleSubmit">
          <div class="row">
            <!-- Danh sách người dùng -->
            <div class="col-md-6">
              <div class="mb-4">
                <label class="form-label">Chọn người dùng</label>
                <div class="table-responsive">
                  <table class="table table-bordered table-striped table-vcenter">
                    <thead>
                      <tr>
                        <th class="text-center" style="width: 50px">
                          <div class="form-check">
                            <input type="checkbox" class="form-check-input" :checked="isAllUsersSelected" @change="toggleSelectAllUsers" />
                          </div>
                        </th>
                        <th>Tên</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="user in users" :key="user.id">
                        <td class="text-center">
                          <div class="form-check">
                            <input type="checkbox" class="form-check-input" :checked="selectedUsers.includes(user.id)" @change="toggleUserSelection(user.id)" />
                          </div>
                        </td>
                        <td>{{ user.fullName }}</td>
                        <td>{{ user.email }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
  
            <!-- Chọn nhóm -->
            <div class="col-md-6">
              <div class="mb-4">
                <label class="form-label" for="group">Chọn nhóm</label>
                <select id="group" class="form-select" v-model="selectedGroup" required>
                  <option value="">Chọn nhóm...</option>
                  <option v-for="group in groups" :key="group.id" :value="group.name">
                    {{ group.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
  
          <div class="row">
            <div class="col-12">
              <button type="submit" class="btn btn-primary" :disabled="!selectedGroup || selectedUsers.length === 0"><i class="fa fa-save opacity-50 me-1"></i> Lưu thay đổi</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </template>
   -->