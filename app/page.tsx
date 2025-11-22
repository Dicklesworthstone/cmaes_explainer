"use client";

import dynamicImport from "next/dynamic";

const MathProvider = dynamicImport(
  () => import("./components/MathProvider").then((m) => m.MathProvider),
  { ssr: false }
);
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { CmaesIntro } from "./components/CmaesIntro";
import { NoGradientExamples } from "./components/NoGradientExamples";
import { WingWalkthrough } from "./components/WingWalkthrough";
import { OpenSourceEngines } from "./components/OpenSourceEngines";
import { WasmDemo } from "./components/WasmDemo";
import { Footer } from "./components/Footer";
import { Section } from "./components/Section";
import { TechnicalAddendum } from "./components/TechnicalAddendum";
import { BackToTop } from "./components/BackToTop";

export default function Page() {
  return (
    <MathProvider>
      <main id="main-content" className="relative min-h-screen">
        <Navbar />
        <div className="pt-20 pb-24">
          <Hero />
          <Section id="what-is-cmaes" title="What CMA-ES is and why anyone should care">
            <CmaesIntro />
          </Section>
          <Section id="no-gradients" title="When gradients disappear">
            <NoGradientExamples />
          </Section>
          <Section
            id="wing-walkthrough"
            title="A concrete CMA-ES walk-through: designing an airplane wing"
          >
            <WingWalkthrough />
          </Section>
          <Section id="engines" title="Two high-performance CMA-ES engines in Rust">
            <OpenSourceEngines />
          </Section>
          <Section id="live-demo" title="Live CMA-ES landscape explorer (WASM)">
            <WasmDemo />
          </Section>
          <Section id="technical-addendum" title="Technical addendum: what is really going on">
            <TechnicalAddendum />
          </Section>
          <Footer />
          <BackToTop />
        </div>
      </main>
    </MathProvider>
  );
}
