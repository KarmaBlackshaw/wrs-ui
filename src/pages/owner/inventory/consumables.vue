<script setup lang="ts">
import { consumables as consumablesMock, productUsages as productUsagesMock, stockEntries as stockEntriesMock } from "@/mocks/consumables";
import type { TConsumable, TProductUsage, TStockEntry } from "@/types/entities/inventory";

definePage({ meta: { title: "Consumables" } });

const { productName } = useProductLookup();

const toastStore = useToastStore();

const consumables = ref<TConsumable[]>([...consumablesMock]);
const productUsages = ref<TProductUsage[]>([...productUsagesMock]);
const stockEntries = ref<TStockEntry[]>([...stockEntriesMock]);

const columns = [
  { key: "name", label: "Consumable" },
  { key: "kind", label: "Kind" },
  { key: "onHand", label: "On hand", align: "right" as const },
  { key: "status", label: "Status" },
  { key: "actions", label: "", align: "right" as const },
];

function usagesFor(consumableId: string) {
  return productUsages.value.filter((usage) => usage.consumableId === consumableId);
}

const usageSheetConsumable = ref<TConsumable | null>(null);
const usageDrafts = ref<{ productId: string; qtyPerUnit: number }[]>([]);

function openUsageSheet(consumable: TConsumable) {
  usageSheetConsumable.value = consumable;
  usageDrafts.value = usagesFor(consumable.id).map((usage) => ({ productId: usage.productId, qtyPerUnit: usage.qtyPerUnit }));
}

function submitUsage() {
  if (!usageSheetConsumable.value) {
    return;
  }

  const consumableId = usageSheetConsumable.value.id;

  productUsages.value = productUsages.value.filter((usage) => usage.consumableId !== consumableId);
  productUsages.value.push(...usageDrafts.value.map((draft) => ({ consumableId, productId: draft.productId, qtyPerUnit: draft.qtyPerUnit })));

  usageSheetConsumable.value = null;
  toastStore.show("Saved");
}

const stockTakeConsumable = ref<TConsumable | null>(null);
const countedQty = ref(0);

function openStockTake(consumable: TConsumable) {
  stockTakeConsumable.value = consumable;
  countedQty.value = consumable.onHand;
}

function submitStockTake() {
  if (!stockTakeConsumable.value) {
    return;
  }

  const consumable = stockTakeConsumable.value;
  const delta = countedQty.value - consumable.onHand;

  consumable.onHand = countedQty.value;

  stockEntries.value.push({
    id: `stock-${stockEntries.value.length + 1}`,
    consumableId: consumable.id,
    qty: delta,
    reason: "Stock-take adjustment",
    createdAt: new Date().toISOString(),
  });

  stockTakeConsumable.value = null;
  toastStore.show("Saved");
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiDataTable :columns="columns" :rows="consumables" :row-key="(row) => row.id">
      <template #cell-onHand="{ row }">{{ row.onHand }} {{ row.unit }}</template>
      <template #cell-status="{ row }">
        <UiStatusPill :tone="row.onHand <= row.reorderLevel ? 'warn' : 'ok'">
          {{ row.onHand <= row.reorderLevel ? "Reorder" : "OK" }}
        </UiStatusPill>
      </template>
      <template #cell-actions="{ row }">
        <div class="flex justify-end gap-2">
          <UiButton size="sm" variant="secondary" @click="openUsageSheet(row)">Usage</UiButton>
          <UiButton size="sm" variant="secondary" @click="openStockTake(row)">Stock-take</UiButton>
        </div>
      </template>
      <template #empty>
        <UiEmptyState title="No consumables yet" />
      </template>
    </UiDataTable>

    <UiBottomSheet :open="usageSheetConsumable !== null" title="Edit usage list" @update:open="usageSheetConsumable = null">
      <div class="flex flex-col gap-4">
        <p class="text-sm text-zinc-500">{{ usageSheetConsumable?.name }}, quantity used per unit sold</p>
        <div v-for="draft in usageDrafts" :key="draft.productId" class="flex items-center justify-between gap-3">
          <span class="text-base text-zinc-700">{{ productName(draft.productId) }}</span>
          <UiStepper v-model="draft.qtyPerUnit" :min="0" :max="10" />
        </div>
        <p v-if="usageDrafts.length === 0" class="text-sm text-zinc-400">No products use this consumable yet.</p>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton @click="submitUsage">Save usage list</UiButton>
        </div>
      </template>
    </UiBottomSheet>

    <UiBottomSheet :open="stockTakeConsumable !== null" title="Stock-take" @update:open="stockTakeConsumable = null">
      <div class="flex flex-col gap-4">
        <p class="text-sm text-zinc-500">{{ stockTakeConsumable?.name }}, on hand: {{ stockTakeConsumable?.onHand }}</p>
        <UiStepper v-model="countedQty" label="Counted quantity" :min="0" :max="99999" />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton @click="submitStockTake">Save count</UiButton>
        </div>
      </template>
    </UiBottomSheet>
  </div>
</template>
