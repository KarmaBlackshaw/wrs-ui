<script setup lang="ts">
import { ROUTES } from "@/types/routes";

const items = [
  { label: "Dashboard", to: ROUTES.OWNER.INDEX, icon: "squares-four" },
  { label: "Approvals", to: ROUTES.OWNER.APPROVALS, icon: "stamp" },
  { label: "Sales", to: ROUTES.OWNER.SALES, icon: "receipt" },
  { label: "Trips", to: ROUTES.OWNER.TRIPS, icon: "truck" },
  { label: "Customers", to: ROUTES.OWNER.CUSTOMERS.INDEX, icon: "users" },
  { label: "Containers", to: ROUTES.OWNER.CONTAINERS, icon: "cube" },
  { label: "Inventory", to: ROUTES.OWNER.INVENTORY.INDEX, icon: "package" },
  { label: "Money", to: ROUTES.OWNER.MONEY.INDEX, icon: "wallet" },
  { label: "People", to: ROUTES.OWNER.PEOPLE.INDEX, icon: "identification-badge" },
  { label: "Settings", to: ROUTES.OWNER.SETTINGS, icon: "gear" },
];
</script>

<template>
  <LayoutShell :items="items" :home="ROUTES.OWNER.INDEX" />
</template>
