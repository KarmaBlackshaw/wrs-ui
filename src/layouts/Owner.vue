<script setup lang="ts">
import {
  IconCube,
  IconCubeFill,
  IconGear,
  IconGearFill,
  IconIdentificationBadge,
  IconIdentificationBadgeFill,
  IconPackage,
  IconPackageFill,
  IconReceipt,
  IconReceiptFill,
  IconSquaresFour,
  IconSquaresFourFill,
  IconStamp,
  IconStampFill,
  IconTruck,
  IconTruckFill,
  IconUsers,
  IconUsersFill,
  IconWallet,
  IconWalletFill,
} from "@/components";
import { ROUTES } from "@/types";

const items = [
  { label: "Dashboard", to: ROUTES.OWNER.INDEX, icon: IconSquaresFour, activeIcon: IconSquaresFourFill },
  { label: "Approvals", to: ROUTES.OWNER.APPROVALS, icon: IconStamp, activeIcon: IconStampFill },
  { label: "Sales", to: ROUTES.OWNER.SALES, icon: IconReceipt, activeIcon: IconReceiptFill },
  { label: "Trips", to: ROUTES.OWNER.TRIPS, icon: IconTruck, activeIcon: IconTruckFill },
  { label: "Customers", to: ROUTES.OWNER.CUSTOMERS.INDEX, icon: IconUsers, activeIcon: IconUsersFill },
  { label: "Containers", to: ROUTES.OWNER.CONTAINERS.INDEX, icon: IconCube, activeIcon: IconCubeFill },
  { label: "Inventory", to: ROUTES.OWNER.INVENTORY.INDEX, icon: IconPackage, activeIcon: IconPackageFill },
  { label: "Money", to: ROUTES.OWNER.MONEY.INDEX, icon: IconWallet, activeIcon: IconWalletFill },
  { label: "People", to: ROUTES.OWNER.PEOPLE.INDEX, icon: IconIdentificationBadge, activeIcon: IconIdentificationBadgeFill },
  { label: "Settings", to: ROUTES.OWNER.SETTINGS, icon: IconGear, activeIcon: IconGearFill },
];
</script>

<template>
  <LayoutShell :items="items" :home="ROUTES.OWNER.INDEX" />
</template>
