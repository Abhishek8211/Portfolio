import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import { useLenisModal } from "@/hooks/use-lenis-modal";
import { useLanguage } from "@/providers/language-provider";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import type { ProjectItem } from "@/types/project";
import { ShineButton } from "@/components/ui/shine-button";

function GithubIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
    );
}


interface ProjectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project: ProjectItem | null;
}

export function ProjectModal({ open, onOpenChange, project }: ProjectModalProps) {
    useLenisModal(open);
    const { dict } = useLanguage();

    if (!project) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={true}
                className="flex flex-col sm:max-w-[800px] w-[95vw] max-h-[90vh] p-0 gap-0 border-border/50 bg-background/95 backdrop-blur-xl shrink-0"
            >
                <DialogHeader className="sr-only">
                    <DialogTitle>{project.title}</DialogTitle>
                    <DialogDescription>{dict.projectDetails} {project.title}</DialogDescription>
                </DialogHeader>

                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent z-10" />

                <div className="overflow-y-auto w-full h-full flex-1" data-lenis-prevent="true">

                    <div className="relative w-full h-[40vh] sm:h-[50vh] shrink-0">
                        {project.image && (
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                className="object-cover rounded-lg"
                                priority
                            />
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />

                        <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-foreground mb-2">
                                    {project.title}
                                </h2>
                                <div className="flex items-center gap-3 text-sm font-mono tracking-widest text-muted-foreground uppercase">
                                    <span>{project.category}</span>
                                    <span className="w-1 h-1 rounded-full bg-border" />
                                    <span>{project.year}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-10 flex flex-col gap-10">
                        <div>
                            <h3 className="text-sm tracking-widest text-muted-foreground uppercase mb-4">{dict.aboutProject}</h3>
                            <p className="text-lg text-foreground/80 leading-relaxed font-light">
                                {project.description}
                            </p>
                        </div>

                        {project.stack && project.stack.length > 0 && (
                            <div>
                                <h3 className="text-sm tracking-widest text-muted-foreground uppercase mb-4">{dict.technologies}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.stack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-4 py-1.5 rounded-full border border-border/50 bg-secondary/50 text-sm"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(project.demo || project.repo) && (
                            <div className="flex flex-wrap gap-4 pt-4 border-t border-border/50">
                                {project.demo && (
                                    <ShineButton
                                        href={project.demo}
                                        className="h-12 bg-foreground px-6 sm:px-8 text-background hover:bg-background hover:text-foreground shadow-lg hover:-translate-y-1"
                                        shineClassName="w-8 bg-background/20 dark:bg-foreground/10"
                                    >
                                        <span className="relative z-10 flex items-center gap-2 text-xs sm:text-sm font-medium tracking-widest uppercase">
                                            {dict.liveDemo}
                                            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                                        </span>
                                    </ShineButton>
                                )}

                                {project.repo && (
                                    <ShineButton
                                        href={project.repo}
                                        className="h-12 bg-secondary/10 backdrop-blur-md px-6 sm:px-8 text-foreground hover:bg-foreground hover:text-background shadow-sm hover:-translate-y-1"
                                        shineClassName="w-8 bg-foreground/10 dark:bg-background/20"
                                    >
                                        <span className="relative z-10 flex items-center gap-2 text-xs sm:text-sm font-medium tracking-widest uppercase">
                                            {dict.sourceCode}
                                            <GithubIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
                                        </span>
                                    </ShineButton>
                                )}
                            </div>
                        )}

                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent z-10" />
            </DialogContent>
        </Dialog>
    );
}
