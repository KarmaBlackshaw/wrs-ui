<script setup lang="ts">
defineProps<{
  tabs: { label: string; to: string }[];
}>();
</script>

<template>
  <nav class="flex gap-6 overflow-x-auto border-b border-zinc-200" aria-label="Tabs">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.to"
      :to="tab.to"
      class="-mb-px shrink-0 border-b-2 border-transparent py-3 text-sm font-medium whitespace-nowrap text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-brand-600"
      active-class="border-brand-700 text-brand-700 hover:border-brand-700 hover:text-brand-700"
      exact-active-class="border-brand-700 text-brand-700 hover:border-brand-700 hover:text-brand-700"
    >
      {{ tab.label }}
    </RouterLink>
  </nav>
</template>
