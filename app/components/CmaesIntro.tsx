"use client";

import { MathJax } from "better-react-mathjax";
import { WhyILove } from "./WhyILove";

export function CmaesIntro() {
  return (
    <div className="prose-cmaes">
      <p>
        If you live anywhere near modern ML, “optimization” almost always means <em>gradients</em>.
        Adam, Adafactor, Lion, SGD with restarts; different knobs, same playbook: step downhill
        using cheap gradient estimates.
      </p>
      <p>
        There is a huge class where that trick fails: the gradient does not exist, is nonsense, or
        costs more to approximate than the underlying job. Call it black-box optimization. My first
        choice there is <strong>CMA-ES</strong>, the Covariance Matrix Adaptation Evolution Strategy
        — a rank-based, geometry-aware search that (as a sampled natural gradient step in
        distribution space) does the “right” update even when the landscape is ugly.
      </p>
      <p>
        CMA-ES is the gradient-free cousin of SGD: it turns “I can only evaluate this” into “I can
        walk toward a good solution.” It keeps a Gaussian search distribution over your parameters
        and keeps reshaping that Gaussian; the mean moves toward good regions, the covariance tilts
        and shrinks to match the landscape. Think of the glowing ellipsoid as an evolving prior over
        where good answers live.
      </p>
      <p>
        Concretely, suppose you have some unknown function
      </p>
      <MathJax dynamic>{"$$f: \\mathbb{R}^n \to \\mathbb{R}$$"}</MathJax>
      <p>
        that you want to minimize. CMA-ES keeps a mean vector <MathJax inline>{"$m$"}</MathJax>, a
        scalar step size <MathJax inline>{"$\\sigma$"}</MathJax>, and a covariance matrix
        <MathJax inline>{"$C$"}</MathJax>. Each round it samples a small population
        <MathJax inline>{"$x_i \\sim \\mathcal{N}(m, \\sigma^2 C)$"}</MathJax>, evaluates
        <MathJax inline>{"$f(x_i)$"}</MathJax>, ranks them, and nudges <MathJax inline>{"$m, \\sigma,$"}</MathJax>
        and <MathJax inline>{"$C$"}</MathJax> so the next Gaussian leans toward what worked.
      </p>
      <p>
        Over time the spherical Gaussian turns into a rotated, stretched ellipsoid that lines up
        with the valleys and ridges. It is quietly learning a Hessian proxy without a single
        derivative. Early rounds are wide and clumsy; later rounds are tight and aligned. On a
        quadratic, the covariance asymptotically tracks something proportional to the inverse
        Hessian — without ever seeing a derivative.
      </p>
      <p>
        The crucial thing is: <strong>CMA-ES only needs function evaluations.</strong> It never asks
        you for gradients, Jacobians, or any structural information about your model or simulator.
        That makes it an excellent default whenever evaluations are very expensive, the landscape is
        ugly (non-convex, multi-modal, ill-conditioned), and you don’t trust your intuition enough
        to hard-wire a better search strategy. Because it is rank-based and invariant to rigid
        linear transforms, unit choices and monotone hacks in your objective don’t throw it off.
      </p>
      <p>
        When to reach for it: mixed discrete/continuous knobs; hours-per-eval simulators; bumpy,
        noisy surfaces; tiny budgets where every evaluation must teach the optimizer something about
        geometry. When not to: cheap smooth objectives with gradients—just use SGD/Adam/L-BFGS—or
        thousand-dimensional cheap losses where a diagonal/LM variant is the right tool.
      </p>
      <p>
        Historical roots: evolution strategies in Germany (Rechenberg, Schwefel) leaned into Gaussian
        mutations and self-adapting strategy parameters; genetic algorithms leaned on crossover of
        bitstrings. CMA-ES took the ES branch and said “optimize the whole Gaussian,” landing next to
        estimation-of-distribution and cross-entropy methods—and philosophically close to kriging’s
        maximum-entropy prior that bends with data.
      </p>
      <p>
        A practical habit: normalize everything into a comparable box, even categories (carve the
        unit interval into sub-ranges and quantize back). CMA-ES remains happy because it only ever
        sees a vector in <MathJax inline>{"$\\mathbb{R}^n$"}</MathJax>; the encode/decode layer hides
        your real-world messiness.
      </p>
      <p>
        Encode/decode playbook: squash unbounded params with tanh/logit; reflect or clip at bounds;
        allocate sub-intervals of [0,1] to categories and quantize late; keep everything seeded so you
        can replay. This is the “normalize then decode” habit that makes CMA-ES plug into messy
        pipelines without bespoke math each time.
      </p>
      <div className="mt-4">
        <WhyILove />
      </div>
    </div>
  );
}
