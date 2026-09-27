<script setup lang="ts">
import { ROUTES } from "@/types";

const items = [
  { label: "Trips", to: ROUTES.RIDER.INDEX, icon: "truck" },
  { label: "Customers", to: ROUTES.RIDER.CUSTOMERS, icon: "users" },
  { label: "Me", to: ROUTES.ME.INDEX, icon: "user-circle" },
];
</script>

<template>
  <LayoutShell :items="items" :home="ROUTES.RIDER.INDEX" />
</template>
