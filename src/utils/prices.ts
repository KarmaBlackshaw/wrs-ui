import maxBy from "lodash/maxBy";

import { prices } from "@/mocks/products";

export function latestEffective<T extends { effectiveFrom: string }>(items: T[], onDate = todayIso()) {
  return maxBy(
    items.filter((item) => item.effectiveFrom.slice(0, 10) <= onDate),
    (item) => item.effectiveFrom
  );
}

export function currentPrice(productId: string, onDate?: string) {
  return (
    latestEffective(
      prices.filter((price) => price.productId === productId),
      onDate
    )?.amount ?? 0
  );
}
