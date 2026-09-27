<script setup lang="ts">
import { PhTruck, PhUserCircle, PhUsers } from "@phosphor-icons/vue";

import { ROUTES } from "@/types/routes";

const items = [
  { label: "Trips", to: ROUTES.RIDER.INDEX, icon: PhTruck },
  { label: "Customers", to: ROUTES.RIDER.CUSTOMERS, icon: PhUsers },
  { label: "Me", to: ROUTES.ME.INDEX, icon: PhUserCircle },
];
</script>

<template>
  <LayoutShell :items="items" :home="ROUTES.RIDER.INDEX" />
</template>
