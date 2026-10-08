import ScrollProgress from "@/components/layout/scroll-progress";
import BackToTop from "@/components/layout/back-to-top";
import ManifestoFlow from "@/components/effects/manifesto-flow";
import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import Stack from "@/components/sections/stack";
import Projects from "@/components/sections/projects";
import Certificates from "@/components/sections/certificates";
import Roadmap from "@/components/sections/roadmap";
import Contact from "@/components/sections/contact";
import { InteractiveParticles } from "@/components/effects/interactive-particles";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <ScrollProgress />
      <BackToTop />
      <InteractiveParticles />

      <main id="main-content" tabIndex={-1} className="bg-background relative">

        <Hero />

        <div className="relative z-10 bg-background border-t border-border">

          <section id="about">
            <About />
          </section>

          <ManifestoFlow />

          <section id="stack">
            <Stack />
          </section>

          <ManifestoFlow reverse />

          <section id="projects">
            <Projects />
          </section>

          <ManifestoFlow />

          <section id="certificates">
            <Certificates />
          </section>

          <ManifestoFlow variant="certificates" />

          <section id="roadmap">
            <Roadmap />
          </section>

          <ManifestoFlow reverse />

          <section id="contact">
            <Contact />
          </section>

        </div>

      </main >
    </>
  );
}
