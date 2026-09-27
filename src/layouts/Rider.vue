<script setup lang="ts">
import IconTruck from "@/components/icon/Truck.vue";
import IconTruckFill from "@/components/icon/TruckFill.vue";
import IconUserCircle from "@/components/icon/UserCircle.vue";
import IconUserCircleFill from "@/components/icon/UserCircleFill.vue";
import IconUsers from "@/components/icon/Users.vue";
import IconUsersFill from "@/components/icon/UsersFill.vue";
import { ROUTES } from "@/types";

const items = [
  { label: "Trips", to: ROUTES.RIDER.INDEX, icon: IconTruck, activeIcon: IconTruckFill },
  { label: "Customers", to: ROUTES.RIDER.CUSTOMERS, icon: IconUsers, activeIcon: IconUsersFill },
  { label: "Me", to: ROUTES.ME.INDEX, icon: IconUserCircle, activeIcon: IconUserCircleFill },
];
</script>

<template>
  <LayoutShell :items="items" :home="ROUTES.RIDER.INDEX" />
</template>
