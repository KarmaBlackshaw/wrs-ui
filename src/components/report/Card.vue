<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

import type { TReportTable } from "@/types";

const { table, limit = 5 } = defineProps<{
  title: string;
  to: RouteLocationRaw;
  table: TReportTable;
  limit?: number;
}>();

const summary = computed(() => (table.rows.length === 1 ? table.rows[0] : null));
const previewRows = computed(() => table.rows.slice(0, limit).map((row, index) => ({ ...row, _rowId: index })));
</script>

<template>
  <article class="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs">
    <header class="flex min-h-12 items-center justify-between gap-3 border-b border-zinc-100 py-2 pr-2 pl-4">
      <h3 class="truncate text-base font-semibold text-zinc-900">{{ title }}</h3>
      <UiButton :to="to" variant="ghost" size="sm">
        {{ table.rows.length > limit ? `View all ${table.rows.length}` : "Open" }}
        <IconArrowRight class="size-4" />
      </UiButton>
    </header>

    <dl v-if="summary" class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3">
      <div v-for="column in table.columns" :key="column.key" class="flex flex-col gap-1">
        <dt class="text-sm text-zinc-500">{{ column.label }}</dt>
        <dd class="text-xl font-semibold tracking-tight text-zinc-900 tabular-nums">{{ summary[column.key] }}</dd>
      </div>
    </dl>

    <UiDataTable v-else :columns="table.columns" :rows="previewRows" :row-key="(row) => row._rowId" class="rounded-none! border-0! shadow-none!">
      <template #empty>
        <UiEmptyState title="Nothing to show yet" />
      </template>
    </UiDataTable>
  </article>
</template>
