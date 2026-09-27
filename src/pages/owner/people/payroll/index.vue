<script setup lang="ts">
import { payRuns as payRunsMock } from "@/mocks/payroll";
import { ROUTES } from "@/types";
import type { TPayFrequency, TPayRun } from "@/types";

definePage({ meta: { title: "Payroll" } });

const toast = useToast();
const router = useRouter();

const payRuns = ref<TPayRun[]>([...payRunsMock]);
const rows = computed(() => [...payRuns.value].sort((a, b) => b.periodStart.localeCompare(a.periodStart)));

const columns = [
  { key: "period", label: "Period" },
  { key: "frequency", label: "Frequency" },
  { key: "status", label: "Status" },
];

const statusTone = {
  draft: "warn",
  finalized: "ok",
} as const;

const frequencyOptions: { value: TPayFrequency; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "semi-monthly", label: "Semi-monthly" },
  { value: "monthly", label: "Monthly" },
];

const addOpen = ref(false);
const newFrequency = ref<TPayFrequency>("semi-monthly");
const newPeriodStart = ref(todayIso());
const newPeriodEnd = ref(todayIso());

const canCreateRun = computed(() => newPeriodStart.value.length > 0 && newPeriodEnd.value.length > 0 && newPeriodStart.value <= newPeriodEnd.value);

function submitNewRun() {
  if (!canCreateRun.value) {
    return;
  }

  payRuns.value.push({
    id: `run-${payRuns.value.length + 1}`,
    frequency: newFrequency.value,
    periodStart: newPeriodStart.value,
    periodEnd: newPeriodEnd.value,
    status: "draft",
  });

  addOpen.value = false;
  toast.show("Saved");
}

function openRun(run: TPayRun) {
  router.push(ROUTES.OWNER.PEOPLE.PAYROLL.RUN(run.id));
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-end">
      <UiButton @click="addOpen = true">New run</UiButton>
    </div>

    <UiDataTable clickable :columns="columns" :rows="rows" :row-key="(row) => row.id" @row-click="openRun">
      <template #cell-period="{ row }">{{ formatPeriod(row.periodStart, row.periodEnd) }}</template>
      <template #cell-status="{ row }">
        <UiStatusPill :tone="statusTone[row.status]">{{ row.status === "finalized" ? "Finalized" : "Draft" }}</UiStatusPill>
      </template>
      <template #empty>
        <UiEmptyState title="No payroll runs yet" />
      </template>
    </UiDataTable>

    <UiBottomSheet v-model:open="addOpen" title="New payroll run">
      <div class="flex flex-col gap-4">
        <UiSelect v-model="newFrequency" label="Frequency" :options="frequencyOptions" />
        <UiField v-model="newPeriodStart" label="Period start" type="date" />
        <UiField v-model="newPeriodEnd" label="Period end" type="date" />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton :disabled="!canCreateRun" @click="submitNewRun">Create run</UiButton>
        </div>
      </template>
    </UiBottomSheet>
  </div>
</template>
