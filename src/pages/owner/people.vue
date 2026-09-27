<script setup lang="ts">
import { ROUTES } from "@/types/routes";

definePage({ meta: { title: "People", roles: ["owner"] } });

const tabs = [
  { label: "Employees", to: ROUTES.OWNER_PEOPLE },
  { label: "Payroll", to: ROUTES.OWNER_PEOPLE_PAYROLL },
  { label: "Loans", to: ROUTES.OWNER_PEOPLE_LOANS },
];
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiPageHeader title="People" />
    <UiTabs :tabs="tabs" />
    <RouterView />
  </div>
</template>
