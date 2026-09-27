<script setup lang="ts">
import type { TCustomer, TOption, TPaymentType } from "@/types";
import { products } from "@/mocks/products";
import { containerTypes } from "@/mocks/containerTypes";

definePage({ meta: { title: "Walk-in sale" } });

const toast = useToast();

const activeProducts = products.filter((product) => product.active);

const cart = ref<Record<string, number>>({});
const ownership = ref<"own" | "borrowed">("own");

const ownershipOptions: TOption<typeof ownership.value>[] = [
  { value: "own", label: "Own container" },
  { value: "borrowed", label: "Borrowed" },
];
const paymentType = ref<TPaymentType>("cash");
const customer = ref<TCustomer>();
const customerSheetOpen = ref(false);
const confirmOpen = ref(false);

function qtyFor(productId: string) {
  return cart.value[productId] ?? 0;
}

function setQty(productId: string, qty: number) {
  cart.value[productId] = qty;
}

const cartLines = computed(() =>
  activeProducts.map((product) => ({ product, qty: qtyFor(product.id), price: currentPrice(product.id) })).filter((line) => line.qty > 0)
);

const containerLine = computed(() => cartLines.value.find((line) => line.product.containerType));

const showContainerChoice = computed(() => containerLine.value != null);

const depositAmount = computed(() => {
  if (ownership.value !== "borrowed" || !containerLine.value || customer.value?.depositWaived) {
    return 0;
  }

  const containerType = containerTypes.find((type) => type.code === containerLine.value?.product.containerType);

  return (containerType?.depositAmount ?? 0) * containerLine.value.qty;
});

const subtotal = computed(() => cartLines.value.reduce((sum, line) => sum + line.qty * line.price, 0));

const total = computed(() => subtotal.value + depositAmount.value);

const requiresCustomer = computed(() => ownership.value === "borrowed" || paymentType.value === "credit");

const blockedReason = computed(() => {
  if (paymentType.value !== "credit" || !customer.value) {
    return null;
  }

  return creditBlockReason(customer.value, total.value);
});

const canConfirm = computed(() => cartLines.value.length > 0 && (!requiresCustomer.value || customer.value != null) && !blockedReason.value);

function onSelectCustomer(picked: TCustomer) {
  customer.value = picked;
}

function reset() {
  cart.value = {};
  ownership.value = "own";
  paymentType.value = "cash";
  customer.value = undefined;
  confirmOpen.value = false;
}

function confirmSale() {
  toast.show("Saved");
  reset();
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiPageHeader title="Walk-in sale" />

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div v-for="product in activeProducts" :key="product.id" class="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3 shadow-xs">
        <span class="text-base font-medium text-zinc-900">{{ product.name }}</span>
        <UiMoneyText :centavos="currentPrice(product.id)" tone="muted" />
        <UiStepper :model-value="qtyFor(product.id)" :min="0" :max="99" @update:model-value="(value) => setQty(product.id, value)" />
      </div>
    </div>

    <UiCard v-if="showContainerChoice" title="Container">
      <UiSegmentedControl v-model="ownership" :options="ownershipOptions" />
      <p v-if="ownership === 'borrowed'" class="mt-3 text-sm text-zinc-500">Deposit due: <UiMoneyText :centavos="depositAmount" size="sm" /></p>
    </UiCard>

    <UiCard title="Customer" v-if="requiresCustomer || customer">
      <div v-if="customer" class="flex items-center justify-between gap-2">
        <div class="flex flex-col">
          <span class="text-base font-medium text-zinc-900">{{ customer.name }}</span>
          <span class="text-sm text-zinc-500">{{ customer.address }}</span>
        </div>
        <UiButton variant="ghost" @click="customerSheetOpen = true">Change</UiButton>
      </div>
      <UiButton v-else variant="secondary" @click="customerSheetOpen = true">Select customer</UiButton>
    </UiCard>

    <UiCard title="Payment">
      <UiSegmentedControl v-model="paymentType" :options="PAYMENT_OPTIONS" />
      <p v-if="blockedReason" class="mt-3 text-sm font-medium text-red-700">{{ blockedReason }}</p>
    </UiCard>

    <div class="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-xs">
      <span class="text-base font-medium text-zinc-700">Total</span>
      <UiMoneyText :centavos="total" size="xl" />
    </div>

    <div class="flex justify-end">
      <UiButton :disabled="!canConfirm" @click="confirmOpen = true">Confirm sale</UiButton>
    </div>

    <CashierCustomerPickerSheet v-model:open="customerSheetOpen" @select="onSelectCustomer" />

    <UiDialog v-model:open="confirmOpen" title="Confirm sale">
      <div class="flex flex-col gap-2">
        <div v-for="line in cartLines" :key="line.product.id" class="flex items-center justify-between">
          <span>{{ line.qty }}× {{ line.product.name }}</span>
          <UiMoneyText :centavos="line.qty * line.price" />
        </div>
        <div v-if="depositAmount > 0" class="flex items-center justify-between">
          <span>Deposit</span>
          <UiMoneyText :centavos="depositAmount" />
        </div>
        <div class="flex items-center justify-between border-t border-zinc-200 pt-2">
          <span class="font-semibold">Total</span>
          <UiMoneyText :centavos="total" size="lg" />
        </div>
      </div>

      <template #footer>
        <UiButton variant="ghost" @click="confirmOpen = false">Cancel</UiButton>
        <UiButton @click="confirmSale">Confirm</UiButton>
      </template>
    </UiDialog>
  </div>
</template>
