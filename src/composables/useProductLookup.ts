import { products } from "@/mocks/products";

export function useProductLookup() {
  function findProduct(id: string) {
    return products.find((product) => product.id === id);
  }

  function productName(id: string) {
    return findProduct(id)?.name ?? "Unknown";
  }

  return { findProduct, productName };
}
