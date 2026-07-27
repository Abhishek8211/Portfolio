"use client";

import { useEffect, useRef } from "react";

/**
 * Hook to manage browser history for modals and drawers on mobile devices.
 * Pushes a history entry when opened, and listens to popstate (back button)
 * so pressing physical/gesture Back closes the modal instead of exiting the site.
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
        if (isPushedRef.current) {
          isPushedRef.current = false;
          onOpenChange(false);
        }
      };

      window.addEventListener("popstate", handlePopState);
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    } else {
      if (isPushedRef.current) {
        isPushedRef.current = false;
        if (typeof window !== "undefined" && window.history.state?.modal === modalId) {
          window.history.back();
        }
      }
    }
  }, [open, onOpenChange, modalId]);
}
