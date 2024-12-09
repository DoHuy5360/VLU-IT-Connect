<template>
    <div class="container py-4">
        <div class="row g-2 border border-new-gray rounded-3 shadow-sm">
            <div v-for="video in videos" :key="video.id" class="col-sm-4">
                <div class="gy-2 p-sm-4">
                    <div class="col-auto col-sm">
                        <iframe
                            width="100%"
                            height="200px"
                            :src="video.src"
                            frameborder="0"
                            allowfullscreen
                            class="rounded"
                        ></iframe>
                        <div>
                            <strong>{{ video.title }}</strong>
                            <div>
                                {{ video.content }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useTemplateStore } from "@/stores/template";

const store = useTemplateStore();
store.setBreadcrumb([
    {
        name: "Video Clips hướng dẫn",
        path: "/videos",
    },
]);
    const videos = [
        {
            id: "v1",
            src: "https://www.youtube.com/embed/u31qwQUeGuM?si=9IaKmebZwgbysBE6",
            title: "Lorem ipsum dolor ",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed blandit ante eu pulvinar semper."
        },
        {
            id: "v2",
            src: "https://www.youtube.com/embed/u31qwQUeGuM?si=9IaKmebZwgbysBE6",
            title: "Lorem ipsum dolor ",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed blandit ante eu pulvinar semper."
        },
        {
            id: "v3",
            src: "https://www.youtube.com/embed/u31qwQUeGuM?si=9IaKmebZwgbysBE6",
            title: "Lorem ipsum dolor ",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed blandit ante eu pulvinar semper."
        },
        {
            id: "v4",
            src: "https://www.youtube.com/embed/u31qwQUeGuM?si=9IaKmebZwgbysBE6",
            title: "Lorem ipsum dolor ",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed blandit ante eu pulvinar semper."
        },
        {
            id: "v5",
            src: "https://www.youtube.com/embed/u31qwQUeGuM?si=9IaKmebZwgbysBE6",
            title: "Lorem ipsum dolor ",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed blandit ante eu pulvinar semper."
        },
        {
            id: "v6",
            src: "https://www.youtube.com/embed/u31qwQUeGuM?si=9IaKmebZwgbysBE6",
            title: "Lorem ipsum dolor ",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed blandit ante eu pulvinar semper."
        },
        {
            id: "v7",
            src: "https://www.youtube.com/embed/u31qwQUeGuM?si=9IaKmebZwgbysBE6",
            title: "Lorem ipsum dolor ",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed blandit ante eu pulvinar semper."
        },
        {
            id: "v8",
            src: "https://www.youtube.com/embed/u31qwQUeGuM?si=9IaKmebZwgbysBE6",
            title: "Lorem ipsum dolor ",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed blandit ante eu pulvinar semper."
        },
        {
            id: "v9",
            src: "https://www.youtube.com/embed/u31qwQUeGuM?si=9IaKmebZwgbysBE6",
            title: "Lorem ipsum dolor ",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed blandit ante eu pulvinar semper."
        },
    ]
</script>

<style lang="scss" scoped>

</style>