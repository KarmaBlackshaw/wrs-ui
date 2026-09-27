<script setup lang="ts">
definePage({ meta: { title: "Not found" } });
</script>

<template>
  <div class="flex flex-col items-start gap-2">
    <h1 class="text-2xl font-semibold">Page not found</h1>
    <RouterLink to="/" class="text-sm underline">Back home</RouterLink>
  </div>
</template>
