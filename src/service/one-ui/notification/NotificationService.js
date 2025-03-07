import { guestRequest } from "../../../views/one-ui/accountmanager/service/axiosConfig";

/**
 * Lấy danh sách các danh mục bài viết để đăng ký nhận thông báo
 * @returns {Promise} Danh sách các danh mục bài viết
 */
export const getNotificationCategories = async () => {
  try {
    const response = await guestRequest.get("/Notification/Categories");
    return response.data.data.$values;
  } catch (error) {
    console.error("Lỗi khi lấy danh mục bài viết:", error);
    throw error;
  }
};

/**
 * Đăng ký nhận thông báo khi có bài viết mới
 * @param {Object} subscriptionData Dữ liệu đăng ký
 * @param {string} subscriptionData.Email Email người đăng ký
 * @param {number} subscriptionData.CategoryId ID danh mục bài viết
 * @param {string} subscriptionData.Notes Ghi chú
 * @returns {Promise} Kết quả đăng ký
 */
export const subscribeNotification = async (subscriptionData) => {
  try {
    const response = await guestRequest.post(
      "/Notification/Subscribe",
      subscriptionData
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi đăng ký nhận thông báo:", error);
    throw error;
  }
};

/**
 * Lấy danh sách đăng ký của một email
 * @param {string} email Email cần kiểm tra
 * @returns {Promise} Danh sách đăng ký
 */
export const getSubscriptionsByEmail = async (email) => {
  try {
    const response = await guestRequest.get(
      `/Notification/Subscriptions/${email}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đăng ký:", error);
    throw error;
  }
};

/**
 * Lấy danh sách tất cả các đăng ký nhận thông báo (phân trang)
 * @param {number} page Số trang
 * @param {number} pageSize Số lượng mục trên mỗi trang
 * @param {string} searchTerm Từ khóa tìm kiếm (tùy chọn)
 * @returns {Promise} Danh sách đăng ký đã phân trang
 */
export const getAllSubscriptions = async (page = 1, pageSize = 20, searchTerm = "") => {
  try {
    const params = {
      page,
      pageSize,
      searchTerm
    };
    
    const response = await guestRequest.get("/Notification/Subscriptions", { params });
    return {
      success: response.data.success,
      data: {
        items: response.data.data.$values || [],
        totalItems: response.data.data.$values?.length || 0,
        totalPages: Math.ceil((response.data.data.$values?.length || 0) / pageSize) || 1
      },
      message: response.data.message
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đăng ký:", error);
    throw error;
  }
};

/**
 * Xóa một đăng ký nhận thông báo
 * @param {number} id ID của đăng ký cần xóa
 * @returns {Promise} Kết quả xóa
 */
export const deleteSubscription = async (id) => {
  try {
    const response = await guestRequest.delete(`/Notification/Subscriptions/${id}`);
    return {
      success: response.data.success,
      message: response.data.message
    };
  } catch (error) {
    console.error("Lỗi khi xóa đăng ký:", error);
    throw error;
  }
};

/**
 * Xóa nhiều đăng ký nhận thông báo
 * @param {Array<number>} ids Danh sách ID các đăng ký cần xóa
 * @returns {Promise} Kết quả xóa
 */
export const deleteMultipleSubscriptions = async (ids) => {
  try {
    const response = await guestRequest.post("/Notification/Subscriptions/DeleteMultiple", { ids });
    return {
      success: response.data.success,
      message: response.data.message
    };
  } catch (error) {
    console.error("Lỗi khi xóa nhiều đăng ký:", error);
    throw error;
  }
};
