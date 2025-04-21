import axios from "axios";
import { msalEntity } from "../../../../config/msalConfig";
import { useAuth } from "@/config/useAuth";

const { getAccessToken } = useAuth();

function checkAccountExisting() {
    const account = msalEntity.getActiveAccount();
    if (!account) {
        console.log("Không có tài khoản đăng nhập");
        return false;
    }
    return true;
}

// Tạo instance axios với base URL
const authRequest = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL + "/api", // Sử dụng URL đầy đủ của BE
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    maxRedirects: 0,
});

// Request interceptor
authRequest.interceptors.request.use(
    async (config) => {
        // Log URL để debug
        // console.log("Request URL:", `${config.baseURL}${config.url}`);

        // const token = localStorage.getItem("authToken");
        // if (token) {
        //     config.headers["Authorization"] = token;
        // }
        if (checkAccountExisting()) {
            try {
                config.headers.Authorization = `Bearer ${await getAccessToken()}`;
            } catch (error) {
                console.error("Lỗi khi lấy token", error);
            }
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
    console.log("Fail to authorize request");
};

const guestRequest = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL + "/api", // Sử dụng URL đầy đủ của BE
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    maxRedirects: 0,
});

const gateRequest = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL, // Sử dụng URL đầy đủ của BE
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    maxRedirects: 0,
});

const msRequest = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL + "", // Sử dụng URL đầy đủ của BE
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    maxRedirects: 0,
});

msRequest.interceptors.request.use(async (config) => {
    const account = msalEntity.getActiveAccount();
    if (!account) {
        throw new Error("Không có tài khoản đăng nhập");
    }

    try {
        const accessToken = await getAccessToken();

        config.headers.Authorization = `Bearer ${accessToken}`;
    } catch (error) {
        console.error("Lỗi khi lấy token", error);
    }

    return config;
});

export { authRequest, guestRequest, gateRequest, msRequest };
