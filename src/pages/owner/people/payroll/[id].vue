<script setup lang="ts">
import { payPlans } from "@/mocks/employees";
import { payLines as payLinesMock, payRuns as payRunsMock } from "@/mocks/payroll";
import type { TPayLine, TPayRun } from "@/types/entities/payroll";
import { ROUTES } from "@/types/routes";

definePage({ meta: { title: "Payroll run" } });

const { employeeName } = useEmployeeLookup();

const route = useRoute("/owner/people/payroll/[id]");
const toast = useToast();

const payRuns = ref<TPayRun[]>([...payRunsMock]);
const run = computed(() => payRuns.value.find((candidate) => candidate.id === route.params.id));

const payLines = ref<TPayLine[]>([...payLinesMock]);
const lines = computed(() => payLines.value.filter((line) => line.runId === route.params.id));

const columns = [
  { key: "employee", label: "Employee" },
  { key: "days", label: "Days" },
  { key: "base", label: "Base", align: "right" as const },
  { key: "incentive", label: "Incentive", align: "right" as const },
  { key: "adjustments", label: "Adjustments", align: "right" as const },
  { key: "deductions", label: "Deductions", align: "right" as const },
  { key: "net", label: "Net", align: "right" as const },
  { key: "actions", label: "" },
];

const deductionOrder = { advance: 0, loan: 1, shortage: 2 } as const;

function sortedDeductions(line: TPayLine) {
  return [...line.deductions].sort((a, b) => deductionOrder[a.kind] - deductionOrder[b.kind]);
}

function deductionCap(line: TPayLine) {
  const capPct = payPlans.find((plan) => plan.employeeId === line.employeeId)?.deductionCapPct;

  if (!capPct) {
    return null;
  }

  return Math.round(((line.base + line.incentive + line.adjustments) * capPct) / 100);
}

function carriedOver(line: TPayLine) {
  const cap = deductionCap(line);

  return cap === null ? 0 : Math.max(0, totalDeductions(line) - cap);
}

const adjustLine = ref<TPayLine | null>(null);
const adjustAmount = ref("");

function openAdjust(line: TPayLine) {
  adjustLine.value = line;
  adjustAmount.value = "";
}

function submitAdjust() {
  if (!adjustLine.value || !Number(adjustAmount.value)) {
    return;
  }

  const delta = Math.round(Number(adjustAmount.value) * 100);

  adjustLine.value.adjustments += delta;
  adjustLine.value.net += delta;
  adjustLine.value = null;
  toast.show("Saved");
}

const finalizeOpen = ref(false);

function confirmFinalize() {
  if (run.value) {
    run.value.status = "finalized";
  }

  finalizeOpen.value = false;
  toast.show("Payroll run finalized");
}
</script>

<template>
  <div v-if="run" class="flex flex-col gap-4">
    <UiPageHeader :title="formatPeriod(run.periodStart, run.periodEnd)" :subtitle="run.frequency" :back="ROUTES.OWNER.PEOPLE.PAYROLL.INDEX">
      <template v-if="run.status === 'draft'" #actions>
        <UiButton variant="danger" @click="finalizeOpen = true">Finalize run</UiButton>
      </template>
    </UiPageHeader>

    <p class="text-sm text-zinc-500">Payroll runs require an online connection to create, adjust or finalize.</p>

    <p v-if="run.status === 'finalized'" class="rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-600">
      This run is finalized and read-only. Corrections go in the next run as adjustments.
    </p>

    <UiDataTable :columns="columns" :rows="lines" :row-key="(row) => row.employeeId">
      <template #cell-employee="{ row }">{{ employeeName(row.employeeId) }}</template>
      <template #cell-days="{ row }">
        Days worked: {{ row.daysWorked }}<template v-if="row.delivered"> · Delivered: {{ row.delivered }}</template>
      </template>
      <template #cell-base="{ row }">
        <UiMoneyText :centavos="row.base" size="sm" />
      </template>
      <template #cell-incentive="{ row }">
        <UiMoneyText v-if="row.incentive" :centavos="row.incentive" size="sm" />
      </template>
      <template #cell-adjustments="{ row }">
        <UiMoneyText v-if="row.adjustments" :centavos="row.adjustments" size="sm" />
      </template>
      <template #cell-deductions="{ row }">
        <div v-if="row.deductions.length > 0" class="flex flex-col items-end gap-0.5">
          <span v-for="deduction in sortedDeductions(row)" :key="`${deduction.kind}-${deduction.refId}`" class="text-sm text-zinc-500">
            {{ DEDUCTION_LABEL[deduction.kind] }}: <UiMoneyText :centavos="deduction.amount" size="sm" tone="danger" />
          </span>
          <span v-if="carriedOver(row) > 0" class="text-sm text-amber-700">
            Carried over to next run: <UiMoneyText :centavos="carriedOver(row)" size="sm" tone="warn" />
          </span>
        </div>
      </template>
      <template #cell-net="{ row }">
        <UiMoneyText :centavos="row.net" size="lg" />
      </template>
      <template #cell-actions="{ row }">
        <div class="flex justify-end">
          <UiButton v-if="run.status === 'draft'" size="sm" variant="secondary" @click="openAdjust(row)">Adjust</UiButton>
        </div>
      </template>
      <template #empty>
        <UiEmptyState title="No pay lines yet" description="Pay lines are computed once the run has activity to include." />
      </template>
    </UiDataTable>

    <UiBottomSheet :open="adjustLine !== null" title="Adjust pay line" @update:open="adjustLine = null">
      <div class="flex flex-col gap-4">
        <p class="text-sm text-zinc-500">{{ adjustLine ? employeeName(adjustLine.employeeId) : "" }}</p>
        <UiField v-model="adjustAmount" label="Adjustment amount (₱, use negative to deduct)" type="number" inputmode="decimal" />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton @click="submitAdjust">Save adjustment</UiButton>
        </div>
      </template>
    </UiBottomSheet>

    <UiDialog v-model:open="finalizeOpen" title="Finalize payroll run?">
      <p>This locks the run. Any further corrections must go in the next run as adjustments.</p>

      <template #footer>
        <UiButton variant="secondary" @click="finalizeOpen = false">Cancel</UiButton>
        <UiButton variant="danger" @click="confirmFinalize">Finalize</UiButton>
      </template>
    </UiDialog>
  </div>

  <UiEmptyState v-else title="Payroll run not found">
    <template #action>
      <UiButton :to="ROUTES.OWNER.PEOPLE.PAYROLL.INDEX">Back to payroll</UiButton>
    </template>
  </UiEmptyState>
</template>
