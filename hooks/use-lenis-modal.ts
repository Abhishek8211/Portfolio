import { useEffect, useRef } from "react";
import { useLenis } from "@/providers/smooth-scroll-provider";

export function useLenisModal(open: boolean) {
    const lenis = useLenis();
    const savedScrollY = useRef(0);

    useEffect(() => {
        if (open) {
            // Save position before locking scroll.
            savedScrollY.current = window.scrollY;
            lenis?.stop();
        } else {
            lenis?.start();
            // Snap Lenis back to the saved position so it doesn't jump to top.
            if (savedScrollY.current > 0) {
                requestAnimationFrame(() => {
                    lenis?.scrollTo(savedScrollY.current, { immediate: true });
                });
            }
        }
    }, [open, lenis]);
}

