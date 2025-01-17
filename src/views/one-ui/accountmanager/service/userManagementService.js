import axiosInstance from "./axiosConfig";

const userManagementService = {
  // Get list of users
  async getUsers() {
    try {
      const response = await axiosInstance.get("/UserManagement/users");
      return {
        success: response.data.success,
        data: response.data.data
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Không thể tải danh sách người dùng"
      };
    }
  }
};

export default userManagementService;
