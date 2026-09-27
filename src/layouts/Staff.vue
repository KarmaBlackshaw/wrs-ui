<script setup lang="ts">
import { ROUTES } from "@/types";

const items = [
  { label: "Logs", to: ROUTES.STAFF.LOGS, icon: "clipboard-text" },
  { label: "Me", to: ROUTES.ME.INDEX, icon: "user-circle" },
];
</script>

<template>
  <LayoutShell :items="items" :home="ROUTES.STAFF.LOGS" />
</template>
