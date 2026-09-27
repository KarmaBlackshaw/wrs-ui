<script setup lang="ts">
import { ROUTES } from "@/types";

definePage({ meta: { title: "Inventory" } });

const tabs = [
  { label: "Products & prices", to: ROUTES.OWNER.INVENTORY.INDEX },
  { label: "Consumables", to: ROUTES.OWNER.INVENTORY.CONSUMABLES },
  { label: "Maintenance", to: ROUTES.OWNER.INVENTORY.MAINTENANCE },
  { label: "Water quality", to: ROUTES.OWNER.INVENTORY.WATER_QUALITY },
];
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiPageHeader title="Inventory" />
    <UiTabs :tabs="tabs" />
    <RouterView />
  </div>
</template>
