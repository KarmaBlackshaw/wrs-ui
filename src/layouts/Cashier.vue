<script setup lang="ts">
import { ROUTES } from "@/types";

const items = [
  { label: "Sell", to: ROUTES.CASHIER.SELL, icon: "cash-register" },
  { label: "Trips", to: ROUTES.CASHIER.TRIPS.INDEX, icon: "truck" },
  { label: "Count", to: ROUTES.CASHIER.COUNT, icon: "calculator" },
  { label: "Stock", to: ROUTES.CASHIER.STOCK, icon: "package" },
  { label: "Me", to: ROUTES.ME.INDEX, icon: "user-circle" },
];
</script>

<template>
  <LayoutShell :items="items" :home="ROUTES.CASHIER.INDEX" />
</template>
