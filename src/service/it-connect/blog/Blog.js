import axios from "axios";

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
            return {
                id: post.id,
                title: post.title,
                details: post.content || post.excerpt || "No details available.",
                date: new Date(post.publishedAt).toLocaleDateString(),
                author: post.userId || "Unknown author",
                image: post.metadata?.image || "https://via.placeholder.com/600x300",
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
