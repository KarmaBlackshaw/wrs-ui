<script setup lang="ts">
import { labTests as labTestsMock, waterReadings } from "@/mocks/waterQuality";
import type { TLabTest } from "@/types/entities/water";

definePage({ meta: { title: "Water quality" } });

const { employeeName } = useEmployeeLookup();

const toastStore = useToastStore();

const labTests = ref<TLabTest[]>([...labTestsMock]);

const sortedReadings = computed(() => [...waterReadings].sort((a, b) => a.at.localeCompare(b.at)));
const maxTds = computed(() => Math.max(...sortedReadings.value.map((reading) => reading.tds), 1));
const recentReadings = computed(() => [...sortedReadings.value].reverse());

const readingColumns = [
  { key: "at", label: "Date" },
  { key: "by", label: "By" },
  { key: "tds", label: "TDS", align: "right" as const },
  { key: "ph", label: "pH", align: "right" as const },
];

const testColumns = [
  { key: "type", label: "Type" },
  { key: "date", label: "Date" },
  { key: "result", label: "Result" },
  { key: "nextDue", label: "Next due" },
];

const addOpen = ref(false);
const newType = ref("");
const newDate = ref(todayIso());
const newResult = ref("");
const newNextDue = ref("");
const newFile = ref<File | null>(null);

const canAddTest = computed(() => newType.value.trim().length > 0 && newResult.value.trim().length > 0 && newNextDue.value.length > 0);

function submitAddTest() {
  if (!canAddTest.value) {
    return;
  }

  labTests.value.push({
    id: `lab-${labTests.value.length + 1}`,
    type: newType.value.trim(),
    date: newDate.value,
    result: newResult.value.trim(),
    fileUrl: newFile.value ? URL.createObjectURL(newFile.value) : "",
    nextDue: newNextDue.value,
  });

  newType.value = "";
  newResult.value = "";
  newNextDue.value = "";
  newFile.value = null;
  addOpen.value = false;
  toastStore.show("Saved locally");
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiCard title="TDS trend">
      <div class="flex h-32 items-end gap-2">
        <div v-for="reading in sortedReadings" :key="reading.id" class="flex flex-1 flex-col items-center gap-1">
          <div
            class="w-full rounded-t bg-brand-500"
            :class="isTdsOutOfRange(reading.tds) ? '!bg-red-500' : ''"
            :style="{ height: `${Math.max((reading.tds / maxTds) * 100, 4)}%` }"
          ></div>
          <span class="text-xs text-zinc-500">{{ reading.tds }}</span>
        </div>
      </div>
      <p class="mt-2 text-sm text-zinc-500">ppm by reading, most recent {{ sortedReadings.length }} entries</p>
    </UiCard>

    <h2 class="text-lg font-semibold text-zinc-900">Recent readings</h2>
    <UiDataTable :columns="readingColumns" :rows="recentReadings" :row-key="(row) => row.id">
      <template #cell-at="{ row }">{{ formatDateTime(row.at) }}</template>
      <template #cell-by="{ row }">{{ employeeName(row.by) }}</template>
      <template #cell-tds="{ row }">
        <span :class="isTdsOutOfRange(row.tds) ? 'font-semibold text-red-700' : ''">{{ row.tds }} ppm</span>
      </template>
      <template #cell-ph="{ row }">{{ row.ph ?? "-" }}</template>
      <template #empty>
        <UiEmptyState title="No readings yet" />
      </template>
    </UiDataTable>

    <div class="flex items-center justify-between gap-3">
      <h2 class="text-lg font-semibold text-zinc-900">Lab tests</h2>
      <UiButton @click="addOpen = true">Add lab test</UiButton>
    </div>

    <UiDataTable :columns="testColumns" :rows="labTests" :row-key="(row) => row.id">
      <template #cell-date="{ row }">{{ formatDate(row.date) }}</template>
      <template #cell-nextDue="{ row }">{{ formatDate(row.nextDue) }}</template>
      <template #empty>
        <UiEmptyState title="No lab tests yet" description="Add the first lab test to start tracking due dates." />
      </template>
    </UiDataTable>

    <UiBottomSheet v-model:open="addOpen" title="Add lab test">
      <div class="flex flex-col gap-4">
        <UiField v-model="newType" label="Test type" />
        <UiField v-model="newDate" label="Date" type="date" />
        <UiField v-model="newResult" label="Result" />
        <UiField v-model="newNextDue" label="Next due" type="date" />
        <UiFileInput v-model="newFile" label="Attachment" accept="image/*,.pdf" />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton :disabled="!canAddTest" @click="submitAddTest">Save lab test</UiButton>
        </div>
      </template>
    </UiBottomSheet>
  </div>
</template>
