<script setup lang="ts">
import { containerHoldings } from "@/mocks/containers";

definePage({ meta: { title: "Holdings" } });

const columns = [
  { key: "locationLabel", label: "Location" },
  { key: "type", label: "Type" },
  { key: "full", label: "Full", align: "right" as const },
  { key: "empty", label: "Empty", align: "right" as const },
];
</script>

<template>
  <UiDataTable title="Holdings by location" :columns="columns" :rows="containerHoldings" :row-key="(row) => `${row.location}-${row.type}`">
    <template #empty>
      <UiEmptyState title="No holdings recorded" />
    </template>
  </UiDataTable>
</template>
