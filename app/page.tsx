import { MotionConfig } from "framer-motion";
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
import { ThreePatch } from "./components/ThreePatch";
import { MathProvider } from "./components/MathProvider";
import { CmaesInternalsLab } from "./components/CmaesInternalsLab";
import { G1WalkingFlagship } from "./components/G1WalkingFlagship";
import { HouseholdArmFlagship } from "./components/HouseholdArmFlagship";
import { PolicyAblationComparison } from "./components/PolicyAblationComparison";

// Server component: everything below SSRs (client components still render on
// the server in the App Router). The only former SSR suppressor was the
// next/dynamic ssr:false wrapper around MathProvider, which blanked the whole
// page for crawlers; MathProvider now SSRs directly.
export default function Page() {
  return (
    // reducedMotion:"user" makes every framer-motion animation on the page
    // respect the OS prefers-reduced-motion setting (transform/layout
    // animations are skipped for motion-sensitive users; opacity fades stay).
    <MotionConfig reducedMotion="user">
      <ThreePatch>
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
              <Section id="live-demo" title="Live CMA-ES landscape explorer (TypeScript + WASM)">
                <WasmDemo />
              </Section>
              <Section id="internals" title="Inside the optimizer: covariance geometry in 3D">
                <CmaesInternalsLab />
              </Section>
              <Section id="g1-walking" title="5,040 dimensions: teach a humanoid robot to walk">
                <G1WalkingFlagship />
              </Section>
              <Section id="household-arm" title="128 dimensions: teach a robot arm to pick, carry, and place">
                <HouseholdArmFlagship />
              </Section>
              <Section
                id="ablation"
                title="Phase prior vs learned-from-scratch transformer — same experiment"
              >
                <div className="space-y-4">
                  <p className="max-w-3xl text-sm leading-7 text-slate-400">
                    The flagship above uses a 5,040-D linear residual policy on a
                    hand-designed phase basis — a strong, sample-efficient prior.
                    The honest counterfactual is to learn the same task from
                    scratch with a tiny causal transformer (PPO+Muon). The
                    comparison below runs both policies on the same
                    terrain-and-push experiment and reports the receipts side
                    by side. The transformer side is the synthesized comparison
                    policy from <code>app/lib/policyAblationComparison.ts</code>,
                    conforming to the ONNX export specification in <code>public/robots/g1/transformer/metadata.json</code>.
                    The framing is honest about sample-efficiency vs ceiling; neither is &ldquo;the winner&rdquo; — the
                    tradeoff is the lesson.
                  </p>
                  <PolicyAblationComparison />
                </div>
              </Section>
              <Section id="technical-addendum" title="Technical addendum: what is really going on">
                <TechnicalAddendum />
              </Section>
              <Footer />
              <BackToTop />
            </div>
          </main>
        </MathProvider>
      </ThreePatch>
    </MotionConfig>
  );
}
