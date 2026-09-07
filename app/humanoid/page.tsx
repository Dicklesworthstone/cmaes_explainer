import type { Metadata } from "next";
import Link from "next/link";
import { G1WalkingFlagship } from "../components/G1WalkingFlagship";
import { PolicyAblationComparison } from "../components/PolicyAblationComparison";
import { RealPhysicsResidual } from "../components/RealPhysicsResidual";
import { G1ResidualTrainer } from "../components/G1ResidualTrainer";
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
      <main className="mx-auto max-w-7xl px-6 pt-16 pb-28 lg:pt-20 lg:pb-24">
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
          aria-label="Action-causal transfer check: phase prior vs legacy transformer"
        >
          <h2 className="font-display text-2xl font-bold text-white">
            Two architectures on the same contract — phase prior vs transformer
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            The flagship above uses a 5,040-D linear residual policy on a
            hand-designed phase basis — a <em>strong, sample-efficient prior</em>.
            Beside it runs a 2.9M-parameter causal transformer on the same
            action-causal contract, where moving forward costs real actuator
            work. Its committed PPO+Muon run never learned — reward flat across
            all 60 iterations, checkpoint from iteration 0, and a policy head
            exported entirely zero, so it emitted no action at all. Rather than
            display that as a result, the shipped artifact keeps that trunk
            frozen, repairs its observation normalisation, and trains only the
            29×256 output layer — cloned from the CMA-ES gait, then searched
            against this environment&apos;s own reward — until it walks{" "}
            <strong>7.09 m</strong>, past the phase prior&apos;s 7.05 m at the
            same budget. The contract caps speed at 0.65 m/s, so 7.80 m is the
            most anything can travel here; give the 105-parameter prior three
            times the search and it reaches 7.29 m and leads again. Which
            architecture wins is a question about budget, not about
            architecture, and that is the point worth taking away. Artifacts
            remain under{" "}
            <code className="break-all">public/robots/g1/transformer/</code>.
          </p>
          <div className="mt-6">
            <PolicyAblationComparison />
          </div>
        </section>

        <section
          id="real-physics-residual"
          className="mx-auto mt-16 max-w-5xl"
          aria-label="Transformer residual measured on real G1 physics"
        >
          <h2 className="font-display text-2xl font-bold text-white">
            The same transformer, measured on the real robot
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Everything above is measured in the stand-in, and a stand-in whose
            forward speed is a formula can only ever settle an argument about
            the formula. So the same architecture was searched against the owner
            the flagship actually runs — articulated-body dynamics, real
            contact, and the identical objective CMA-ES minimises in the demo at
            the top of this page. The transformer contributes a residual on top
            of the tuned controller and its output layer starts at zero, so the
            search <em>begins</em> at that controller&apos;s exact behaviour and
            has to earn every step from there.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            The search itself is the thing this site is about: LM-CMA from{" "}
            <code>fs-dfo</code>, the same optimizer family the flagship offers,
            with IPOP restarts because a converged run spends its remaining
            budget standing still. A whole generation is one parallel batch
            across every core. That combination replaced a hand-rolled
            evolution strategy and moved the flat-ground result from a 45.8%
            improvement over the tuned controller to 191.5%, using a fifth of
            the wall-clock time.
          </p>
          <div className="mt-6">
            <RealPhysicsResidual />
          </div>
        </section>

        <section
          id="train-residual"
          className="mx-auto mt-16 max-w-5xl"
          aria-label="Train the transformer residual in this browser"
        >
          <h2 className="font-display text-2xl font-bold text-white">
            Now run that search yourself
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Everything above reports a search that already finished. This runs
            it here: the same LM-CMA over the same 960 parameters, against the
            same articulated-body physics and the same objective, in a worker on
            your machine. The kernel ships with SIMD enabled and the model is 64
            units wide and two layers deep, which is the whole reason a laptop
            suffices. It starts on flat ground, where the first improvement
            typically lands within about ten seconds and roughly forty rollouts;
            the harder cross-challenge run the figures above are measured on is
            one dropdown away. There is no fixed budget, so it keeps going until
            you stop it — on one laptop it passed{" "}
            <strong>120% better than the tuned controller</strong> inside two
            minutes — and the policy it finds downloads as an FSGT weights
            file. It is a 64-wide, two-layer model, so it is deliberately not
            interchangeable with the 256-wide artifact the comparison above
            loads; that loader pins its audited architecture and refuses
            anything else, which is the point of the audit. A run also survives
            a reload, and the policy fits in a link: only the 960 trained
            parameters travel, because the rest of the network is fixed by the
            kernel&apos;s own seed. They ride in the URL fragment, so the policy
            never reaches a server, and whoever opens it has the owner re-run it
            on their own machine before believing the number.
          </p>
          <div className="mt-6">
            <G1ResidualTrainer />
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
