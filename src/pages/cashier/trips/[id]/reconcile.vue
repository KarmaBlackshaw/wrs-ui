<script setup lang="ts">
import { ROUTES } from "@/types";

definePage({ meta: { title: "Reconcile trip", roles: ["cashier", "owner"] } });

const { customerName } = useCustomerLookup();
const { productName } = useProductLookup();

const route = useRoute<"/cashier/trips/[id]/reconcile">();
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const summary = tripSummary(route.params.id);

const tripsHomeRoute = computed(() => (authStore.activeRole === "owner" ? ROUTES.OWNER.TRIPS : ROUTES.CASHIER.TRIPS.INDEX));

const hasVariance = computed(() => summary.fullVariance !== 0 || summary.emptyVariance !== 0 || summary.cashVariance !== 0);

const suggestedShortageCash = computed(() => Math.max(0, -summary.cashVariance));
const shortageSheetOpen = ref(false);
const shortageCashPad = ref("");
const shortageCashAmount = computed(() => padToCentavos(shortageCashPad.value));
const shortageContainers = ref(Math.max(0, -summary.fullVariance));

const voidSheetOpen = ref(false);
const voidTargetSummary = ref("");

const productColumns: { key: string; label: string; align?: "left" | "right" }[] = [
  { key: "product", label: "Product" },
  { key: "full", label: "Full" },
  { key: "empty", label: "Empty" },
];

const productRows = summary.perProduct.map((line) => ({ ...line, product: productName(line.productId) }));

const deliveryColumns: { key: string; label: string; align?: "left" | "right" }[] = [
  { key: "customer", label: "Customer" },
  { key: "delivered", label: "Delivered", align: "right" },
  { key: "amount", label: "Amount", align: "right" },
  { key: "actions", label: "", align: "right" },
];

const deliveryRows = summary.deliveries.map((delivery) => ({ ...delivery, customer: customerName(delivery.customerId) }));

function openVoid(delivery: (typeof summary.deliveries)[number]) {
  voidTargetSummary.value = `Delivery to ${customerName(delivery.customerId)}, ${delivery.delivered} delivered, ${formatMoney(delivery.amount)}`;
  voidSheetOpen.value = true;
}

function recordShortage() {
  toast.show("Saved");
  shortageSheetOpen.value = false;
}

function reconcile() {
  toast.show("Saved");
  router.push(tripsHomeRoute.value);
}
</script>

<template>
  <UiEmptyState v-if="!summary.trip" title="Trip not found" description="It may not exist.">
    <template #action>
      <UiButton :to="tripsHomeRoute">Back to trips</UiButton>
    </template>
  </UiEmptyState>

  <div v-else class="flex flex-col gap-4">
    <UiPageHeader title="Reconcile trip" :subtitle="`Loaded ${formatDateTime(summary.trip.loadedAt)}`" :back="tripsHomeRoute">
      <template #actions>
        <UiStatusPill :tone="TRIP_STATUS_TONE[summary.trip.status]">{{ TRIP_STATUS_LABEL[summary.trip.status] }}</UiStatusPill>
        <UiButton v-if="summary.trip.status !== 'reconciled'" @click="reconcile">Reconcile</UiButton>
      </template>
    </UiPageHeader>

    <UiDataTable :columns="productColumns" :rows="productRows" :row-key="(row) => row.productId">
      <template #cell-full="{ row }">
        <UiStatusPill :tone="row.fullVariance === 0 ? 'ok' : 'danger'">{{ row.fullVariance === 0 ? "Matches" : `${row.fullVariance} off` }}</UiStatusPill>
      </template>
      <template #cell-empty="{ row }">
        <UiStatusPill :tone="row.emptyVariance === 0 ? 'ok' : 'danger'">{{ row.emptyVariance === 0 ? "Matches" : `${row.emptyVariance} off` }}</UiStatusPill>
      </template>
    </UiDataTable>

    <UiCard title="Cash">
      <div class="flex items-center justify-between">
        <span class="text-sm text-zinc-500">Expected <UiMoneyText :centavos="summary.expectedCash" size="sm" /></span>
        <UiStatusPill :tone="summary.cashVariance === 0 ? 'ok' : 'danger'">
          {{
            summary.cashVariance === 0
              ? "Matches"
              : summary.cashVariance > 0
                ? `Over ${formatMoney(summary.cashVariance)}`
                : `Short ${formatMoney(Math.abs(summary.cashVariance))}`
          }}
        </UiStatusPill>
      </div>
    </UiCard>

    <UiDataTable title="Deliveries" :columns="deliveryColumns" :rows="deliveryRows" :row-key="(row) => row.id">
      <template #cell-amount="{ row }">
        <UiMoneyText :centavos="row.amount" />
      </template>
      <template #cell-actions="{ row }">
        <UiButton variant="ghost" size="sm" @click="openVoid(row)">Request void</UiButton>
      </template>
      <template #empty>
        <p class="p-4 text-base text-zinc-500">No deliveries logged.</p>
      </template>
    </UiDataTable>

    <UiButton v-if="hasVariance" variant="secondary" @click="shortageSheetOpen = true">Record shortage</UiButton>

    <UiBottomSheet v-model:open="shortageSheetOpen" title="Record shortage">
      <div class="flex flex-col gap-4">
        <UiStepper v-model="shortageContainers" label="Containers short" :min="0" :max="999" />
        <p class="text-center"><UiMoneyText :centavos="shortageCashAmount" size="xl" /></p>
        <UiButton v-if="suggestedShortageCash > 0" variant="ghost" @click="shortageCashPad = String(suggestedShortageCash)">
          Use {{ formatMoney(suggestedShortageCash) }}
        </UiButton>
        <UiNumberPad v-model="shortageCashPad" />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton @click="recordShortage">Save shortage</UiButton>
        </div>
      </template>
    </UiBottomSheet>

    <VoidRequestSheet v-model:open="voidSheetOpen" :summary="voidTargetSummary" />
  </div>
</template>
