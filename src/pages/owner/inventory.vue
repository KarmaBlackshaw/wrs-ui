<script setup lang="ts">
import { ROUTES } from "@/types/routes";

definePage({ meta: { title: "Inventory", roles: ["owner"] } });

const tabs = [
  { label: "Products & prices", to: ROUTES.OWNER_INVENTORY },
  { label: "Consumables", to: ROUTES.OWNER_INVENTORY_CONSUMABLES },
  { label: "Maintenance", to: ROUTES.OWNER_INVENTORY_MAINTENANCE },
  { label: "Water quality", to: ROUTES.OWNER_INVENTORY_WATER_QUALITY },
];
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiPageHeader title="Inventory" />
    <UiTabs :tabs="tabs" />
    <RouterView />
  </div>
</template>
