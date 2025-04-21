<template>
    <div class="search-bar">
        <label hidden for="searchBarInput">Tìm kiếm</label>
        <input id="searchBarInput" type="text" class="form-control" :placeholder="placeholder" v-model="localSearchTerm" @input="emitSearch" />
    </div>
</template>

<script>
export default {
    name: "SearchBar",
    props: {
        value: {
            type: String,
            required: true,
        },
        placeholder: {
            type: String,
            default: "Search...",
        },
    },
    data() {
        return {
            localSearchTerm: this.value,
        };
    },
    watch: {
        value(newVal) {
            this.localSearchTerm = newVal;
        },
    },
    methods: {
        emitSearch() {
            this.$emit("update:value", this.localSearchTerm);
            this.$emit("search", this.localSearchTerm);
        },
    },
};
</script>

<style scoped>
.search-bar {
    margin-bottom: 1rem;
}
</style>
