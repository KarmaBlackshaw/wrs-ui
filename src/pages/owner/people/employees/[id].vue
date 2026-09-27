<script setup lang="ts">
import { employees, payPlans as payPlansMock } from "@/mocks/employees";
import type { TPayFrequency, TPayPlan, TRateBasis } from "@/types/entities/payroll";
import { ROLE_LABEL } from "@/types/roles";
import { ROUTES } from "@/types/routes";

definePage({ meta: { title: "Employee", roles: ["owner"] } });

const route = useRoute("/owner/people/employees/[id]");
const toastStore = useToastStore();

const employee = computed(() => employees.find((candidate) => candidate.id === route.params.id));

const payPlans = ref<TPayPlan[]>([...payPlansMock]);

const history = computed(() =>
  payPlans.value.filter((plan) => plan.employeeId === route.params.id).sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom))
);
const currentPlan = computed(() => latestEffective(history.value) ?? null);
const currentFrequencyLabel = computed(() => frequencyOptions.find((option) => option.value === currentPlan.value?.frequency)?.label);

const historyColumns = [
  { key: "effectiveFrom", label: "Effective from" },
  { key: "baseRate", label: "Base rate", align: "right" as const },
];

const frequencyOptions: { value: TPayFrequency; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "semi-monthly", label: "Semi-monthly" },
  { value: "monthly", label: "Monthly" },
];

const rateBasisOptions: { value: TRateBasis; label: string }[] = [
  { value: "per-day", label: "Per day" },
  { value: "per-period", label: "Per period" },
];

const editOpen = ref(false);
const frequency = ref<TPayFrequency>("monthly");
const rateBasis = ref<TRateBasis>("per-period");
const baseRate = ref("");
const quota = ref(0);
const incentive = ref("");
const deductionCapPct = ref("");
const effectiveFrom = ref(todayIso());

function openEdit() {
  const plan = currentPlan.value;

  frequency.value = plan?.frequency ?? "monthly";
  rateBasis.value = plan?.rateBasis ?? "per-period";
  baseRate.value = plan ? String(plan.baseRate / 100) : "";
  quota.value = plan?.quota ?? 0;
  incentive.value = plan?.incentivePerContainer ? String(plan.incentivePerContainer / 100) : "";
  deductionCapPct.value = plan?.deductionCapPct ? String(plan.deductionCapPct) : "";
  effectiveFrom.value = todayIso();
  editOpen.value = true;
}

const canSubmit = computed(() => Number(baseRate.value) >= 0 && effectiveFrom.value.length > 0);

function submitEdit() {
  if (!employee.value || !canSubmit.value) {
    return;
  }

  payPlans.value.push({
    employeeId: employee.value.id,
    frequency: frequency.value,
    rateBasis: rateBasis.value,
    baseRate: Math.round(Number(baseRate.value) * 100),
    quota: quota.value > 0 ? quota.value : undefined,
    incentivePerContainer: incentive.value ? Math.round(Number(incentive.value) * 100) : undefined,
    deductionCapPct: deductionCapPct.value ? Number(deductionCapPct.value) : undefined,
    effectiveFrom: effectiveFrom.value,
  });

  editOpen.value = false;
  toastStore.show("Saved locally");
}
</script>

<template>
  <div v-if="employee" class="flex flex-col gap-4">
    <UiPageHeader :title="employee.name" :subtitle="employee.phone" />

    <UiCard title="Roles">
      <div class="flex flex-wrap gap-2">
        <UiStatusPill v-for="role in employee.roles" :key="role" tone="info">{{ ROLE_LABEL[role] }}</UiStatusPill>
        <UiStatusPill :tone="employee.active ? 'ok' : 'neutral'">{{ employee.active ? "Active" : "Inactive" }}</UiStatusPill>
      </div>
    </UiCard>

    <UiCard title="Current pay plan">
      <template #actions>
        <UiButton size="md" variant="secondary" @click="openEdit">Edit pay plan</UiButton>
      </template>

      <div v-if="currentPlan" class="flex flex-col gap-1 text-base text-zinc-700">
        <p>{{ currentFrequencyLabel }} · {{ currentPlan.rateBasis }}</p>
        <p>Base rate: <UiMoneyText :centavos="currentPlan.baseRate" /></p>
        <p v-if="currentPlan.quota">Quota: {{ currentPlan.quota }} containers/day</p>
        <p v-if="currentPlan.incentivePerContainer">Incentive: <UiMoneyText :centavos="currentPlan.incentivePerContainer" /> per container above quota</p>
        <p v-if="currentPlan.deductionCapPct">Deduction cap: {{ currentPlan.deductionCapPct }}% of gross</p>
        <p class="text-sm text-zinc-500">Effective from {{ formatDate(currentPlan.effectiveFrom) }}</p>
      </div>
      <UiEmptyState v-else title="No pay plan set" />
    </UiCard>

    <UiSection title="History">
      <UiDataTable :columns="historyColumns" :rows="history" :row-key="(row) => row.effectiveFrom">
        <template #cell-effectiveFrom="{ row }">From {{ formatDate(row.effectiveFrom) }}</template>
        <template #cell-baseRate="{ row }">
          <UiMoneyText :centavos="row.baseRate" tone="muted" />
        </template>
        <template #empty>
          <UiEmptyState title="No pay plan history yet" />
        </template>
      </UiDataTable>
    </UiSection>

    <UiBottomSheet v-model:open="editOpen" title="Edit pay plan">
      <div class="flex flex-col gap-4">
        <UiSelect v-model="frequency" label="Frequency" :options="frequencyOptions" />
        <UiSelect v-model="rateBasis" label="Rate basis" :options="rateBasisOptions" />
        <UiField v-model="baseRate" label="Base rate (₱)" type="number" inputmode="decimal" />
        <UiStepper v-model="quota" label="Daily quota (containers)" :min="0" :max="999" />
        <UiField v-model="incentive" label="Incentive per container above quota (₱)" type="number" inputmode="decimal" />
        <UiField v-model="deductionCapPct" label="Deduction cap (% of gross)" type="number" inputmode="decimal" />
        <UiField v-model="effectiveFrom" label="Effective date" type="date" hint="Applies forward from this date; history is kept." />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton :disabled="!canSubmit" @click="submitEdit">Save pay plan</UiButton>
        </div>
      </template>
    </UiBottomSheet>
  </div>

  <UiEmptyState v-else title="Employee not found" description="It may have been removed.">
    <template #action>
      <UiButton :to="ROUTES.OWNER_PEOPLE">Back to employees</UiButton>
    </template>
  </UiEmptyState>
</template>
