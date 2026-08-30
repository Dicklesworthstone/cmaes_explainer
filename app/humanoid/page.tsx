import type { Metadata } from "next";
import Link from "next/link";
import { G1WalkingFlagship } from "../components/G1WalkingFlagship";
import { PolicyAblationComparison } from "../components/PolicyAblationComparison";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const metadata: Metadata = {
  title: "Unitree G1 Humanoid Walking — 5,040-D CMA-ES Simulation",
  description:
    "Watch a source-bound Unitree G1 model learn to walk: CMA-ES optimizes a 5,040-parameter policy inside a 29-DoF articulated-dynamics kernel.",
};

const OWNER_LAYERS = [
  {
    label: "Physical plant",
    value: "29 source joints",
    detail:
      "All leg, waist, and arm bodies carry the pinned mode-11 inertias, joint axes, and hard limits.",
  },
  {
    label: "Learned controller",
    value: "15 × 42 × 8",
    detail:
      "Fifteen locomotion rows multiply 42 physical signals by eight periodic basis terms: 5,040 weights.",
  },
  {
    label: "Disclosed reflex",
    value: "14 arm joints",
    detail:
      "The arms add real mass and reaction forces while a deterministic swing-and-balance reflex drives them.",
  },
] as const;

export default function HumanoidPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-10">
        <section className="mx-auto max-w-4xl text-center">
          <span className="rounded-full border border-cyan-300/25 bg-sky-500/10 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-cyan-200">
            Live physics · zero gradients
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Teach a whole-body G1 model to walk
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-400">
            Twenty-nine source actuators, 480&nbsp;Hz articulated dynamics, and
            5,040 learned locomotion weights — optimized live in your browser by
            CMA-ES with no gradient ever computed.
          </p>
        </section>

        <section
          className="mx-auto mt-10 grid max-w-5xl gap-3 md:grid-cols-3"
          aria-label="Simulation ownership layers"
        >
          {OWNER_LAYERS.map((layer) => (
            <article
              key={layer.label}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"
            >
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-cyan-300">
                {layer.label}
              </p>
              <p className="mt-2 font-mono text-lg text-white">{layer.value}</p>
              <p className="mt-3 text-xs leading-5 text-slate-400">
                {layer.detail}
              </p>
            </article>
          ))}
        </section>

        <div className="mt-12">
          <G1WalkingFlagship />
         </div>
        <section
          id="ablation"
          className="mx-auto mt-16 max-w-5xl"
          aria-label="Policy architecture ablation: phase prior vs learned-from-scratch"
        >
          <h2 className="font-display text-2xl font-bold text-white">
            Phase prior vs learned-from-scratch transformer — same experiment
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            The flagship above uses a 5,040-D linear residual policy on a
            hand-designed phase basis — a <em>strong, sample-efficient prior</em>.
            The honest counterfactual is to learn the same task from scratch
            with a causal transformer trained by PPO+Muon. The component below
            reports <em>measured</em> receipts on the same disclosed
            stepwise experiment: the transformer side runs real trained
            weights (exported from the sibling{" "}
            <code className="break-all">fs-g1-train</code> crate — see{" "}
            <code className="break-all">public/robots/g1/transformer/</code>) with
            in-browser inference, while the CMA-ES side is searched live in
            this browser under your selected seed. Neither side is
            synthesized; every number is a measurement.
          </p>
          <div className="mt-6">
            <PolicyAblationComparison />
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-3xl space-y-6 text-sm leading-7 text-slate-300">
          <h2 className="font-display text-2xl font-bold text-white">
            What this simulation actually does
          </h2>
          <p>
            Every candidate policy is a vector of{" "}
            <strong>5,040 learned weights</strong>: 15 lower-body and waist
            actuators each read 42 physical signals through 8 gait-phase basis
            terms (15 × 42 × 8 = 5,040). The policy outputs bounded residual
            efforts; an articulated multibody kernel with SE(3) integration,
            contact, and friction integrates all 29 source joints at a fixed
            timestep — the same 1.5-second, 720-step experiment for every
            candidate and for the winner you watch.
          </p>
          <p>
            CMA-ES never sees derivatives. It samples a population from a
            Gaussian search distribution, scores each walk (upright distance,
            foot contact schedule adherence, energy, and hard guards for falls
            and joint limits), then reshapes its covariance toward the
            successful candidates. Full CMA-ES is refused above 256 dimensions
            because a dense 5,040² covariance would need 25,401,600 entries; the
            live flagship therefore uses the separable and limited-memory
            variants you can compare directly.
          </p>
          <p>
            The source boundary is precise. Frankensim transcribes
            Unitree&apos;s current 29-DoF mode-11 description; the Three.js
            scene projects the 30 emitted world-from-link poses and never
            recomputes robot kinematics. The fixed head and hand shells are
            visual geometry. This remains a deterministic explainer, not a
            validated hardware controller or sim-to-real result. See the{" "}
            <a
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-4"
              href="https://github.com/unitreerobotics/unitree_ros/blob/master/robots/g1_description/README.md"
            >
              official model guide
            </a>{" "}
            and its{" "}
            <a
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-4"
              href="https://github.com/unitreerobotics/unitree_ros/blob/master/robots/g1_description/g1_29dof_mode_11.urdf"
            >
              mode-11 URDF
            </a>
            .
          </p>
          <div className="pt-3 text-center">
            <Link
              className="text-sm font-semibold text-cyan-300 hover:text-cyan-200"
              href="/#engines"
            >
              Continue to the CMA-ES family explainer →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
