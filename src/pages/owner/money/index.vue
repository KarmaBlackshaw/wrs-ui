<script setup lang="ts">
import { customers } from "@/mocks/customers";
import { ROUTES } from "@/types";
import type { TAgingBucket } from "@/types";

definePage({ meta: { title: "Credit aging" } });

const router = useRouter();

const bucketOrder: TAgingBucket[] = ["current", "7", "15", "30+"];

const columns = [
  { key: "name", label: "Customer" },
  { key: "creditBalance", label: "Credit", align: "right" as const },
];

const groups = computed(() =>
  bucketOrder.map((bucket) => {
    const rows = customers.filter((customer) => customer.creditBalance > 0 && customer.agingBucket === bucket);

    return { bucket, rows, total: rows.reduce((sum, customer) => sum + customer.creditBalance, 0) };
  })
);

const grandTotal = computed(() => groups.value.reduce((sum, group) => sum + group.total, 0));
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiStatCard label="Total outstanding credit" tone="danger">
      <UiMoneyText :centavos="grandTotal" size="xl" tone="danger" />
    </UiStatCard>

    <UiDataTable
      v-for="group in groups"
      :key="group.bucket"
      :title="AGING_LABEL[group.bucket]"
      :columns="columns"
      :rows="group.rows"
      :row-key="(row) => row.id"
      clickable
      @row-click="(row) => router.push(ROUTES.OWNER.CUSTOMERS.DETAIL(row.id))"
    >
      <template #actions>
        <UiMoneyText :centavos="group.total" tone="muted" />
      </template>
      <template #cell-creditBalance="{ row }"><UiMoneyText :centavos="row.creditBalance" /></template>
      <template #empty>
        <UiEmptyState title="No customers in this bucket" />
      </template>
    </UiDataTable>
  </div>
</template>
