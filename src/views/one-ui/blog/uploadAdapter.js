import { useTemplateStore } from "../../../stores/template";
import { authRequest } from "../accountmanager/service/axiosConfig";

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
                authRequest
                    .post("/admin/posts/upload-image-content", data, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    })
                    .then((response) => response.data)
                    .then((result) => {
                        resolve({
                            default: store.app.baseURL + "/" + result.url, // URL ảnh sau khi upload
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
