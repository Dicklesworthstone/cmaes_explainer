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
import { HpoTrainer } from "./components/HpoTrainer";
import { HonestyChipStack } from "./components/HonestyChipStack";
import { KernelSummary } from "./components/KernelSummary";
import { ViewportLazy } from "./components/ViewportLazy";

// Server component: everything below SSRs (client components still render on
// the server in the App Router). The only former SSR suppressor was the
// next/dynamic ssr:false wrapper around MathProvider, which blanked the whole
// page for crawlers; MathProvider now SSRs directly.
//
// Lazy-mount policy (viewport-deferred via ViewportLazy): heavy client
// components (R3F scenes, CMA-ES worker, WASM demo, large data tables)
// are mounted only after their section nears the viewport (200px
// rootMargin). Placeholder heights prevent CLS. Above-the-fold content
// (Hero, navbar) is mounted eagerly.
export default function Page() {
  return (
    <MotionConfig reducedMotion="user">
      <ThreePatch>
        <MathProvider>
          <main id="main-content" className="relative min-h-screen">
            <Navbar />
            <div className="pt-16 pb-28 lg:pt-20 lg:pb-24">
              <Hero />
              <Section id="what-is-cmaes" title="What CMA-ES is and why anyone should care">
                <ViewportLazy minHeight={420}>
                  <CmaesIntro />
                </ViewportLazy>
              </Section>
              <Section id="no-gradients" title="When gradients disappear">
                <ViewportLazy minHeight={420}>
                  <NoGradientExamples />
                </ViewportLazy>
              </Section>
              <Section
                id="wing-walkthrough"
                title="A concrete CMA-ES walk-through: designing an airplane wing"
              >
                <ViewportLazy minHeight={420}>
                  <WingWalkthrough />
                </ViewportLazy>
              </Section>
              <Section id="engines" title="Two high-performance CMA-ES engines in Rust">
                <ViewportLazy minHeight={380}>
                  <OpenSourceEngines />
                </ViewportLazy>
              </Section>
              <Section id="live-demo" title="Live CMA-ES landscape explorer (TypeScript + WASM)">
                <ViewportLazy minHeight={420}>
                  <WasmDemo />
                </ViewportLazy>
              </Section>
              <Section id="internals" title="Inside the optimizer: covariance geometry in 3D">
                <ViewportLazy minHeight={420}>
                  <CmaesInternalsLab />
                </ViewportLazy>
              </Section>
              <Section
                id="robotics-flagships"
                title="Real-World Robotics: Whole-Body Humanoid & Articulated Arm"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-cyan-400/30 bg-slate-950/80 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-cyan-300">
                          5,040 Dimensions · Zero Gradients
                        </span>
                        <span className="text-xs font-mono text-slate-400">480 Hz Physics</span>
                      </div>
                      <h3 className="mt-4 text-xl font-bold text-white">Unitree G1 Whole-Body Walking Simulation</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">Watch a 29-DoF Unitree G1 humanoid optimize a 5,040-parameter locomotion policy live in your browser. Features whole-house 3D waypoint navigation across 7 rooms, zero-penetration collision detection, and ragdoll dragging.</p>
                      <ul className="mt-4 space-y-2 text-xs text-slate-400">
                        <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /><span>Whole-house multi-room waypoint navigation routes</span></li>
                        <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /><span>Touch & ragdoll dragging with continuous collision detection</span></li>
                        <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /><span>480 Hz articulated dynamics & terrain push balance recovery</span></li>
                      </ul>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs text-cyan-300 font-medium">Full Interactive Simulator</span>
                      <a href="/humanoid" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 px-4 py-2 text-xs font-bold uppercase tracking-wider text-cyan-200 hover:bg-cyan-500/30 transition-all hover:scale-105">Launch Humanoid Simulator →</a>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-orange-400/30 bg-slate-950/80 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-orange-300">128 Dimensions · Black-Box</span>
                        <span className="text-xs font-mono text-slate-400">90 Hz Contact</span>
                      </div>
                      <h3 className="mt-4 text-xl font-bold text-white">KUKA LBR iiwa 7 R800 Pick-and-Place</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">A source-bound 7-DoF KUKA LBR iiwa 7 R800 is optimized to reach, grasp, transport, and release objects in three reduced household scenes. Placement is accepted only when the collision receipt is clear.</p>
                      <ul className="mt-4 space-y-2 text-xs text-slate-400">
                        <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-orange-400" /><span>3D Coulomb friction cones & contact force verification</span></li>
                        <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-orange-400" /><span>KMR iiwa 4-mecanum mobile base navigation & 2D LiDAR raycasting</span></li>
                        <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-orange-400" /><span>Interactive 360° camera orbit & grasp microscope inspection</span></li>
                      </ul>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs text-orange-300 font-medium">Full Interactive Simulator</span>
                      <a href="/arm" className="inline-flex items-center gap-2 rounded-xl bg-orange-500/20 border border-orange-400/40 px-4 py-2 text-xs font-bold uppercase tracking-wider text-orange-200 hover:bg-orange-500/30 transition-all hover:scale-105">Launch Robot Arm Simulator →</a>
                    </div>
                  </div>
                </div>
              </Section>
              <Section id="hpo" title="Outer CMA-ES over 8 training hyperparameters (this site runs it client-side)">
                <ViewportLazy minHeight={480}><HpoTrainer /></ViewportLazy>
              </Section>
              <Section id="honesty" title="Honesty ledger: every physics claim traced to its source, test, citation, and bead">
                <ViewportLazy minHeight={420}><HonestyChipStack /></ViewportLazy>
              </Section>
              <Section id="kernel-summary" title="What the simulation kernel actually does (and doesn’t)">
                <ViewportLazy minHeight={420}><KernelSummary /></ViewportLazy>
              </Section>
              <Section id="technical-addendum" title="Technical addendum: what is really going on">
                <ViewportLazy minHeight={420}><TechnicalAddendum /></ViewportLazy>
              </Section>
              <Footer />
            </div>
          </main>
        </MathProvider>
      </ThreePatch>
    </MotionConfig>
  );
}
