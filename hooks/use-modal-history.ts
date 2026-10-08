"use client";

import { useEffect, useRef } from "react";

/**
 * Manages browser history for modals so the Android/iOS back gesture
 * closes the modal — WITHOUT causing scroll-to-top or conflicting with
 * the Next.js App Router.
 *
 * On open  → pushState({modal}) so the back gesture hits the sentinel first.
 * On popstate (back gesture) → close the modal. Browser already moved back;
 *   no history.back() needed.
 * On close via ✕/Escape → replaceState(null) to silently overwrite the
 *   sentinel. replaceState does NOT fire popstate, so Next.js router is
 *   never touched and the page does NOT scroll to top.
 */
export function useModalHistory(
  open: boolean,
  onOpenChange: (open: boolean) => void,
  modalId: string
) {
  const isPushedRef = useRef(false);

  useEffect(() => {
    if (open) {
      if (!isPushedRef.current) {
        window.history.pushState({ modal: modalId }, "");
        isPushedRef.current = true;
      }

      const handlePopState = () => {
        // Back gesture: browser already moved back. Just close the modal.
        isPushedRef.current = false;
        onOpenChange(false);
      };

      window.addEventListener("popstate", handlePopState);
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    } else {
      if (isPushedRef.current) {
        isPushedRef.current = false;
        // replaceState silently overwrites the sentinel — no popstate fires,
        // no Next.js router conflict, no scroll-to-top.
        if (
          typeof window !== "undefined" &&
          window.history.state?.modal === modalId
        ) {
          window.history.replaceState(null, "");
        }
      }
    }
  }, [open, onOpenChange, modalId]);
}
