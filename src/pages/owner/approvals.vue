<script setup lang="ts">
import IconCheck from "@/components/icon/Check.vue";
import IconStamp from "@/components/icon/Stamp.vue";
import IconUserCircle from "@/components/icon/UserCircle.vue";
import IconX from "@/components/icon/X.vue";
import { approvals } from "@/mocks/approvals";
import { loans } from "@/mocks/loans";
import { ROUTES } from "@/types";
import type { TApproval, TLoan, TRowAction } from "@/types";

definePage({ meta: { title: "Approvals" } });

const { employeeName } = useEmployeeLookup();
const { findCustomer } = useCustomerLookup();

const toast = useToast();

const handled = ref<Record<string, "approved" | "rejected">>({});

const confirmDialogOpen = ref(false);
const confirmAction = ref<"approve" | "reject">();
const confirmApproval = ref<TApproval>();

const loanSheetOpen = ref(false);
const loanApproval = ref<TApproval>();
const authFile = ref<File>();

const columns = [
  { key: "summary", label: "Request" },
  { key: "requestedBy", label: "Requested by" },
  { key: "createdAt", label: "Date" },
  { key: "details", label: "Details" },
  { key: "status", label: "Status" },
  { key: "actions", label: "", align: "right" as const },
];

function customerLink(refId: string) {
  return findCustomer(refId) ? ROUTES.OWNER.CUSTOMERS.DETAIL(refId) : undefined;
}

function approvalActions(approval: TApproval) {
  const actions: TRowAction[] = [];
  const customer = approval.kind === "credit" || approval.kind === "waiver" ? customerLink(approval.refId) : undefined;

  if (customer) {
    actions.push({ label: "View customer", icon: IconUserCircle, to: customer });
  }

  if (!handled.value[approval.id]) {
    actions.push(
      { label: "Approve", icon: IconCheck, variant: "primary", onSelect: () => openConfirm(approval, "approve") },
      { label: "Reject", icon: IconX, variant: "danger", onSelect: () => openConfirm(approval, "reject") }
    );
  }

  return actions;
}

function loanFor(refId: string) {
  return loans.find((loan) => loan.id === refId);
}

function loanPreview(loan: TLoan) {
  const monthlyInterest = Math.round(loan.principal * (loan.ratePct / 100));
  const totalInterest = loan.method === "diminishing" ? Math.round((monthlyInterest * (loan.termMonths + 1)) / 2) : monthlyInterest * loan.termMonths;
  const installment = Math.round((loan.principal + totalInterest) / loan.termMonths);

  return { totalInterest, installment };
}

function openConfirm(approval: TApproval, action: "approve" | "reject") {
  if (action === "approve" && approval.kind === "loan") {
    loanApproval.value = approval;
    authFile.value = undefined;
    loanSheetOpen.value = true;

    return;
  }

  confirmApproval.value = approval;
  confirmAction.value = action;
  confirmDialogOpen.value = true;
}

function confirmDecision() {
  if (!confirmApproval.value || !confirmAction.value) {
    return;
  }

  handled.value[confirmApproval.value.id] = confirmAction.value === "approve" ? "approved" : "rejected";
  toast.show(confirmAction.value === "approve" ? "Approved" : "Rejected");
  confirmDialogOpen.value = false;
}

function confirmLoanApproval() {
  if (!loanApproval.value || !authFile.value) {
    return;
  }

  handled.value[loanApproval.value.id] = "approved";
  toast.show("Loan approved");
  loanSheetOpen.value = false;
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiDataTable title="Approvals" :icon="IconStamp" :columns="columns" :rows="approvals" :row-key="(row) => row.id">
      <template #cell-requestedBy="{ row }">{{ employeeName(row.requestedBy) }}</template>
      <template #cell-createdAt="{ row }">{{ formatDateTime(row.createdAt) }}</template>
      <template #cell-details="{ row }">
        <div v-if="row.kind === 'loan' && loanFor(row.refId)" class="flex flex-col gap-0.5 text-sm text-zinc-600">
          <span>Interest: <UiMoneyText :centavos="loanPreview(loanFor(row.refId)!).totalInterest" size="sm" /></span>
          <span>Installment / pay run: <UiMoneyText :centavos="loanPreview(loanFor(row.refId)!).installment" size="sm" /></span>
        </div>
      </template>
      <template #cell-status="{ row }">
        <UiStatusPill v-if="handled[row.id]" :tone="handled[row.id] === 'approved' ? 'ok' : 'danger'">
          {{ handled[row.id] === "approved" ? "Approved" : "Rejected" }}
        </UiStatusPill>
        <UiStatusPill v-else tone="warn">Pending</UiStatusPill>
      </template>
      <template #cell-actions="{ row }">
        <UiDataTableRowActions :actions="approvalActions(row)" />
      </template>
      <template #empty>
        <UiEmptyState title="No pending approvals" />
      </template>
    </UiDataTable>

    <UiDialog v-model:open="confirmDialogOpen" :title="confirmAction === 'approve' ? 'Approve request' : 'Reject request'">
      <p>Are you sure you want to {{ confirmAction }} this request?</p>

      <template #footer>
        <UiButton variant="secondary" @click="confirmDialogOpen = false">Cancel</UiButton>
        <UiButton :variant="confirmAction === 'reject' ? 'danger' : 'primary'" @click="confirmDecision">Confirm</UiButton>
      </template>
    </UiDialog>

    <UiBottomSheet v-model:open="loanSheetOpen" title="Approve loan">
      <div class="flex flex-col gap-4">
        <p v-if="loanApproval">{{ loanApproval.summary }}</p>
        <p class="text-sm text-zinc-500">A signed authorization photo is required before releasing a loan (BR-15).</p>
        <UiFileInput v-model="authFile" label="Authorization photo" accept="image/*" capture="environment" />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton :disabled="!authFile" @click="confirmLoanApproval">Approve and release</UiButton>
        </div>
      </template>
    </UiBottomSheet>
  </div>
</template>
