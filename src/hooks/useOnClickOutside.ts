import { useEffect, type RefObject } from "react";

interface UseOnClickOutsideOptions {
  refs: RefObject<HTMLElement | null>[];
  enabled: boolean;
  onOutsideClick: () => void;
}

export function useOnClickOutside({
  refs,
  enabled,
  onOutsideClick,
}: UseOnClickOutsideOptions): void {
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      const clickedInside = refs.some((ref) => ref.current?.contains(target));

      if (!clickedInside) {
        onOutsideClick();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, [enabled, onOutsideClick, refs]);
}
