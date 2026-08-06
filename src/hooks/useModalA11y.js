import { useEffect } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "textarea:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

/**
 * Gives a modal the behaviour a native <dialog> would provide: Escape closes it,
 * the page behind it stops scrolling, focus moves in on open, Tab stays inside,
 * and focus returns to whatever opened it on close.
 *
 * `containerRef` must point at the modal panel (not the backdrop) so the
 * backdrop's own click target stays outside the focus trap.
 */
export function useModalA11y({ open, onClose, containerRef, initialFocusRef }) {
  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;

    return () => {
      if (
        previouslyFocused instanceof HTMLElement &&
        document.contains(previouslyFocused)
      ) {
        previouslyFocused.focus();
      }
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const container = containerRef.current;
    if (!container) return undefined;

    // Delayed so the open animation has started and the panel is hit-testable.
    const focusTimer = window.setTimeout(() => {
      const target =
        initialFocusRef?.current || container.querySelector(FOCUSABLE_SELECTOR);
      if (target) {
        target.focus();
      } else {
        container.focus();
      }
    }, 80);

    function handleTab(event) {
      if (event.key !== "Tab") return;

      const focusable = [
        ...container.querySelectorAll(FOCUSABLE_SELECTOR),
      ].filter(
        (element) =>
          element.offsetParent !== null || element === document.activeElement,
      );
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    container.addEventListener("keydown", handleTab);

    return () => {
      window.clearTimeout(focusTimer);
      container.removeEventListener("keydown", handleTab);
    };
  }, [open, containerRef, initialFocusRef]);
}
