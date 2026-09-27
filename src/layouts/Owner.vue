<script setup lang="ts">
import { PhCube, PhGear, PhIdentificationBadge, PhPackage, PhReceipt, PhSquaresFour, PhStamp, PhTruck, PhUsers, PhWallet } from "@phosphor-icons/vue";

import { ROUTES } from "@/types/routes";

const { t } = useI18n();

const items = computed(() => [
  { label: t("nav.dashboard"), to: ROUTES.OWNER_HOME, icon: PhSquaresFour },
  { label: t("nav.approvals"), to: ROUTES.OWNER_APPROVALS, icon: PhStamp },
  { label: t("nav.sales"), to: ROUTES.OWNER_SALES, icon: PhReceipt },
  { label: t("nav.trips"), to: ROUTES.OWNER_TRIPS, icon: PhTruck },
  { label: t("nav.customers"), to: ROUTES.OWNER_CUSTOMERS, icon: PhUsers },
  { label: t("nav.containers"), to: ROUTES.OWNER_CONTAINERS, icon: PhCube },
  { label: t("nav.inventory"), to: ROUTES.OWNER_INVENTORY, icon: PhPackage },
  { label: t("nav.money"), to: ROUTES.OWNER_MONEY, icon: PhWallet },
  { label: t("nav.people"), to: ROUTES.OWNER_PEOPLE, icon: PhIdentificationBadge },
  { label: t("nav.settings"), to: ROUTES.OWNER_SETTINGS, icon: PhGear },
]);
</script>

<template>
  <LayoutShell :items="items" :home="ROUTES.OWNER_HOME" />
</template>
