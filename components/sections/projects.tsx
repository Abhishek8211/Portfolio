"use client";

import { motion, useTransform, useScroll, useSpring } from "framer-motion";
import React, { useRef, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useLanguage } from "@/providers/language-provider";
import { useMediaQuery, BREAKPOINTS } from "@/hooks/use-media-query";
import { BlurReveal } from "@/components/effects/blur-reveal";
import type { ProjectItem } from "@/types/project";
import { useSound } from "@/providers/sound-provider";
import FlipCard from "@/components/ui/FlipCard";
import { ExternalLink } from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
    );
}

// Accent colors per project index
const CARD_ACCENTS = [
    { primary: "#00e5ff", glow: "rgba(0,229,255,0.35)", ring: "rgba(0,229,255,0.2)" },   // cyan – EnergyIQ
    { primary: "#3b82f6", glow: "rgba(59,130,246,0.35)", ring: "rgba(59,130,246,0.2)" },  // blue – WordGame
    { primary: "#a855f7", glow: "rgba(168,85,247,0.35)", ring: "rgba(168,85,247,0.2)" },  // purple – HandwritingAI
];

type ProjectFilter = "all" | "web" | "ai" | "games" | "mobile";

const PROJECT_FILTERS: { id: ProjectFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "web", label: "Web" },
    { id: "ai", label: "AI" },
    { id: "games", label: "Games" },
    { id: "mobile", label: "Mobile" },
];

function matchesProjectFilter(project: ProjectItem, filter: ProjectFilter) {
    if (filter === "all") return true;
    const searchableText = `${project.title} ${project.category} ${project.description}`.toLowerCase();
    if (filter === "ai") return searchableText.includes("ai") || searchableText.includes("artificial");
    if (filter === "games") return searchableText.includes("game") || searchableText.includes("juego") || searchableText.includes("jeu");
    if (filter === "mobile") return searchableText.includes("mobile") || searchableText.includes("react native");
    return searchableText.includes("web") || searchableText.includes("react") || searchableText.includes("next");
}

export default function Projects() {
    const { content, dict } = useLanguage();
    const isDesktop = useMediaQuery(BREAKPOINTS.xl);

    const targetRef = useRef<HTMLDivElement>(null);
    const horizontalContainerRef = useRef<HTMLDivElement>(null);

    const [measurements, setMeasurements] = useState({ scrollRange: 0, dynamicHeight: "auto" });
    const [filter, setFilter] = useState<ProjectFilter>("all");
    const filteredProjects = useMemo(
        () => content.projects.filter((project: ProjectItem) => matchesProjectFilter(project, filter)),
        [content.projects, filter],
    );

    useEffect(() => {
        if (!isDesktop) {
            const frame = requestAnimationFrame(() => {
                setMeasurements({ scrollRange: 0, dynamicHeight: "auto" });
            });
            return () => cancelAnimationFrame(frame);
        }

        const updateMeasurements = () => {
            if (horizontalContainerRef.current) {
                const totalWidth = horizontalContainerRef.current.scrollWidth;
                const viewportW = window.innerWidth;
                const range = totalWidth - viewportW;
                const safeRange = range > 0 ? range : 0;
                setMeasurements({
                    scrollRange: safeRange,
                    dynamicHeight: `${safeRange + window.innerHeight}px`,
                });
            }
        };

        updateMeasurements();
        const timeout = setTimeout(updateMeasurements, 100);
        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(updateMeasurements);
        });
        if (horizontalContainerRef.current) {
            resizeObserver.observe(horizontalContainerRef.current);
        }
        return () => {
            clearTimeout(timeout);
            resizeObserver.disconnect();
        };
    }, [isDesktop, content.projects]);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"],
    });

    const x = useTransform(scrollYProgress, [0, 1], [0, -measurements.scrollRange]);
    const smoothX = useSpring(x, { stiffness: 400, damping: 60, restDelta: 0.5 });

    return (
        <section
            ref={targetRef}
            data-slot="projects"
            className="relative py-16 md:py-24 lg:py-32 xl:py-0"
            style={{ height: measurements.dynamicHeight }}
        >
            <div
                className={`w-full ${isDesktop
                    ? "sticky top-0 h-screen flex items-center overflow-hidden"
                    : "relative flex flex-col"
                    }`}
            >
                {!isDesktop ? (
                    <>
                        <div className="flex flex-col gap-4 px-container mb-10">
                            <BlurReveal>
                                <span className="title-counter">[003]</span>
                            </BlurReveal>
                            <BlurReveal>
                                <h2 className="title">{dict.title.projects}</h2>
                            </BlurReveal>
                            <BlurReveal>
                                <p className="mt-4 text-muted-foreground text-lg">{dict.projectsIntro}</p>
                            </BlurReveal>
                            <ProjectFilters active={filter} onChange={setFilter} />
                        </div>
                        <div className="flex flex-col w-full max-w-full px-container gap-8 items-center">
                            {filteredProjects.map((project: ProjectItem, i: number) => (
                                <ProjectFlipCard
                                    key={project.id}
                                    project={project}
                                    index={i}
                                    total={filteredProjects.length}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <motion.div
                        ref={horizontalContainerRef}
                        style={{ x: smoothX }}
                        className="flex px-container w-max items-center gap-0"
                    >
                        {/* Intro panel */}
                        <div className="w-[50vw] xl:w-[38vw] shrink-0 flex flex-col justify-center pr-16">
                            <div className="flex flex-col gap-4">
                                <BlurReveal>
                                    <span className="title-counter">[003]</span>
                                </BlurReveal>
                                <BlurReveal>
                                    <h2 className="title">{dict.title.projects}</h2>
                                </BlurReveal>
                                <BlurReveal>
                                    <p className="mt-4 text-5xl font-light leading-tight">{dict.projectsIntro}</p>
                                </BlurReveal>
                                <ProjectFilters active={filter} onChange={setFilter} />
                                <BlurReveal>
                                    <div className="mt-12 flex items-center gap-4">
                                        <div className="h-px w-24 bg-border" />
                                        <span className="text-sm font-mono text-foreground/40 uppercase">
                                            {dict.projectsScrollText}
                                        </span>
                                    </div>
                                </BlurReveal>
                            </div>
                        </div>

                        {/* Cards */}
                        {filteredProjects.map((project: ProjectItem, i: number) => (
                            <ProjectFlipCard
                                key={project.id}
                                project={project}
                                index={i}
                                total={filteredProjects.length}
                            />
                        ))}

                        {/* End panel */}
                        <div className="w-[35vw] h-[70vh] shrink-0 flex flex-col justify-center items-center">
                            <h3 className="text-[9vw] font-black tracking-tighter text-border uppercase">
                                {dict.projectsEndText}
                            </h3>
                        </div>
                    </motion.div>
                )}
            </div>

        </section>
    );
}

function ProjectFilters({
    active,
    onChange,
}: {
    active: ProjectFilter;
    onChange: (filter: ProjectFilter) => void;
}) {
    return (
        <div className="flex flex-wrap gap-2" aria-label="Filter projects">
            {PROJECT_FILTERS.map((item) => (
                <button
                    key={item.id}
                    type="button"
                    aria-pressed={active === item.id}
                    onClick={() => onChange(item.id)}
                    className={`rounded-full border px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-colors ${
                        active === item.id
                            ? "border-foreground bg-foreground text-background"
                            : "border-border text-muted-foreground hover:border-foreground/60 hover:text-foreground"
                    }`}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}

/* ─── ProjectFlipCard ─────────────────────────────────────────────────────── */

const ProjectFlipCard = React.memo(function ProjectFlipCard({
    project,
    index,
    total,
}: {
    project: ProjectItem;
    index: number;
    total: number;
}) {
    const { playHover } = useSound();
    const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];

    /* ── Front face ───────────────────────────────────────────────────────── */
    const frontContent = (
        <div className="relative w-full h-full overflow-hidden group/front bg-[#080a0f]">

            {/* Full bleed project image */}
            <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 1280px) 90vw, 640px"
                priority={index < 2}
                className="object-cover object-center transition-transform duration-700 ease-out scale-[1.04] group-hover/front:scale-100"
            />

            {/* Layered gradients for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

            {/* Animated accent glow at bottom */}
            <div
                className="absolute bottom-0 left-0 right-0 h-1/3 opacity-60"
                style={{
                    background: `linear-gradient(to top, ${accent.glow}, transparent)`,
                }}
            />

            {/* Accent colour line at top */}
            <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: `linear-gradient(to right, transparent, ${accent.primary}, transparent)` }}
            />

            {/* Top bar */}
            <div className="absolute top-5 left-5 right-5 flex justify-between items-center">
                <span
                    className="text-[10px] font-mono tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border backdrop-blur-md"
                    style={{
                        color: accent.primary,
                        borderColor: accent.ring,
                        background: `${accent.ring}`,
                    }}
                >
                    {project.category}
                </span>
                <span className="text-[10px] font-mono text-white/50 tracking-widest bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    {project.year}
                </span>
            </div>

            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-3xl font-black tracking-tighter text-white uppercase leading-none mb-2">
                    {project.title}
                </h3>

                {/* Tech stack preview */}
                {project.stack && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.stack.slice(0, 3).map((t) => (
                            <span key={t} className="text-[10px] font-mono text-white/50 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                                {t}
                            </span>
                        ))}
                        {(project.stack.length > 3) && (
                            <span className="text-[10px] font-mono text-white/30">
                                +{project.stack.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                {/* Flip hint with animated arrow */}
                <div className="flex items-center gap-2">
                    <div
                        className="h-px flex-1 opacity-40"
                        style={{ background: accent.primary }}
                    />
                    <span className="text-[10px] font-mono tracking-[0.2em] uppercase" style={{ color: accent.primary }}>
                        flip to explore
                    </span>
                    <span className="text-xs" style={{ color: accent.primary }}>→</span>
                </div>
            </div>

            {/* Corner number */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2">
                <span className="text-[10px] font-mono text-white/20 tracking-widest">
                    {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
            </div>
        </div>
    );

    /* ── Back face ────────────────────────────────────────────────────────── */
    const backContent = (
        <div className="relative flex flex-col h-full overflow-hidden bg-[#080a0f]">

            {/* Subtle image bleed on back */}
            <div className="absolute inset-0">
                <Image
                    src={project.image}
                    alt=""
                    fill
                    sizes="560px"
                    loading="lazy"
                    className="object-cover object-top opacity-[0.06] scale-110 blur-sm"
                />
            </div>

            {/* Accent glow top */}
            <div
                className="absolute top-0 left-0 right-0 h-48 opacity-20"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${accent.primary}, transparent 70%)` }}
            />

            {/* Top accent line */}
            <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: `linear-gradient(to right, transparent, ${accent.primary}, transparent)` }}
            />

            {/* Content */}
            <div className="relative flex flex-col h-full min-h-0 p-6 pt-8 z-10">

                {/* Header */}
                <div className="shrink-0">
                    <div className="flex items-center justify-between mb-3">
                        <span
                            className="text-[10px] font-mono tracking-[0.18em] uppercase px-2.5 py-1 rounded-full border"
                            style={{ color: accent.primary, borderColor: accent.ring, background: accent.ring }}
                        >
                            {project.category}
                        </span>
                        <span className="text-[10px] font-mono text-white/30 tracking-widest">
                            {project.year}
                        </span>
                    </div>
                    <h3 className="text-2xl xl:text-3xl font-black tracking-tighter text-white uppercase leading-none">
                        {project.title}
                    </h3>
                    <div className="mt-3 h-px w-full" style={{ background: `linear-gradient(to right, ${accent.primary}40, transparent)` }} />
                </div>

                {/* Scrollable project content */}
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
                    <p className="text-sm text-white/65 leading-relaxed mt-4">
                        {project.description}
                    </p>

                    {project.stack && project.stack.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                            {project.stack.map((tech) => (
                                <span
                                    key={tech}
                                    className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wide border"
                                    style={{
                                        color: `${accent.primary}cc`,
                                        borderColor: accent.ring,
                                        background: `${accent.ring}`,
                                    }}
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="mt-5 shrink-0 flex flex-wrap items-center gap-2.5">
                    {project.demo && (
                        <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[11px] font-mono tracking-wider font-semibold transition-all duration-200 hover:brightness-90"
                            style={{
                                background: accent.primary,
                                color: "#000",
                            }}
                        >
                            <ExternalLink className="w-3 h-3" />
                            Live Demo
                        </a>
                    )}
                    {project.repo && (
                        <a
                            href={project.repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[11px] font-mono tracking-wider text-white border transition-all duration-200 hover:bg-white/10"
                            style={{ borderColor: accent.ring, background: "rgba(255,255,255,0.05)" }}
                        >
                            <GithubIcon className="w-3 h-3" />
                            Source
                        </a>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <BlurReveal>
            <div className="project-flip-card shrink-0 xl:mx-5" onMouseEnter={playHover}>
                <FlipCard
                    front={frontContent}
                    back={backContent}
                    axis="y"
                    flipOnClick
                    draggable
                    dragDistance={0}
                    tilt
                    tiltMax={8}
                    glare
                    glareOpacity={0.15}
                    hoverScale={1.03}
                    perspective={1200}
                    stiffness={160}
                    damping={22}
                    width={640}
                    height={440}
                    radius={18}
                    background="#080a0f"
                    color="#f5f5f5"
                    shadow
                    shadowColor={accent.primary.replace("#", "")}
                    shadowOpacity={0.25}
                    ariaLabel={`Project: ${project.title}`}
                />
            </div>
        </BlurReveal>
    );
});