<script setup lang="ts">
defineProps<{
  tabs: { label: string; to: string; count?: number }[];
}>();
</script>

<template>
  <nav class="flex gap-3 overflow-x-auto" aria-label="Tabs">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.to"
      :to="tab.to"
      class="flex min-w-40 flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium whitespace-nowrap text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-brand-600"
      active-class="border-brand-600 font-semibold text-brand-700 hover:border-brand-600 hover:text-brand-700"
      exact-active-class="border-brand-600 font-semibold text-brand-700 hover:border-brand-600 hover:text-brand-700"
    >
      {{ tab.label }}
      <span v-if="tab.count != null" class="rounded border border-zinc-200 bg-zinc-100 px-1.5 text-xs font-medium text-zinc-600">
        {{ tab.count }}
      </span>
    </RouterLink>
  </nav>
</template>
