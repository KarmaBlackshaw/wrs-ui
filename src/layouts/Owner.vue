<script setup lang="ts">
import { PhCube, PhGear, PhIdentificationBadge, PhPackage, PhReceipt, PhSquaresFour, PhStamp, PhTruck, PhUsers, PhWallet } from "@phosphor-icons/vue";

import { ROUTES } from "@/types/routes";

const items = [
  { label: "Dashboard", to: ROUTES.OWNER.INDEX, icon: PhSquaresFour },
  { label: "Approvals", to: ROUTES.OWNER.APPROVALS, icon: PhStamp },
  { label: "Sales", to: ROUTES.OWNER.SALES, icon: PhReceipt },
  { label: "Trips", to: ROUTES.OWNER.TRIPS, icon: PhTruck },
  { label: "Customers", to: ROUTES.OWNER.CUSTOMERS.INDEX, icon: PhUsers },
  { label: "Containers", to: ROUTES.OWNER.CONTAINERS, icon: PhCube },
  { label: "Inventory", to: ROUTES.OWNER.INVENTORY.INDEX, icon: PhPackage },
  { label: "Money", to: ROUTES.OWNER.MONEY.INDEX, icon: PhWallet },
  { label: "People", to: ROUTES.OWNER.PEOPLE.INDEX, icon: PhIdentificationBadge },
  { label: "Settings", to: ROUTES.OWNER.SETTINGS, icon: PhGear },
];
</script>

<template>
  <LayoutShell :items="items" :home="ROUTES.OWNER.INDEX" />
</template>
