<script setup lang="ts">
import { ROUTES } from "@/types/routes";

definePage({ meta: { title: "Report" } });

const route = useRoute("/owner/reports/[report]");
const toast = useToast();

const report = computed(() => REPORTS.find((candidate) => candidate.slug === route.params.report) ?? null);

const dateFrom = ref("2026-09-01");
const dateTo = ref("2026-09-30");

const table = computed(() => (report.value ? buildReportTable(report.value.slug) : null));

const filteredRows = computed(() => {
  if (!table.value) {
    return [];
  }

  return table.value.rows
    .filter((row) => !row._date || (row._date.slice(0, 10) >= dateFrom.value && row._date.slice(0, 10) <= dateTo.value))
    .map((row, index) => ({ ...row, _rowId: index }));
});

function exportCsv() {
  toast.show("Export ready (demo)");
}
</script>

<template>
  <div v-if="report && table" class="flex flex-col gap-4">
    <UiPageHeader :title="report.title" :subtitle="report.description" :back="ROUTES.OWNER.INDEX" />

    <div class="flex flex-wrap items-end gap-3">
      <UiField v-model="dateFrom" label="From" type="date" />
      <UiField v-model="dateTo" label="To" type="date" />
      <UiButton variant="secondary" @click="exportCsv">Export CSV</UiButton>
    </div>

    <UiDataTable :columns="table.columns" :rows="filteredRows" :row-key="(row) => row._rowId">
      <template #empty>
        <UiEmptyState title="No rows in this range" description="Widen the date range to see more results." />
      </template>
    </UiDataTable>
  </div>

  <UiEmptyState v-else title="Report not found" description="This report type isn't available.">
    <template #action>
      <UiButton :to="ROUTES.OWNER.INDEX">Back to dashboard</UiButton>
    </template>
  </UiEmptyState>
</template>
