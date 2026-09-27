import { autoUpdate, flip, offset, shift, size, useFloating } from "@floating-ui/vue";
import type { Placement } from "@floating-ui/vue";
import type { Ref } from "vue";

let closeOpenPanel: (() => void) | undefined;

export function useFloatingPanel(
  reference: Readonly<Ref<HTMLElement | null>>,
  floating: Readonly<Ref<HTMLElement | null>>,
  { placement = "bottom-start", matchWidth = true, maxHeight = 320 }: { placement?: Placement; matchWidth?: boolean; maxHeight?: number } = {}
) {
  const open = ref(false);

  const { floatingStyles } = useFloating(reference, floating, {
    open,
    placement,
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      size({
        padding: 8,
        apply({ rects, availableHeight, elements }) {
          elements.floating.style.maxHeight = `${Math.min(availableHeight, maxHeight)}px`;

          if (matchWidth) {
            elements.floating.style.minWidth = `${rects.reference.width}px`;
          }
        },
      }),
    ],
  });

  watch(
    [open, floating],
    ([isOpen, element]) => {
      if (element?.isConnected) {
        element.togglePopover(isOpen);
      }
    },
    { flush: "post" }
  );

  const close = () => (open.value = false);

  watch(open, (isOpen) => {
    if (isOpen) {
      if (closeOpenPanel !== close) {
        closeOpenPanel?.();
      }

      closeOpenPanel = close;
    } else if (closeOpenPanel === close) {
      closeOpenPanel = undefined;
    }
  });

  onScopeDispose(() => {
    if (closeOpenPanel === close) {
      closeOpenPanel = undefined;
    }
  });

  onClickOutside(floating, close, { ignore: [reference] });

  return { open, floatingStyles };
}
