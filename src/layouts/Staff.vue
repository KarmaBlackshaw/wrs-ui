<script setup lang="ts">
import { PhClipboardText, PhUserCircle } from "@phosphor-icons/vue";

import { ROUTES } from "@/types/routes";

const { t } = useI18n();

const items = computed(() => [
  { label: t("nav.logs"), to: ROUTES.STAFF_LOGS, icon: PhClipboardText },
  { label: t("nav.me"), to: ROUTES.ME, icon: PhUserCircle },
]);
</script>

<template>
  <LayoutShell :items="items" :home="ROUTES.STAFF_LOGS" />
</template>
