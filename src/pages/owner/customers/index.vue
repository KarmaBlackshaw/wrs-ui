<script setup lang="ts">
import { IconUsers } from "@/components";
import { ROUTES } from "@/types";

definePage({ meta: { title: "Customers" } });

const toast = useToast();

const columns = [
  { key: "name", label: "Name" },
  { key: "address", label: "Address" },
  { key: "containersHeld", label: "Containers", align: "right" as const },
  { key: "depositOnFile", label: "Deposit", align: "right" as const },
  { key: "creditBalance", label: "Credit balance", align: "right" as const },
  { key: "agingBucket", label: "Aging" },
];

const query = ref("");
const filteredCustomers = useCustomerSearch(query);

const router = useRouter();

function openCustomer(customer: { id: string }) {
  router.push(ROUTES.OWNER.CUSTOMERS.DETAIL(customer.id));
}

const addSheetOpen = ref(false);
const nameDraft = ref("");
const addressDraft = ref("");

function submitAdd() {
  if (!nameDraft.value.trim()) {
    return;
  }

  toast.show("Customer saved");
  nameDraft.value = "";
  addressDraft.value = "";
  addSheetOpen.value = false;
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiDataTable
      clickable
      title="Customers"
      :icon="IconUsers"
      :columns="columns"
      :rows="filteredCustomers"
      :row-key="(row) => row.id"
      @row-click="openCustomer"
    >
      <template #actions>
        <UiButton @click="addSheetOpen = true">Add customer</UiButton>
      </template>
      <template #filters>
        <UiSearchInput v-model="query" label="Search customers" />
      </template>
      <template #cell-depositOnFile="{ row }">
        <UiMoneyText :centavos="row.depositOnFile" />
      </template>
      <template #cell-creditBalance="{ row }">
        <UiMoneyText :centavos="row.creditBalance" />
      </template>
      <template #cell-agingBucket="{ row }">
        <UiStatusPill :tone="AGING_TONE[row.agingBucket]">{{ AGING_LABEL[row.agingBucket] }}</UiStatusPill>
      </template>
      <template #empty>
        <UiEmptyState title="No customers match your search" />
      </template>
    </UiDataTable>

    <UiBottomSheet v-model:open="addSheetOpen" title="Add customer">
      <div class="flex flex-col gap-4">
        <UiField v-model="nameDraft" label="Name" />
        <UiField v-model="addressDraft" label="Address" hint="Free text, landmarks welcome" />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton :disabled="!nameDraft.trim()" @click="submitAdd">Save customer</UiButton>
        </div>
      </template>
    </UiBottomSheet>
  </div>
</template>
