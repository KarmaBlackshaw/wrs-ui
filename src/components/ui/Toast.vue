<script setup lang="ts">
const { toasts, dismiss } = useToast();

const toneIcons = {
  success: { icon: "check-circle-fill", class: "text-emerald-600" },
  info: { icon: "info-fill", class: "text-brand-700" },
  warning: { icon: "warning-fill", class: "text-amber-600" },
  error: { icon: "x-circle-fill", class: "text-red-600" },
};
</script>

<template>
  <div
    class="pointer-events-none fixed inset-x-0 top-[max(1rem,env(safe-area-inset-top))] z-50 flex flex-col items-center gap-2 px-4 sm:items-end"
    aria-live="polite"
    role="status"
  >
    <TransitionGroup
      enter-from-class="-translate-y-2 opacity-0"
      leave-to-class="opacity-0"
      enter-active-class="transition duration-200 ease-out motion-reduce:transition-none"
      leave-active-class="transition duration-150 motion-reduce:transition-none"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border border-zinc-200 bg-white py-3 pr-2 pl-4 text-sm font-medium text-zinc-900 shadow-lg"
      >
        <UiIcon :name="toneIcons[toast.tone].icon" class="size-5 shrink-0" :class="toneIcons[toast.tone].class" />
        <span class="flex-1">{{ toast.message }}</span>
        <button
          type="button"
          aria-label="Dismiss"
          class="grid size-8 shrink-0 place-items-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-brand-600"
          @click="dismiss(toast.id)"
        >
          <UiIcon name="x" class="size-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
