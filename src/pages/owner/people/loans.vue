<script setup lang="ts">
import { installments, loans as loansMock } from "@/mocks/loans";
import type { TLoan, TLoanRow } from "@/types/entities/loan";

definePage({ meta: { title: "Loans", roles: ["owner"] } });

const { employeeName } = useEmployeeLookup();

const toastStore = useToastStore();

const loans = ref<TLoan[]>([...loansMock]);

const columns = [
  { key: "employee", label: "Employee" },
  { key: "type", label: "Type" },
  { key: "status", label: "Status" },
  { key: "principal", label: "Principal", align: "right" as const },
  { key: "balance", label: "Balance", align: "right" as const },
  { key: "actions", label: "" },
];

const rows = computed(() =>
  loans.value.map((loan): TLoanRow => ({
    ...loan,
    employee: employeeName(loan.employeeId),
    balance: balance(loan),
  }))
);

function schedule(loanId: string) {
  return installments.filter((installment) => installment.loanId === loanId).sort((a, b) => a.seq - b.seq);
}

function balance(loan: TLoan) {
  const paid = schedule(loan.id)
    .filter((installment) => installment.paid)
    .reduce((sum, installment) => sum + installment.principalPart, 0);

  return loan.status === "released" || loan.status === "paid" ? Math.max(0, loan.principal - paid) : loan.principal;
}

const scheduleLoan = ref<TLoan | null>(null);

function openSchedule(loan: TLoan) {
  scheduleLoan.value = loan;
}

function approve(loan: TLoan) {
  loan.status = "approved";
  toastStore.show("Saved locally");
}

const releaseLoan = ref<TLoan | null>(null);
const releaseFile = ref<File | null>(null);

function openRelease(loan: TLoan) {
  releaseLoan.value = loan;
  releaseFile.value = null;
}

function submitRelease() {
  if (!releaseLoan.value || !releaseFile.value) {
    return;
  }

  releaseLoan.value.status = "released";
  releaseLoan.value.authorizationUrl = URL.createObjectURL(releaseFile.value);
  releaseLoan.value = null;
  toastStore.show("Released, posted as expense");
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiDataTable :columns="columns" :rows="rows" :row-key="(row) => row.id">
      <template #cell-type="{ row }">
        <UiStatusPill tone="neutral">{{ row.type }}</UiStatusPill>
      </template>
      <template #cell-status="{ row }">
        <UiStatusPill :tone="LOAN_STATUS_TONE[row.status]">{{ LOAN_STATUS_LABEL[row.status] }}</UiStatusPill>
      </template>
      <template #cell-principal="{ row }">
        <UiMoneyText :centavos="row.principal" size="sm" tone="muted" />
      </template>
      <template #cell-balance="{ row }">
        <UiMoneyText :centavos="row.balance" />
      </template>
      <template #cell-actions="{ row }">
        <div class="flex justify-end gap-2">
          <UiButton v-if="schedule(row.id).length > 0" size="sm" variant="ghost" @click="openSchedule(row)">Schedule</UiButton>
          <UiButton v-if="row.status === 'requested'" size="sm" variant="secondary" @click="approve(row)">Approve</UiButton>
          <UiButton v-if="row.status === 'approved'" size="sm" @click="openRelease(row)">Release</UiButton>
        </div>
      </template>
      <template #empty>
        <UiEmptyState title="No loans yet" />
      </template>
    </UiDataTable>

    <UiBottomSheet :open="scheduleLoan !== null" title="Installment schedule" @update:open="scheduleLoan = null">
      <div v-if="scheduleLoan" class="flex flex-col gap-4">
        <p class="text-sm text-zinc-500">
          {{ employeeName(scheduleLoan.employeeId) }}
          <template v-if="scheduleLoan.ratePct">· {{ scheduleLoan.ratePct }}% {{ scheduleLoan.method }} · {{ scheduleLoan.termMonths }} months</template>
        </p>
        <ul class="flex flex-col gap-1 text-sm text-zinc-600">
          <li v-for="installment in schedule(scheduleLoan.id)" :key="installment.seq" class="flex items-center justify-between">
            <span>#{{ installment.seq }}, due {{ formatDate(installment.due) }}</span>
            <span class="flex items-center gap-2">
              <UiMoneyText :centavos="installment.principalPart + installment.interestPart" size="sm" />
              <UiStatusPill :tone="installment.paid ? 'ok' : 'warn'">{{ installment.paid ? "Paid" : "Pending" }}</UiStatusPill>
            </span>
          </li>
        </ul>
      </div>
    </UiBottomSheet>

    <UiBottomSheet :open="releaseLoan !== null" title="Release with authorization" @update:open="releaseLoan = null">
      <div class="flex flex-col gap-4">
        <p class="text-sm text-zinc-500">{{ releaseLoan ? employeeName(releaseLoan.employeeId) : "" }}</p>
        <UiFileInput v-model="releaseFile" label="Signed authorization photo" accept="image/*" capture="environment" />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton :disabled="!releaseFile" @click="submitRelease">Release loan</UiButton>
        </div>
      </template>
    </UiBottomSheet>
  </div>
</template>
