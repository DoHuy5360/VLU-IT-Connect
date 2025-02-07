import axios from "axios";

// Tạo instance axios với base URL
const authRequest = axios.create({
    // baseURL: "/api", // Sử dụng URL đầy đủ của BE
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    maxRedirects: 0
});

// Request interceptor
authRequest.interceptors.request.use(
    (config) => {
        // Log URL để debug
        console.log("Request URL:", `${config.baseURL}${config.url}`);

        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers["Authorization"] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Thêm interceptor cho phản hồi
authRequest.interceptors.response.use(
    (response) => {
      // Nếu không có lỗi, trả về response
      console.log(response);
      if (response.status === 302) {
          handleAuthorizeFail();
      }
      return response;
    },
    (error) => {
      // Trả về lỗi để tiếp tục xử lý
      return Promise.reject(error);
    }
  );

const handleAuthorizeFail = () => {
    console.log('Fail to authorize request');
    
  };

export default authRequest;
