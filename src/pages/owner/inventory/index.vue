<script setup lang="ts">
import { IconPackage } from "@/components";
import { products as productsMock, prices as pricesMock } from "@/mocks/products";
import type { TContainerTypeCode, TPrice, TProduct, TProductKind } from "@/types";

definePage({ meta: { title: "Products & prices" } });

const toast = useToast();

const products = ref<TProduct[]>([...productsMock]);
const prices = ref<TPrice[]>([...pricesMock]);

const columns = [
  { key: "name", label: "Product" },
  { key: "kind", label: "Kind" },
  { key: "containerType", label: "Container" },
  { key: "price", label: "Price", align: "right" as const },
  { key: "actions", label: "", align: "right" as const },
];

const pricesByProduct = computed(() => {
  const map = new Map<string, TPrice[]>();

  for (const price of prices.value) {
    const list = map.get(price.productId) ?? [];
    list.push(price);
    map.set(price.productId, list);
  }

  for (const list of map.values()) {
    list.sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom));
  }

  return map;
});

function currentAmount(productId: string) {
  return latestEffective(pricesByProduct.value.get(productId) ?? [])?.amount ?? 0;
}

const historyProduct = ref<TProduct>();

function openHistorySheet(product: TProduct) {
  historyProduct.value = product;
}

const kindOptions: { value: TProductKind; label: string }[] = [
  { value: "refill", label: "Refill" },
  { value: "container", label: "Container" },
  { value: "bottled", label: "Bottled" },
  { value: "other", label: "Other" },
];

const containerTypeOptions: { value: TContainerTypeCode; label: string }[] = [
  { value: "round", label: "Round" },
  { value: "slim", label: "Slim" },
];

const addOpen = ref(false);
const newName = ref("");
const newKind = ref<TProductKind>("refill");
const newContainerType = ref<TContainerTypeCode>("round");
const newPrice = ref("");

const needsContainerType = computed(() => newKind.value === "refill" || newKind.value === "container");
const canAddProduct = computed(() => newName.value.trim().length > 0 && Number(newPrice.value) > 0);

function submitAddProduct() {
  if (!canAddProduct.value) {
    return;
  }

  const id = `prod-${products.value.length + 1}`;

  products.value.push({
    id,
    name: newName.value.trim(),
    kind: newKind.value,
    containerType: needsContainerType.value ? newContainerType.value : undefined,
    active: true,
  });

  prices.value.push({ productId: id, amount: Math.round(Number(newPrice.value) * 100), effectiveFrom: todayIso() });

  newName.value = "";
  newPrice.value = "";
  addOpen.value = false;
  toast.show("Saved");
}

const priceSheetProduct = ref<TProduct>();
const priceAmount = ref("");
const priceEffectiveFrom = ref(todayIso());

function openPriceSheet(product: TProduct) {
  priceSheetProduct.value = product;
  priceAmount.value = "";
  priceEffectiveFrom.value = todayIso();
}

const canSubmitPrice = computed(() => Number(priceAmount.value) > 0 && priceEffectiveFrom.value.length > 0);

function submitPriceChange() {
  if (!priceSheetProduct.value || !canSubmitPrice.value) {
    return;
  }

  prices.value.push({
    productId: priceSheetProduct.value.id,
    amount: Math.round(Number(priceAmount.value) * 100),
    effectiveFrom: priceEffectiveFrom.value,
  });

  priceSheetProduct.value = undefined;
  toast.show("Saved");
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiDataTable title="Products & prices" :icon="IconPackage" :columns="columns" :rows="products" :row-key="(row) => row.id">
      <template #actions>
        <UiButton @click="addOpen = true">Add product</UiButton>
      </template>
      <template #cell-kind="{ row }">
        <div class="flex items-center gap-2">
          <UiStatusPill tone="neutral">{{ row.kind }}</UiStatusPill>
          <UiStatusPill v-if="!row.active" tone="warn">Inactive</UiStatusPill>
        </div>
      </template>
      <template #cell-containerType="{ row }">
        <UiStatusPill v-if="row.containerType" tone="info">{{ row.containerType }}</UiStatusPill>
        <span v-else class="text-zinc-400">-</span>
      </template>
      <template #cell-price="{ row }"><UiMoneyText :centavos="currentAmount(row.id)" /></template>
      <template #cell-actions="{ row }">
        <UiDataTableRowActions
          :actions="[
            { label: 'History', onSelect: () => openHistorySheet(row) },
            { label: 'Change price', onSelect: () => openPriceSheet(row) },
          ]"
        />
      </template>
      <template #empty>
        <UiEmptyState title="No products yet" description="Add your first product to start tracking prices." />
      </template>
    </UiDataTable>

    <UiBottomSheet v-model:open="addOpen" title="Add product">
      <div class="flex flex-col gap-4">
        <UiField v-model="newName" label="Product name" />
        <UiSelect v-model="newKind" label="Kind" :options="kindOptions" />
        <UiSelect v-if="needsContainerType" v-model="newContainerType" label="Container type" :options="containerTypeOptions" />
        <UiField v-model="newPrice" label="Price (₱)" type="number" inputmode="decimal" />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton :disabled="!canAddProduct" @click="submitAddProduct">Save product</UiButton>
        </div>
      </template>
    </UiBottomSheet>

    <UiBottomSheet :open="priceSheetProduct != null" title="Change price" @update:open="priceSheetProduct = undefined">
      <div class="flex flex-col gap-4">
        <p class="text-sm text-zinc-500">{{ priceSheetProduct?.name }}</p>
        <UiField v-model="priceAmount" label="New price (₱)" type="number" inputmode="decimal" />
        <UiField v-model="priceEffectiveFrom" label="Effective date" type="date" hint="Applies forward from this date; price history is kept." />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton :disabled="!canSubmitPrice" @click="submitPriceChange">Save price</UiButton>
        </div>
      </template>
    </UiBottomSheet>

    <UiBottomSheet :open="historyProduct != null" title="Price history" @update:open="historyProduct = undefined">
      <p class="text-sm text-zinc-500">{{ historyProduct?.name }}</p>
      <ul class="mt-2 flex flex-col gap-1 text-sm text-zinc-600">
        <li v-for="price in pricesByProduct.get(historyProduct?.id ?? '')" :key="price.effectiveFrom" class="flex justify-between">
          <span>From {{ formatDate(price.effectiveFrom) }}</span>
          <UiMoneyText :centavos="price.amount" size="sm" tone="muted" />
        </li>
      </ul>
    </UiBottomSheet>
  </div>
</template>
