<script setup lang="ts">
import { PhCaretDown } from "@phosphor-icons/vue";

import { ROLE_LABEL } from "@/types/roles";

const authStore = useAuthStore();
const menuOpen = ref(false);
</script>

<template>
  <div class="ml-auto flex min-w-0 items-center gap-3">
    <UiSyncBadge />
    <button
      v-if="authStore.user"
      type="button"
      class="flex min-w-0 items-center gap-2.5 rounded-lg p-1 pr-2 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-brand-600"
      aria-haspopup="dialog"
      :aria-expanded="menuOpen"
      @click="menuOpen = true"
    >
      <span class="grid size-8 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800">{{
        initials(authStore.user.name)
      }}</span>
      <span class="hidden min-w-0 flex-col text-left leading-tight sm:flex">
        <span class="truncate text-sm font-medium text-zinc-900">{{ authStore.user.name }}</span>
        <span v-if="authStore.activeRole" class="text-xs text-zinc-500">{{ ROLE_LABEL[authStore.activeRole] }}</span>
      </span>
      <PhCaretDown class="size-4 shrink-0 text-zinc-500" />
      <span class="sr-only">Account menu</span>
    </button>
    <UiBottomSheet v-model:open="menuOpen" title="Account">
      <LayoutAccountControls />
    </UiBottomSheet>
  </div>
</template>
