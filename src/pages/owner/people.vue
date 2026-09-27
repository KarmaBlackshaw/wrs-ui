<script setup lang="ts">
import { ROUTES } from "@/types";

definePage({ meta: { title: "People" } });

const tabs = [
  { label: "Employees", to: ROUTES.OWNER.PEOPLE.INDEX },
  { label: "Payroll", to: ROUTES.OWNER.PEOPLE.PAYROLL.INDEX },
  { label: "Loans", to: ROUTES.OWNER.PEOPLE.LOANS },
];
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiPageHeader title="People" />
    <UiTabs :tabs="tabs" />
    <RouterView />
  </div>
</template>
