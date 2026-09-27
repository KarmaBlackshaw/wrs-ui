<script setup lang="ts">
import type { TCustomer } from "@/types/entities/customer";
import { ROUTES } from "@/types/routes";

definePage({ meta: { title: "Customers", roles: ["rider"] } });

const openTrip = useOpenTrip();

function deliverTo(customer: TCustomer) {
  return openTrip.value ? ROUTES.RIDER_DELIVER(openTrip.value.id, customer.id) : ROUTES.RIDER_HOME;
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiPageHeader title="Customers" />

    <UiEmptyState v-if="!openTrip" title="No open trip" description="Open a trip from your cashier before delivering to a customer." />
    <RiderCustomerSearchList v-else :get-to="deliverTo" />
  </div>
</template>
