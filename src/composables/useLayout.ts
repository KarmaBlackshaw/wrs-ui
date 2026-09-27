import type { Component } from "vue";

const layouts = import.meta.glob<Component>("@/layouts/*.vue", { eager: true, import: "default" });

export function useLayout() {
  const route = useRoute();

  const layout = computed(() => layouts[`/src/layouts/${route.meta.layout ?? "Default"}.vue`]);

  return { layout };
}
