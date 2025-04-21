<template>
    <div class="container py-3">
        <div class="rounded-3 p-3 border-new-gray border bg-white">
            <div v-if="data.origin.length" class="d-flex flex-column gap-3">
                <div v-for="blog in data.paginated" :key="blog.id" class="">
                    <RouterLink :to="`/blog/detail/${blog.slug}`" target="_blank" class="text-black hover_underline" style="cursor: pointer">
                        <strong class="" style="font-size: 1.2rem">{{ blog.title }}</strong>
                        <div class="text-muted">{{ blog.excerpt }}</div>
                    </RouterLink>
                </div>
                <div>
                    <Pagination v-model="data" />
                </div>
            </div>
            <div v-else>
                <p>Không tìm thấy bài viết liên quan.</p>
            </div>
            <hr style="border-top: dashed 2px black" />

            <!-- Videos Section -->
            <div class="py-2 mb-3">
                <div class="d-flex justify-content-between">
                    <h4 class="mb-3 font-weight-bold">{{ store.isVietNamese() ? "Clip hướng dẫn sử dụng" : "Guiding clips" }}</h4>
                    <RouterLink :to="`/videos`" class="text-primary hover_underline">
                        <b>{{ store.isVietNamese() ? "Xem tất cả" : "View all" }}</b>
                    </RouterLink>
                </div>
                <div v-if="data.origin.length" class="row" id="wrapVideo">
                    <div class="col-auto col-sm-3" v-for="blog in data.paginated.slice(0, 3)" :key="blog.id">
                        <div v-if="blog.video !== null">
                            <video v-if="store.isMP4(blog.video)" height="150px" :src="blog.video" controls class="rounded w-100" title="Guiding clips"></video>
                            <iframe v-else width="100%" height="150px" :src="blog.video" frameborder="0" allowfullscreen class="rounded h-50" title="Guiding clips"></iframe>

                            <RouterLink :to="`/blog/detail/${blog.slug}`" class="hover_underline text-black">
                                <div class="mt-2">
                                    <strong>{{ blog.title }}</strong>
                                    <div>{{ store.truncateText(blog.excerpt, 100) }}</div>
                                </div>
                            </RouterLink>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <p>Không tìm thấy video liên quan.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, reactive } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useTemplateStore } from "@/stores/template";
import { guestRequest } from "../one-ui/accountmanager/service/axiosConfig";
import Pagination from "../../components/custom/Pagination.vue";
const store = useTemplateStore();
const route = useRoute();

const data = reactive({
    origin: [],
    paginated: [],
    size: 5,
});

const searchParams = route.query.q;

async function searchBlog(searchValue) {
    const response = await guestRequest.get(`/posts/search`, {
        params: { searchTerm: searchValue },
    });
    data.origin = response.data?.data.$values.map((blog) => ({
        slug: blog.slug,
        title: blog.title,
        excerpt: blog.excerpt,
        video: store.parseMetadataVideo(blog.metadata),
    }));
}
searchBlog(searchParams);

watch(
    () => route.query.q,
    (newSearchParam) => {
        searchBlog(newSearchParam);
    }
);

store.setBreadcrumb([
    {
        name: {
            vn: "Kết quả tìm kiếm",
            en: "Search result",
        },
        path: `/search?q=${searchParams}`,
    },
]);

store.setHeroTitleName({
    vn: "Kết quả tìm kiếm",
    en: "Search result",
});
</script>
