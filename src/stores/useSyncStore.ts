import type { TRejectedEntry, TSyncStatus } from "@/types/sync";

const CYCLE: TSyncStatus[] = ["synced", "pending", "offline", "rejected"];

export const useSyncStore = defineStore("sync", () => {
  const status = ref<TSyncStatus>("pending");
  const pendingCount = ref(3);
  const lastSyncedAt = ref(new Date().toISOString());
  const rejected = ref<TRejectedEntry[]>([]);

  function syncNow() {
    if (status.value === "pending") {
      pendingCount.value = 0;
      status.value = "synced";
      lastSyncedAt.value = new Date().toISOString();
    }
  }

  function cycleStatus() {
    const next = CYCLE[(CYCLE.indexOf(status.value) + 1) % CYCLE.length];

    if (next) {
      status.value = next;
    }
  }

  return { status, pendingCount, lastSyncedAt, rejected, syncNow, cycleStatus };
});
