import axiosInstance from "./axiosConfig";

const accountGroupService = {
  // Get paginated list of groups
  async getList(pageNumber = 1, pageSize = 20, searchTerm = "") {
    try {
      const response = await axiosInstance.get("/AccountGroup/list", {
        params: {
          pageNumber,
          pageSize,
          searchTerm,
        },
      });

      // Lấy mảng items từ response.data.data.$values
      const items = response.data.data.$values || [];

      return {
        success: true,
        data: {
          items: items.map((item) => ({
            id: item.Id,
            name: item.GroupName,
            description: item.Description,
            createdDate: item.CreatedDate,
            permissionCount: item.PermissionCount,
            accountCount: item.AccountCount,
          })),
          totalItems: items.length,
          totalPages: Math.ceil(items.length / pageSize),
        },
      };
    } catch (error) {
      console.error("Error fetching groups:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể tải danh sách nhóm",
      };
    }
  },

  // Get group by ID
  async getGroupById(groupId) {
    try {
      const response = await axiosInstance.get(`/AccountGroup/${groupId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching group:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch group",
      };
    }
  },

  // Create a new group
  async createGroup(groupData) {
    try {
      const response = await axiosInstance.post("/AccountGroup/add", {
        GroupName: groupData.GroupName,
        Description: groupData.Description,
        UserPermissions: groupData.UserPermissions,
        ActionPermissions: groupData.ActionPermissions,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Edit group
  async editGroup(groupId, groupData) {
    try {
      const response = await axiosInstance.put("/AccountGroup/edit", {
        groupId,
        groupName: groupData.name,
        description: groupData.description,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error editing group:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to edit group",
      };
    }
  },

  // Delete a single group
  async deleteGroup(groupId) {
    try {
      const response = await axiosInstance.delete(
        `/AccountGroup/delete/${groupId}`
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error deleting group:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete group",
      };
    }
  },

  // Delete multiple groups
  async deleteMultipleGroups(groupIds) {
    console.log("Deleting Multiple Groups:", {
      groupIds,
      type: typeof groupIds,
      isArray: Array.isArray(groupIds),
    });
    try {
      const response = await axiosInstance.delete("/AccountGroup/deletes", {
        data: groupIds,
      });
      console.log("Delete Response:", response);
      return {
        success: true,
        data: response.data,
        message: "Xóa nhóm thành công",
      };
    } catch (error) {
      console.error("Error deleting groups:", error);
      console.log("Error Details:", {
        errorResponse: error.response,
        errorData: error.response?.data,
      });
      return {
        success: false,
        message: error.response?.data?.message || "Xóa nhóm thất bại",
      };
    }
  },

  // Search groups by name
  async searchByName(searchTerm, pageNumber = 1, pageSize = 20) {
    try {
      const response = await axiosInstance.get("/AccountGroup/search", {
        params: {
          searchTerm,
          pageNumber,
          pageSize,
        },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error searching groups:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Không thể tìm kiếm nhóm",
      };
    }
  },

  // Get available permissions
  async getAvailablePermissions() {
    try {
      const response = await axiosInstance.get(
        "/AccountGroup/available-permissions"
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching permissions:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch permissions",
      };
    }
  },

  // Get group permissions
  async getGroupPermissions(groupId) {
    try {
      const response = await axiosInstance.get(
        `/AccountGroup/permissions/${groupId}`
      );
      console.log("Raw API Response:", response.data); // Debug log

      const data = response.data;
      if (!data) {
        throw new Error("Invalid response data");
      }

      // Format lại data để component có thể hiển thị
      return {
        success: true,
        data: {
          data: {
            groupName: data.data.groupName || "",
            description: data.data.description || "",
            roleId: data.data.roleId || groupId,
            userPermissions: data.data.userPermissions || [],
            actionPermissions: data.data.actionPermissions || [],
          },
        },
      };
    } catch (error) {
      console.error("Error fetching group permissions:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể tải quyền của nhóm",
      };
    }
  },

  // Update group permissions
  async updateGroupPermissions(groupId, permissions) {
    try {
      const response = await axiosInstance.put(`/AccountGroup/edit`, {
        GroupName: permissions.groupName,
        Description: permissions.description,
        UserPermissions: permissions.userPermissions,
        ActionPermissions: permissions.actionPermissions,
        RoleId: permissions.roleId, // Sử dụng roleId từ permissions
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error updating permissions:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Không thể cập nhật quyền",
      };
    }
  },

  // Gán người dùng vào nhóm
  async assignUsersToGroup(groupName, userIds) {
    try {
      const response = await axiosInstance.post(
        "/AccountGroup/assign-users-to-group",
        {
          GroupName: groupName,
          UserIds: userIds,
        }
      );
      return {
        success: true,
        message: "Đã thêm người dùng vào nhóm thành công",
        data: response.data,
      };
    } catch (error) {
      console.error("Lỗi khi thêm người dùng vào nhóm:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể thêm người dùng vào nhóm",
      };
    }
  },
};

export default accountGroupService;
