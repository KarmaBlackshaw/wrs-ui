<script setup lang="ts">
import { ROUTES } from "@/types/routes";

definePage({ meta: { title: "Money" } });

const tabs = [
  { label: "Credit aging", to: ROUTES.OWNER.MONEY.INDEX },
  { label: "Expenses", to: ROUTES.OWNER.MONEY.EXPENSES },
  { label: "Cash sessions", to: ROUTES.OWNER.MONEY.CASH_SESSIONS },
];
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiPageHeader title="Money" />
    <UiTabs :tabs="tabs" />
    <RouterView />
  </div>
</template>
