"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { LatexRenderer } from "./LatexRenderer";
import { WhyILove } from "./WhyILove";
import { ColorizedEquation } from "./ColorizedEquation";
import { CMAES_EQUATIONS } from "../lib/cmaesEquations";
import {
  Sparkles,
  Sliders,
  RotateCw,
  Compass,
  ArrowRight,
  TrendingDown,
  Layers,
  Activity,
  Check,
  Play,
  Pause,
  RotateCcw,
  StepForward,
  Zap,
  Target
} from "lucide-react";
import { eigen2x2, sampleGaussian, sampleGaussian2D } from "../lib/cmaesEngine";

interface InteractiveSample {
  x: number;
  y: number;
  fitness: number;
  rank: number;
  isElite: boolean;
}

interface TrajectoryNode {
  x: number;
  y: number;
  fitness: number;
  gen: number;
}

type LandscapeKey = "rosenbrock" | "cigar" | "rastrigin" | "ackley";

interface LandscapeSpec {
  id: LandscapeKey;
  name: string;
  subtitle: string;
  formula: string;
  fn: (x: number, y: number) => number;
  initialMean: [number, number];
  globalOpt: [number, number];
  initialSigma: number;
  initialEigenRatio: number;
  initialAngle: number;
}

const LANDSCAPES: Record<LandscapeKey, LandscapeSpec> = {
  rosenbrock: {
    id: "rosenbrock",
    name: "Rosenbrock Banana Valley",
    subtitle: "Curved non-convex ravine with minimum at (1, 1)",
    formula: "f(x, y) = 10(\\textcolor{#60a5fa}{y} - \\textcolor{#60a5fa}{x}^2)^2 + (1 - \\textcolor{#60a5fa}{x})^2",
    fn: (x, y) => 10 * Math.pow(y - x * x, 2) + Math.pow(1 - x, 2),
    initialMean: [-1.4, 1.4],
    globalOpt: [1.0, 1.0],
    initialSigma: 0.55,
    initialEigenRatio: 3.0,
    initialAngle: 35
  },
  cigar: {
    id: "cigar",
    name: "Sharp Cigar Ravine",
    subtitle: "Highly ill-conditioned ridge rotated by 35°",
    formula: "f(x, y) = \\textcolor{#60a5fa}{u}^2 + 80 \\textcolor{#60a5fa}{v}^2, \\quad \\kappa(H) = 80",
    fn: (x, y) => {
      const rot = 0.61;
      const u = x * Math.cos(rot) + y * Math.sin(rot);
      const v = -x * Math.sin(rot) + y * Math.cos(rot);
      return u * u + 80 * v * v;
    },
    initialMean: [-1.6, 1.3],
    globalOpt: [0.0, 0.0],
    initialSigma: 0.5,
    initialEigenRatio: 4.5,
    initialAngle: 35
  },
  rastrigin: {
    id: "rastrigin",
    name: "Rastrigin Multimodal",
    subtitle: "Grid of deceptive local minima surrounding the origin",
    formula: "f(x, y) = 20 + \\textcolor{#60a5fa}{x}^2 + \\textcolor{#60a5fa}{y}^2 - 10(\\cos 2\\pi \\textcolor{#60a5fa}{x} + \\cos 2\\pi \\textcolor{#60a5fa}{y})",
    fn: (x, y) => 20 + x * x + y * y - 10 * (Math.cos(2 * Math.PI * x) + Math.cos(2 * Math.PI * y)),
    initialMean: [-1.5, -1.5],
    globalOpt: [0.0, 0.0],
    initialSigma: 0.6,
    initialEigenRatio: 1.2,
    initialAngle: 0
  },
  ackley: {
    id: "ackley",
    name: "Ackley Basin",
    subtitle: "Flat outer plateau with steep central exponential bowl",
    formula: "f(x, y) = -20 e^{-0.2\\|\\textcolor{#60a5fa}{x}\\|} - e^{0.5\\sum \\cos 2\\pi \\textcolor{#60a5fa}{x_i}} + 20 + e",
    fn: (x, y) =>
      -20 * Math.exp(-0.2 * Math.sqrt(0.5 * (x * x + y * y))) -
      Math.exp(0.5 * (Math.cos(2 * Math.PI * x) + Math.cos(2 * Math.PI * y))) +
      Math.E +
      20,
    initialMean: [1.6, 1.6],
    globalOpt: [0.0, 0.0],
    initialSigma: 0.65,
    initialEigenRatio: 1.5,
    initialAngle: 45
  }
};

/**
 * 2D Interactive Gaussian Search Distribution Sandbox:
 * Allows the learner to manually manipulate the mean, covariance eigenvalues,
 * rotation angle, and step-size, or step and auto-play full 2D CMA-ES generations!
 */
function GaussianDistributionSandbox() {
  const [activeLandscapeKey, setActiveLandscapeKey] = useState<LandscapeKey>("rosenbrock");
  const landscape = LANDSCAPES[activeLandscapeKey];

  const [meanX, setMeanX] = useState(landscape.initialMean[0]);
  const [meanY, setMeanY] = useState(landscape.initialMean[1]);
  const [sigma, setSigma] = useState(landscape.initialSigma);
  const [eigenRatio, setEigenRatio] = useState(landscape.initialEigenRatio);
  const [angleDeg, setAngleDeg] = useState(landscape.initialAngle);
  const [sampleCount, setSampleCount] = useState(16);
  const [eliteFraction] = useState(0.4);
  const [isDragging, setIsDragging] = useState(false);

  // CMA-ES Internal Evolution State
  const [generation, setGeneration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(480);
  const [pSigmaNorm, setPSigmaNorm] = useState(0);
  const [pCNorm, setPCNorm] = useState(0);
  const [deltaMNorm, setDeltaMNorm] = useState(0);
  const [history, setHistory] = useState<TrajectoryNode[]>([
    { x: landscape.initialMean[0], y: landscape.initialMean[1], fitness: landscape.fn(landscape.initialMean[0], landscape.initialMean[1]), gen: 0 }
  ]);

  const pSigmaRef = useRef<[number, number]>([0, 0]);
  const pCRef = useRef<[number, number]>([0, 0]);
  const covRef = useRef<[[number, number], [number, number]]>([
    [1, 0],
    [0, 1]
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animPosRef = useRef({
    x: landscape.initialMean[0],
    y: landscape.initialMean[1],
    sigma: landscape.initialSigma,
    eigenRatio: landscape.initialEigenRatio,
    angleDeg: landscape.initialAngle,
    emX: landscape.initialMean[0],
    emY: landscape.initialMean[1],
  });

  // Switch landscape preset
  const handleSelectLandscape = (key: LandscapeKey) => {
    setActiveLandscapeKey(key);
    setIsPlaying(false);
    const spec = LANDSCAPES[key];
    setMeanX(spec.initialMean[0]);
    setMeanY(spec.initialMean[1]);
    setSigma(spec.initialSigma);
    setEigenRatio(spec.initialEigenRatio);
    setAngleDeg(spec.initialAngle);
    setGeneration(0);
    setPSigmaNorm(0);
    setPCNorm(0);
    setDeltaMNorm(0);
    pSigmaRef.current = [0, 0];
    pCRef.current = [0, 0];
    covRef.current = [
      [1, 0],
      [0, 1]
    ];
    animPosRef.current = {
      x: spec.initialMean[0],
      y: spec.initialMean[1],
      sigma: spec.initialSigma,
      eigenRatio: spec.initialEigenRatio,
      angleDeg: spec.initialAngle,
      emX: spec.initialMean[0],
      emY: spec.initialMean[1],
    };
    setHistory([{ x: spec.initialMean[0], y: spec.initialMean[1], fitness: spec.fn(spec.initialMean[0], spec.initialMean[1]), gen: 0 }]);
  };

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

  // Generate samples from N(m, sigma^2 C)
  const { samples, eliteMean, samplePoints } = useMemo(() => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const l1 = eigenRatio * 0.5;
    const l2 = 0.5;
    const s1 = Math.sqrt(l1) * sigma;
    const s2 = Math.sqrt(l2) * sigma;

    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);

    const pts: InteractiveSample[] = [];
    for (let i = 0; i < sampleCount; i++) {
      const [z0, z1] = sampleGaussian2D();

      // Transform by sqrt(C) * sigma
      const lx = z0 * s1;
      const ly = z1 * s2;

      // Rotate and shift by mean
      const px = meanX + (lx * cosA - ly * sinA);
      const py = meanY + (lx * sinA + ly * cosA);

      const f = landscape.fn(px, py);
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
      samplePoints: pts
    };
  }, [meanX, meanY, sigma, eigenRatio, angleDeg, sampleCount, eliteFraction, landscape]);

  // Execute one step of 2D CMA-ES
  const stepGeneration = useCallback(() => {
    const mu = Math.max(1, Math.floor(sampleCount * eliteFraction));
    const eliteSamples = samplePoints.filter((s) => s.isElite);

    let sumW = 0;
    let sumWsq = 0;
    const weights: number[] = [];
    for (let i = 0; i < mu; i++) {
      const w = Math.log(mu + 0.5) - Math.log(i + 1);
      weights.push(w);
      sumW += w;
      sumWsq += w * w;
    }
    const normWeights = weights.map((w) => w / sumW);
    const muEff = 1 / normWeights.reduce((acc, w) => acc + w * w, 0);

    const oldMean: [number, number] = [meanX, meanY];
    const newM: [number, number] = [eliteMean[0], eliteMean[1]];
    const dm: [number, number] = [newM[0] - oldMean[0], newM[1] - oldMean[1]];

    // Hyperparameters for n=2
    const n = 2;
    const cSigma = (muEff + 2) / (n + muEff + 5);
    const dSigma = 1 + 2 * Math.max(0, Math.sqrt((muEff - 1) / (n + 1)) - 1) + cSigma;
    const cc = (4 + muEff / n) / (n + 4 + 2 * muEff / n);
    const c1 = 2 / (Math.pow(n + 1.3, 2) + muEff);
    const cMu = Math.min(1 - c1, (2 * (muEff - 2 + 1 / muEff)) / (Math.pow(n + 2, 2) + muEff));

    // Update evolution paths
    const angleRad = (angleDeg * Math.PI) / 180;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);
    const l1 = eigenRatio * 0.5;
    const l2 = 0.5;

    // C^(-1/2) * (dm / sigma)
    const invSqrt1 = 1 / Math.sqrt(Math.max(1e-4, l1));
    const invSqrt2 = 1 / Math.sqrt(Math.max(1e-4, l2));

    const rotDmX = (dm[0] * cosA + dm[1] * sinA) / Math.max(1e-4, sigma);
    const rotDmY = (-dm[0] * sinA + dm[1] * cosA) / Math.max(1e-4, sigma);

    const whitenedX = rotDmX * invSqrt1;
    const whitenedY = rotDmY * invSqrt2;

    const unrotWhitenedX = whitenedX * cosA - whitenedY * sinA;
    const unrotWhitenedY = whitenedX * sinA + whitenedY * cosA;

    const constSig = Math.sqrt(cSigma * (2 - cSigma) * muEff);
    const newPSig: [number, number] = [
      (1 - cSigma) * pSigmaRef.current[0] + constSig * unrotWhitenedX,
      (1 - cSigma) * pSigmaRef.current[1] + constSig * unrotWhitenedY
    ];
    pSigmaRef.current = newPSig;

    const pSigNorm = Math.sqrt(newPSig[0] * newPSig[0] + newPSig[1] * newPSig[1]);
    const chiN = Math.sqrt(2) * (1 - 1 / (4 * n) + 1 / (21 * n * n));
    const newSigma = Math.max(0.02, Math.min(1.5, sigma * Math.exp((cSigma / dSigma) * (pSigNorm / chiN - 1))));

    // Update pc
    const constC = Math.sqrt(cc * (2 - cc) * muEff);
    const newPC: [number, number] = [
      (1 - cc) * pCRef.current[0] + constC * (dm[0] / Math.max(1e-4, sigma)),
      (1 - cc) * pCRef.current[1] + constC * (dm[1] / Math.max(1e-4, sigma))
    ];
    pCRef.current = newPC;

    // Adapt covariance matrix
    const currentC = covRef.current;
    const rank1_00 = newPC[0] * newPC[0];
    const rank1_01 = newPC[0] * newPC[1];
    const rank1_11 = newPC[1] * newPC[1];

    let rankMu_00 = 0;
    let rankMu_01 = 0;
    let rankMu_11 = 0;
    for (let i = 0; i < mu; i++) {
      const s = eliteSamples[i];
      const y0 = (s.x - oldMean[0]) / Math.max(1e-4, sigma);
      const y1 = (s.y - oldMean[1]) / Math.max(1e-4, sigma);
      const w = normWeights[i];
      rankMu_00 += w * y0 * y0;
      rankMu_01 += w * y0 * y1;
      rankMu_11 += w * y1 * y1;
    }

    const newC00 = (1 - c1 - cMu) * currentC[0][0] + c1 * rank1_00 + cMu * rankMu_00;
    const newC01 = (1 - c1 - cMu) * currentC[0][1] + c1 * rank1_01 + cMu * rankMu_01;
    const newC11 = (1 - c1 - cMu) * currentC[1][1] + c1 * rank1_11 + cMu * rankMu_11;

    covRef.current = [
      [newC00, newC01],
      [newC01, newC11]
    ];

    // Compute updated eigensystem for visual sliders
    const { eigenvalues, angle } = eigen2x2(newC00, newC01, newC11);
    const eval1 = eigenvalues[0];
    const eval2 = eigenvalues[1];
    const nextEigenRatio = Math.max(1.0, Math.min(8.0, eval1 / Math.max(1e-4, eval2)));
    const nextAngleDeg = (angle * 180) / Math.PI;

    // Apply updates to UI state
    const dmLen = Math.hypot(dm[0], dm[1]);
    setDeltaMNorm(parseFloat(dmLen.toFixed(3)));
    setPSigmaNorm(parseFloat(pSigNorm.toFixed(2)));
    const pcLen = Math.hypot(newPC[0], newPC[1]);
    setPCNorm(parseFloat(pcLen.toFixed(2)));

    setMeanX(parseFloat(newM[0].toFixed(3)));
    setMeanY(parseFloat(newM[1].toFixed(3)));
    setSigma(parseFloat(newSigma.toFixed(3)));
    setEigenRatio(parseFloat(nextEigenRatio.toFixed(2)));
    setAngleDeg(Math.round(nextAngleDeg));
    setGeneration((g) => g + 1);

    const fNew = landscape.fn(newM[0], newM[1]);
    setHistory((prev) => [...prev.slice(-30), { x: newM[0], y: newM[1], fitness: fNew, gen: generation + 1 }]);
  }, [meanX, meanY, sigma, eigenRatio, angleDeg, sampleCount, eliteFraction, samplePoints, eliteMean, landscape, generation]);

  // Autoplay ticker
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      stepGeneration();
    }, speedMs);
    return () => clearInterval(timer);
  }, [isPlaying, speedMs, stepGeneration]);

  // Pre-render background heatmap offscreen once per landscape switch
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const offscreen = document.createElement("canvas");
    const W = 540;
    const H = 380;
    offscreen.width = W;
    offscreen.height = H;
    const ctx = offscreen.getContext("2d");
    if (!ctx) return;

    const DOMAIN = 2.4;
    const toCoordX = (px: number) => (px / W) * (2 * DOMAIN) - DOMAIN;
    const toCoordY = (py: number) => ((H - py) / H) * (2 * DOMAIN) - DOMAIN;

    const imgData = ctx.createImageData(W, H);
    const buf32 = new Uint32Array(imgData.data.buffer);
    const denom = activeLandscapeKey === "cigar" ? 25 : 8;

    for (let py = 0; py < H; py += 2) {
      const y = toCoordY(py);
      const row0 = py * W;
      const row1 = Math.min(H - 1, py + 1) * W;

      for (let px = 0; px < W; px += 2) {
        const x = toCoordX(px);
        const f = landscape.fn(x, y);
        const norm = Math.tanh(f / denom);

        const r = (8 + 22 * norm) | 0;
        const g = (20 + 70 * (1 - norm)) | 0;
        const b = (40 + 130 * (1 - norm)) | 0;
        const color = (255 << 24) | (b << 16) | (g << 8) | r;

        const px1 = Math.min(W - 1, px + 1);
        buf32[row0 + px] = color;
        buf32[row0 + px1] = color;
        buf32[row1 + px] = color;
        buf32[row1 + px1] = color;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    bgCanvasRef.current = offscreen;
  }, [activeLandscapeKey, landscape]);

  // Smooth 60fps Animation Loop with linear interpolation
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const DOMAIN = 2.4;

    const toPxX = (x: number) => ((x + DOMAIN) / (2 * DOMAIN)) * W;
    const toPxY = (y: number) => H - ((y + DOMAIN) / (2 * DOMAIN)) * H;

    const render = () => {
      const a = animPosRef.current;
      const lerp = 0.22;
      a.x += (meanX - a.x) * lerp;
      a.y += (meanY - a.y) * lerp;
      a.sigma += (sigma - a.sigma) * lerp;
      a.eigenRatio += (eigenRatio - a.eigenRatio) * lerp;
      a.angleDeg += (angleDeg - a.angleDeg) * lerp;
      a.emX += (eliteMean[0] - a.emX) * lerp;
      a.emY += (eliteMean[1] - a.emY) * lerp;

      ctx.clearRect(0, 0, W, H);

      // Blit pre-rendered background heatmap instantly
      if (bgCanvasRef.current) {
        ctx.drawImage(bgCanvasRef.current, 0, 0);
      }

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

      // Draw Global Optimum Target Marker
      const [optX, optY] = landscape.globalOpt;
      const optPxX = toPxX(optX);
      const optPxY = toPxY(optY);

      ctx.strokeStyle = "rgba(250, 204, 21, 0.8)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(optPxX, optPxY, 8, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(optPxX, optPxY, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Draw Trajectory History Trail
      if (history.length > 1) {
        ctx.strokeStyle = "rgba(250, 204, 21, 0.45)";
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        history.forEach((h, idx) => {
          const hx = toPxX(h.x);
          const hy = toPxY(h.y);
          if (idx === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        });
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw history nodes
        history.forEach((h) => {
          ctx.fillStyle = "rgba(250, 204, 21, 0.6)";
          ctx.beginPath();
          ctx.arc(toPxX(h.x), toPxY(h.y), 2.5, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Draw 1-sigma, 2-sigma Gaussian confidence ellipses
      const angleRad = (a.angleDeg * Math.PI) / 180;
      const l1 = a.eigenRatio * 0.5;
      const l2 = 0.5;
      const s1 = Math.sqrt(Math.max(1e-4, l1)) * a.sigma * (W / (2 * DOMAIN));
      const s2 = Math.sqrt(Math.max(1e-4, l2)) * a.sigma * (H / (2 * DOMAIN));

      const cx = toPxX(a.x);
      const cy = toPxY(a.y);

      [1, 2].forEach((k) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-angleRad); // Canvas y is inverted

        ctx.strokeStyle = k === 1 ? "rgba(56, 189, 248, 0.9)" : "rgba(56, 189, 248, 0.35)";
        ctx.lineWidth = k === 1 ? 2 : 1;
        ctx.fillStyle = k === 1 ? "rgba(14, 165, 233, 0.12)" : "transparent";

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
      const emX = toPxX(a.emX);
      const emY = toPxY(a.emY);

      ctx.strokeStyle = "rgba(52, 211, 153, 0.95)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(emX, emY);
      ctx.stroke();

      // Arrowhead for mean shift
      const arrowAng = Math.atan2(emY - cy, emX - cx);
      const ahLen = 9;
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
          // Glowing Emerald for Elites
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
          // Dim Cyan for non-elites
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
      ctx.arc(cx, cy, 6.5, 0, Math.PI * 2);
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

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [meanX, meanY, sigma, eigenRatio, angleDeg, samples, eliteMean, landscape, history, activeLandscapeKey]);

  const currentFitness = landscape.fn(meanX, meanY);

  return (
    <div className="glass-card p-6 md:p-8 my-8 space-y-6">
      {/* Sandbox Header with Landscape Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-display">
              Interactive 2D Gaussian Distribution Sandbox
            </h3>
            <p className="text-xs text-slate-400">
              Drag the distribution parameters manually, or run live step-by-step CMA-ES evolution down the valley
            </p>
          </div>
        </div>

        {/* Landscape Preset Selector */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-2xl border border-white/5">
          {(Object.keys(LANDSCAPES) as LandscapeKey[]).map((key) => {
            const spec = LANDSCAPES[key];
            const isSel = activeLandscapeKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectLandscape(key)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  isSel
                    ? "bg-sky-500 text-white shadow-glow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                {spec.name.split(" ")[0]}
              </button>
            );
          })}
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
            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[0.68rem] text-slate-300 font-mono pointer-events-none flex items-center gap-1.5">
              <span>Drag to reposition Mean</span>
              <LatexRenderer math="m" block={false} />
            </div>

            {/* Live Telemetry Badge */}
            <div className="absolute top-3 right-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[0.7rem] font-mono text-slate-200 space-y-0.5 pointer-events-none shadow-lg">
              <div className="flex items-center justify-between gap-3 text-slate-400">
                <span>Gen:</span>
                <span className="text-sky-300 font-bold">{generation}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-slate-400">
                <span className="flex items-center"><LatexRenderer math="f(m)" block={false} />:</span>
                <span className="text-emerald-300 font-bold">{currentFitness < 1e-3 ? currentFitness.toExponential(2) : currentFitness.toFixed(3)}</span>
              </div>
            </div>
          </div>

          {/* Interactive Playback & Stepping Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm ${
                  isPlaying
                    ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
                    : "bg-sky-500 text-white hover:bg-sky-400 shadow-glow-sm"
                }`}
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                <span>{isPlaying ? "Pause" : "Auto-Run"}</span>
              </button>

              <button
                type="button"
                onClick={stepGeneration}
                disabled={isPlaying}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 border border-white/10 text-slate-200 hover:text-white hover:bg-slate-700 disabled:opacity-40 transition-colors"
              >
                <StepForward className="h-3.5 w-3.5" />
                <span>Step</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectLandscape(activeLandscapeKey)}
                className="p-2 rounded-xl bg-slate-800 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                title="Reset Optimization"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Speed & Legend Row */}
            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 text-[0.68rem] text-slate-400 font-mono">
              <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-white/5">
                <span className="text-slate-500">Speed:</span>
                {[
                  { label: "Slow", ms: 700 },
                  { label: "Normal", ms: 450 },
                  { label: "Fast", ms: 160 }
                ].map((s) => (
                  <button
                    key={s.ms}
                    type="button"
                    onClick={() => setSpeedMs(s.ms)}
                    className={`px-1.5 py-0.5 rounded text-[0.65rem] transition-colors ${
                      speedMs === s.ms ? "bg-sky-500 text-white font-bold" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2.5">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-white border border-sky-500" />
                  <span>Mean</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Elites</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-400" />
                  <span>Optimum</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sliders & Parameters Column */}
        <div className="space-y-4">
          <div className="bg-slate-950/40 rounded-2xl p-5 border border-white/5 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-sky-400" /> Distribution Geometry
              </span>
              <span className="text-[0.7rem] text-slate-500 font-mono">Real-Time Controls</span>
            </div>

            {/* Step Size Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-slate-300 flex items-center gap-1">
                  Global Step Size (<LatexRenderer math="\sigma" block={false} />)
                </span>
                <span className="text-sky-300 font-mono bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  {sigma.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                aria-label="Search Distribution Step Size sigma"
                min={0.05}
                max={1.4}
                step={0.02}
                value={sigma}
                onChange={(e) => setSigma(parseFloat(e.target.value))}
                className="w-full accent-sky-400"
              />
              <p className="text-[0.68rem] text-slate-500">Adapts via CSA path length.</p>
            </div>

            {/* Anisotropy (Eigenvalue Ratio) */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-slate-300 flex items-center gap-1">
                  Anisotropy (<LatexRenderer math="\lambda_1 / \lambda_2" block={false} />)
                </span>
                <span className="text-purple-300 font-mono bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  {eigenRatio.toFixed(1)} : 1
                </span>
              </div>
              <input
                type="range"
                aria-label="Covariance Anisotropy Ratio"
                min={1.0}
                max={8.0}
                step={0.1}
                value={eigenRatio}
                onChange={(e) => setEigenRatio(parseFloat(e.target.value))}
                className="w-full accent-purple-400"
              />
              <p className="text-[0.68rem] text-slate-500 flex items-center gap-1">
                <span>Stretches covariance</span> <LatexRenderer math="C" block={false} /> <span>along the ill-conditioned valley.</span>
              </p>
            </div>

            {/* Rotation Angle */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-slate-300 flex items-center gap-1">
                  Principal Orientation (<LatexRenderer math="\theta" block={false} />)
                </span>
                <span className="text-amber-300 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {angleDeg}°
                </span>
              </div>
              <input
                type="range"
                aria-label="Principal Orientation Angle theta"
                min={-90}
                max={90}
                step={1}
                value={angleDeg}
                onChange={(e) => setAngleDeg(parseInt(e.target.value, 10))}
                className="w-full accent-amber-400"
              />
              <p className="text-[0.68rem] text-slate-500">
                Rotates leading eigenvector to align with valley curvature.
              </p>
            </div>

            {/* Population Size Lambda */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-slate-300 flex items-center gap-1">
                  Population Batch (<LatexRenderer math="\lambda" block={false} />)
                </span>
                <span className="text-emerald-300 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {sampleCount} samples
                </span>
              </div>
              <input
                type="range"
                aria-label="Offspring Population Size lambda"
                min={6}
                max={32}
                step={2}
                value={sampleCount}
                onChange={(e) => setSampleCount(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-400"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-950/30 to-indigo-950/20 border border-sky-500/20 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-sky-200 uppercase tracking-wide">
              <Activity className="h-3.5 w-3.5 text-cyan-400" />
              <span>What you are observing</span>
            </div>
            <p className="leading-relaxed">
              As generations progress, the <strong className="text-sky-300">blue confidence ellipse</strong> automatically elongates and rotates to match the curvature of the ravine, while the <strong className="text-emerald-300">green arrow</strong> pulls the mean along the valley floor without evaluating gradients.
            </p>
          </div>
        </div>
      </div>

      {/* Live CMA-ES Internal Algebraic State Telemetry Card */}
      <div className="rounded-2xl border border-sky-500/30 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-sky-950/30 p-5 md:p-6 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <span>Live Simulation Internal Algebraic State</span>
                <span className={`text-[0.65rem] font-mono px-2 py-0.5 rounded-full border ${
                  isPlaying ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 animate-pulse" : "bg-slate-800 border-white/10 text-slate-400"
                }`}>
                  {isPlaying ? "Live Evolution Step" : "Static State"}
                </span>
              </h4>
              <p className="text-[0.7rem] text-slate-400">
                Real-time mathematical parameters governing the Gaussian distribution manifold
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Gen {generation}</span>
            <span className="text-slate-600">|</span>
            <span className="text-sky-300">Evals: {generation * sampleCount}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          {/* Card 1: Distribution Mean */}
          <div className="bg-slate-950/60 rounded-xl p-3 border border-white/5 space-y-1">
            <div className="text-[0.65rem] font-bold uppercase tracking-wider text-purple-400 flex items-center justify-between">
              <span>Distribution Mean</span>
              <LatexRenderer math="m" block={false} />
            </div>
            <div className="font-mono text-white text-sm font-semibold">
              ({meanX.toFixed(2)}, {meanY.toFixed(2)})
            </div>
            <div className="text-[0.68rem] text-slate-400 font-mono">
              <LatexRenderer math="\|\Delta m\|" block={false} /> = {deltaMNorm.toFixed(3)}
            </div>
          </div>

          {/* Card 2: Step Size sigma */}
          <div className="bg-slate-950/60 rounded-xl p-3 border border-white/5 space-y-1">
            <div className="text-[0.65rem] font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
              <span>Step-Size (CSA)</span>
              <LatexRenderer math="\sigma" block={false} />
            </div>
            <div className="font-mono text-amber-300 text-sm font-semibold">
              {sigma.toFixed(3)}
            </div>
            <div className="text-[0.68rem] text-slate-400 font-mono">
              <LatexRenderer math="\|p_\sigma\|" block={false} /> = {pSigmaNorm.toFixed(2)} (vs 1.13)
            </div>
          </div>

          {/* Card 3: Covariance Condition */}
          <div className="bg-slate-950/60 rounded-xl p-3 border border-white/5 space-y-1">
            <div className="text-[0.65rem] font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-between">
              <span>Covariance Shape</span>
              <LatexRenderer math="\kappa(C)" block={false} />
            </div>
            <div className="font-mono text-emerald-300 text-sm font-semibold">
              {eigenRatio.toFixed(1)} : 1
            </div>
            <div className="text-[0.68rem] text-slate-400 font-mono">
              <LatexRenderer math="\theta" block={false} /> = {angleDeg}° orientation
            </div>
          </div>

          {/* Card 4: Evolution Path pc */}
          <div className="bg-slate-950/60 rounded-xl p-3 border border-white/5 space-y-1">
            <div className="text-[0.65rem] font-bold uppercase tracking-wider text-rose-400 flex items-center justify-between">
              <span>Covariance Path</span>
              <LatexRenderer math="p_c" block={false} />
            </div>
            <div className="font-mono text-rose-300 text-sm font-semibold">
              <LatexRenderer math="\|p_c\|" block={false} /> = {pCNorm.toFixed(2)}
            </div>
            <div className="text-[0.68rem] text-slate-400">
              Rank-1 directional memory
            </div>
          </div>

          {/* Card 5: Elite Selection */}
          <div className="bg-slate-950/60 rounded-xl p-3 border border-white/5 space-y-1 sm:col-span-2 lg:col-span-1">
            <div className="text-[0.65rem] font-bold uppercase tracking-wider text-sky-400 flex items-center justify-between">
              <span>Elite Selection</span>
              <span><LatexRenderer math="\mu / \lambda" block={false} /></span>
            </div>
            <div className="font-mono text-sky-300 text-sm font-semibold">
              {Math.max(1, Math.floor(sampleCount * eliteFraction))} / {sampleCount}
            </div>
            <div className="text-[0.68rem] text-slate-400 font-mono">
              Best <LatexRenderer math="f" block={false} />: {currentFitness < 1e-3 ? currentFitness.toExponential(2) : currentFitness.toFixed(3)}
            </div>
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
          In deep learning, optimization almost always means <em className="text-sky-300 font-semibold not-italic">gradients</em>: Adam, Adafactor, Lion, and SGD with cosine schedules evaluate backpropagation derivatives to step downhill.
        </p>

        <p>
          In engineering design, physical robotics, and scientific simulations, <strong>gradients often do not exist, suffer from severe discretization noise, or cost hours of compute per point</strong>. In black-box optimization, where you can only evaluate a system and observe its scalar output, <strong className="text-sky-200 font-semibold">CMA-ES</strong> (Covariance Matrix Adaptation Evolution Strategy) is the standard workhorse.
        </p>

        <p>
          CMA-ES provides a coordinate-invariant, sample-efficient method to navigate opaque, non-differentiable objective landscapes directly into the optimal basin.
        </p>
      </div>

      {/* Interactive Exploration Sandbox */}
      <GaussianDistributionSandbox />

      <div className="prose-cmaes space-y-6">
        <h2>The Core Mathematical Philosophy</h2>

        <p>
          At its foundation, CMA-ES operates under a clean abstraction:
        </p>

        <blockquote className="border-l-4 border-sky-400 bg-slate-900/40 p-5 rounded-r-2xl my-6 text-slate-200 text-base md:text-lg italic leading-relaxed">
          &ldquo;You do not optimize a single point in parameter space. You optimize a <strong>probability distribution</strong> over parameter space, and iteratively reshape that distribution to concentrate probability mass where performance is highest.&rdquo;
        </blockquote>

        <p>
          Suppose you want to minimize an unknown black-box objective function <LatexRenderer math="f: \mathbb{R}^n \to \mathbb{R}" block={false} />. You supply CMA-ES with the dimension <LatexRenderer math="n" block={false} />, an initial mean vector <LatexRenderer math="m^{(0)}" block={false} />, and an initial step size <LatexRenderer math="\sigma^{(0)}" block={false} />.
        </p>
      </div>

      {/* Colorized Equation 1: Sampling */}
      <div className="my-8">
        <ColorizedEquation equation={CMAES_EQUATIONS["cmaes-sampling"]} />
      </div>

      <div className="prose-cmaes space-y-6">
        <p>
          In each generation <LatexRenderer math="g" block={false} />, the algorithm executes a four-beat cycle:
        </p>

        <div className="grid gap-4 my-8 not-prose">
          {[
            {
              step: "1",
              title: "Sampling Offspring",
              math: "\\textcolor{#60a5fa}{x_i} \\sim \\mathcal{N}(\\textcolor{#c084fc}{m^{(g)}}, (\\textcolor{#fbbf24}{\\sigma^{(g)}})^2 \\textcolor{#34d399}{C^{(g)}})",
              desc: "Generate a batch of λ candidate designs from the current multivariate normal distribution. Initially, C is spherical; over successive iterations, it stretches along the valley floor."
            },
            {
              step: "2",
              title: "Black-Box Evaluation",
              math: "\\textcolor{#60a5fa}{y_i} = f(\\textcolor{#60a5fa}{x_i}), \\quad i = 1, \\dots, \\lambda",
              desc: "Evaluate the simulator, finite-element solver, or hyperparameter training run for each candidate vector to obtain scalar performance scores."
            },
            {
              step: "3",
              title: "Rank-Based Selection",
              math: "f(\\textcolor{#60a5fa}{x_{1:\\lambda}}) \\le f(\\textcolor{#60a5fa}{x_{2:\\lambda}}) \\le \\dots \\le f(\\textcolor{#60a5fa}{x_{\\lambda:\\lambda}})",
              desc: "Sort the population by relative rank. CMA-ES ignores raw magnitudes and tracks only order, providing invariance to any strictly increasing monotonic transformation g(f(x))."
            },
            {
              step: "4",
              title: "Distribution Update",
              math: "\\textcolor{#c084fc}{m^{(g+1)}} = \\sum_{i=1}^{\\mu} \\textcolor{#fb923c}{w_i} \\textcolor{#60a5fa}{x_{i:\\lambda}}, \\quad \\textcolor{#34d399}{C^{(g+1)}} = \\text{Adapt}(\\textcolor{#34d399}{C^{(g)}}, \\textcolor{#fb7185}{p_c}), \\quad \\textcolor{#fbbf24}{\\sigma^{(g+1)}} = \\text{CSA}(\\textcolor{#fbbf24}{\\sigma^{(g)}}, \\textcolor{#fb7185}{p_\\sigma})",
              desc: "Shift mean m toward weighted elite designs, adapt covariance matrix C via rank-1 trajectory memory and rank-μ batch spread, and adjust step size σ using path momentum."
            }
          ].map((item) => (
            <div
              key={item.step}
              className="glass-card p-5 border-white/5 hover:border-sky-500/30 transition-colors duration-300 flex flex-col sm:flex-row items-start gap-4"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/30 text-sm font-bold font-mono text-sky-300">
                {item.step}
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <div className="font-mono text-xs text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                    <LatexRenderer math={item.math} block={false} />
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Colorized Equation 2: Recombination */}
      <div className="my-8">
        <ColorizedEquation equation={CMAES_EQUATIONS["cmaes-recombination"]} />
      </div>

      <div className="prose-cmaes space-y-6">
        <h2>Why CMA-ES Implicitly Learns the Inverse Hessian</h2>

        <p>
          On an ill-conditioned quadratic bowl <LatexRenderer math="f(x) = \frac{1}{2} x^\top H x" block={false} />, isotropic search struggles because steep directions oscillate while shallow directions crawl. Newton&apos;s method resolves this by preconditioning gradients with <LatexRenderer math="H^{-1}" block={false} />, transforming elliptical contours into spherical circles where steepest descent points directly at the minimum.
        </p>

        <p>
          CMA-ES discovers this geometry <strong>without forming a Hessian matrix or computing derivatives</strong>. Through the accumulation of successful steps along the evolution paths, the covariance matrix <LatexRenderer math="C" block={false} /> asymptotically adapts such that:
        </p>

        <div className="my-6 not-prose">
          <ColorizedEquation equation={CMAES_EQUATIONS["cmaes-hessian-inverse"]} />
        </div>

        <p>
          Sampling from <LatexRenderer math="\mathcal{N}(m, \sigma^2 H^{-1})" block={false} /> whitens the search landscape, enabling optimal linear convergence rates on ill-conditioned problems that stall standard genetic algorithms or random search.
        </p>
      </div>

      <div className="mt-8">
        <WhyILove />
      </div>
    </div>
  );
}
