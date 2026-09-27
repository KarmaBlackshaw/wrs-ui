import { customers } from "@/mocks/customers";

export function useCustomerLookup() {
  function findCustomer(id: string) {
    return customers.find((customer) => customer.id === id);
  }

  function customerName(id: string) {
    return findCustomer(id)?.name ?? "Unknown";
  }

  return { findCustomer, customerName };
}
