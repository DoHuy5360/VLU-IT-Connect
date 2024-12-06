<template>
    <div class="container py-3">
        <div class="rounded-3 p-3 border-new-gray border shadow-sm bg-white">
            <div class="d-flex flex-column gap-2">
                <div v-for="blog in blogs" :key="blog.id">
                    <div><strong>{{ blog.title }}</strong></div>
                    <span class="text-gray-700">{{ blog.content }}</span>
                </div>
            </div>
            <hr style="border-top: dashed 2px black;">
            <div class="py-2 mb-3">
                <div class="d-flex justify-content-between">
                    <h4 class="mb-3" style="font-weight: bold">
                        Clip hướng dẫn sử dụng
                    </h4>
                    <b
                        class="text-primary hover_underline"
                        style="cursor: pointer"
                        >Xem tất cả</b
                    >
                </div>
                <div class="row" id="wrapVideo">
                    <div class="col-auto col-sm">
                        <iframe
                            width="100%"
                            height="200px"
                            src="https://www.youtube.com/embed/u31qwQUeGuM?si=9IaKmebZwgbysBE6"
                            frameborder="0"
                            allowfullscreen
                            class="rounded"
                        ></iframe>
                        <div>
                            <strong>Hướng dẫn</strong>
                            <div>
                                Lorem, ipsum dolor sit amet consectetur
                                adipisicing elit. Maxime aliquid iusto tempore
                                recusandae obcaecati
                            </div>
                        </div>
                    </div>
                    <div class="col-auto col-sm">
                        <iframe
                            width="100%"
                            height="200px"
                            src="https://www.youtube.com/embed/u31qwQUeGuM?si=9IaKmebZwgbysBE6"
                            frameborder="0"
                            allowfullscreen
                            class="rounded"
                        ></iframe>
                        <div>
                            <strong>Hướng dẫn</strong>
                            <div>
                                Lorem, ipsum dolor sit amet consectetur
                                adipisicing elit. Maxime aliquid iusto tempore
                                recusandae obcaecati
                            </div>
                        </div>
                    </div>
                    <div class="col-auto col-sm">
                        <iframe
                            width="100%"
                            height="200px"
                            src="https://www.youtube.com/embed/u31qwQUeGuM?si=9IaKmebZwgbysBE6"
                            frameborder="0"
                            allowfullscreen
                            class="rounded"
                        ></iframe>
                        <div>
                            <strong>Hướng dẫn</strong>
                            <div>
                                Lorem, ipsum dolor sit amet consectetur
                                adipisicing elit. Maxime aliquid iusto tempore
                                recusandae obcaecati
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const blogs = [
    {
        id: "b",
        title: "Sed blandit ante eu pulvinar semper",
        content:
            "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse ac lorem magna. Donec venenatis, ipsum in porta pretium,o purus dictum dolor, at convallis mi nulla quis sem.",
    },
    {
        id: "b",
        title: "Quisque tincidunt commodo sapien, non viverra ante auctor ut",
        content:
            "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse ac lorem magna. Donec venenatis, ipsum in porta pretium, o purus dictum dolor, at convallis mi nulla quis sem.",
    },
    {
        id: "b",
        title: "Fusce cursus, ipsum ac mollis fermentum, purus lorem maximus justo",
        content:
            "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse ac lorem magna. Donec venenatis, ipsum in porta pretium, eo purus dictum dolor, at convallis mi nulla quis sem.",
    },
    {
        id: "b",
        title: "Ut id pretium tortor. Curabitur vel risus dolor",
        content:
            "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse ac lorem magna. Donec venenatis, ipsum in porta pretium, le purus dictum dolor, at convallis mi nulla quis sem.",
    },
    {
        id: "b",
        title: "Aliquam placerat, metus ac efficitur tincidunt, mauris lorem vehicula arcu",
        content:
            "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse ac lorem magna. Donec venenatis, ipsum in porta pretium, le purus dictum dolor, at convallis mi nulla quis sem.",
    },
];
</script>

<style lang="scss" scoped></style>
