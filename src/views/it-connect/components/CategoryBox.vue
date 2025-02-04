<template>
    <div class="rounded-2 shadow-sm border border-new-gray py-2 px-4 h-100 bg-white">
        <div class="category-name py-3" style="font-weight: bold">{{ props.dataProps.categoryName }}</div>
        <div v-if="props.dataProps.posts.length > 0">
            <div class="d-flex flex-column gap-2">
                <div v-for="(blog, index) in props.dataProps.posts" :key="index" class="d-flex gap-2">
                    <span>
                        <svg width="12" height="17" viewBox="0 0 12 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M3.50312 14.3636C3.50312 14.5603 3.55988 14.7523 3.66825 14.9164L4.20388 15.7192C4.36794 15.9653 4.74044 16.1654 5.03638 16.1654H6.96356C7.2585 16.1654 7.63106 15.9654 7.79513 15.7192L8.32887 14.9167C8.42069 14.778 8.496 14.5301 8.496 14.3636L8.5 13.1386H3.5L3.50312 14.3636ZM6 0.166687C2.81312 0.176696 0.5 2.7595 0.5 5.63856C0.5 7.02544 1.01375 8.28981 1.86125 9.25731C2.37781 9.84606 3.18438 11.077 3.49312 12.1151C3.4941 12.1229 3.49606 12.1313 3.49703 12.1396H8.50328C8.50426 12.1313 8.50621 12.1234 8.50719 12.1151C8.81578 11.077 9.6225 9.84606 10.1391 9.25731C10.9875 8.31669 11.5 7.05419 11.5 5.63856C11.5 2.62919 9.0375 0.166809 6 0.166687ZM9.0125 8.29481C8.52312 8.85262 7.9175 9.74169 7.47969 10.6664H4.52313C4.08531 9.74169 3.47969 8.85262 2.99062 8.29512C2.35125 7.56669 2 6.60731 2 5.63856C2 3.70731 3.50313 1.6745 5.97188 1.66669C8.20625 1.66669 10 3.46044 10 5.63856C10 6.60731 9.65 7.56669 9.0125 8.29481ZM5.5 2.66669C4.12188 2.66669 3 3.78856 3 5.16669C3 5.44306 3.22362 5.66669 3.5 5.66669C3.77638 5.66669 4 5.44169 4 5.16669C4 4.3395 4.67281 3.66669 5.5 3.66669C5.77637 3.66669 6 3.44331 6 3.167C6 2.89069 5.775 2.66669 5.5 2.66669Z"
                                fill="#252F4A"
                            />
                        </svg>
                    </span>
                    <a class="hover_underline text-black" style="font-size: 1rem" :href="`/blog/detail/${blog.slugPost}`">{{ blog.postTitle }}</a>
                </div>
            </div>
        </div>
        <div v-else style="word-break: break-all; color: #999">Không có bài viết</div>
        <div class="d-flex justify-content-end">
            <a v-if="props.dataProps.posts.length > 0" :href="`/blog?category=${props.dataProps.slug}`" >Xem thêm</a>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useTemplateStore } from "@/stores/template";

const props = defineProps({
    dataProps: Object,
});
const store = useTemplateStore();

const router = useRouter();

</script>
