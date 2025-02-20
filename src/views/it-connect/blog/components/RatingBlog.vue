<template>
    <div class="rating">
        <span
            v-for="star in 5"
            :key="star"
            @mouseover="hoverRating = star"
            @mouseleave="hoverRating = selectedRating"
            @click="toggleRating(star)"
            class="star"
            :class="{ active: star <= hoverRating }"
        >
            &#9733;
        </span>
    </div>
</template>

<script setup>
import { ref } from "vue";

const selectedRating = ref(0);
const hoverRating = ref(0);

const toggleRating = (star) => {
    if (selectedRating.value === star) {
        selectedRating.value = 0;
    } else {
        selectedRating.value = star;
    }
    hoverRating.value = selectedRating.value;
};
</script>

<style scoped>
.rating {
    font-size: 2rem;
    cursor: pointer;
}
.star {
    color: #ccc;
    transition: color 0.2s;
}
.star.active {
    color: gold;
}
</style>
