<script setup lang="ts">
import startCase from "lodash/startCase";

import { settings as settingsMock } from "@/mocks/settings";
import type { TSetting } from "@/types/entities/settings";
import { ROUTES } from "@/types/routes";

definePage({ meta: { title: "Settings" } });

const toastStore = useToastStore();

const settingsHistory = ref<TSetting[]>([...settingsMock]);

const settingLabel: Record<string, string> = {
  "rider.dailyQuota": "Rider daily quota",
  "rider.incentivePerContainer": "Incentive per container above quota",
  "pay.frequency": "Pay frequency",
  "pay.baseRate": "Base rate",
  "pay.deductionCapPct": "Deduction cap",
  "loan.interestRatePct": "Loan interest rate",
  "loan.interestMethod": "Loan interest method",
  "loan.maxAmount": "Max loan amount",
  "loan.maxTermMonths": "Max loan term",
  "container.depositAmount.round": "Container deposit (round)",
  "container.depositAmount.slim": "Container deposit (slim)",
  "customer.creditLimit": "Customer credit limit",
  "void.approvalThreshold": "Void approval threshold",
  "water.tdsAcceptableRangePpm": "TDS acceptable range",
  "labTest.reminderDays": "Lab test reminder",
  "digest.sendTime": "Digest send time",
};

const moneyKeys = new Set([
  "pay.baseRate",
  "rider.incentivePerContainer",
  "loan.maxAmount",
  "container.depositAmount.round",
  "container.depositAmount.slim",
  "customer.creditLimit",
  "void.approvalThreshold",
]);

const unitSuffix: Record<string, string> = {
  "rider.dailyQuota": "containers",
  "loan.interestRatePct": "% per month",
  "pay.deductionCapPct": "% of gross",
  "loan.maxTermMonths": "months",
  "labTest.reminderDays": "days before due",
  "water.tdsAcceptableRangePpm": "ppm",
};

const groups: { name: string; keys: string[] }[] = [
  { name: "Riders & pay", keys: ["rider.dailyQuota", "rider.incentivePerContainer", "pay.frequency", "pay.baseRate", "pay.deductionCapPct"] },
  { name: "Loans", keys: ["loan.interestRatePct", "loan.interestMethod", "loan.maxAmount", "loan.maxTermMonths"] },
  { name: "Containers & credit", keys: ["container.depositAmount.round", "container.depositAmount.slim", "customer.creditLimit", "void.approvalThreshold"] },
  { name: "Water quality", keys: ["water.tdsAcceptableRangePpm", "labTest.reminderDays"] },
  { name: "Digest", keys: ["digest.sendTime"] },
];

const settingsColumns = [
  { key: "setting", label: "Setting" },
  { key: "value", label: "Value" },
  { key: "actions", label: "" },
];

function settingsRows(group: { keys: string[] }) {
  return group.keys.map((key) => ({ key, setting: currentSetting(key) }));
}

function currentSetting(key: string) {
  const found = latestEffective(settingsHistory.value.filter((setting) => setting.key === key));

  return found ?? { key, value: null, effectiveFrom: "" };
}

function displayValue(setting: TSetting) {
  if (setting.value === null) {
    return null;
  }

  if (moneyKeys.has(setting.key)) {
    return formatMoney(typeof setting.value === "number" ? setting.value : Number(setting.value));
  }

  const suffix = unitSuffix[setting.key];

  if (suffix) {
    return `${setting.value} ${suffix}`;
  }

  return typeof setting.value === "string" ? startCase(setting.value) : String(setting.value);
}

const editSetting = ref<TSetting | null>(null);
const editValue = ref("");
const editEffectiveFrom = ref(todayIso());

function openEdit(setting: TSetting) {
  editSetting.value = setting;
  const numericValue = typeof setting.value === "number" ? setting.value : Number(setting.value);

  editValue.value = setting.value === null ? "" : moneyKeys.has(setting.key) ? String(numericValue / 100) : String(setting.value);
  editEffectiveFrom.value = todayIso();
}

const canSubmitEdit = computed(() => editValue.value.trim().length > 0 && editEffectiveFrom.value.length > 0);

function submitEdit() {
  if (!editSetting.value || !canSubmitEdit.value) {
    return;
  }

  const key = editSetting.value.key;
  const raw = editValue.value.trim();
  const numeric = Number(raw);
  const value = moneyKeys.has(key) ? Math.round(numeric * 100) : Number.isNaN(numeric) ? raw : numeric;

  settingsHistory.value.push({ key, value, effectiveFrom: editEffectiveFrom.value });
  editSetting.value = null;
}

function saveChanges() {
  toastStore.show("Saved");
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiPageHeader title="Settings">
      <template #actions>
        <UiButton @click="saveChanges">Save changes</UiButton>
      </template>
    </UiPageHeader>

    <p class="text-sm text-zinc-500">Changing settings requires an online connection.</p>

    <UiSection v-for="group in groups" :key="group.name" :title="group.name">
      <UiDataTable :columns="settingsColumns" :rows="settingsRows(group)" :row-key="(row) => row.key">
        <template #cell-setting="{ row }">{{ settingLabel[row.key] }}</template>
        <template #cell-value="{ row }">
          <span v-if="displayValue(row.setting) !== null" class="text-zinc-700">{{ displayValue(row.setting) }}</span>
          <UiStatusPill v-else tone="warn">Not set</UiStatusPill>
        </template>
        <template #cell-actions="{ row }">
          <div class="flex justify-end">
            <UiButton size="sm" variant="secondary" @click="openEdit(row.setting)">Edit</UiButton>
          </div>
        </template>
      </UiDataTable>
    </UiSection>

    <p class="text-sm text-zinc-500">
      Stock and maintenance settings (reorder levels, intervals) are configured per item in
      <RouterLink :to="ROUTES.OWNER.INVENTORY.CONSUMABLES" class="underline">Consumables</RouterLink> and
      <RouterLink :to="ROUTES.OWNER.INVENTORY.MAINTENANCE" class="underline">Maintenance</RouterLink>.
    </p>

    <UiBottomSheet :open="editSetting !== null" title="Edit setting" @update:open="editSetting = null">
      <div class="flex flex-col gap-4">
        <p class="text-sm text-zinc-500">{{ editSetting ? settingLabel[editSetting.key] : "" }}</p>
        <UiField
          v-model="editValue"
          :label="editSetting && moneyKeys.has(editSetting.key) ? 'Value (₱)' : 'Value'"
          :type="editSetting && moneyKeys.has(editSetting.key) ? 'number' : 'text'"
          :inputmode="editSetting && moneyKeys.has(editSetting.key) ? 'decimal' : undefined"
        />
        <UiField v-model="editEffectiveFrom" label="Effective date" type="date" hint="Applies forward from this date; history is kept." />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton :disabled="!canSubmitEdit" @click="submitEdit">Save setting</UiButton>
        </div>
      </template>
    </UiBottomSheet>
  </div>
</template>
