"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./BounceCards.css";

type BounceCardsProps = {
    className?: string;
    images?: string[];
    containerWidth?: number;
    containerHeight?: number;
    animationDelay?: number;
    animationStagger?: number;
    easeType?: string;
    transformStyles?: string[];
    enableHover?: boolean;
    onCardClick?: (index: number) => void;
};

const DEFAULT_TRANSFORMS = [
    "rotate(8deg) translate(-105px)",
    "rotate(4deg) translate(-52px)",
    "rotate(-3deg)",
    "rotate(-6deg) translate(52px)",
    "rotate(4deg) translate(105px)",
];

export default function BounceCards({
    className = "",
    images = [],
    containerWidth = 400,
    containerHeight = 400,
    animationDelay = 0.5,
    animationStagger = 0.06,
    easeType = "elastic.out(1, 0.8)",
    transformStyles = DEFAULT_TRANSFORMS,
    enableHover = true,
    onCardClick,
}: BounceCardsProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".bounce-card",
                { scale: 0, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    stagger: animationStagger,
                    ease: easeType,
                    delay: animationDelay,
                },
            );
        }, containerRef);

        return () => ctx.revert();
    }, [animationDelay, animationStagger, easeType]);

    const getNoRotationTransform = (transform: string) =>
        /rotate\([\s\S]*?\)/.test(transform)
            ? transform.replace(/rotate\([\s\S]*?\)/, "rotate(0deg)")
            : transform === "none"
                ? "rotate(0deg)"
                : `${transform} rotate(0deg)`;

    const getPushedTransform = (transform: string, offsetX: number) => {
        const translateRegex = /translate\(([-0-9.]+)px\)/;
        const match = transform.match(translateRegex);
        if (match) {
            return transform.replace(
                translateRegex,
                `translate(${parseFloat(match[1]) + offsetX}px)`,
            );
        }
        return transform === "none"
            ? `translate(${offsetX}px)`
            : `${transform} translate(${offsetX}px)`;
    };

    const pushSiblings = (hoveredIndex: number) => {
        if (!enableHover || !containerRef.current) return;
        const select = gsap.utils.selector(containerRef);

        images.forEach((_, index) => {
            const target = select(`.card-${index}`);
            gsap.killTweensOf(target);
            const baseTransform = transformStyles[index] || "none";

            if (index === hoveredIndex) {
                gsap.to(target, {
                    transform: getNoRotationTransform(baseTransform),
                    duration: 0.4,
                    ease: "back.out(1.4)",
                    overwrite: "auto",
                });
            } else {
                const offsetX = index < hoveredIndex ? -100 : 100;
                gsap.to(target, {
                    transform: getPushedTransform(baseTransform, offsetX),
                    duration: 0.4,
                    delay: Math.abs(hoveredIndex - index) * 0.05,
                    ease: "back.out(1.4)",
                    overwrite: "auto",
                });
            }
        });
    };

    const resetCards = () => {
        if (!enableHover || !containerRef.current) return;
        const select = gsap.utils.selector(containerRef);
        images.forEach((_, index) => {
            const target = select(`.card-${index}`);
            gsap.killTweensOf(target);
            gsap.to(target, {
                transform: transformStyles[index] || "none",
                duration: 0.4,
                ease: "back.out(1.4)",
                overwrite: "auto",
            });
        });
    };

    return (
        <div
            ref={containerRef}
            className={`bounce-cards-container ${className}`}
            style={{ "--bounce-width": `${containerWidth}px`, "--bounce-height": `${containerHeight}px` } as React.CSSProperties}
        >
            {images.map((src, index) => (
                <button
                    key={src}
                    type="button"
                    className={`bounce-card card-${index}`}
                    style={{ transform: transformStyles[index] ?? "none" }}
                    onMouseEnter={() => pushSiblings(index)}
                    onMouseLeave={resetCards}
                    onFocus={() => pushSiblings(index)}
                    onBlur={resetCards}
                    onClick={() => onCardClick?.(index)}
                    aria-label={`Open certificate ${index + 1}`}
                >
                    <img src={src} alt="" className="bounce-card-image" />
                </button>
            ))}
        </div>
    );
}
