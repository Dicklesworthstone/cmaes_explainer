"use client";

import { MathJax } from "better-react-mathjax";

export function CmaesIntro() {
  return (
    <div className="prose-cmaes">
      <p>
        If you live anywhere near modern machine learning, “optimization” almost automatically
        means <em>gradients</em>. Adam, Adafactor, Lion, SGD with warm restarts—pick your favorite
        flavor, they are all dancing to the same tune: move parameters downhill along a gradient you
        can compute cheaply.
      </p>
      <p>
        But there is a big category of problems where the gradient either does not exist, is
        meaningless, or is so expensive to approximate that you might as well not bother. In that
        world—what people call <em>black-box optimization</em>—my favorite tool by a wide margin is
        <strong> CMA-ES</strong>, the Covariance Matrix Adaptation Evolution Strategy.
      </p>
      <p>
        Roughly speaking, CMA-ES does for nasty, opaque objective functions what gradient descent
        does for nice smooth ones: it gives you a principled way to turn “I can only evaluate this
        thing” into “I can reliably walk toward a good solution.” It keeps a
        <em> Gaussian search distribution</em> over your parameter space and iteratively morphs that
        Gaussian—its mean and its covariance—to concentrate probability mass where the objective
        looks good.
      </p>
      <p>
        Concretely, suppose you have some unknown function
      </p>
      <MathJax dynamic>{"$$f: \\mathbb{R}^n \to \\mathbb{R}$$"}</MathJax>
      <p>
        that you want to minimize. CMA-ES keeps track of a mean vector <MathJax inline>{"$m$"}</MathJax>,
        scalar step-size <MathJax inline>{"$\\sigma$"}</MathJax>, and covariance matrix
        <MathJax inline>{"$C$"}</MathJax>. Each generation it samples a small population
        <MathJax inline>{"$x_i \\sim \\mathcal{N}(m, \\sigma^2 C)$"}</MathJax>, evaluates your
        expensive black-box <MathJax inline>{"$f(x_i)$"}</MathJax>, ranks the samples, and nudges
        <MathJax inline>{"$m, \\sigma,$"}</MathJax> and <MathJax inline>{"$C$"}</MathJax> so the next
        Gaussian puts more probability where the good samples came from and less where the bad ones
        came from.
      </p>
      <p>
        Over time, the initially spherical Gaussian turns into a rotated, stretched ellipsoid that
        lines up with the valleys and ridges of your objective function. It is implicitly learning
        something like the local Hessian without ever seeing a derivative. Early on, samples are
        spread out, the covariance is mostly spherical, and the algorithm is groping in the dark. As
        evidence accumulates, the ellipsoid tilts, stretches, and shrinks, zooming in on promising
        regions.
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
