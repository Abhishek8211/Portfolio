"use client";

import { useMemo, useState } from "react";
import { BlurReveal } from "@/components/effects/blur-reveal";
import BounceCards from "@/components/ui/BounceCards";
import { CertificateModal } from "@/components/modals/certificate-modal";
import { useLanguage } from "@/providers/language-provider";
import type { CertificateItem } from "@/types/certificate";

export default function Certificates() {
    const { content, dict } = useLanguage();
    const [selected, setSelected] = useState<CertificateItem | null>(null);
    const certificates = useMemo(() => content.certificates || [], [content.certificates]);
    const images = certificates.map((certificate) => certificate.image);

    return (
        <>
            <section className="relative overflow-hidden border-t border-border/50 py-16 md:py-24 lg:py-28" data-slot="certificates">
                <div className="pointer-events-none absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
                <div className="container relative z-10 mx-auto max-w-6xl px-container">
                    <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
                        <div className="max-w-xl">
                            <BlurReveal><span className="title-counter">[004]</span></BlurReveal>
                            <BlurReveal><h2 className="title mt-4">{dict.title.certificates}</h2></BlurReveal>
                            <BlurReveal><p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">{dict.certificatesIntro}</p></BlurReveal>
                            <p className="mt-5 text-sm font-mono uppercase tracking-widest text-foreground/50">
                                {certificates.length} {dict.certificatesCount}
                            </p>
                            <p className="mt-8 text-xs font-mono uppercase tracking-[0.2em] text-primary/80">{dict.certificatesHint}</p>
                        </div>
                        <div className="flex justify-center lg:justify-end">
                            <BounceCards images={images} containerWidth={600} containerHeight={340} onCardClick={(index) => setSelected(certificates[index] ?? null)} />
                        </div>
                    </div>
                </div>
            </section>
            <CertificateModal open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)} certificate={selected} />
        </>
    );
}
