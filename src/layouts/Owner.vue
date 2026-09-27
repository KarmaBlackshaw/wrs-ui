<script setup lang="ts">
import IconCube from "@/components/icon/Cube.vue";
import IconCubeFill from "@/components/icon/CubeFill.vue";
import IconGear from "@/components/icon/Gear.vue";
import IconGearFill from "@/components/icon/GearFill.vue";
import IconIdentificationBadge from "@/components/icon/IdentificationBadge.vue";
import IconIdentificationBadgeFill from "@/components/icon/IdentificationBadgeFill.vue";
import IconPackage from "@/components/icon/Package.vue";
import IconPackageFill from "@/components/icon/PackageFill.vue";
import IconReceipt from "@/components/icon/Receipt.vue";
import IconReceiptFill from "@/components/icon/ReceiptFill.vue";
import IconSquaresFour from "@/components/icon/SquaresFour.vue";
import IconSquaresFourFill from "@/components/icon/SquaresFourFill.vue";
import IconStamp from "@/components/icon/Stamp.vue";
import IconStampFill from "@/components/icon/StampFill.vue";
import IconTruck from "@/components/icon/Truck.vue";
import IconTruckFill from "@/components/icon/TruckFill.vue";
import IconUsers from "@/components/icon/Users.vue";
import IconUsersFill from "@/components/icon/UsersFill.vue";
import IconWallet from "@/components/icon/Wallet.vue";
import IconWalletFill from "@/components/icon/WalletFill.vue";
import { ROUTES } from "@/types";

const items = [
  { label: "Dashboard", to: ROUTES.OWNER.INDEX, icon: IconSquaresFour, activeIcon: IconSquaresFourFill },
  { label: "Approvals", to: ROUTES.OWNER.APPROVALS, icon: IconStamp, activeIcon: IconStampFill },
  { label: "Sales", to: ROUTES.OWNER.SALES, icon: IconReceipt, activeIcon: IconReceiptFill },
  { label: "Trips", to: ROUTES.OWNER.TRIPS, icon: IconTruck, activeIcon: IconTruckFill },
  { label: "Customers", to: ROUTES.OWNER.CUSTOMERS.INDEX, icon: IconUsers, activeIcon: IconUsersFill },
  { label: "Containers", to: ROUTES.OWNER.CONTAINERS, icon: IconCube, activeIcon: IconCubeFill },
  { label: "Inventory", to: ROUTES.OWNER.INVENTORY.INDEX, icon: IconPackage, activeIcon: IconPackageFill },
  { label: "Money", to: ROUTES.OWNER.MONEY.INDEX, icon: IconWallet, activeIcon: IconWalletFill },
  { label: "People", to: ROUTES.OWNER.PEOPLE.INDEX, icon: IconIdentificationBadge, activeIcon: IconIdentificationBadgeFill },
  { label: "Settings", to: ROUTES.OWNER.SETTINGS, icon: IconGear, activeIcon: IconGearFill },
];
</script>

<template>
  <LayoutShell :items="items" :home="ROUTES.OWNER.INDEX" />
</template>
