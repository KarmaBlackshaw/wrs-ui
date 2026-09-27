<script setup lang="ts">
import { IconCube } from "@/components";
import { containerMovements } from "@/mocks/containers";
import { OWNER_TABS } from "@/types";

definePage({ meta: { title: "Movement log" } });

const toast = useToast();

const columns = [
  { key: "createdAt", label: "Date" },
  { key: "type", label: "Movement" },
  { key: "containerType", label: "Type" },
  { key: "qty", label: "Qty", align: "right" as const },
  { key: "from", label: "From" },
  { key: "to", label: "To" },
  { key: "reason", label: "Reason" },
];

const movements = computed(() => [...containerMovements].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));

const movementSheetOpen = ref(false);
const movementAction = ref("damaged");
const movementType = ref("round");

const movementActionOptions = [
  { value: "damaged", label: "Damaged" },
  { value: "lost", label: "Lost" },
  { value: "purchased", label: "Purchased" },
];

const containerTypeOptions = [
  { value: "round", label: "Round" },
  { value: "slim", label: "Slim" },
];
const movementQty = ref(1);
const movementReason = ref("");

function submitMovement() {
  toast.show("Container movement saved");
  movementSheetOpen.value = false;
  movementQty.value = 1;
  movementReason.value = "";
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiDataTable title="Containers" :icon="IconCube" :tabs="OWNER_TABS.CONTAINERS" :columns="columns" :rows="movements" :row-key="(row) => row.id">
      <template #actions>
        <UiButton @click="movementSheetOpen = true">Record movement</UiButton>
      </template>
      <template #cell-createdAt="{ row }">{{ formatDateTime(row.createdAt) }}</template>
      <template #empty>
        <UiEmptyState title="No movements yet" />
      </template>
    </UiDataTable>

    <UiBottomSheet v-model:open="movementSheetOpen" title="Record container movement">
      <div class="flex flex-col gap-4">
        <UiSegmentedControl v-model="movementAction" :options="movementActionOptions" />
        <UiSelect v-model="movementType" label="Container type" :options="containerTypeOptions" />
        <UiStepper v-model="movementQty" label="Quantity" :min="1" />
        <UiField v-model="movementReason" label="Reason" :hint="movementAction === 'purchased' ? 'Optional' : 'Required'" />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton :disabled="movementAction !== 'purchased' && !movementReason.trim()" @click="submitMovement">Save movement</UiButton>
        </div>
      </template>
    </UiBottomSheet>
  </div>
</template>
