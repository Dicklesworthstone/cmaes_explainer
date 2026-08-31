import type { Metadata } from "next";
import Link from "next/link";
import { ArmPageClient } from "../components/ArmPageClient";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const metadata: Metadata = {
  title: "KUKA LBR iiwa 7 R800 Pick-and-Place — 128-D CMA-ES Simulation",
  description:
    "A source-bound KUKA LBR iiwa 7 R800 performs black-box pick-and-place: CMA-ES optimizes 128 joint-curve variables against a piecewise physical objective with contact, friction, collision envelopes, and hard limits.",
};

export default function ArmPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pt-16 pb-28 lg:pt-20 lg:pb-24">
        <section className="mx-auto max-w-4xl text-center">
          <span className="rounded-full border border-orange-300/25 bg-orange-500/10 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-orange-200">
            Black-box manipulation · grasp verified
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Teach a KUKA LBR iiwa 7 R800 to pick, carry, and place
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-400">
            Seven joint target curves plus one gripper-width curve, sampled at
            sixteen knots: 128 variables optimized against a piecewise physical
            objective that never leaks a gradient.
          </p>
        </section>

        <div className="mt-12">
          <ArmPageClient />
        </div>

        <section className="mx-auto mt-16 max-w-3xl space-y-6 text-sm leading-7 text-slate-300">
          <h2 className="font-display text-2xl font-bold text-white">Why 128 dimensions is the honest sweet spot</h2>
          <p>
            Seven joint target curves and one gripper-width curve are sampled at
            sixteen knots — 128 CMA-ES variables. The objective is assembled from
            a full LBR iiwa 7 R800 rollout with contact activation, static-slip friction
            capacity, free-space dynamics, release timing, hard limits, and an
            owner-routed obstacle/self/object separation — piecewise and
            black-box by construction. There is no browser-side gradient to
            hide behind, and the grasp is only claimed when the receipt verifies
            it.
          </p>
          <p>
            At 128 dimensions all four scalable representations (Full, Separable,
            LM-CMA, LM-MA) fit the honest browser envelope, so this section is
            where the family race is physically meaningful — Full CMA is
            pedagogically useful here and rightly refused for the 5,040-D
            humanoid walking problem.
          </p>
          <div className="pt-3 text-center">
            <Link
              className="text-sm font-semibold text-orange-300 hover:text-orange-200"
              href="/#internals"
            >
              Explore 3D Covariance Space →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
