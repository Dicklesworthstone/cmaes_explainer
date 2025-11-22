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

      <p>
        Another way to say it: you optimize the <em>distribution</em>, not individual points. That is
        why the algorithm stays stable under odd objective scalings and why the update lines up with a
        sampled natural gradient step on the manifold of Gaussians.
      </p>

      <p>
        Information-geometry lens: maximize expected fitness under a Gaussian while staying invariant
        to coordinate choices. The natural gradient with the Fisher metric gives exactly the CMA-ES
        mean/covariance updates (Akimoto et al.), making the algorithm more than a heuristic—it is the
        canonical move given “I search with a Gaussian.”
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

      <p>
        Practically this means you can change units, rotate the basis, or cobble together composite
        scores without breaking the optimizer’s intuition—it will relearn the metric on the fly.
      </p>

      <p>
        Kriging parallel: kriging builds the best linear unbiased predictor with a Gaussian process;
        CMA-ES builds the best-behaving Gaussian proposal it can from samples. Both start with
        maximum-entropy ignorance and let covariance carry the learning burden.
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

      <p>
        Active CMA layers in negative weights for clearly bad samples to shrink variance along harmful
        directions faster, sharpening the short axes while keeping <MathJax inline>{"$C$"}</MathJax>
        positive definite.
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

      <p>
        The effect is that you get global sweeps and local refinement without retuning a dozen knobs;
        it is a big part of why CMA-ES feels close to parameter-free in practice.
      </p>

      <h3>Complexity and variants</h3>
      <p>
        Full CMA-ES costs <MathJax inline>{"$O(n^2)$"}</MathJax> per evaluation internally. That is
        negligible when each evaluation is a massive CFD/FEA run but expensive for cheap objectives
        in high dimensions. Diagonal (sep‑CMA‑ES) and limited‑memory (LM‑CMA) variants trade fidelity
        for <MathJax inline>{"$O(n)$"}</MathJax> or low‑rank scaling.
      </p>

      <p>
        Rule of thumb: keep full covariance when each sample is precious and geometry learning pays
        for itself; drop to diagonal/LM when you are in thousands of dimensions with inexpensive
        evaluations.
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

      <h3>Why this matters beyond toy functions</h3>
      <p>
        The same machinery carries over to neural architecture search, physics sims, robotics
        controllers, and continuous cellular automata scored on “visual interestingness.” When the
        gradient is missing or misleading, CMA-ES turns scarce evaluations into a learned metric and a
        reliable walk toward good regions.
      </p>

      <h3>Where this came from</h3>
      <p>
        CMA-ES descends from the German evolution-strategies line (Rechenberg/Schwefel) and sits
        next to genetic algorithms: small populations, Gaussian mutations, self-adapting strategy
        parameters instead of crossover on bitstrings. The key leap was to treat the <em>search
        distribution</em> as the optimization object and let symmetry/invariance drive the design:
        start isotropic, learn anisotropy from data. That’s close in spirit to kriging/geostatistics:
        begin with a maximum-entropy prior, then bend it with evidence. It’s also kin to
        estimation-of-distribution and cross-entropy methods, all phrased as “fit a distribution to
        elites.”
      </p>

      <h3>Two communities that mostly ignore each other</h3>
      <p>
        There is a long-running black-box optimization community (GECCO and friends) with its own
        language, benchmarks, and heroes. The deep learning world (NeurIPS, ICML) often rediscovers the
        same ideas with new names. Projects like Le Jepa overlap with CMA-ES thinking, but the two ships
        still pass in the night. Bridging them is low-hanging fruit.
      </p>

      <h3>Why it still matters with modern AI</h3>
      <p>
        You can bolt CMA-ES onto things that have no clean gradients or where the gradients tell you the
        wrong story. Example: evolving continuous cellular automata for “visual interestingness” and
        spatial complexity; define a scalar score, wire up the parameters that drive your CA, and let the
        optimizer roam. The same pattern applies to neural architecture search, physics sims, robotics
        controllers, and any case where each evaluation is expensive but you still need to search.
      </p>
    </div>
  );
}
