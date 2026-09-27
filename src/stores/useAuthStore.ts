import type { TEmployee } from "@/types/entities/employee";
import type { TRole } from "@/types/roles";
import { employees } from "@/mocks/employees";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const user = ref<TEmployee | null>(null);
    const activeRole = ref<TRole | null>(null);

    const isAuthenticated = computed(() => user.value != null);

    function login(employeeId: string, role: TRole) {
      const employee = employees.find((candidate) => candidate.id === employeeId);

      if (!employee || !employee.roles.includes(role)) {
        throw new Error("Employee does not hold that role.");
      }

      user.value = employee;
      activeRole.value = role;
    }

    function switchRole(role: TRole) {
      if (!user.value?.roles.includes(role)) {
        throw new Error("Employee does not hold that role.");
      }

      activeRole.value = role;
    }

    function logout() {
      user.value = null;
      activeRole.value = null;
    }

    return { user, activeRole, isAuthenticated, login, switchRole, logout };
  },
  { persist: { pick: ["user", "activeRole"] } }
);
