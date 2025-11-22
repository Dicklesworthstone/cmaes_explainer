"use client";

import { MathJax } from "better-react-mathjax";

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
        choice there is <strong>CMA-ES</strong>, the Covariance Matrix Adaptation Evolution
        Strategy.
      </p>
      <p>
        CMA-ES is the gradient-free cousin of SGD: it turns “I can only evaluate this” into “I can
        walk toward a good solution.” It keeps a Gaussian search distribution over your parameters
        and keeps reshaping that Gaussian; the mean moves toward good regions, the covariance tilts
        and shrinks to match the landscape.
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
        derivative. Early rounds are wide and clumsy; later rounds are tight and aligned.
      </p>
      <p>
        The crucial thing is: <strong>CMA-ES only needs function evaluations.</strong> It never asks
        you for gradients, Jacobians, or any structural information about your model or simulator.
        That makes it an excellent default whenever evaluations are very expensive, the landscape is
        ugly (non-convex, multi-modal, ill-conditioned), and you don’t trust your intuition enough
        to hard-wire a better search strategy.
      </p>
    </div>
  );
}
