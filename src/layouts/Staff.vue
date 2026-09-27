<script setup lang="ts">
import { PhClipboardText, PhUserCircle } from "@phosphor-icons/vue";

import { ROUTES } from "@/types/routes";

const items = [
  { label: "Logs", to: ROUTES.STAFF.LOGS, icon: PhClipboardText },
  { label: "Me", to: ROUTES.ME.INDEX, icon: PhUserCircle },
];
</script>

<template>
  <LayoutShell :items="items" :home="ROUTES.STAFF.LOGS" />
</template>
