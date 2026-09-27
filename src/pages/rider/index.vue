<script setup lang="ts">
import { customers } from "@/mocks/customers";
import { ROUTES } from "@/types";

definePage({ meta: { title: "Today's trip" } });

const openTrip = useOpenTrip();
const summary = computed(() => (openTrip.value ? tripSummary(openTrip.value.id) : null));

function deliveryFor(customerId: string) {
  return summary.value?.deliveries.find((delivery) => delivery.customerId === customerId);
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiPageHeader title="Today's trip" :subtitle="openTrip ? `Trip ${openTrip.id}` : undefined">
      <template #actions>
        <UiButton v-if="openTrip" :to="ROUTES.RIDER.TRIP_RETURN(openTrip.id)">End trip</UiButton>
      </template>
    </UiPageHeader>

    <UiEmptyState v-if="!openTrip || !summary" title="No open trip" description="Ask your cashier to load out a trip to get started." />

    <template v-else>
      <div class="grid grid-cols-3 gap-3">
        <UiStatCard label="Loaded">{{ summary.loaded }}</UiStatCard>
        <UiStatCard label="Delivered" tone="ok">{{ summary.delivered }}</UiStatCard>
        <UiStatCard label="Left" :tone="summary.expectedFull === 0 ? 'ok' : 'default'">{{ summary.expectedFull }}</UiStatCard>
      </div>

      <UiCard title="Customers">
        <div class="-m-4 divide-y divide-zinc-100">
          <UiListItem
            v-for="customer in customers"
            :key="customer.id"
            :title="customer.name"
            :subtitle="customer.address"
            :to="deliveryFor(customer.id) ? undefined : ROUTES.RIDER.DELIVER(openTrip.id, customer.id)"
          >
            <template #trailing>
              <UiStatusPill v-if="deliveryFor(customer.id)" tone="ok">Delivered</UiStatusPill>
              <span v-else class="text-sm font-medium text-brand-700">Deliver</span>
            </template>
          </UiListItem>
        </div>
      </UiCard>
    </template>
  </div>
</template>
