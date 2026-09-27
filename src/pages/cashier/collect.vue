<script setup lang="ts">
import type { TCustomer } from "@/types/entities/customer";

definePage({ meta: { title: "Collect payment" } });

const customer = ref<TCustomer | null>(null);
const customerSheetOpen = ref(true);
const pad = ref("");

const amount = computed(() => padToCentavos(pad.value));
const canConfirm = computed(() => customer.value != null && amount.value > 0);

function onSelectCustomer(picked: TCustomer) {
  customer.value = picked;
}

function confirm() {
  if (!canConfirm.value) {
    return;
  }

  useToastStore().show("Saved on this phone");
  pad.value = "";
  customerSheetOpen.value = true;
  customer.value = null;
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiPageHeader title="Collect payment">
      <template #actions>
        <UiButton v-if="customer" :disabled="!canConfirm" @click="confirm">Record payment</UiButton>
      </template>
    </UiPageHeader>

    <UiEmptyState v-if="!customer" title="No customer selected" description="Search for a customer to collect their payment.">
      <template #action>
        <UiButton @click="customerSheetOpen = true">Select customer</UiButton>
      </template>
    </UiEmptyState>

    <template v-else>
      <UiCard>
        <div class="flex items-center justify-between gap-2">
          <div class="flex flex-col">
            <span class="text-base font-medium text-zinc-900">{{ customer.name }}</span>
            <span class="text-sm text-zinc-500">{{ customer.address }}</span>
          </div>
          <UiButton variant="ghost" @click="customerSheetOpen = true">Change</UiButton>
        </div>
        <div class="mt-3 flex items-center justify-between">
          <span class="text-base text-zinc-700">Balance</span>
          <UiMoneyText :centavos="customer.creditBalance" size="lg" :tone="customer.creditBalance > 0 ? 'warn' : 'default'" />
        </div>
        <div class="mt-2 flex justify-end">
          <UiStatusPill :tone="AGING_TONE[customer.agingBucket]">{{ AGING_LABEL[customer.agingBucket] }}</UiStatusPill>
        </div>
      </UiCard>

      <p class="text-center"><UiMoneyText :centavos="amount" size="xl" /></p>
      <UiButton v-if="customer.creditBalance > 0" variant="ghost" @click="pad = String(customer.creditBalance)">
        Use full balance ({{ formatMoney(customer.creditBalance) }})
      </UiButton>
      <UiNumberPad v-model="pad" />
    </template>

    <CashierCustomerPickerSheet v-model:open="customerSheetOpen" :allow-quick-add="false" @select="onSelectCustomer" />
  </div>
</template>
