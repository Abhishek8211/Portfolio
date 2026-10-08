"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLenisModal } from "@/hooks/use-lenis-modal";
import { useModalHistory } from "@/hooks/use-modal-history";
import { useLanguage } from "@/providers/language-provider";
import type { CertificateItem } from "@/types/certificate";

export function CertificateModal({
    open,
    onOpenChange,
    certificate,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    certificate: CertificateItem | null;
}) {
    useLenisModal(open);
    useModalHistory(open, onOpenChange, `certificate-${certificate?.id ?? "details"}`);
    const { dict } = useLanguage();

    if (!certificate) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-[760px] max-h-[90vh] overflow-y-auto border-border/50 bg-background/95 p-0 backdrop-blur-xl">
                <DialogHeader className="sr-only">
                    <DialogTitle>{certificate.title}</DialogTitle>
                    <DialogDescription>{dict.certificateDetails} {certificate.title}</DialogDescription>
                </DialogHeader>
                <div className="relative min-h-[240px] w-full overflow-hidden bg-secondary/20 sm:min-h-[420px]">
                    <Image src={certificate.image} alt={certificate.title} fill sizes="(max-width: 760px) 95vw, 760px" className="object-contain" priority />
                </div>
                <div className="space-y-5 p-6 sm:p-10">
                    <div>
                        <p className="mb-2 text-xs font-mono uppercase tracking-[0.2em] text-primary">{certificate.issuer} · {certificate.year}</p>
                        <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">{certificate.title}</h2>
                    </div>
                    <p className="text-base leading-relaxed text-foreground/70 sm:text-lg">{certificate.description}</p>
                    {certificate.credential && (
                        <p className="border-t border-border/50 pt-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                            {dict.credential}: {certificate.credential}
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
