"use client";

import { MathJax } from "better-react-mathjax";

export function TechnicalAddendum() {
  return (
    <div className="prose-cmaes">
      <p>
        This is the “OK, but show me the real math and design principles” section, distilled from
        Hansen & Auger’s long CMA-ES tutorial deck. The central abstraction is simple: you are not
        optimizing <MathJax inline>{"$f(x)$"}</MathJax> directly; you are optimizing a probability
        distribution over <MathJax inline>{"$x$"}</MathJax>.
      </p>

      <h3>The search distribution</h3>
      <p>
        CMA-ES maintains
        <MathJax inline>{"$x \\sim \\mathcal{N}(m, \\sigma^2 C)$"}</MathJax> with parameters mean
        <MathJax inline>{"$m$"}</MathJax>, scalar step size <MathJax inline>{"$\\sigma$"}</MathJax>,
        and covariance <MathJax inline>{"$C$"}</MathJax>. All adaptation happens in this distribution
        space, not directly in parameter space. The Gaussian is chosen because it is maximum entropy
        for a given variance, rotationally invariant when isotropic, and analytically convenient.
      </p>

      <h3>Invariance as a design principle</h3>
      <p>
        CMA-ES is rank-based: only the ordering of
        <MathJax inline>{"$f(x_i)$"}</MathJax> matters, so any strictly increasing transform of the
        objective leaves the trajectory unchanged. With full covariance adaptation it is also
        invariant to rigid linear transforms of the search space (rotations, reflections,
        translations). Those invariances make a single benchmark represent a whole equivalence class
        of problems.
      </p>

      <h3>Step-size control (CSA)</h3>
      <p>
        The evolution path <MathJax inline>{"$p_\\sigma$"}</MathJax> is an exponentially weighted sum
        of normalized mean shifts. Under pure random selection it behaves like a random walk with
        expected length <MathJax inline>{"$\\mathbb{E}|N(0,I)|$"}</MathJax>. CSA compares the empirical
        length to that expectation and updates
        <MathJax dynamic>{"$$\\sigma^{(g+1)} = \\sigma^{(g)} \\exp\\left(\\tfrac{c_\\sigma}{d_\\sigma} \\left( \\tfrac{|p_\\sigma^{(g+1)}|}{\\mathbb{E}|N(0,I)|} - 1 \\right) \\right).$$"}</MathJax>
        Long path → increase <MathJax inline>{"$\\sigma$"}</MathJax>; short path → decrease it.
      </p>

      <h3>Covariance adaptation</h3>
      <p>
        The covariance update blends three pieces:
      </p>
        <MathJax dynamic>{"$$C^{(g+1)} = (1 - c_1 - c_\\mu) C^{(g)} + c_1\\, p_c p_c^\\top + c_\\mu \\sum_{i=1}^{\\mu} w_i\\, y_{i:\\lambda} y_{i:\\lambda}^\\top$$"}</MathJax>
      <p>
        where <MathJax inline>{"$y_{i:\\lambda} = (x_{i:\\lambda} - m^{(g)})/\\sigma^{(g)}$"}</MathJax> are
        normalized steps of the top <MathJax inline>{"$\\mu$"}</MathJax> samples and
        <MathJax inline>{"$p_c$"}</MathJax> is a cumulated path of mean shifts. The rank‑1 term is an
        online PCA of where the mean has been moving; the rank‑
        <MathJax inline>{"$\\mu$"}</MathJax> term is a weighted covariance of successful steps. On a
        quadratic <MathJax inline>{"$f(x)=x^\\top H x$"}</MathJax> this drives
        <MathJax inline>{"$C \\propto H^{-1}$"}</MathJax>, i.e., it learns an inverse Hessian metric
        from zero‑order data.
      </p>

      <h3>Active covariance and rank‑µ</h3>
      <p>
        Using only the best steps is the standard rank‑
	        <MathJax inline>{"$\\mu$"}</MathJax> update. Active CMA adds negative weights for some of the
        worst samples to <em>shrink</em> variance along clearly bad directions, sharpening the short
        axes faster while keeping <MathJax inline>{"$C$"}</MathJax> positive definite.
      </p>

      <h3>Restarts for multimodality</h3>
      <p>
        Multimodal landscapes benefit from restarts. IPOP‑CMA‑ES grows the population size each
        restart for broader exploration; BIPOP alternates large and small populations so you sweep
        both global and local regimes without manual tuning.
      </p>

      <h3>Complexity and variants</h3>
      <p>
        Full CMA-ES costs <MathJax inline>{"$O(n^2)$"}</MathJax> per evaluation internally. That is
        negligible when each evaluation is a massive CFD/FEA run but expensive for cheap objectives
        in high dimensions. Diagonal (sep‑CMA‑ES) and limited‑memory (LM‑CMA) variants trade fidelity
        for <MathJax inline>{"$O(n)$"}</MathJax> or low‑rank scaling.
      </p>

      <h3>Big-picture summary</h3>
      <ul>
        <li>Multivariate normal search because it is the least committal distribution with a given variance.</li>
	        <li>Rank-based selection gives invariance to monotone transforms of <MathJax inline>{"$f$"}</MathJax>.</li>
	        <li>Step-size control via evolution paths yields near-optimal linear convergence rates.</li>
	        <li>Covariance adaptation learns a variable metric that approximates <MathJax inline>{"$H^{-1}$"}</MathJax> without gradients.</li>
      </ul>
      <p>
        Problems that were “impossible” for plain evolution strategies become solvable with orders of
        magnitude fewer evaluations once you add covariance adaptation and good step-size control.
      </p>
    </div>
  );
}
