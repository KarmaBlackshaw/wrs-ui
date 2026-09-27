<script setup lang="ts">
import { containerHoldings, containerMovements, containerCounts } from "@/mocks/containers";

definePage({ meta: { title: "Containers" } });

const toastStore = useToastStore();

const holdingColumns = [
  { key: "locationLabel", label: "Location" },
  { key: "type", label: "Type" },
  { key: "full", label: "Full", align: "right" as const },
  { key: "empty", label: "Empty", align: "right" as const },
];

const movementColumns = [
  { key: "createdAt", label: "Date" },
  { key: "type", label: "Movement" },
  { key: "containerType", label: "Type" },
  { key: "qty", label: "Qty", align: "right" as const },
  { key: "from", label: "From" },
  { key: "to", label: "To" },
  { key: "reason", label: "Reason" },
];

const countColumns = [
  { key: "date", label: "Date" },
  { key: "type", label: "Type" },
  { key: "full", label: "Full", align: "right" as const },
  { key: "empty", label: "Empty", align: "right" as const },
  { key: "expected", label: "Expected", align: "right" as const },
  { key: "variance", label: "Variance", align: "right" as const },
];

const movements = computed(() => [...containerMovements].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));

const counts = computed(() =>
  containerCounts.map((count) => ({ ...count, variance: count.full + count.empty - count.expected })).sort((a, b) => b.date.localeCompare(a.date))
);

const movementSheetOpen = ref(false);
const movementAction = ref("damaged");
const movementType = ref("round");
const movementQty = ref(1);
const movementReason = ref("");

function submitMovement() {
  toastStore.show("Container movement saved locally");
  movementSheetOpen.value = false;
  movementQty.value = 1;
  movementReason.value = "";
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiPageHeader title="Containers" subtitle="Holdings, movement log and count variances">
      <template #actions>
        <UiButton @click="movementSheetOpen = true">Record movement</UiButton>
      </template>
    </UiPageHeader>

    <h2 class="text-lg font-semibold text-zinc-900">Holdings by location</h2>
    <UiDataTable :columns="holdingColumns" :rows="containerHoldings" :row-key="(row) => `${row.location}-${row.type}`">
      <template #empty>
        <UiEmptyState title="No holdings recorded" />
      </template>
    </UiDataTable>

    <h2 class="text-lg font-semibold text-zinc-900">Movement log</h2>
    <UiDataTable :columns="movementColumns" :rows="movements" :row-key="(row) => row.id">
      <template #cell-createdAt="{ row }">{{ formatDateTime(row.createdAt) }}</template>
      <template #empty>
        <UiEmptyState title="No movements yet" />
      </template>
    </UiDataTable>

    <h2 class="text-lg font-semibold text-zinc-900">Count variances</h2>
    <UiDataTable :columns="countColumns" :rows="counts" :row-key="(row) => row.id">
      <template #cell-date="{ row }">{{ formatDate(row.date) }}</template>
      <template #cell-variance="{ row }">
        <UiStatusPill :tone="row.variance === 0 ? 'ok' : 'danger'">{{ row.variance }}</UiStatusPill>
      </template>
      <template #empty>
        <UiEmptyState title="No counts recorded" />
      </template>
    </UiDataTable>

    <UiBottomSheet v-model:open="movementSheetOpen" title="Record container movement">
      <div class="flex flex-col gap-4">
        <UiSegmentedControl
          v-model="movementAction"
          :options="[
            { value: 'damaged', label: 'Damaged' },
            { value: 'lost', label: 'Lost' },
            { value: 'purchased', label: 'Purchased' },
          ]"
        />
        <UiSelect
          v-model="movementType"
          label="Container type"
          :options="[
            { value: 'round', label: 'Round' },
            { value: 'slim', label: 'Slim' },
          ]"
        />
        <UiStepper v-model="movementQty" label="Quantity" :min="1" />
        <UiField v-model="movementReason" label="Reason" :hint="movementAction === 'purchased' ? 'Optional' : 'Required'" />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton :disabled="movementAction !== 'purchased' && !movementReason.trim()" @click="submitMovement">Save movement</UiButton>
        </div>
      </template>
    </UiBottomSheet>
  </div>
</template>
