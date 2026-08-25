"use client";

import { MathJax } from "better-react-mathjax";
import { CovarianceMinimap } from "./CovarianceMinimap";
import { PracticalPlaybook } from "./PracticalPlaybook";
import { DLHybrids } from "./DLHybrids";
import { CommunitySplit } from "./CommunitySplit";
import {
  Compass,
  Layers,
  Sparkles,
  ShieldCheck,
  TrendingDown,
  Activity,
  Cpu,
  RefreshCw,
  Sigma,
  BookOpen,
  ArrowRight
} from "lucide-react";

export function TechnicalAddendum() {
  return (
    <div className="space-y-16">
      {/* Intro to Theory */}
      <div className="prose-cmaes">
        <p className="text-lg text-slate-300 leading-relaxed font-normal">
          This technical addendum provides the rigorous mathematical foundations of CMA-ES, synthesized from
          Nikolaus Hansen and Anne Auger’s seminal publications, Akimoto et al.’s information-geometric natural
          gradient proofs, and practical production engineering considerations.
        </p>

        <blockquote className="border-l-4 border-sky-400 bg-slate-900/40 p-5 rounded-r-2xl my-6 text-slate-200 text-base md:text-lg italic leading-relaxed">
          &ldquo;CMA-ES is not an ad-hoc heuristic. It is the canonical, coordinate-invariant natural gradient
          step on the Riemannian manifold of multivariate Gaussian distributions.&rdquo;
        </blockquote>
      </div>

      {/* Chapter 1: The Maximum Entropy Distribution */}
      <div className="space-y-6">
        <div className="prose-cmaes">
          <h2>1. The Search Distribution as an Optimization Object</h2>
          <p>
            In classical optimization, one maintains a candidate point <MathJax inline>{"$x \\in \\mathbb{R}^n$"}</MathJax>.
            In CMA-ES, one maintains a parameterized probability density{" "}
            <MathJax inline>{"$P_\\theta(x)$"}</MathJax> on <MathJax inline>{"$\\mathbb{R}^n$"}</MathJax>, where{" "}
            <MathJax inline>{"$\\theta = \\{m, \\sigma, C\\}$"}</MathJax>:
          </p>

          <MathJax dynamic>
            {"$$x \\sim \\mathcal{N}(m, \\sigma^2 C) = m + \\sigma \\, \\mathcal{N}(0, C) = m + \\sigma \\, B D \\, \\mathcal{N}(0, I_n)$$"}
          </MathJax>

          <p>
            where:
          </p>
          <ul>
            <li><MathJax inline>{"$m \\in \\mathbb{R}^n$"}</MathJax> is the distribution mean (best estimate of optimum).</li>
            <li><MathJax inline>{"$\\sigma \\in \\mathbb{R}_+$"}</MathJax> is the global scale / step-size.</li>
            <li><MathJax inline>{"$C \\in \\mathbb{R}^{n \\times n}$"}</MathJax> is a symmetric, positive-definite covariance matrix (<MathJax inline>{"$C = B D^2 B^\\top$"}</MathJax>, where <MathJax inline>{"$B$"}</MathJax> is orthogonal and <MathJax inline>{"$D$"}</MathJax> is diagonal).</li>
          </ul>

          <p>
            <strong>Why a Gaussian?</strong> By the Principle of Maximum Entropy, the multivariate normal distribution is the unique distribution that maximizes information entropy for a specified mean and covariance matrix. It represents the <em>least committal prior</em> under second-order ignorance.
          </p>
        </div>

        <CovarianceMinimap />
      </div>

      {/* Chapter 2: Information Geometry & Natural Gradients */}
      <div className="prose-cmaes space-y-6">
        <h2>2. Information Geometry & The Sampled Natural Gradient</h2>

        <p>
          Suppose our objective is to maximize the expected fitness under the search distribution:
        </p>

        <MathJax dynamic>
          {"$$J(\\theta) = \\mathbb{E}_{x \\sim P_\\theta} [-f(x)] = \\int_{\\mathbb{R}^n} -f(x) \\, P_\\theta(x) \\, dx$$"}
        </MathJax>

        <p>
          Standard Euclidean steepest ascent on <MathJax inline>{"$\\nabla_\\theta J$"}</MathJax> depends arbitrarily on how we parameterize the distribution (e.g. Cholesky vs Eigendecomposition vs Matrix Logarithm).
        </p>

        <p>
          To achieve coordinate invariance, information geometry equips the statistical manifold with the <strong>Fisher Information Metric</strong>:
        </p>

        <MathJax dynamic>
          {"$$F(\\theta) = \\mathbb{E}_{x \\sim P_\\theta} \\left[ \\nabla_\\theta \\ln P_\\theta(x) \\, \\nabla_\\theta \\ln P_\\theta(x)^\\top \\right]$$"}
        </MathJax>

        <p>
          The canonical steepest ascent direction invariant to reparameterization is the <strong>Natural Gradient</strong>:
        </p>

        <MathJax dynamic>
          {"$$\\tilde{\\nabla}_\\theta J(\\theta) = F(\\theta)^{-1} \\nabla_\\theta J(\\theta)$$"}
        </MathJax>

        <p>
          Akimoto et al. and Ollivier et al. demonstrated that when rank-based weights <MathJax inline>{"$w_i$"}</MathJax> are substituted for raw fitness values <MathJax inline>{"$f(x_i)$"}</MathJax>, the CMA-ES mean and covariance updates correspond <em>identically</em> to a sampled natural gradient step on the Gaussian manifold!
        </p>
      </div>

      {/* Chapter 3: Cumulative Step-Size Adaptation (CSA) */}
      <div className="prose-cmaes space-y-6">
        <h2>3. Cumulative Step-Size Adaptation (CSA)</h2>

        <p>
          Adapting step-size <MathJax inline>{"$\\sigma$"}</MathJax> via standard 1/5th success rules fails in non-spherical landscapes. CMA-ES solves this by tracking an exponentially smoothed <strong>evolution path</strong> <MathJax inline>{"$p_\\sigma$"}</MathJax> in whitened coordinate space:
        </p>

        <MathJax dynamic>
          {"$$p_\\sigma^{(g+1)} = (1 - c_\\sigma) p_\\sigma^{(g)} + \\sqrt{c_\\sigma (2 - c_\\sigma) \\mu_{\\text{eff}}} \\, C^{(g)^{-1/2}} \\frac{m^{(g+1)} - m^{(g)}}{\\sigma^{(g)}}$$"}
        </MathJax>

        <p>
          Under random selection (a neutral fitness landscape), <MathJax inline>{"$p_\\sigma$"}</MathJax> behaves as a stationary Gaussian process with <MathJax inline>{"$p_\\sigma \\sim \\mathcal{N}(0, I_n)$"}</MathJax>. The expected length of a standard normal vector is:
        </p>

        <MathJax dynamic>
          {"$$\\mathbb{E}\\|\\mathcal{N}(0, I_n)\\| = \\sqrt{2}\\, \\frac{\\Gamma((n+1)/2)}{\\Gamma(n/2)} \\approx \\sqrt{n} \\left(1 - \\frac{1}{4n} + \\frac{1}{21n^2}\\right)$$"}
        </MathJax>

        <p>
          CSA compares the empirical path length <MathJax inline>{"$\\|p_\\sigma^{(g+1)}\\|$"}</MathJax> to its expectation under random selection:
        </p>

        <MathJax dynamic>
          {"$$\\sigma^{(g+1)} = \\sigma^{(g)} \\exp\\left( \\frac{c_\\sigma}{d_\\sigma} \\left( \\frac{\\|p_\\sigma^{(g+1)}\\|}{\\mathbb{E}\\|\\mathcal{N}(0, I_n)\\|} - 1 \\right) \\right)$$"}
        </MathJax>

        <ul>
          <li><strong>Consistently aligned steps:</strong> <MathJax inline>{"$\\|p_\\sigma\\| > \\mathbb{E}\\|\\mathcal{N}(0, I)\\|$"}</MathJax> <MathJax inline>{"$\\implies \\sigma$"}</MathJax> increases (accelerates across flat valleys).</li>
          <li><strong>Oscillating / Canceling steps:</strong> <MathJax inline>{"$\\|p_\\sigma\\| < \\mathbb{E}\\|\\mathcal{N}(0, I)\\|$"}</MathJax> <MathJax inline>{"$\\implies \\sigma$"}</MathJax> decreases (precision zoom into local minima).</li>
        </ul>
      </div>

      {/* Chapter 4: Covariance Adaptation Derivation */}
      <div className="prose-cmaes space-y-6">
        <h2>4. Covariance Matrix Adaptation (Rank-1 & Rank-µ Updates)</h2>

        <p>
          The full covariance update blends three distinct mechanisms:
        </p>

        <MathJax dynamic>
          {"$$C^{(g+1)} = (1 - c_1 - c_\\mu) C^{(g)} + c_1 \\underbrace{p_c^{(g+1)} {p_c^{(g+1)}}^\\top}_{\\text{Rank-1 update}} + c_\\mu \\underbrace{\\sum_{i=1}^{\\mu} w_i y_{i:\\lambda}^{(g+1)} {y_{i:\\lambda}^{(g+1)}}^\\top}_{\\text{Rank-}\\mu \\text{ update}} + \\underbrace{\\Delta C_{\\text{active}}}_{\\text{Active Negative Weights}}$$"}
        </MathJax>

        <p>
          where <MathJax inline>{"$y_{i:\\lambda} = (x_{i:\\lambda} - m^{(g)}) / \\sigma^{(g)}$"}</MathJax> and <MathJax inline>{"$p_c$"}</MathJax> is the cumulated evolution path in parameter coordinates:
        </p>

        <MathJax dynamic>
          {"$$p_c^{(g+1)} = (1 - c_c) p_c^{(g)} + h_\\sigma \\sqrt{c_c (2 - c_c) \\mu_{\\text{eff}}} \\, \\frac{m^{(g+1)} - m^{(g)}}{\\sigma^{(g)}}$$"}
        </MathJax>

        <ul>
          <li><strong>Rank-1 Update (<MathJax inline>{"$c_1$"}</MathJax>):</strong> Exploits correlations between consecutive generations. It acts like an online Principal Component Analysis (PCA) of the trajectory of the mean.</li>
          <li><strong>Rank-<MathJax inline>{"$\\mu$"}</MathJax> Update (<MathJax inline>{"$c_\\mu$"}</MathJax>):</strong> Exploits intra-generation variance among the top <MathJax inline>{"$\\mu$"}</MathJax> elite points in the current batch. Crucial for large populations.</li>
          <li><strong>Active CMA (<MathJax inline>{"$\\Delta C_{\\text{active}}$"}</MathJax>):</strong> Uses negative weights on the worst <MathJax inline>{"$\\mu$"}</MathJax> offspring to actively shrink variance along harmful directions.</li>
        </ul>
      </div>

      {/* Chapter 5: Invariance Properties */}
      <div className="prose-cmaes space-y-6">
        <h2>5. Fundamental Invariance Properties</h2>

        <p>
          A core reason CMA-ES is considered mathematically &ldquo;complete&rdquo; under black-box assumptions is its dual invariance:
        </p>

        <div className="grid gap-4 not-prose my-6 sm:grid-cols-2">
          <div className="glass-card p-5 border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-300">
              <ShieldCheck className="h-4 w-4" />
              <span>Order Invariance</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Invariance to strictly increasing transformations of the objective function:
            </p>
            <div className="font-mono text-xs text-sky-300 bg-slate-950/60 p-2 rounded-lg border border-white/5">
              <MathJax dynamic>{"$$\\forall g: \\mathbb{R} \\to \\mathbb{R}, \\quad g'(x) > 0 \\implies \\arg\\min f(x) = \\arg\\min (g \\circ f)(x)$$"}</MathJax>
            </div>
            <p className="text-[0.7rem] text-slate-400">
              Units, scalings, logarithmic rewards, or cutoff bounds do not alter the optimization trajectory in any way.
            </p>
          </div>

          <div className="glass-card p-5 border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
              <Compass className="h-4 w-4" />
              <span>Affine Coordinate Invariance</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Invariance to rigid linear transformations of the search space:
            </p>
            <div className="font-mono text-xs text-emerald-300 bg-slate-950/60 p-2 rounded-lg border border-white/5">
              <MathJax dynamic>{"$$y = A x + b, \\quad A \\in \\text{GL}(n, \\mathbb{R})$$"}</MathJax>
            </div>
            <p className="text-[0.7rem] text-slate-400">
              Rotating, translating, or scaling coordinates leaves the algorithm behavior invariant once covariance adapts.
            </p>
          </div>
        </div>
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
