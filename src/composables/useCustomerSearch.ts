import type { MaybeRefOrGetter } from "vue";

import { customers } from "@/mocks/customers";
import type { TCustomer } from "@/types";

export function useCustomerSearch(query: MaybeRefOrGetter<string>, source: MaybeRefOrGetter<TCustomer[]> = customers) {
  return computed(() => {
    const term = toValue(query).trim().toLowerCase();
    const list = toValue(source);

    if (!term) {
      return list;
    }

    return list.filter((customer) => customer.name.toLowerCase().includes(term) || customer.address.toLowerCase().includes(term));
  });
}
