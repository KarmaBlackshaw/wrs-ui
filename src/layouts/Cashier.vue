<script setup lang="ts">
import IconCalculator from "@/components/icon/Calculator.vue";
import IconCalculatorFill from "@/components/icon/CalculatorFill.vue";
import IconCashRegister from "@/components/icon/CashRegister.vue";
import IconCashRegisterFill from "@/components/icon/CashRegisterFill.vue";
import IconPackage from "@/components/icon/Package.vue";
import IconPackageFill from "@/components/icon/PackageFill.vue";
import IconTruck from "@/components/icon/Truck.vue";
import IconTruckFill from "@/components/icon/TruckFill.vue";
import IconUserCircle from "@/components/icon/UserCircle.vue";
import IconUserCircleFill from "@/components/icon/UserCircleFill.vue";
import { ROUTES } from "@/types";

const items = [
  { label: "Sell", to: ROUTES.CASHIER.SELL, icon: IconCashRegister, activeIcon: IconCashRegisterFill },
  { label: "Trips", to: ROUTES.CASHIER.TRIPS.INDEX, icon: IconTruck, activeIcon: IconTruckFill },
  { label: "Count", to: ROUTES.CASHIER.COUNT, icon: IconCalculator, activeIcon: IconCalculatorFill },
  { label: "Stock", to: ROUTES.CASHIER.STOCK, icon: IconPackage, activeIcon: IconPackageFill },
  { label: "Me", to: ROUTES.ME.INDEX, icon: IconUserCircle, activeIcon: IconUserCircleFill },
];
</script>

<template>
  <LayoutShell :items="items" :home="ROUTES.CASHIER.INDEX" />
</template>
