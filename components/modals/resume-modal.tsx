import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

import { useLenisModal } from "@/hooks/use-lenis-modal";
import Magnetic from "@/components/effects/magnetic";
import { Download } from "lucide-react";

interface ResumeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ResumeModal({ open, onOpenChange }: ResumeModalProps) {
    useLenisModal(open);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={true}
                className="flex flex-col w-[95vw] sm:w-[90vw] md:max-w-[1000px] h-[90vh] p-0 gap-0 border-border/50 bg-background/95 backdrop-blur-xl overflow-hidden rounded-xl"
            >
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent z-10" />

                <div className="relative w-full h-full flex-1 overflow-hidden pt-12 pb-4 px-4 sm:px-8">
                    <iframe
                        src="/resume/Abhishek resume.pdf#toolbar=0&view=FitH"
                        className="w-full h-full border-0 rounded-lg shadow-lg bg-white/5"
                        title="Resume"
                    />
                </div>

                {/* Floating Download Button */}
                <div className="absolute bottom-8 right-8 z-50">
                    <a
                        href="/resume/Abhishek resume.pdf"
                        download="Abhishek_Resume.pdf"
                        className="group relative flex h-14 items-center justify-center gap-3 rounded-full overflow-hidden border border-border/50 bg-background px-6 text-foreground shadow-[0_0_20px_rgba(0,0,0,0.1)] transition-all duration-500 hover:bg-foreground hover:text-background hover:border-foreground/30 hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] hover:-translate-y-1 active:scale-[0.98] active:translate-y-0"
                        aria-label="Download Resume"
                    >
                        <div className="absolute inset-0 flex h-full w-full justify-center -translate-x-full -skew-x-12 group-hover:duration-1000 group-hover:translate-x-full rounded-full">
                            <div className="relative h-full w-8 bg-foreground/10 dark:bg-background/20" />
                        </div>

                        <Download className="relative z-10 w-5 h-5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        <span className="relative z-10 font-semibold tracking-wider text-sm uppercase">
                            Download
                        </span>
                    </a>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent z-10" />
            </DialogContent>
        </Dialog>
    );
}
