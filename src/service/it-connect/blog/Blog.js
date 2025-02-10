import axios from "axios";
import { useTemplateStore } from "../../../stores/template";
const store = useTemplateStore();

export default {
    data() {
        return {
            featuredArticle: null, // Store the most recent article
            oldArticles: [], // Store the remaining articles
        };
    },
    methods: {
        truncateText(text, maxLength) {
            // Safely truncate text
            return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
        },
        formatPost(post) {
            let imageUrl = "";
            try {
                if (post.metadata) {
                    const metadataObj = JSON.parse(post.metadata);
                    if (metadataObj.Files && metadataObj.Files.length > 0) {
                        // Thêm base URL vào đường dẫn hình ảnh và thay thế dấu \\ bằng /
                        const imagePath = metadataObj.Files[0].replace(/\\/g, "/");
                        imageUrl = `${store.app.baseURL}/${imagePath}`;
                    }
                }
            } catch (error) {
                console.error("Error parsing metadata:", error);
            }

            return {
                id: post.id,
                title: post.title,
                details: post.content || post.excerpt || "No details available.",
                date: new Date(post.publishedAt).toLocaleDateString(),
                userName: post.userName || "Unknown author",
                image: imageUrl,
            };
        },
    },
    async created() {
        try {
            const response = await axios.get("/api/posts");
            const posts = response.data?.data?.$values || [];

            if (posts.length > 0) {
                // Assign featured article
                this.featuredArticle = this.formatPost(posts[0]);

                // Assign old articles
                this.oldArticles = posts.slice(1).map(this.formatPost);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    },
};
