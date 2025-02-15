import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [vue()],
    base: "/FE/",
    resolve: {
        alias: {
            "@": "/src", // Alias for the backend API
        },
    },
    server: {
        // proxy: {
        //     "/api": {
        //         target: "http://172.16.3.52/api/", // Backend URL
        //         changeOrigin: true,
        //         secure: false, // Disable SSL verification for local development
        //     },
        //     "/login": {
        //         target: "http://172.16.3.52/api/", // Backend URL
        //         changeOrigin: true,
        //         secure: false, // Disable SSL verification for local development
        //     },
        // },
    },
});
