<script setup lang="ts">
import { PhTruck, PhUserCircle, PhUsers } from "@phosphor-icons/vue";

import { ROUTES } from "@/types/routes";

const { t } = useI18n();

const items = computed(() => [
  { label: t("nav.trips"), to: ROUTES.RIDER_HOME, icon: PhTruck },
  { label: t("nav.customers"), to: ROUTES.RIDER_CUSTOMERS, icon: PhUsers },
  { label: t("nav.me"), to: ROUTES.ME, icon: PhUserCircle },
]);
</script>

<template>
  <LayoutShell :items="items" :home="ROUTES.RIDER_HOME" />
</template>
