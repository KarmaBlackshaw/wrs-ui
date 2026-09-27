<script setup lang="ts">
import startCase from "lodash/startCase";

import { consumables } from "@/mocks/consumables";
import { employees } from "@/mocks/employees";
import { expenseCategories, expenses as expensesMock } from "@/mocks/expenses";
import type { TExpense, TExpenseSource } from "@/types/entities/expense";

definePage({ meta: { title: "Expenses" } });

const { employeeName } = useEmployeeLookup();

const toast = useToast();

const expenses = ref<TExpense[]>([...expensesMock]);

const rowColumns = [
  { key: "category", label: "Category" },
  { key: "date", label: "Date" },
  { key: "paidBy", label: "Paid by" },
  { key: "amount", label: "Amount", align: "right" as const },
];

const monthKey = (date: string) => date.slice(0, 7);
const monthLabel = (key: string) => new Date(`${key}-01`).toLocaleDateString("en-PH", { month: "long", year: "numeric" });

const monthGroups = computed(() => {
  const months = new Map<string, TExpense[]>();

  for (const expense of [...expenses.value].sort((a, b) => b.date.localeCompare(a.date))) {
    const key = monthKey(expense.date);
    const list = months.get(key) ?? [];
    list.push(expense);
    months.set(key, list);
  }

  return [...months.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, rows]) => {
      const categoryTotals = new Map<string, number>();

      for (const row of rows) {
        categoryTotals.set(row.category, (categoryTotals.get(row.category) ?? 0) + row.amount);
      }

      return { key, rows, categoryTotals: [...categoryTotals.entries()], total: rows.reduce((sum, row) => sum + row.amount, 0) };
    });
});

const addOpen = ref(false);
const newCategory = ref(expenseCategories[0] ?? "");
const newAmount = ref("");
const newDate = ref(todayIso());
const newPaidBy = ref(employees[0]?.id ?? "");
const newSource = ref<TExpenseSource>("owner");
const newConsumableId = ref("");
const newQty = ref(0);
const newReceipt = ref<File>();

const categoryOptions = computed(() => expenseCategories.map((category) => ({ value: category, label: category })));
const employeeOptions = computed(() => employees.map((employee) => ({ value: employee.id, label: employee.name })));

const sourceOptions: { value: TExpenseSource; label: string }[] = [
  { value: "owner", label: "Owner" },
  { value: "drawer", label: "Drawer" },
];

const consumableOptions = computed(() => [
  { value: "", label: "None" },
  ...consumables.map((consumable) => ({ value: consumable.id, label: consumable.name })),
]);

const canAddExpense = computed(() => Number(newAmount.value) > 0 && newDate.value.length > 0 && newPaidBy.value.length > 0);

function submitAddExpense() {
  if (!canAddExpense.value) {
    return;
  }

  expenses.value.push({
    id: `exp-${expenses.value.length + 1}`,
    category: newCategory.value,
    amount: Math.round(Number(newAmount.value) * 100),
    date: newDate.value,
    paidBy: newPaidBy.value,
    source: newSource.value,
    receiptUrl: newReceipt.value ? URL.createObjectURL(newReceipt.value) : undefined,
    consumableId: newConsumableId.value || undefined,
    qty: newConsumableId.value ? newQty.value : undefined,
  });

  newAmount.value = "";
  newConsumableId.value = "";
  newQty.value = 0;
  newReceipt.value = undefined;
  addOpen.value = false;
  toast.show(newConsumableId.value ? "Saved, consumable restocked" : "Saved");
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between gap-3">
      <p class="text-sm text-zinc-500">{{ expenses.length }} expenses</p>
      <UiButton @click="addOpen = true">Add expense</UiButton>
    </div>

    <UiSection v-for="group in monthGroups" :key="group.key" :title="monthLabel(group.key)">
      <template #actions>
        <UiMoneyText :centavos="group.total" />
      </template>

      <dl class="flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <div v-for="[category, total] in group.categoryTotals" :key="category" class="flex items-center gap-2">
          <dt class="text-zinc-500">{{ category }}</dt>
          <dd><UiMoneyText :centavos="total" size="sm" /></dd>
        </div>
      </dl>

      <UiDataTable :columns="rowColumns" :rows="group.rows" :row-key="(row) => row.id">
        <template #cell-date="{ row }">{{ formatDate(row.date) }}</template>
        <template #cell-paidBy="{ row }">
          {{ employeeName(row.paidBy) }} · {{ startCase(row.source) }}
          <template v-if="row.consumableId">· restocked {{ row.qty }} pc</template>
        </template>
        <template #cell-amount="{ row }"><UiMoneyText :centavos="row.amount" /></template>
      </UiDataTable>
    </UiSection>

    <UiBottomSheet v-model:open="addOpen" title="Add expense">
      <div class="flex flex-col gap-4">
        <UiSelect v-model="newCategory" label="Category" :options="categoryOptions" />
        <UiField v-model="newAmount" label="Amount (₱)" type="number" inputmode="decimal" />
        <UiField v-model="newDate" label="Date" type="date" />
        <UiSelect v-model="newPaidBy" label="Paid by" :options="employeeOptions" />
        <UiSelect v-model="newSource" label="Source" :options="sourceOptions" />
        <UiSelect v-model="newConsumableId" label="Restock consumable (optional)" :options="consumableOptions" />
        <div v-if="newConsumableId" class="flex flex-col gap-1.5">
          <UiStepper v-model="newQty" label="Quantity" :min="0" :max="99999" />
          <p class="text-sm text-zinc-500">Restocks that consumable's stock on hand.</p>
        </div>
        <UiFileInput v-model="newReceipt" label="Receipt photo" accept="image/*" capture="environment" />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton :disabled="!canAddExpense" @click="submitAddExpense">Save expense</UiButton>
        </div>
      </template>
    </UiBottomSheet>
  </div>
</template>
