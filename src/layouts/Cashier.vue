<script setup lang="ts">
import { PhCalculator, PhCashRegister, PhPackage, PhTruck, PhUserCircle } from "@phosphor-icons/vue";

import { ROUTES } from "@/types/routes";

const items = [
  { label: "Sell", to: ROUTES.CASHIER.SELL, icon: PhCashRegister },
  { label: "Trips", to: ROUTES.CASHIER.TRIPS.INDEX, icon: PhTruck },
  { label: "Count", to: ROUTES.CASHIER.COUNT, icon: PhCalculator },
  { label: "Stock", to: ROUTES.CASHIER.STOCK, icon: PhPackage },
  { label: "Me", to: ROUTES.ME.INDEX, icon: PhUserCircle },
];
</script>

<template>
  <LayoutShell :items="items" :home="ROUTES.CASHIER.INDEX" />
</template>
