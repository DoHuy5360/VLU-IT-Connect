import axios from "axios";

// Tạo instance axios với base URL
const axiosInstance = axios.create({
    baseURL: "/api", // Sử dụng URL đầy đủ của BE
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
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

export default axiosInstance;
