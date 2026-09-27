<script setup lang="ts">
import { consumables } from "@/mocks/consumables";

definePage({ meta: { title: "Stock" } });

const toast = useToast();

const localConsumables = ref(consumables.map((consumable) => ({ ...consumable })));

const stockColumns: { key: string; label: string; align?: "left" | "right" }[] = [
  { key: "name", label: "Consumable" },
  { key: "onHand", label: "On hand", align: "right" },
  { key: "status", label: "Status" },
  { key: "actions", label: "", align: "right" },
];

const restockSheetOpen = ref(false);
const stockTakeSheetOpen = ref(false);
const selectedId = ref<string>();

const restockPad = ref("");
const stockTakePad = ref("");
const stockTakeReason = ref("");

const selected = computed(() => localConsumables.value.find((consumable) => consumable.id === selectedId.value) ?? null);

function padToQty(pad: string) {
  return Number(pad || "0");
}

const restockAmount = computed(() => padToQty(restockPad.value));
const stockTakeAmount = computed(() => padToQty(stockTakePad.value));
const suggestedTopUp = computed(() => (selected.value ? Math.max(0, selected.value.reorderLevel - selected.value.onHand) : 0));

function reorderTone(consumable: (typeof localConsumables.value)[number]) {
  if (consumable.onHand <= consumable.reorderLevel) {
    return "danger";
  }

  if (consumable.onHand <= consumable.reorderLevel * 1.5) {
    return "warn";
  }

  return null;
}

function reorderText(consumable: (typeof localConsumables.value)[number]) {
  const tone = reorderTone(consumable);

  if (tone === "danger") {
    return "Reorder now";
  }

  if (tone === "warn") {
    return "Reorder soon";
  }

  return null;
}

function openRestock(id: string) {
  selectedId.value = id;
  restockPad.value = "";
  restockSheetOpen.value = true;
}

function openStockTake(id: string) {
  selectedId.value = id;
  stockTakePad.value = "";
  stockTakeReason.value = "";
  stockTakeSheetOpen.value = true;
}

function confirmRestock() {
  if (!selected.value || restockAmount.value <= 0) {
    return;
  }

  selected.value.onHand += restockAmount.value;
  restockSheetOpen.value = false;
  toast.show("Saved");
}

function confirmStockTake() {
  if (!selected.value || !stockTakeReason.value.trim()) {
    return;
  }

  selected.value.onHand = stockTakeAmount.value;
  stockTakeSheetOpen.value = false;
  toast.show("Saved");
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiPageHeader title="Stock" subtitle="Consumables on hand" />

    <UiDataTable :columns="stockColumns" :rows="localConsumables" :row-key="(row) => row.id">
      <template #cell-onHand="{ row }">{{ row.onHand }} {{ row.unit }}</template>
      <template #cell-status="{ row }">
        <UiStatusPill v-if="reorderText(row)" :tone="reorderTone(row) ?? 'neutral'">{{ reorderText(row) }}</UiStatusPill>
      </template>
      <template #cell-actions="{ row }">
        <div class="flex justify-end gap-2">
          <UiButton variant="secondary" size="sm" @click="openRestock(row.id)">Restock</UiButton>
          <UiButton variant="ghost" size="sm" @click="openStockTake(row.id)">Stock-take</UiButton>
        </div>
      </template>
    </UiDataTable>

    <UiBottomSheet v-model:open="restockSheetOpen" title="Restock">
      <div class="flex flex-col gap-4">
        <p v-if="selected" class="text-base font-medium text-zinc-900">{{ selected.name }}</p>
        <p class="text-center text-2xl font-semibold tabular-nums">{{ restockAmount }} {{ selected?.unit }}</p>
        <UiButton v-if="suggestedTopUp > 0" variant="ghost" @click="restockPad = String(suggestedTopUp)"
          >Use {{ suggestedTopUp }} (top up to reorder level)</UiButton
        >
        <UiNumberPad v-model="restockPad" />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton :disabled="restockAmount <= 0" @click="confirmRestock">Save restock</UiButton>
        </div>
      </template>
    </UiBottomSheet>

    <UiBottomSheet v-model:open="stockTakeSheetOpen" title="Stock-take">
      <div class="flex flex-col gap-4">
        <p v-if="selected" class="text-base font-medium text-zinc-900">{{ selected.name }}</p>
        <p class="text-center text-2xl font-semibold tabular-nums">{{ stockTakeAmount }} {{ selected?.unit }}</p>
        <UiButton v-if="selected" variant="ghost" @click="stockTakePad = String(selected.onHand)">Use current ({{ selected.onHand }})</UiButton>
        <UiNumberPad v-model="stockTakePad" />
        <UiField v-model="stockTakeReason" label="Reason" />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton :disabled="!stockTakeReason.trim()" @click="confirmStockTake">Save stock-take</UiButton>
        </div>
      </template>
    </UiBottomSheet>
  </div>
</template>
