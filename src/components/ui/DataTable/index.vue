<script setup lang="ts" generic="T extends Record<string, unknown>">
import type { TTab } from "@/types";

const { rows } = defineProps<{
  columns: { key: string; label: string; align?: "left" | "right" }[];
  rows: T[];
  rowKey: (row: T) => string | number;
  clickable?: boolean;
  activeKey?: string | number;
  title?: string;
  icon?: Component;
  tabs?: TTab[];
}>();

const emit = defineEmits<{
  "row-click": [row: T];
}>();
</script>

<template>
  <UiPanel :title="title" :icon="icon" :count="rows.length" :tabs="tabs">
    <template v-if="$slots.actions" #actions>
      <slot name="actions"></slot>
    </template>
    <template v-if="$slots.filters" #filters>
      <slot name="filters"></slot>
    </template>
    <UiTable :columns="columns" :rows="rows" :row-key="rowKey" :clickable="clickable" :active-key="activeKey" @row-click="(row) => emit('row-click', row)">
      <template v-for="column in columns" :key="column.key" #[`cell-${column.key}`]="{ row }">
        <slot :name="`cell-${column.key}`" :row="row">{{ row[column.key] }}</slot>
      </template>
      <template #empty>
        <slot name="empty"></slot>
      </template>
    </UiTable>
  </UiPanel>
</template>
