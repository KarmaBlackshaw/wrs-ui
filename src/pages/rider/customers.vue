<script setup lang="ts">
import { ROUTES } from "@/types";
import type { TCustomer } from "@/types";

definePage({ meta: { title: "Customers" } });

const openTrip = useOpenTrip();

function deliverTo(customer: TCustomer) {
  return openTrip.value ? ROUTES.RIDER.DELIVER(openTrip.value.id, customer.id) : ROUTES.RIDER.INDEX;
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiPageHeader title="Customers" />

    <UiEmptyState v-if="!openTrip" title="No open trip" description="Open a trip from your cashier before delivering to a customer." />
    <RiderCustomerSearchList v-else :get-to="deliverTo" />
  </div>
</template>
