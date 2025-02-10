import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": "/src", // Alias for the backend API
        },
    },
    server: {
        proxy: {
            "/api": {
                target: "https://localhost:7017/", // Backend URL
                changeOrigin: true,
                secure: false, // Disable SSL verification for local development
            },
            "/login": {
                target: "https://localhost:7017/", // Backend URL
                changeOrigin: true,
                secure: false, // Disable SSL verification for local development
            },
        },
    },
});
