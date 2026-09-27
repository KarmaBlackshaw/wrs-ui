<script setup lang="ts">
import { ROUTES } from "@/types";

definePage({ meta: { title: "Containers" } });

const tabs = [
  { label: "Holdings", to: ROUTES.OWNER.CONTAINERS.INDEX },
  { label: "Movement log", to: ROUTES.OWNER.CONTAINERS.MOVEMENTS },
  { label: "Count variances", to: ROUTES.OWNER.CONTAINERS.COUNTS },
];
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiPageHeader title="Containers" subtitle="Holdings, movement log and count variances" />
    <UiTabs :tabs="tabs" />
    <RouterView />
  </div>
</template>
