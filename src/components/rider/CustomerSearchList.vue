<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

import type { TCustomer } from "@/types";

const { getTo } = defineProps<{
  getTo: (customer: TCustomer) => RouteLocationRaw;
}>();

const query = ref("");
const filtered = useCustomerSearch(query);
</script>

<template>
  <div class="flex flex-col gap-3">
    <UiSearchInput v-model="query" label="Search customers by name or address" />
    <UiEmptyState v-if="filtered.length === 0" title="No customers found" description="Try a different name or address." />
    <div v-else class="divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs">
      <UiListItem v-for="customer in filtered" :key="customer.id" :title="customer.name" :subtitle="customer.address" :to="getTo(customer)" />
    </div>
  </div>
</template>
