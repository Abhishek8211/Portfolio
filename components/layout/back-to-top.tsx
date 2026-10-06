"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useLenis } from "@/providers/smooth-scroll-provider";

export default function BackToTop() {
    const lenis = useLenis();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > window.innerHeight * 0.75);
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        if (lenis) {
            lenis.scrollTo(0, { duration: 1.1 });
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    type="button"
                    initial={{ opacity: 0, y: 16, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 16, scale: 0.9 }}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ duration: 0.2 }}
                    onClick={scrollToTop}
                    aria-label="Back to top"
                    className="fixed bottom-6 right-6 z-80 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-lg backdrop-blur-md transition-colors hover:bg-foreground hover:text-background sm:bottom-8 sm:right-8"
                >
                    <ArrowUp className="h-4 w-4" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
