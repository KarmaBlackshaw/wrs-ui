<script setup lang="ts">
import { consumables } from "@/mocks/consumables";
import { maintenanceLogs as maintenanceLogsMock } from "@/mocks/maintenance";
import { meterReadings } from "@/mocks/meterReadings";
import type { TConsumable } from "@/types/entities/inventory";
import type { TMaintenanceLog } from "@/types/entities/maintenance";

definePage({ meta: { title: "Maintenance" } });

const toastStore = useToastStore();

const maintenanceLogs = ref<TMaintenanceLog[]>([...maintenanceLogsMock]);
const latestMeterLiters = computed(() => Math.max(...meterReadings.map((reading) => reading.liters)));

const columns = [
  { key: "name", label: "Item" },
  { key: "status", label: "Status" },
  { key: "lastReplaced", label: "Last replaced" },
  { key: "notes", label: "Notes" },
  { key: "actions", label: "", align: "right" as const },
];

const rows = computed(() =>
  consumables
    .filter((consumable) => consumable.kind === "maintenance")
    .map((item) => ({ item, state: computeMaintenanceState(item, maintenanceLogs.value, latestMeterLiters.value) }))
);

const statusTone = {
  ok: "ok",
  due: "warn",
  overdue: "danger",
} as const;

const statusLabel = {
  ok: "OK",
  due: "Due soon",
  overdue: "Overdue",
} as const;

const logSheetItem = ref<TConsumable | null>(null);
const meterReading = ref(latestMeterLiters.value);

function openLogSheet(item: TConsumable) {
  logSheetItem.value = item;
  meterReading.value = latestMeterLiters.value;
}

function submitReplacement() {
  if (!logSheetItem.value) {
    return;
  }

  maintenanceLogs.value.push({
    id: `maint-${maintenanceLogs.value.length + 1}`,
    consumableId: logSheetItem.value.id,
    at: new Date().toISOString(),
    meterLiters: meterReading.value,
  });

  logSheetItem.value = null;
  toastStore.show("Saved locally");
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiDataTable :columns="columns" :rows="rows" :row-key="(row) => row.item.id">
      <template #cell-name="{ row }">{{ row.item.name }}</template>
      <template #cell-status="{ row }">
        <UiStatusPill :tone="statusTone[row.state.status]">{{ statusLabel[row.state.status] }}</UiStatusPill>
      </template>
      <template #cell-lastReplaced="{ row }">{{ row.state.lastReplacedAt ? formatDate(row.state.lastReplacedAt) : "Never" }}</template>
      <template #cell-notes="{ row }">
        {{ row.state.litersSince !== null ? `${row.state.litersSince.toLocaleString()} L since replacement` : "No meter baseline yet" }}
        <span v-if="row.item.intervalLiters"> · interval {{ row.item.intervalLiters.toLocaleString() }} L</span>
        <span v-if="row.item.intervalDays"> · every {{ row.item.intervalDays }} days</span>
      </template>
      <template #cell-actions="{ row }">
        <div class="flex justify-end">
          <UiButton size="sm" variant="secondary" @click="openLogSheet(row.item)">Log replacement</UiButton>
        </div>
      </template>
      <template #empty>
        <UiEmptyState title="No maintenance items yet" />
      </template>
    </UiDataTable>

    <UiBottomSheet :open="logSheetItem !== null" title="Log replacement" @update:open="logSheetItem = null">
      <div class="flex flex-col gap-4">
        <p class="text-sm text-zinc-500">{{ logSheetItem?.name }}</p>
        <UiStepper v-model="meterReading" label="Meter reading (liters)" :min="0" :max="999999" :step="10" />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton @click="submitReplacement">Save replacement</UiButton>
        </div>
      </template>
    </UiBottomSheet>
  </div>
</template>
