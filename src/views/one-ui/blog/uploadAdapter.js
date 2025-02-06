export class CustomUploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    upload() {
        return new Promise((resolve, reject) => {
            const data = new FormData();
            this.loader.file.then((file) => {
                data.append("image", file);

                fetch("https://your-api.com/upload", {
                    method: "POST",
                    body: data,
                })
                    .then((response) => response.json())
                    .then((result) => {
                        resolve({
                            default: result.url, // URL ảnh sau khi upload
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
