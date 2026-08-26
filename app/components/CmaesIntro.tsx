"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { MathJax } from "better-react-mathjax";
import { WhyILove } from "./WhyILove";
import {
  Sparkles,
  Sliders,
  RotateCw,
  Compass,
  ArrowRight,
  TrendingDown,
  Layers,
  Activity,
  Check
} from "lucide-react";
import { eigen2x2, sampleGaussian } from "../lib/cmaesEngine";

interface InteractiveSample {
  x: number;
  y: number;
  fitness: number;
  rank: number;
  isElite: boolean;
}

/**
 * 2D Interactive Gaussian Search Distribution Sandbox:
 * Allows the learner to manually manipulate the mean, covariance eigenvalues,
 * rotation angle, and step-size to visually understand how N(m, sigma^2 C) operates.
 */
function GaussianDistributionSandbox() {
  const [meanX, setMeanX] = useState(0.8);
  const [meanY, setMeanY] = useState(1.1);
  const [sigma, setSigma] = useState(0.55);
  const [eigenRatio, setEigenRatio] = useState(3.2); // Anisotropy ratio (lambda_1 / lambda_2)
  const [angleDeg, setAngleDeg] = useState(35); // Degrees
  const [sampleCount, setSampleCount] = useState(16);
  const [eliteFraction, setEliteFraction] = useState(0.4);
  const [isDragging, setIsDragging] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handlePointerPos = (clientX: number, clientY: number, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;
    const DOMAIN = 2.4;
    const x = Math.max(-DOMAIN, Math.min(DOMAIN, (px / rect.width) * (2 * DOMAIN) - DOMAIN));
    const y = Math.max(-DOMAIN, Math.min(DOMAIN, ((rect.height - py) / rect.height) * (2 * DOMAIN) - DOMAIN));
    setMeanX(parseFloat(x.toFixed(2)));
    setMeanY(parseFloat(y.toFixed(2)));
  };

  // Curved valley objective function: f(x, y) = 10*(y - x^2)^2 + (1 - x)^2
  const objective = (x: number, y: number) => 10 * Math.pow(y - x * x, 2) + Math.pow(1 - x, 2);

  // Generate samples from N(m, sigma^2 C)
  const { samples, eliteMean, covarianceMatrix } = useMemo(() => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const l1 = eigenRatio * 0.5;
    const l2 = 0.5;
    const s1 = Math.sqrt(l1) * sigma;
    const s2 = Math.sqrt(l2) * sigma;

    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);

    // Covariance matrix C = R * diag(l1, l2) * R^T
    const c00 = cosA * cosA * l1 + sinA * sinA * l2;
    const c01 = cosA * sinA * (l1 - l2);
    const c11 = sinA * sinA * l1 + cosA * cosA * l2;

    const pts: InteractiveSample[] = [];
    for (let i = 0; i < sampleCount; i++) {
      const z0 = sampleGaussian();
      const z1 = sampleGaussian();

      // Transform by sqrt(C) * sigma
      const lx = z0 * s1;
      const ly = z1 * s2;

      // Rotate and shift by mean
      const px = meanX + (lx * cosA - ly * sinA);
      const py = meanY + (lx * sinA + ly * cosA);

      const f = objective(px, py);
      pts.push({ x: px, y: py, fitness: f, rank: 0, isElite: false });
    }

    // Rank samples
    pts.sort((a, b) => a.fitness - b.fitness);
    const mu = Math.max(1, Math.floor(sampleCount * eliteFraction));
    let sumEx = 0;
    let sumEy = 0;
    let sumW = 0;

    pts.forEach((p, idx) => {
      p.rank = idx + 1;
      if (idx < mu) {
        p.isElite = true;
        const w = Math.log(mu + 0.5) - Math.log(idx + 1);
        sumEx += p.x * w;
        sumEy += p.y * w;
        sumW += w;
      }
    });

    const newMean: [number, number] = [sumEx / sumW, sumEy / sumW];

    return {
      samples: pts,
      eliteMean: newMean,
      covarianceMatrix: [
        [c00, c01],
        [c01, c11]
      ]
    };
  }, [meanX, meanY, sigma, eigenRatio, angleDeg, sampleCount, eliteFraction]);

  // Render contour plot, Gaussian confidence ellipses, samples, and mean shift
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const DOMAIN = 2.4;

    const toPxX = (x: number) => ((x + DOMAIN) / (2 * DOMAIN)) * W;
    const toPxY = (y: number) => H - ((y + DOMAIN) / (2 * DOMAIN)) * H;
    const toCoordX = (px: number) => (px / W) * (2 * DOMAIN) - DOMAIN;
    const toCoordY = (py: number) => ((H - py) / H) * (2 * DOMAIN) - DOMAIN;

    ctx.clearRect(0, 0, W, H);

    // Draw objective function background heatmap
    const imgData = ctx.createImageData(W, H);
    for (let py = 0; py < H; py += 2) {
      const y = toCoordY(py);
      for (let px = 0; px < W; px += 2) {
        const x = toCoordX(px);
        const f = objective(x, y);
        const norm = Math.tanh(f / 8);

        // Dark navy to deep cyan/blue gradient
        const r = Math.floor(10 + 20 * norm);
        const g = Math.floor(25 + 60 * (1 - norm));
        const b = Math.floor(45 + 110 * (1 - norm));

        for (let dy = 0; dy < 2; dy++) {
          for (let dx = 0; dx < 2; dx++) {
            const idx = ((py + dy) * W + (px + dx)) * 4;
            imgData.data[idx] = r;
            imgData.data[idx + 1] = g;
            imgData.data[idx + 2] = b;
            imgData.data[idx + 3] = 255;
          }
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let gx = -2; gx <= 2; gx += 1) {
      ctx.moveTo(toPxX(gx), 0);
      ctx.lineTo(toPxX(gx), H);
    }
    for (let gy = -2; gy <= 2; gy += 1) {
      ctx.moveTo(0, toPxY(gy));
      ctx.lineTo(W, toPxY(gy));
    }
    ctx.stroke();

    // Draw valley path contour
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let x = -2; x <= 2; x += 0.05) {
      const y = x * x;
      if (x === -2) ctx.moveTo(toPxX(x), toPxY(y));
      else ctx.lineTo(toPxX(x), toPxY(y));
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw 1-sigma, 2-sigma, 3-sigma Gaussian confidence ellipses
    const angleRad = (angleDeg * Math.PI) / 180;
    const l1 = eigenRatio * 0.5;
    const l2 = 0.5;
    const s1 = Math.sqrt(l1) * sigma * (W / (2 * DOMAIN));
    const s2 = Math.sqrt(l2) * sigma * (H / (2 * DOMAIN));

    const cx = toPxX(meanX);
    const cy = toPxY(meanY);

    [1, 2].forEach((k) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-angleRad); // Canvas y is inverted

      ctx.strokeStyle = k === 1 ? "rgba(56, 189, 248, 0.85)" : "rgba(56, 189, 248, 0.3)";
      ctx.lineWidth = k === 1 ? 2 : 1;
      ctx.fillStyle = k === 1 ? "rgba(14, 165, 233, 0.08)" : "transparent";

      ctx.beginPath();
      ctx.ellipse(0, 0, s1 * k, s2 * k, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Principal Axes (for 1-sigma)
      if (k === 1) {
        ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
        ctx.beginPath();
        ctx.moveTo(-s1, 0);
        ctx.lineTo(s1, 0);
        ctx.moveTo(0, -s2);
        ctx.lineTo(0, s2);
        ctx.stroke();
      }

      ctx.restore();
    });

    // Draw Mean Shift Vector (Delta m)
    const emX = toPxX(eliteMean[0]);
    const emY = toPxY(eliteMean[1]);

    ctx.strokeStyle = "rgba(52, 211, 153, 0.9)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(emX, emY);
    ctx.stroke();

    // Arrowhead for mean shift
    const arrowAng = Math.atan2(emY - cy, emX - cx);
    const ahLen = 8;
    ctx.fillStyle = "#34d399";
    ctx.beginPath();
    ctx.moveTo(emX, emY);
    ctx.lineTo(
      emX - ahLen * Math.cos(arrowAng - Math.PI / 6),
      emY - ahLen * Math.sin(arrowAng - Math.PI / 6)
    );
    ctx.lineTo(
      emX - ahLen * Math.cos(arrowAng + Math.PI / 6),
      emY - ahLen * Math.sin(arrowAng + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();

    // Draw Samples
    samples.forEach((s) => {
      const px = toPxX(s.x);
      const py = toPxY(s.y);

      if (s.isElite) {
        // Glowing Gold/Emerald for Elites
        ctx.fillStyle = "#34d399";
        ctx.shadowColor = "#34d399";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        // Cyan/Dim for non-elites
        ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Current Mean Point
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // New Proposed Elite Mean Point
    ctx.fillStyle = "#34d399";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(emX, emY, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }, [meanX, meanY, sigma, eigenRatio, angleDeg, samples, eliteMean]);

  return (
    <div className="glass-card p-6 my-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Interactive 2D Gaussian Search Distribution
            </h3>
            <p className="text-xs text-slate-400">
              Drag parameters to see how the Gaussian distribution samples candidates and moves toward elite points
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
            <Sparkles className="h-3 w-3" /> Live Recombination
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] items-start">
        {/* Canvas Stage */}
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#030712] shadow-2xl">
            <canvas
              ref={canvasRef}
              width={540}
              height={380}
              className="w-full h-auto block cursor-crosshair touch-none select-none"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                setIsDragging(true);
                handlePointerPos(e.clientX, e.clientY, e.currentTarget);
              }}
              onPointerMove={(e) => {
                if (isDragging) {
                  handlePointerPos(e.clientX, e.clientY, e.currentTarget);
                }
              }}
              onPointerUp={(e) => {
                setIsDragging(false);
                try {
                  e.currentTarget.releasePointerCapture(e.pointerId);
                } catch {}
              }}
              onPointerCancel={() => setIsDragging(false)}
            />

            {/* Click/Drag hint overlay */}
            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[0.68rem] text-slate-300 font-mono pointer-events-none">
              Click or drag to relocate Mean m
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-white/5 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white border border-sky-500" />
              <span>Current Mean m⁽ᵍ⁾</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Top μ Elites</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white" />
              <span>Next Mean m⁽ᵍ⁺¹⁾</span>
            </div>
          </div>
        </div>

        {/* Sliders & Parameters Column */}
        <div className="space-y-4">
          <div className="bg-slate-950/40 rounded-2xl p-5 border border-white/5 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-sky-400" /> Gaussian Geometry Controls
              </span>
              <span className="text-[0.7rem] text-slate-500 font-mono">2D Space</span>
            </div>

            {/* Step Size Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Step Size ($\sigma$)</span>
                <span className="text-sky-300 font-mono bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  {sigma.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={0.2}
                max={1.2}
                step={0.02}
                value={sigma}
                onChange={(e) => setSigma(parseFloat(e.target.value))}
                className="w-full accent-sky-400"
              />
              <p className="text-[0.68rem] text-slate-500">Controls overall scale of exploration.</p>
            </div>

            {/* Anisotropy (Eigenvalue Ratio) */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Covariance Ratio ($\lambda_1 / \lambda_2$)</span>
                <span className="text-purple-300 font-mono bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  {eigenRatio.toFixed(1)} : 1
                </span>
              </div>
              <input
                type="range"
                min={1.0}
                max={6.0}
                step={0.1}
                value={eigenRatio}
                onChange={(e) => setEigenRatio(parseFloat(e.target.value))}
                className="w-full accent-purple-400"
              />
              <p className="text-[0.68rem] text-slate-500">
                1.0 = Isotropic circle; higher = elongated ellipsoid aligned with valley.
              </p>
            </div>

            {/* Rotation Angle */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Principal Orientation ($\theta$)</span>
                <span className="text-amber-300 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {angleDeg}°
                </span>
              </div>
              <input
                type="range"
                min={-90}
                max={90}
                step={1}
                value={angleDeg}
                onChange={(e) => setAngleDeg(parseInt(e.target.value, 10))}
                className="w-full accent-amber-400"
              />
              <p className="text-[0.68rem] text-slate-500">
                Eigenvector rotation aligning with objective contours.
              </p>
            </div>

            {/* Population Size Lambda */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Population Size ($\lambda$)</span>
                <span className="text-emerald-300 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {sampleCount} samples
                </span>
              </div>
              <input
                type="range"
                min={8}
                max={32}
                step={2}
                value={sampleCount}
                onChange={(e) => setSampleCount(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-400"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-sky-950/30 to-indigo-950/20 border border-sky-500/20 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-sky-200 uppercase tracking-wide">
              <Activity className="h-3.5 w-3.5 text-cyan-400" />
              <span>What this demonstrates</span>
            </div>
            <p className="leading-relaxed">
              Notice the <strong className="text-emerald-300">green arrow</strong>: because the top{" "}
              $\mu$ samples are concentrated downhill in the valley, the weighted mean shift{" "}
              $\Delta m$ automatically steers the center of probability mass toward the minimum—without computing a single derivative!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CmaesIntro() {
  return (
    <div className="space-y-10">
      <div className="prose-cmaes">
        <p className="text-xl text-slate-200 leading-relaxed font-normal">
          If you live anywhere near modern machine learning, “optimization” almost automatically means{" "}
          <em className="text-sky-300 font-semibold not-italic">gradients</em>. Adam, Adafactor, Lion,
          SGD with cosine schedules—they all dance to the same tune: evaluate cheap backprop derivatives
          and step downhill.
        </p>

        <p>
          But in the broader world of engineering, robotics, and scientific computing, there is a vast
          territory where <strong>gradients either do not exist, are complete fiction, or cost hours of compute per point</strong>.
          In that world—known as <em>black-box optimization</em>—my favorite tool by a wide margin is{" "}
          <strong className="text-sky-200 font-semibold">CMA-ES</strong> (Covariance Matrix Adaptation Evolution Strategy).
        </p>

        <p>
          Roughly speaking, CMA-ES does for nasty, opaque, non-differentiable objective functions what
          gradient descent does for smooth ones: it gives you a principled, invariant, data-efficient way
          to turn “I can only evaluate this system” into “I can reliably walk straight into the optimal region.”
        </p>
      </div>

      {/* Interactive Exploration Sandbox */}
      <GaussianDistributionSandbox />

      <div className="prose-cmaes space-y-6">
        <h2>The Core Mathematical Philosophy</h2>

        <p>
          At its foundation, CMA-ES operates under a radically elegant abstraction:
        </p>

        <blockquote className="border-l-4 border-sky-400 bg-slate-900/40 p-5 rounded-r-2xl my-6 text-slate-200 text-base md:text-lg italic leading-relaxed">
          &ldquo;You do not optimize a point in parameter space. You optimize a <strong>probability distribution</strong> over parameter space, and continuously reshape that distribution to concentrate probability mass where outcomes are best.&rdquo;
        </blockquote>

        <p>
          Concretely, suppose you have an unknown objective function:
        </p>

        <MathJax dynamic>{"$$f: \\mathbb{R}^n \\to \\mathbb{R}$$"}</MathJax>

        <p>
          that you wish to minimize. You provide CMA-ES with the dimension <MathJax inline>{"$n$"}</MathJax>,
          an initial guess for the mean <MathJax inline>{"$m^{(0)}$"}</MathJax>, and an initial step size{" "}
          <MathJax inline>{"$\\sigma^{(0)}$"}</MathJax>.
        </p>

        <p>
          In every generation <MathJax inline>{"$g$"}</MathJax>, the algorithm executes a 4-beat cycle:
        </p>

        <div className="grid gap-4 my-8 not-prose">
          {[
            {
              step: "1",
              title: "Sampling Offspring",
              math: "x_i \\sim \\mathcal{N}(m^{(g)}, (\\sigma^{(g)})^2 C^{(g)})",
              desc: "Generate a batch of λ candidate designs from the current multivariate normal distribution. Early on, C is isotropic (spherical); later, it mirrors the landscape curvature."
            },
            {
              step: "2",
              title: "Black-Box Evaluation",
              math: "y_i = f(x_i), \\quad i = 1, \\dots, \\lambda",
              desc: "Evaluate the simulator, finite-element mesh, or hyperparameter training run for each candidate point to obtain scalar fitness scores."
            },
            {
              step: "3",
              title: "Rank-Based Selection",
              math: "f(x_{1:\\lambda}) \\le f(x_{2:\\lambda}) \\le \\dots \\le f(x_{\\lambda:\\lambda})",
              desc: "Sort the population purely by rank. CMA-ES never looks at the raw objective values—only their relative order. This gives complete invariance to any strictly monotonic warping g(f(x))."
            },
            {
              step: "4",
              title: "Distribution Update",
              math: "m^{(g+1)} = \\sum_{i=1}^{\\mu} w_i x_{i:\\lambda}, \\quad C^{(g+1)} = \\text{Adapt}(C^{(g)}, p_c, \\{x_{i:\\lambda}\\}), \\quad \\sigma^{(g+1)} = \\text{CSA}(\\sigma^{(g)}, p_\\sigma)",
              desc: "Nudge the mean m toward the weighted elite designs, adapt the covariance matrix C (rank-1 online PCA + rank-μ cloud update), and adjust step-size σ based on path coherence."
            }
          ].map((item) => (
            <div
              key={item.step}
              className="glass-card p-5 border-white/5 hover:border-sky-500/30 transition-all flex flex-col sm:flex-row items-start gap-4"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/30 text-sm font-bold font-mono text-sky-300">
                {item.step}
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <div className="font-mono text-xs text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                    <MathJax inline>{`$${item.math}$`}</MathJax>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2>Why CMA-ES Implicitly Learns the Inverse Hessian</h2>

        <p>
          On a quadratic bowl <MathJax inline>{"$f(x) = \\frac{1}{2} x^\\top H x$"}</MathJax>, standard
          isotropic search struggles because steep directions oscillate while shallow directions crawl.
          Newton&apos;s method resolves this by multiplying gradients by <MathJax inline>{"$H^{-1}$"}</MathJax>,
          turning elliptical contours into round circles where steepest descent points directly to the minimum.
        </p>

        <p>
          CMA-ES achieves this <strong>without ever forming a Hessian or computing a single derivative</strong>.
          Through the accumulation of successful steps along the evolution paths, the covariance matrix{" "}
          <MathJax inline>{"$C$"}</MathJax> asymptotically adapts such that:
        </p>

        <MathJax dynamic>{"$$C \\propto H^{-1}$$"}</MathJax>

        <p>
          In distribution space, sampling from <MathJax inline>{"$\\mathcal{N}(m, \\sigma^2 H^{-1})$"}</MathJax>{" "}
          effectively whitens the landscape, allowing CMA-ES to achieve optimal linear convergence rates on
          ill-conditioned problems that would choke standard random search or genetic algorithms.
        </p>
      </div>

      <div className="mt-8">
        <WhyILove />
      </div>
    </div>
  );
}
