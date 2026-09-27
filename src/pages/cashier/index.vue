<script setup lang="ts">
import { drawerSessions } from "@/mocks/drawerSessions";
import { walkInSales } from "@/mocks/walkInSales";
import { payments } from "@/mocks/payments";
import { trips } from "@/mocks/trips";
import { expenses, expenseCategories } from "@/mocks/expenses";
import { ROUTES } from "@/types/routes";
import type { TLocalExpense } from "@/types/entities/expense";
import type { TReportColumn } from "@/types/report";

definePage({ meta: { title: "Drawer" } });

const toast = useToast();

const latestSession = drawerSessions.at(-1) ?? null;
const sessionDay = latestSession ? new Date(latestSession.openedAt) : new Date();

const isOpen = ref(latestSession != null && latestSession.closedAt == null);
const openingCash = ref(latestSession?.openingCash ?? 0);

const localExpenses = ref<TLocalExpense[]>([]);

const expenseColumns: TReportColumn[] = [
  { key: "category", label: "Category" },
  { key: "note", label: "Note" },
  { key: "amount", label: "Amount", align: "right" },
];

const openSheetOpen = ref(false);
const openPad = ref("");

const expenseSheetOpen = ref(false);
const expenseCategory = ref(expenseCategories[0] ?? "");
const expensePad = ref("");
const expenseNote = ref("");

const closeSheetOpen = ref(false);
const countPad = ref("");

const suggestedOpeningCash = latestSession?.openingCash ?? 0;

const walkInCash = computed(() =>
  walkInSales.filter((sale) => sale.paymentType === "cash" && isSameManilaDay(sale.createdAt, sessionDay)).reduce((sum, sale) => sum + sale.amount, 0)
);

const collections = computed(() =>
  payments.filter((payment) => payment.source === "drawer" && isSameManilaDay(payment.createdAt, sessionDay)).reduce((sum, payment) => sum + payment.amount, 0)
);

const riderRemittances = computed(() =>
  trips.filter((trip) => trip.returnedAt && isSameManilaDay(trip.returnedAt, sessionDay)).reduce((sum, trip) => sum + (trip.cashRemitted ?? 0), 0)
);

const seededExpenses = computed(() =>
  expenses.filter((expense) => expense.source === "drawer" && isSameManilaDay(expense.date, sessionDay)).reduce((sum, expense) => sum + expense.amount, 0)
);

const localExpenseTotal = computed(() => localExpenses.value.reduce((sum, expense) => sum + expense.amount, 0));

const drawerExpensesTotal = computed(() => seededExpenses.value + localExpenseTotal.value);

const expectedCash = computed(() => openingCash.value + walkInCash.value + collections.value + riderRemittances.value - drawerExpensesTotal.value);

const openAmount = computed(() => padToCentavos(openPad.value));
const expenseAmount = computed(() => padToCentavos(expensePad.value));
const countedCash = computed(() => padToCentavos(countPad.value));

const variance = computed(() => countedCash.value - expectedCash.value);

const varianceTone = computed(() => (variance.value === 0 ? "ok" : "danger"));

const varianceText = computed(() => {
  if (variance.value === 0) {
    return "Exact match";
  }

  return variance.value > 0 ? `Over ${formatMoney(variance.value)}` : `Short ${formatMoney(Math.abs(variance.value))}`;
});

function confirmOpen() {
  openingCash.value = openAmount.value;
  isOpen.value = true;
  openPad.value = "";
  openSheetOpen.value = false;
  toast.show("Saved");
}

function confirmExpense() {
  if (expenseAmount.value <= 0 || !expenseCategory.value) {
    return;
  }

  localExpenses.value.push({ id: `local-exp-${Date.now()}`, category: expenseCategory.value, amount: expenseAmount.value, note: expenseNote.value.trim() });
  expensePad.value = "";
  expenseNote.value = "";
  expenseSheetOpen.value = false;
  toast.show("Saved");
}

function confirmClose() {
  isOpen.value = false;
  closeSheetOpen.value = false;
  countPad.value = "";
  toast.show("Saved");
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiPageHeader title="Drawer session" :subtitle="isOpen ? `Opened ${formatDateTime(latestSession?.openedAt ?? sessionDay)}` : 'Drawer is closed'">
      <template #actions>
        <UiStatusPill :tone="isOpen ? 'ok' : 'neutral'">{{ isOpen ? "Open" : "Closed" }}</UiStatusPill>
        <template v-if="isOpen">
          <UiButton variant="secondary" :to="ROUTES.CASHIER.COLLECT">Collect payment</UiButton>
          <UiButton variant="secondary" :to="ROUTES.CASHIER.RETURN_CONTAINER">Return container</UiButton>
          <UiButton variant="secondary" @click="expenseSheetOpen = true">Record expense</UiButton>
          <UiButton @click="closeSheetOpen = true">Close with count</UiButton>
        </template>
      </template>
    </UiPageHeader>

    <template v-if="isOpen">
      <div class="grid grid-cols-2 gap-3 lg:grid-cols-3 2xl:grid-cols-6">
        <UiStatCard label="Opening cash"><UiMoneyText :centavos="openingCash" size="lg" /></UiStatCard>
        <UiStatCard label="Walk-in cash"><UiMoneyText :centavos="walkInCash" size="lg" /></UiStatCard>
        <UiStatCard label="Collections"><UiMoneyText :centavos="collections" size="lg" /></UiStatCard>
        <UiStatCard label="Rider remittances"><UiMoneyText :centavos="riderRemittances" size="lg" /></UiStatCard>
        <UiStatCard label="Drawer expenses" tone="warn"><UiMoneyText :centavos="drawerExpensesTotal" size="lg" tone="warn" /></UiStatCard>
        <UiStatCard label="Expected cash"><UiMoneyText :centavos="expectedCash" size="lg" /></UiStatCard>
      </div>

      <div class="flex flex-col gap-2">
        <h2 class="text-sm font-medium text-zinc-500">Drawer expenses this session</h2>
        <UiDataTable :columns="expenseColumns" :rows="localExpenses" :row-key="(row) => row.id">
          <template #cell-amount="{ row }">
            <UiMoneyText :centavos="row.amount" />
          </template>
          <template #empty>
            <p class="p-4 text-base text-zinc-500">None recorded yet.</p>
          </template>
        </UiDataTable>
      </div>
    </template>

    <UiEmptyState v-else title="Drawer is closed" description="Open the drawer with a starting cash count to begin the day.">
      <template #action>
        <UiButton @click="openSheetOpen = true">Open drawer</UiButton>
      </template>
    </UiEmptyState>

    <UiBottomSheet v-model:open="openSheetOpen" title="Open drawer">
      <div class="flex flex-col gap-4">
        <p class="text-center"><UiMoneyText :centavos="openAmount" size="xl" /></p>
        <UiButton v-if="suggestedOpeningCash > 0" variant="ghost" @click="openPad = String(suggestedOpeningCash)">
          Use {{ formatMoney(suggestedOpeningCash) }}
        </UiButton>
        <UiNumberPad v-model="openPad" />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton @click="confirmOpen">Confirm opening cash</UiButton>
        </div>
      </template>
    </UiBottomSheet>

    <UiBottomSheet v-model:open="expenseSheetOpen" title="Drawer expense">
      <div class="flex flex-col gap-4">
        <UiSelect v-model="expenseCategory" label="Category" :options="expenseCategories.map((category) => ({ value: category, label: category }))" />
        <p class="text-center"><UiMoneyText :centavos="expenseAmount" size="xl" /></p>
        <UiNumberPad v-model="expensePad" />
        <UiField v-model="expenseNote" label="Note" hint="Optional" />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton :disabled="expenseAmount <= 0" @click="confirmExpense">Save expense</UiButton>
        </div>
      </template>
    </UiBottomSheet>

    <UiBottomSheet v-model:open="closeSheetOpen" title="Close with count">
      <div class="flex flex-col gap-4">
        <UiStatCard label="Expected cash"><UiMoneyText :centavos="expectedCash" size="lg" /></UiStatCard>
        <p class="text-center"><UiMoneyText :centavos="countedCash" size="xl" /></p>
        <UiButton variant="ghost" @click="countPad = String(expectedCash)">Use {{ formatMoney(expectedCash) }}</UiButton>
        <UiNumberPad v-model="countPad" />
        <p class="text-center text-lg font-semibold" :class="varianceTone === 'ok' ? 'text-emerald-700' : 'text-red-700'">
          {{ varianceText }}
        </p>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton @click="confirmClose">Close drawer</UiButton>
        </div>
      </template>
    </UiBottomSheet>
  </div>
</template>
