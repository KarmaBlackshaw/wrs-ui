<script setup lang="ts">
import { digestDays } from "@/mocks/digest";
import { approvals } from "@/mocks/approvals";
import { shortages } from "@/mocks/shortages";
import { ROUTES } from "@/types/routes";
import type { TReportTable } from "@/types/report";
import type { TAlert, TAlertTone } from "@/types/ui";

definePage({ meta: { title: "Dashboard" } });

const toneLabel: Record<TAlertTone, string> = {
  warn: "Attention",
  danger: "Rejected",
  info: "Pending",
};

const today = computed(() => digestDays.at(-1));

const alerts = computed(() => {
  const list: TAlert[] = [];
  const day = today.value;

  if (day && day.lowStockCount > 0) {
    list.push({ id: "low-stock", title: `${day.lowStockCount} consumable(s) low on stock`, to: ROUTES.OWNER.INVENTORY.CONSUMABLES, tone: "warn" });
  }

  if (day && day.maintenanceDueCount > 0) {
    list.push({
      id: "maintenance",
      title: `${day.maintenanceDueCount} maintenance item(s) due or overdue`,
      to: ROUTES.OWNER.INVENTORY.MAINTENANCE,
      tone: "warn",
    });
  }

  if (day && day.testsDueCount > 0) {
    list.push({ id: "lab-test", title: `${day.testsDueCount} lab test(s) due`, to: ROUTES.OWNER.INVENTORY.WATER_QUALITY, tone: "warn" });
  }

  const openShortages = shortages.filter((shortage) => !shortage.approvedForDeduction);

  if (openShortages.length > 0) {
    list.push({ id: "shortages", title: `${openShortages.length} rider shortage(s) pending review`, to: ROUTES.OWNER.REPORT("shortages"), tone: "warn" });
  }

  if (approvals.length > 0) {
    list.push({ id: "approvals", title: `${approvals.length} pending approval(s)`, to: ROUTES.OWNER.APPROVALS, tone: "info" });
  }

  return list;
});

const digestTable = computed<TReportTable>(() => ({
  columns: [
    { key: "date", label: "Date" },
    { key: "sales", label: "Sales", align: "right" },
    { key: "expenses", label: "Expenses", align: "right" },
  ],
  rows: [...digestDays].reverse().map((day) => ({
    date: formatDate(day.date),
    sales: formatMoney(day.salesCash + day.salesCredit),
    expenses: formatMoney(day.expenses),
  })),
}));

const reportCards = computed(() =>
  REPORTS.map((report) => {
    const table = buildReportTable(report.slug);
    const columns = report.preview ? table.columns.filter((column) => report.preview.includes(column.key)) : table.columns;

    return { ...report, table: { columns, rows: table.rows } };
  })
);
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiPageHeader title="Dashboard" :subtitle="today ? `Today, ${formatDate(today.date)}` : undefined" />

    <div v-if="today" class="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
      <UiStatCard label="Cash sales">
        <UiMoneyText :centavos="today.salesCash" size="lg" />
      </UiStatCard>
      <UiStatCard label="Credit sales">
        <UiMoneyText :centavos="today.salesCredit" size="lg" />
      </UiStatCard>
      <UiStatCard label="Collections">
        <UiMoneyText :centavos="today.collections" size="lg" />
      </UiStatCard>
      <UiStatCard label="Expenses">
        <UiMoneyText :centavos="today.expenses" size="lg" />
      </UiStatCard>
      <UiStatCard label="Variances" :tone="today.variances > 0 ? 'warn' : 'default'">
        <UiMoneyText :centavos="today.variances" size="lg" :tone="today.variances > 0 ? 'warn' : 'default'" />
      </UiStatCard>
    </div>
    <UiEmptyState v-else title="No sales recorded yet today" />

    <UiCard title="Alerts">
      <template v-if="alerts.length > 0" #actions>
        <UiStatusPill>{{ alerts.length }}</UiStatusPill>
      </template>
      <div v-if="alerts.length > 0" class="-mx-4 -mb-4 flex flex-col divide-y divide-zinc-100 border-t border-zinc-100">
        <UiListItem v-for="alert in alerts" :key="alert.id" :title="alert.title" :to="alert.to">
          <template #trailing>
            <UiStatusPill :tone="alert.tone">{{ toneLabel[alert.tone] }}</UiStatusPill>
          </template>
        </UiListItem>
      </div>
      <UiEmptyState v-else title="All caught up" description="No alerts right now." />
    </UiCard>

    <UiSection title="Reports">
      <div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        <ReportCard title="Daily digest" :to="ROUTES.OWNER.DIGEST" :table="digestTable" />
        <ReportCard v-for="report in reportCards" :key="report.slug" :title="report.title" :to="ROUTES.OWNER.REPORT(report.slug)" :table="report.table" />
      </div>
    </UiSection>
  </div>
</template>
