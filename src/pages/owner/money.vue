<script setup lang="ts">
import { ROUTES } from "@/types/routes";

definePage({ meta: { title: "Money", roles: ["owner"] } });

const tabs = [
  { label: "Credit aging", to: ROUTES.OWNER_MONEY },
  { label: "Expenses", to: ROUTES.OWNER_MONEY_EXPENSES },
  { label: "Cash sessions", to: ROUTES.OWNER_MONEY_CASH_SESSIONS },
];
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiPageHeader title="Money" />
    <UiTabs :tabs="tabs" />
    <RouterView />
  </div>
</template>
