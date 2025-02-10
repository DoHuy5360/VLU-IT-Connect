import axios from "axios";
import { useTemplateStore } from "../../../stores/template";

const store = useTemplateStore();

export class CustomUploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    upload() {
        return new Promise((resolve, reject) => {
            const data = new FormData();
            this.loader.file.then((file) => {
                data.append("image", file);
                const token = localStorage.getItem("authToken");
                axios
                    .post("/api/admin/posts/upload-image-content", data, {
                        headers: {
                            Authorization: token,
                        },
                    })
                    .then((response) => response.data)
                    .then((result) => {
                        resolve({
                            default: store.app.baseURL + result.url, // URL ảnh sau khi upload
                        });
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        });
    }

    abort() {
        console.log("Upload aborted");
    }
}
