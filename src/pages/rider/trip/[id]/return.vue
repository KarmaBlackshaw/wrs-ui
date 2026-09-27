<script setup lang="ts">
import { ROUTES } from "@/types/routes";

definePage({ meta: { title: "Return summary", roles: ["rider"] } });

const route = useRoute();
const router = useRouter();
const toastStore = useToastStore();

const tripId = computed(() => String(route.params.id));
const summary = computed(() => tripSummary(tripId.value));

function submitReturn() {
  toastStore.show("Saved on this phone");
  router.push(ROUTES.RIDER_HOME);
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiPageHeader title="Return summary" :subtitle="summary.trip ? `Trip ${summary.trip.id}` : undefined" :back="ROUTES.RIDER_HOME">
      <template #actions>
        <UiButton v-if="summary.trip" @click="submitReturn">Submit return</UiButton>
      </template>
    </UiPageHeader>

    <UiEmptyState v-if="!summary.trip" title="Trip not found" description="This trip may not exist on this phone yet." />

    <template v-else>
      <div class="grid grid-cols-2 gap-3">
        <UiStatCard label="Expected full">{{ summary.expectedFull }}</UiStatCard>
        <UiStatCard label="Expected empties">{{ summary.emptiesCollected }}</UiStatCard>
      </div>

      <UiCard title="Expected cash">
        <UiMoneyText :centavos="summary.expectedCash" size="xl" />
      </UiCard>
    </template>
  </div>
</template>
