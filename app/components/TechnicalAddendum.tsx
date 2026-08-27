"use client";

import { LatexRenderer } from "./LatexRenderer";
import { CovarianceMinimap } from "./CovarianceMinimap";
import { PracticalPlaybook } from "./PracticalPlaybook";
import { DLHybrids } from "./DLHybrids";
import { CommunitySplit } from "./CommunitySplit";
import { ColorizedEquation } from "./ColorizedEquation";
import { CMAES_EQUATIONS } from "../lib/cmaesEquations";
import {
  Compass,
  Layers,
  ShieldCheck,
  Cpu,
} from "lucide-react";

export function TechnicalAddendum() {
  return (
    <div className="space-y-16">
      {/* Intro to Theory */}
      <div className="prose-cmaes">
        <p className="text-lg text-slate-300 leading-relaxed font-normal">
          This technical addendum covers the mathematical foundations of CMA-ES, synthesized from
          Nikolaus Hansen and Anne Auger&apos;s foundational publications, Akimoto et al.&apos;s information-geometric natural
          gradient proofs, and practical production engineering considerations.
        </p>

        <p className="border-l-4 border-sky-400 bg-slate-900/40 p-5 rounded-r-2xl my-6 text-slate-200 text-base md:text-lg leading-relaxed">
          The thesis of this addendum: CMA-ES is no ad-hoc biological heuristic. Its core update is a
          coordinate-invariant natural gradient step on the Riemannian manifold of multivariate Gaussian distributions.
        </p>
      </div>

      {/* Chapter 1: The Maximum Entropy Distribution */}
      <div className="space-y-6">
        <div className="prose-cmaes">
          <h2>1. The Search Distribution as an Optimization Object</h2>
          <p>
            In classical optimization, one maintains a single candidate vector <LatexRenderer math="x \in \mathbb{R}^n" block={false} />.
            In CMA-ES, one maintains a parameterized probability density{" "}
            <LatexRenderer math="P_\theta(x)" block={false} /> on <LatexRenderer math="\mathbb{R}^n" block={false} />, where{" "}
            <LatexRenderer math="\theta = \{m, \sigma, C\}" block={false} />:
          </p>
        </div>

        {/* Colorized Equation 1: Sampling */}
        <ColorizedEquation equation={CMAES_EQUATIONS["cmaes-sampling"]} />

        <div className="prose-cmaes">
          <p>
            <strong>Why a Gaussian?</strong> By the Principle of Maximum Entropy, the multivariate normal distribution is the unique distribution that maximizes information entropy for a specified mean and covariance matrix. It represents the least committal prior under second-order ignorance.
          </p>
        </div>

        <CovarianceMinimap />
      </div>

      {/* Chapter 2: Information Geometry & Natural Gradients */}
      <div className="space-y-6">
        <div className="prose-cmaes">
          <h2>2. Information Geometry & The Sampled Natural Gradient</h2>

          <p>
            Suppose the objective is to maximize expected performance under the search distribution <LatexRenderer math="J(\theta) = \mathbb{E}_{x \sim P_\theta} [-f(x)]" block={false} />.
            Standard Euclidean steepest ascent on <LatexRenderer math="\nabla_\theta J" block={false} /> depends arbitrarily on how the distribution is parameterized (such as Cholesky vs eigendecomposition vs matrix logarithm).
          </p>

          <p>
            To achieve coordinate invariance, information geometry equips the statistical manifold with the <strong>Fisher Information Metric</strong>:
          </p>

          <p>
            The canonical steepest ascent direction invariant to reparameterization is the <strong>Natural Gradient</strong>:
          </p>
        </div>

        {/* Colorized Equation 6: Natural Gradient */}
        <ColorizedEquation equation={CMAES_EQUATIONS["cmaes-natural-gradient"]} />

        <div className="prose-cmaes">
          <p>
            Akimoto et al. and Ollivier et al. demonstrated that when rank-based weights <LatexRenderer math="w_i" block={false} /> are substituted for raw fitness values <LatexRenderer math="f(x_i)" block={false} />, the CMA-ES mean update and rank-μ covariance update correspond exactly to a sampled natural gradient step on the Gaussian manifold. The evolution paths, the rank-1 term, and step-size adaptation accumulate cross-generation history that lies outside this derivation.
          </p>
        </div>
      </div>

      {/* Chapter 3: Cumulative Step-Size Adaptation (CSA) */}
      <div className="space-y-6">
        <div className="prose-cmaes">
          <h2>3. Cumulative Step-Size Adaptation (CSA)</h2>

          <p>
            Adapting step size <LatexRenderer math="\sigma" block={false} /> via standard 1/5th success rules fails in non-spherical landscapes. CMA-ES tracks an exponentially smoothed <strong>evolution path</strong> <LatexRenderer math="p_\sigma" block={false} /> in whitened coordinate space:
          </p>
        </div>

        {/* Colorized Equation 3: CSA Path */}
        <ColorizedEquation equation={CMAES_EQUATIONS["cmaes-csa-path"]} />

        <div className="prose-cmaes space-y-4">
          <p>
            Under random selection in a neutral fitness landscape, <LatexRenderer math="p_\sigma" block={false} /> behaves as a stationary Gaussian process with <LatexRenderer math="p_\sigma \sim \mathcal{N}(0, I_n)" block={false} />. The expected length of a standard normal vector serves as the baseline:
          </p>
        </div>

        {/* Colorized Equation 11: Expected Chi Length */}
        <ColorizedEquation equation={CMAES_EQUATIONS["cmaes-expected-chi"]} />

        <div className="prose-cmaes space-y-4">
          <p>
            CSA compares the empirical path length <LatexRenderer math="\|p_\sigma^{(g+1)}\|" block={false} /> to its expectation under random selection:
          </p>
        </div>

        {/* Colorized Equation 4: Step-Size Update */}
        <ColorizedEquation equation={CMAES_EQUATIONS["cmaes-sigma-update"]} />

        <div className="prose-cmaes">
          <ul>
            <li><strong>Consistently aligned steps:</strong> <LatexRenderer math="\|p_\sigma\| > \mathbb{E}\|\mathcal{N}(0, I)\|" block={false} /> causes <LatexRenderer math="\sigma" block={false} /> to increase (accelerating across flat valleys).</li>
            <li><strong>Oscillating or canceling steps:</strong> <LatexRenderer math="\|p_\sigma\| < \mathbb{E}\|\mathcal{N}(0, I)\|" block={false} /> causes <LatexRenderer math="\sigma" block={false} /> to decrease (zooming in around local minima).</li>
          </ul>
        </div>
      </div>

      {/* Chapter 4: Covariance Adaptation Derivation */}
      <div className="space-y-6">
        <div className="prose-cmaes">
          <h2>4. Covariance Matrix Adaptation (Rank-1 & Rank-μ Updates)</h2>

          <p>
            The full covariance update blends historical memory, rank-1 momentum path <LatexRenderer math="p_c" block={false} />, rank-μ batch spread, and active negative updates:
          </p>
        </div>

        {/* Colorized Equation 5: Covariance Update */}
        <ColorizedEquation equation={CMAES_EQUATIONS["cmaes-covariance-update"]} />

        <div className="prose-cmaes">
          <p>
            where the rank-1 anisotropic evolution path <LatexRenderer math="p_c" block={false} /> accumulates momentum in parameter coordinates:
          </p>
        </div>

        {/* Colorized Equation 7: Rank-1 Anisotropic Path */}
        <ColorizedEquation equation={CMAES_EQUATIONS["cmaes-pc-path"]} />

        <div className="prose-cmaes">
          <ul>
            <li><strong>Rank-1 Update (<LatexRenderer math="c_1" block={false} />):</strong> Exploits correlations between consecutive generations. It acts like an online Principal Component Analysis (PCA) along the trajectory of the mean.</li>
            <li><strong>Rank-<LatexRenderer math="\mu" block={false} /> Update (<LatexRenderer math="c_\mu" block={false} />):</strong> Exploits intra-generation variance among the top <LatexRenderer math="\mu" block={false} /> elite points in the current batch; crucial for large parallel populations.</li>
            <li><strong>Active CMA (<LatexRenderer math="\Delta C_{\text{active}}" block={false} />):</strong> Uses negative weights on the worst-ranked offspring (ranks <LatexRenderer math="\mu + 1, \dots, \lambda" block={false} />) to shrink variance along harmful directions.</li>
          </ul>
        </div>
      </div>

      {/* Chapter 5: Invariance Properties */}
      <div className="space-y-6">
        <div className="prose-cmaes">
          <h2>5. Fundamental Invariance Properties</h2>

          <p>
            A central reason CMA-ES is so well-behaved under black-box assumptions is its dual invariance:
          </p>
        </div>

        {/* Colorized Equation 9: Monotone Rank Invariance */}
        <ColorizedEquation equation={CMAES_EQUATIONS["cmaes-rank-invariance"]} />

        {/* Colorized Equation 10: Affine Coordinate Invariance */}
        <ColorizedEquation equation={CMAES_EQUATIONS["cmaes-affine-invariance"]} />
      </div>

      {/* Chapter 6: Scalable covariance representations */}
      <div className="space-y-8">
        <div className="prose-cmaes">
          <h2>6. One update idea, four ways to remember shape</h2>

          <p>
            “CMA-ES” names a family. Every member samples a population, ranks it,
            moves the mean, and adapts a Gaussian search distribution. The important
            engineering choice is <strong>how much of that distribution&apos;s shape to remember</strong>.
            Remembering every pairwise coordinate interaction is powerful at modest dimension;
            at thousands of dimensions, the representation itself becomes the bottleneck.
          </p>

          <p>
            At <LatexRenderer math="n=5{,}040" block={false} />, one dense covariance matrix
            contains <LatexRenderer math="n^2=25{,}401{,}600" block={false} /> binary64 entries:
            about <strong>194 MiB for the matrix alone</strong>. A production full-covariance
            implementation also needs eigenvectors, transforms, and work buffers. The scalable
            variants spend less memory by making an explicit approximation about which
            correlations matter.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-sky-400/25 bg-sky-500/[0.06] p-5 space-y-3">
            <div className="flex items-center gap-3">
              <span className="rounded-xl border border-sky-400/25 bg-sky-400/10 p-2 text-sky-300">
                <Compass className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display font-bold text-white">Full CMA-ES</h3>
                <p className="text-[0.68rem] font-mono uppercase tracking-wider text-sky-300">
                  dense covariance · O(n²) state
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              Stores every variance and every pairwise correlation. It can rotate and stretch
              the search ellipsoid in any direction, retaining the family&apos;s strongest affine
              invariance. This is the reference-quality choice while dense linear algebra is
              affordable—not the honest default for a 5,040-D browser problem.
            </p>
          </article>

          <article className="rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.06] p-5 space-y-3">
            <div className="flex items-center gap-3">
              <span className="rounded-xl border border-emerald-400/25 bg-emerald-400/10 p-2 text-emerald-300">
                <Layers className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display font-bold text-white">sep-CMA-ES</h3>
                <p className="text-[0.68rem] font-mono uppercase tracking-wider text-emerald-300">
                  diagonal covariance · O(n) state
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              Keeps one learned scale per coordinate and deliberately drops off-diagonal
              correlations. Sampling and adaptation become linear in dimension. It is excellent
              when the chosen coordinates already expose useful axes, but a rotated valley can
              remain difficult because diagonal memory is not rotationally invariant.
            </p>
          </article>

          <article className="rounded-2xl border border-violet-400/25 bg-violet-500/[0.06] p-5 space-y-3">
            <div className="flex items-center gap-3">
              <span className="rounded-xl border border-violet-400/25 bg-violet-400/10 p-2 text-violet-300">
                <Cpu className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display font-bold text-white">LM-CMA</h3>
                <p className="text-[0.68rem] font-mono uppercase tracking-wider text-violet-300">
                  m direction pairs · O(mn) state
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              Replaces the dense transform with a limited history of informative search
              directions. Applying that implicit transform costs
              <LatexRenderer math="O(mn)" block={false} />, where
              <LatexRenderer math="m \ll n" block={false} /> is the memory budget. It can retain
              selected cross-coordinate structure that sep-CMA discards without ever allocating
              a dense covariance matrix.
            </p>
          </article>

          <article className="rounded-2xl border border-amber-400/25 bg-amber-500/[0.06] p-5 space-y-3">
            <div className="flex items-center gap-3">
              <span className="rounded-xl border border-amber-400/25 bg-amber-400/10 p-2 text-amber-300">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display font-bold text-white">LM-MA-ES</h3>
                <p className="text-[0.68rem] font-mono uppercase tracking-wider text-amber-300">
                  limited matrix adaptation · O(mn) state
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              Maintains a short cascade of evolution directions that acts directly as a
              limited-memory sampling transform. It targets the same large-scale regime as
              LM-CMA with a compact matrix-adaptation rule. Its approximation is different,
              so the site reports the selected variant instead of presenting both as one
              interchangeable “low-rank CMA.”
            </p>
          </article>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/45">
          <table className="w-full min-w-[760px] text-left text-sm">
            <caption className="sr-only">
              Comparison of covariance representations used by four CMA-ES variants
            </caption>
            <thead className="border-b border-white/10 bg-white/[0.035] text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th scope="col" className="px-5 py-4">Variant</th>
                <th scope="col" className="px-5 py-4">What it learns</th>
                <th scope="col" className="px-5 py-4">State</th>
                <th scope="col" className="px-5 py-4">Per-sample transform</th>
                <th scope="col" className="px-5 py-4">Important tradeoff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.07] text-slate-300">
              <tr>
                <th scope="row" className="px-5 py-4 font-semibold text-sky-300">Full</th>
                <td className="px-5 py-4">All pairwise correlations</td>
                <td className="px-5 py-4 font-mono">O(n²)</td>
                <td className="px-5 py-4 font-mono">O(n²)</td>
                <td className="px-5 py-4">Best geometric fidelity; dense factorization dominates at scale</td>
              </tr>
              <tr>
                <th scope="row" className="px-5 py-4 font-semibold text-emerald-300">sep</th>
                <td className="px-5 py-4">One scale per coordinate</td>
                <td className="px-5 py-4 font-mono">O(n)</td>
                <td className="px-5 py-4 font-mono">O(n)</td>
                <td className="px-5 py-4">Fastest representation; coordinate rotation can hide structure</td>
              </tr>
              <tr>
                <th scope="row" className="px-5 py-4 font-semibold text-violet-300">LM-CMA</th>
                <td className="px-5 py-4">A limited history of useful directions</td>
                <td className="px-5 py-4 font-mono">O(mn)</td>
                <td className="px-5 py-4 font-mono">O(mn)</td>
                <td className="px-5 py-4">Recovers selected correlations; quality depends on memory budget</td>
              </tr>
              <tr>
                <th scope="row" className="px-5 py-4 font-semibold text-amber-300">LM-MA</th>
                <td className="px-5 py-4">A cascade of matrix-adaptation directions</td>
                <td className="px-5 py-4 font-mono">O(mn)</td>
                <td className="px-5 py-4 font-mono">O(mn)</td>
                <td className="px-5 py-4">Large-scale implicit geometry with a distinct update rule</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm leading-relaxed text-slate-400">
          The right comparison is empirical: equal objective-evaluation budgets, identical seeds
          where the sampling contracts permit it, and explicit memory/time receipts. The explorer
          therefore treats <strong className="text-slate-200">variant</strong> as visible optimizer
          state—not a hidden automatic “performance” switch.
        </p>

        <p className="text-xs leading-relaxed text-slate-500">
          Primary references: Hansen&apos;s{" "}
          <a
            className="text-sky-300 underline decoration-sky-400/40 underline-offset-4 hover:text-sky-200"
            href="https://cma-es.github.io/cmaes_sourcecode_page.html"
            target="_blank"
            rel="noreferrer"
          >
            reference implementations and bibliography
          </a>
          , Loshchilov&apos;s{" "}
          <a
            className="text-violet-300 underline decoration-violet-400/40 underline-offset-4 hover:text-violet-200"
            href="https://arxiv.org/abs/1404.5520"
            target="_blank"
            rel="noreferrer"
          >
            LM-CMA
          </a>
          , and Loshchilov, Glasmachers, and Beyer&apos;s{" "}
          <a
            className="text-amber-300 underline decoration-amber-400/40 underline-offset-4 hover:text-amber-200"
            href="https://arxiv.org/abs/1705.06693"
            target="_blank"
            rel="noreferrer"
          >
            LM-MA-ES
          </a>
          .
        </p>
      </div>

      {/* Practical Playbook Integration */}
      <PracticalPlaybook />

      {/* Deep Learning & Creative Hybrids */}
      <DLHybrids />

      {/* Community Split */}
      <CommunitySplit />
    </div>
  );
}
