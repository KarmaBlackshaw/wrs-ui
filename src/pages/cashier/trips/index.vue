<script setup lang="ts">
import { trips } from "@/mocks/trips";
import { ROUTES } from "@/types/routes";

definePage({ meta: { title: "Trips" } });

const { employeeName } = useEmployeeLookup();

const columns: { key: string; label: string; align?: "left" | "right" }[] = [
  { key: "riderName", label: "Rider" },
  { key: "status", label: "Status" },
  { key: "loadedAt", label: "Loaded" },
  { key: "remitted", label: "Remitted", align: "right" },
  { key: "actions", label: "", align: "right" },
];

const rows = computed(() => trips.map((trip) => ({ ...trip, riderName: employeeName(trip.riderId) })));
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiPageHeader title="Trips">
      <template #actions>
        <UiButton :to="ROUTES.CASHIER.TRIPS.NEW">New load-out</UiButton>
      </template>
    </UiPageHeader>

    <UiDataTable :columns="columns" :rows="rows" :row-key="(row) => row.id">
      <template #cell-status="{ row }">
        <UiStatusPill :tone="TRIP_STATUS_TONE[row.status]">{{ TRIP_STATUS_LABEL[row.status] }}</UiStatusPill>
      </template>
      <template #cell-loadedAt="{ row }">{{ formatDateTime(row.loadedAt) }}</template>
      <template #cell-remitted="{ row }">
        <UiMoneyText v-if="row.cashRemitted != null" :centavos="row.cashRemitted" />
      </template>
      <template #cell-actions="{ row }">
        <UiButton v-if="row.status === 'open'" variant="secondary" size="sm" :to="ROUTES.CASHIER.TRIPS.RECEIVE(row.id)">Receive</UiButton>
        <UiButton v-else-if="row.status === 'returned'" variant="secondary" size="sm" :to="ROUTES.CASHIER.TRIPS.RECONCILE(row.id)">Reconcile</UiButton>
        <UiButton v-else variant="ghost" size="sm" :to="ROUTES.CASHIER.TRIPS.RECONCILE(row.id)">View</UiButton>
      </template>
      <template #empty>
        <UiEmptyState title="No trips yet" description="Start a new load-out to send a rider out." />
      </template>
    </UiDataTable>
  </div>
</template>
