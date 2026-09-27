import type { TToast, TToastTone } from "@/types/toast";

let nextId = 1;

export const useToastStore = defineStore("toast", () => {
  const toasts = ref<TToast[]>([]);

  function show(message: string, tone: TToastTone = "success") {
    const id = nextId++;

    toasts.value.push({ id, message, tone });

    setTimeout(() => dismiss(id), 3000);
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  }

  return { toasts, show, dismiss };
});
