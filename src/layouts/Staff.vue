<script setup lang="ts">
import IconClipboardText from "@/components/icon/ClipboardText.vue";
import IconClipboardTextFill from "@/components/icon/ClipboardTextFill.vue";
import IconUserCircle from "@/components/icon/UserCircle.vue";
import IconUserCircleFill from "@/components/icon/UserCircleFill.vue";
import { ROUTES } from "@/types";

const items = [
  { label: "Logs", to: ROUTES.STAFF.LOGS, icon: IconClipboardText, activeIcon: IconClipboardTextFill },
  { label: "Me", to: ROUTES.ME.INDEX, icon: IconUserCircle, activeIcon: IconUserCircleFill },
];
</script>

<template>
  <LayoutShell :items="items" :home="ROUTES.STAFF.LOGS" />
</template>
