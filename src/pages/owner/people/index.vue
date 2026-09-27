<script setup lang="ts">
import { IconUsers } from "@/components";
import { employees as employeesMock } from "@/mocks/employees";
import { ROLE_LABEL, ROUTES } from "@/types";
import type { TEmployee, TRole } from "@/types";

definePage({ meta: { title: "Employees" } });

const toast = useToast();
const router = useRouter();

const employees = ref<TEmployee[]>([...employeesMock]);

const columns = [
  { key: "name", label: "Name" },
  { key: "phone", label: "Phone" },
  { key: "roles", label: "Roles" },
  { key: "status", label: "Status" },
];

const allRoles: TRole[] = ["owner", "cashier", "rider", "washer", "helper"];

const addOpen = ref(false);
const newName = ref("");
const newPhone = ref("");
const newRoles = ref<TRole[]>([]);

const canAddEmployee = computed(() => newName.value.trim().length > 0 && newPhone.value.trim().length > 0 && newRoles.value.length > 0);

function toggleRole(role: TRole) {
  newRoles.value = newRoles.value.includes(role) ? newRoles.value.filter((candidate) => candidate !== role) : [...newRoles.value, role];
}

function submitAddEmployee() {
  if (!canAddEmployee.value) {
    return;
  }

  employees.value.push({
    id: `emp-${employees.value.length + 1}`,
    name: newName.value.trim(),
    phone: newPhone.value.trim(),
    roles: newRoles.value,
    active: true,
  });

  newName.value = "";
  newPhone.value = "";
  newRoles.value = [];
  addOpen.value = false;
  toast.show("Saved");
}

function openEmployee(employee: TEmployee) {
  router.push(ROUTES.OWNER.PEOPLE.EMPLOYEE(employee.id));
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiDataTable title="Employees" :icon="IconUsers" clickable :columns="columns" :rows="employees" :row-key="(row) => row.id" @row-click="openEmployee">
      <template #actions>
        <UiButton @click="addOpen = true">Add employee</UiButton>
      </template>
      <template #cell-roles="{ row }">
        <div class="flex flex-wrap gap-1">
          <UiStatusPill v-for="role in row.roles" :key="role" tone="info">{{ ROLE_LABEL[role] }}</UiStatusPill>
        </div>
      </template>
      <template #cell-status="{ row }">
        <UiStatusPill :tone="row.active ? 'ok' : 'neutral'">{{ row.active ? "Active" : "Inactive" }}</UiStatusPill>
      </template>
      <template #empty>
        <UiEmptyState title="No employees yet" />
      </template>
    </UiDataTable>

    <UiBottomSheet v-model:open="addOpen" title="Add employee">
      <div class="flex flex-col gap-4">
        <UiField v-model="newName" label="Full name" />
        <UiField v-model="newPhone" label="Phone" type="tel" />
        <div class="flex flex-col gap-1.5">
          <span class="text-sm font-medium text-zinc-700">Roles</span>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="role in allRoles"
              :key="role"
              class="flex min-h-12 cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 shadow-xs"
            >
              <input type="checkbox" :checked="newRoles.includes(role)" @change="toggleRole(role)" />
              <span class="text-base text-zinc-700">{{ ROLE_LABEL[role] }}</span>
            </label>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton :disabled="!canAddEmployee" @click="submitAddEmployee">Save employee</UiButton>
        </div>
      </template>
    </UiBottomSheet>
  </div>
</template>
