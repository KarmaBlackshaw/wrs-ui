<script setup lang="ts">
import { ROUTES } from "@/types/routes";

definePage({ meta: { title: "Receive return" } });

const { productName } = useProductLookup();

const route = useRoute<"/cashier/trips/[id]/receive">();
const router = useRouter();

const summary = tripSummary(route.params.id);

const counted = ref<Record<string, { full: number; empty: number }>>(
  Object.fromEntries(
    summary.perProduct.map((line) => [line.productId, { full: line.returnedFull || line.expectedFull, empty: line.returnedEmpty || line.emptiesCollected }])
  )
);

const cashPad = ref("");
const cashAmount = computed(() => padToCentavos(cashPad.value));

function setFull(productId: string, qty: number) {
  const entry = counted.value[productId];

  if (entry) {
    entry.full = qty;
  }
}

function setEmpty(productId: string, qty: number) {
  const entry = counted.value[productId];

  if (entry) {
    entry.empty = qty;
  }
}

function submit() {
  useToastStore().show("Saved");
  router.push(ROUTES.CASHIER.TRIPS.INDEX);
}
</script>

<template>
  <UiEmptyState v-if="!summary.trip" title="Trip not found" description="It may have been reconciled or removed.">
    <template #action>
      <UiButton :to="ROUTES.CASHIER.TRIPS.INDEX">Back to trips</UiButton>
    </template>
  </UiEmptyState>

  <div v-else class="flex flex-col gap-4">
    <UiPageHeader title="Receive return" :subtitle="`Loaded ${formatDateTime(summary.trip.loadedAt)}`" :back="ROUTES.CASHIER.TRIPS.INDEX">
      <template #actions>
        <UiButton @click="submit">Submit return</UiButton>
      </template>
    </UiPageHeader>

    <UiCard v-for="line in summary.perProduct" :key="line.productId" :title="productName(line.productId)">
      <p class="text-sm text-zinc-500">Loaded {{ line.loaded }}, expected {{ line.expectedFull }} full, {{ line.emptiesCollected }} empty</p>
      <div class="mt-3 grid grid-cols-2 gap-3">
        <UiStepper
          label="Full returned"
          :model-value="counted[line.productId]?.full ?? 0"
          :min="0"
          :max="line.loaded"
          @update:model-value="(value) => setFull(line.productId, value)"
        />
        <UiStepper
          label="Empties returned"
          :model-value="counted[line.productId]?.empty ?? 0"
          :min="0"
          :max="line.loaded"
          @update:model-value="(value) => setEmpty(line.productId, value)"
        />
      </div>
    </UiCard>

    <UiCard title="Cash">
      <p class="text-sm text-zinc-500">Expected <UiMoneyText :centavos="summary.expectedCash" size="sm" /></p>
      <p class="mt-2 text-center"><UiMoneyText :centavos="cashAmount" size="xl" /></p>
      <UiButton variant="ghost" @click="cashPad = String(summary.expectedCash)">Use {{ formatMoney(summary.expectedCash) }}</UiButton>
      <UiNumberPad v-model="cashPad" />
    </UiCard>
  </div>
</template>
