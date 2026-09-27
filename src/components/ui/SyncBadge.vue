<script setup lang="ts">
const syncStore = useSyncStore();
const detailsOpen = ref(false);

const timeFormatter = new Intl.DateTimeFormat("en-PH", { timeZone: "Asia/Manila", hour: "numeric", minute: "2-digit" });

const label = computed(() => {
  if (syncStore.status === "synced") {
    return `Synced ${timeFormatter.format(new Date(syncStore.lastSyncedAt))}`;
  }

  if (syncStore.status === "pending") {
    return `${syncStore.pendingCount} pending`;
  }

  if (syncStore.status === "offline") {
    return "Offline, saved on this phone";
  }

  return `${syncStore.rejected.length} rejected`;
});

const toneClasses = {
  synced: "bg-emerald-50 text-emerald-800 ring-emerald-600/20",
  pending: "bg-amber-50 text-amber-800 ring-amber-600/25",
  offline: "bg-zinc-100 text-zinc-700 ring-zinc-500/20",
  rejected: "bg-red-50 text-red-800 ring-red-600/20",
} as const;

const dotClasses = {
  synced: "bg-emerald-500",
  pending: "bg-amber-500",
  offline: "bg-zinc-400",
  rejected: "bg-red-500",
} as const;
</script>

<template>
  <button
    type="button"
    class="inline-flex min-w-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
    :class="toneClasses[syncStore.status]"
    @click="detailsOpen = true"
  >
    <span class="size-2 shrink-0 rounded-full" :class="dotClasses[syncStore.status]" aria-hidden="true"></span>
    <span class="truncate">{{ label }}</span>
  </button>

  <UiBottomSheet v-model:open="detailsOpen" title="Sync status">
    <div class="flex flex-col gap-3 text-base text-zinc-700">
      <p>{{ label }}</p>
      <ul v-if="syncStore.rejected.length > 0" class="flex flex-col gap-2">
        <li v-for="item in syncStore.rejected" :key="item.id" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <span class="font-semibold">{{ item.entity }}:</span> {{ item.reason }}
        </li>
      </ul>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UiButton variant="secondary" @click="syncStore.cycleStatus()">Cycle state (demo)</UiButton>
        <UiButton @click="syncStore.syncNow()">Sync now</UiButton>
      </div>
    </template>
  </UiBottomSheet>
</template>
