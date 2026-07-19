"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useSpring } from "framer-motion";
import { useSound } from "@/providers/sound-provider";

interface MagneticProps {
    children: React.ReactNode;
    intensity?: number;
    disabled?: boolean;
}

export default function Magnetic({ children, intensity = 0.4, disabled = false }: MagneticProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isTouch, setIsTouch] = useState(false);
    const { playHover } = useSound();

    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
    const x = useSpring(0, springConfig);
    const y = useSpring(0, springConfig);

    useEffect(() => {
        setIsTouch(window.matchMedia("(pointer: coarse)").matches);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isTouch || disabled) return;

        const { clientX, clientY } = e;
        const rect = ref.current?.getBoundingClientRect();
        if (rect) {
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distanceX = clientX - centerX;
            const distanceY = clientY - centerY;

            x.set(distanceX * intensity);
            y.set(distanceY * intensity);
        }
    };

    const handleMouseLeave = () => {
        if (isTouch || disabled) return;
        x.set(0);
        y.set(0);
    };

    const handleMouseEnter = () => {
        if (isTouch || disabled) return;
        playHover();
    };

    if (isTouch || disabled) {
        return <>{children}</>; // Render normally on mobile to avoid layout shifts or wrapper divs
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            style={{ x, y }}
            className="w-fit h-fit flex items-center justify-center relative cursor-pointer"
        >
            {children}
        </motion.div>
    );
}
