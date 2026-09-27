<script setup lang="ts">
import { PhCalculator, PhCashRegister, PhPackage, PhTruck, PhUserCircle } from "@phosphor-icons/vue";

import { ROUTES } from "@/types/routes";

const { t } = useI18n();

const items = computed(() => [
  { label: t("nav.sell"), to: ROUTES.CASHIER_SELL, icon: PhCashRegister },
  { label: t("nav.trips"), to: ROUTES.CASHIER_TRIPS, icon: PhTruck },
  { label: t("nav.count"), to: ROUTES.CASHIER_COUNT, icon: PhCalculator },
  { label: t("nav.stock"), to: ROUTES.CASHIER_STOCK, icon: PhPackage },
  { label: t("nav.me"), to: ROUTES.ME, icon: PhUserCircle },
]);
</script>

<template>
  <LayoutShell :items="items" :home="ROUTES.CASHIER_HOME" />
</template>
