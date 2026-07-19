import { useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import { useLanguage } from "@/providers/language-provider";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { useLenisModal } from "@/hooks/use-lenis-modal";
import { useLenis } from "@/providers/smooth-scroll-provider";
import { ShineButton } from "@/components/ui/shine-button";
import Magnetic from "@/components/effects/magnetic";
import { useSound } from "@/providers/sound-provider";

interface ContactModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ContactModal({ open, onOpenChange }: ContactModalProps) {
    const { content, dict } = useLanguage();
    useLenisModal(open);
    const lenis = useLenis();
    const { playClick } = useSound();

    const handleScrollToContact = useCallback(() => {
        playClick();
        onOpenChange(false);

        setTimeout(() => {
            const elem = document.getElementById("contact");
            if (elem) {
                if (lenis) {
                    lenis.scrollTo(elem, {
                        offset: 160,
                        duration: 1.5,
                    });
                } else {
                    const rect = elem.getBoundingClientRect();
                    const offsetPosition = rect.top + window.scrollY + 160;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                    });
                }
            }
        }, 300); // Wait for modal close animation
    }, [onOpenChange, lenis]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={true}
                className="flex flex-col sm:max-w-[560px] max-h-[85vh] p-0 gap-0 border-border/50 bg-background/95 backdrop-blur-xl overflow-hidden"
            >
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent z-10" />

                <div className="relative px-8 pt-8 pb-4 shrink-0">
                    <DialogHeader className="gap-3">
                        <DialogTitle className="text-2xl font-bold tracking-tight">
                            {dict.contactMe}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
                            {dict.contactModalDescription}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="overflow-y-auto px-8 pb-8 pt-2 flex-1" data-lenis-prevent="true">
                    <div className="flex flex-col mt-4">
                        <Magnetic>
                            <button
                                onClick={handleScrollToContact}
                                className="group relative flex w-full h-14 items-center justify-between rounded-full border border-border/50 bg-foreground px-6 sm:px-8 text-background transition-all duration-500 ease-out hover:bg-background hover:text-foreground hover:border-foreground/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.03)] hover:-translate-y-1 active:scale-[0.98] active:translate-y-0"
                                aria-label="Send a Message"
                            >
                                <div className="absolute inset-0 flex h-full w-full justify-center -translate-x-full -skew-x-12 group-hover:duration-1000 group-hover:translate-x-full">
                                    <div className="relative h-full w-8 bg-background/20 dark:bg-foreground/10" />
                                </div>

                                <div className="w-5" aria-hidden="true" />
                                <span className="relative z-10 text-sm font-semibold tracking-[0.15em] uppercase">
                                    Send a Message
                                </span>
                                <ArrowRight className="relative z-10 w-5 h-5 transition-transform duration-500 group-hover:translate-x-1" />
                            </button>
                        </Magnetic>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center mt-8 justify-center sm:justify-start">
                        {content.social.map((link: { label: string; href: string }) => (
                            <div key={link.label}>
                                <Magnetic intensity={0.2}>
                                    <div onClick={playClick}>
                                        <ShineButton
                                            href={link.href}
                                            className="h-10 px-5"
                                            shineClassName="w-4 bg-background/20 dark:bg-background/20"
                                        >
                                            <span className="relative z-10 flex items-center gap-2 text-xs tracking-widest uppercase font-medium">
                                                {link.label}
                                                <ArrowUpRight className="w-3 h-3 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                                            </span>
                                        </ShineButton>
                                    </div>
                                </Magnetic>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent z-10" />
            </DialogContent>
        </Dialog>
    );
}
