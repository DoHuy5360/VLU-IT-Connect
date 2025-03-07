import { guestRequest } from "../../../views/one-ui/accountmanager/service/axiosConfig";

/**
 * Gửi thông báo email cho tất cả người đăng ký về một bài viết mới
 * @param {Object} notificationData Dữ liệu thông báo
 * @param {number} notificationData.blogId ID của bài viết mới
 * @param {string} notificationData.blogTitle Tiêu đề bài viết mới
 * @param {number} notificationData.categoryId ID danh mục của bài viết (tùy chọn - nếu chỉ muốn gửi cho người đăng ký danh mục cụ thể)
 * @returns {Promise} Kết quả gửi thông báo
 */
export const sendNewBlogNotification = async (notificationData) => {
  try {
    const response = await guestRequest.post(
      "/Notification/SendNewBlogNotification",
      notificationData
    );
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data
    };
  } catch (error) {
    console.error("Lỗi khi gửi thông báo bài viết mới:", error);
    throw error;
  }
};

/**
 * Gửi thông báo về bài viết được cập nhật
 * @param {Object} notificationData Dữ liệu thông báo
 * @param {number} notificationData.blogId ID của bài viết cập nhật
 * @param {string} notificationData.blogTitle Tiêu đề bài viết cập nhật
 * @param {number} notificationData.categoryId ID danh mục của bài viết (tùy chọn)
 * @returns {Promise} Kết quả gửi thông báo
 */
export const sendBlogUpdateNotification = async (notificationData) => {
  try {
    const response = await guestRequest.post(
      "/Notification/SendBlogUpdateNotification",
      notificationData
    );
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data
    };
  } catch (error) {
    console.error("Lỗi khi gửi thông báo cập nhật bài viết:", error);
    throw error;
  }
};

/**
 * Gửi thông báo tùy chỉnh tới tất cả người đăng ký
 * @param {Object} customNotification Dữ liệu thông báo tùy chỉnh
 * @param {string} customNotification.subject Tiêu đề email
 * @param {string} customNotification.message Nội dung thông báo
 * @param {number} customNotification.categoryId ID danh mục (tùy chọn - nếu chỉ muốn gửi cho người đăng ký danh mục cụ thể)
 * @returns {Promise} Kết quả gửi thông báo
 */
export const sendCustomNotification = async (customNotification) => {
  try {
    const response = await guestRequest.post(
      "/Notification/SendCustomNotification",
      customNotification
    );
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data
    };
  } catch (error) {
    console.error("Lỗi khi gửi thông báo tùy chỉnh:", error);
    throw error;
  }
};

/**
 * Lấy số lượng thông báo đã gửi (có thể dùng cho thống kê)
 * @param {Object} params Tham số truy vấn
 * @param {string} params.startDate Ngày bắt đầu (định dạng YYYY-MM-DD)
 * @param {string} params.endDate Ngày kết thúc (định dạng YYYY-MM-DD)
 * @returns {Promise} Số lượng thông báo đã gửi
 */
export const getNotificationStats = async (params = {}) => {
  try {
    const response = await guestRequest.get("/Notification/Stats", { params });
    return {
      success: response.data.success,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error("Lỗi khi lấy thống kê thông báo:", error);
    throw error;
  }
};
