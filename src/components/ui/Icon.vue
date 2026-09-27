<script setup lang="ts">
const icons = import.meta.glob<string>("@/assets/icons/*.svg", { query: "?raw", import: "default", eager: true });

const { name } = defineProps<{ name: string }>();

const svg = computed(() => icons[`/src/assets/icons/${name}.svg`]);
</script>

<template>
  <span class="inline-flex shrink-0 [&>svg]:size-full" aria-hidden="true" v-html="svg"></span>
</template>
