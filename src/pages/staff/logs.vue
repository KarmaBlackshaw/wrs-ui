<script setup lang="ts">
import { meterReadings } from "@/mocks/meterReadings";
import { waterReadings } from "@/mocks/waterQuality";

definePage({ meta: { title: "Readings" } });

const { employeeName } = useEmployeeLookup();

const toastStore = useToastStore();

const logColumns: { key: string; label: string; align?: "left" | "right" }[] = [
  { key: "label", label: "Type" },
  { key: "detail", label: "Detail" },
  { key: "status", label: "Status" },
  { key: "time", label: "Time", align: "right" },
];

const rows = computed(() => {
  const water = waterReadings.map((reading) => ({
    id: `water-${reading.id}`,
    kind: "water" as const,
    label: "Water quality",
    detail: `TDS ${reading.tds} ppm${reading.ph ? ` · pH ${reading.ph}` : ""} · ${employeeName(reading.by)}`,
    outOfRange: isTdsOutOfRange(reading.tds),
    at: reading.at,
  }));

  const meter = meterReadings.map((reading) => ({
    id: `meter-${reading.id}`,
    kind: "meter" as const,
    label: "Meter reading",
    detail: `${reading.liters?.toLocaleString() ?? 0} L · ${employeeName(reading.by)}`,
    outOfRange: false,
    at: reading.at,
  }));

  return [...water, ...meter].sort((a, b) => (a.at < b.at ? 1 : -1));
});

const sheetOpen = ref(false);
const tdsInput = ref("");
const phInput = ref("");
const meterInput = ref("");

const canSubmit = computed(() => tdsInput.value.trim() !== "" || meterInput.value.trim() !== "");

function openSheet() {
  tdsInput.value = "";
  phInput.value = "";
  meterInput.value = "";
  sheetOpen.value = true;
}

function submitReading() {
  if (!canSubmit.value) {
    return;
  }

  sheetOpen.value = false;
  toastStore.show("Saved on this phone");
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiPageHeader title="Readings" subtitle="TDS, pH and production meter">
      <template #actions>
        <UiSyncBadge />
        <UiButton @click="openSheet">Log reading</UiButton>
      </template>
    </UiPageHeader>

    <UiDataTable :columns="logColumns" :rows="rows" :row-key="(row) => row.id">
      <template #cell-detail="{ row }">
        <div class="flex flex-col gap-0.5">
          <span>{{ row.detail }}</span>
          <span v-if="row.outOfRange" class="text-sm font-medium text-red-700">Out of range, retest before selling</span>
        </div>
      </template>
      <template #cell-status="{ row }">
        <UiStatusPill v-if="row.kind === 'water'" :tone="row.outOfRange ? 'danger' : 'ok'">{{ row.outOfRange ? "Out of range" : "OK" }}</UiStatusPill>
      </template>
      <template #cell-time="{ row }">{{ formatTime(row.at) }}</template>
      <template #empty>
        <UiEmptyState title="No readings yet" description="Log a TDS, pH or meter reading to get started." />
      </template>
    </UiDataTable>

    <UiBottomSheet v-model:open="sheetOpen" title="Log reading">
      <div class="flex flex-col gap-4">
        <div>
          <p class="mb-1.5 text-sm font-medium text-zinc-700">TDS (ppm)</p>
          <UiNumberPad v-model="tdsInput" />
        </div>
        <div>
          <p class="mb-1.5 text-sm font-medium text-zinc-700">pH (optional)</p>
          <UiNumberPad v-model="phInput" />
        </div>
        <div>
          <p class="mb-1.5 text-sm font-medium text-zinc-700">Meter liters (optional)</p>
          <UiNumberPad v-model="meterInput" />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton :disabled="!canSubmit" @click="submitReading">Save reading</UiButton>
        </div>
      </template>
    </UiBottomSheet>
  </div>
</template>
