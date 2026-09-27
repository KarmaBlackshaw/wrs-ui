import { employees } from "@/mocks/employees";

export function useEmployeeLookup() {
  function findEmployee(id: string) {
    return employees.find((employee) => employee.id === id);
  }

  function employeeName(id: string) {
    return findEmployee(id)?.name ?? "Unknown";
  }

  return { findEmployee, employeeName };
}
