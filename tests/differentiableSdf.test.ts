import { describe, expect, it } from "bun:test";
import {
  sminPoly,
  sminLse,
  smaxPoly,
  evalGradientAndHessian,
  DifferentiableSdfNode,
  raymarchDifferentiableSdf,
  DifferentiableSceneSDF,
} from "../app/lib/differentiableSdf";
import { sdfBox, sdfSphere } from "../app/lib/analyticSdf";

describe("Differentiable Signed Distance Fields & Exact Gradients", () => {
  describe("C¹ Smooth Minimum & Maximum Operators", () => {
    it("smoothly blends two distances with polynomial smin", () => {
      const k = 0.2;
      const res = sminPoly(0.05, 0.05, k);
      // At a = b, smin(a, a) = a - k/4
      expect(res.val).toBeCloseTo(0.05 - 0.2 / 4, 5);
      // Partial derivatives must be 0.5 each
      expect(res.dda).toBeCloseTo(0.5, 4);
      expect(res.ddb).toBeCloseTo(0.5, 4);
    });

    it("matches exact min outside smoothing radius", () => {
      const k = 0.1;
      const res = sminPoly(0.5, 1.5, k);
      expect(res.val).toBe(0.5);
      expect(res.dda).toBe(1.0);
      expect(res.ddb).toBe(0.0);
    });

    it("evaluates Log-Sum-Exp smooth minimum correctly", () => {
      const k = 0.1;
      const res = sminLse(0.2, 0.2, k);
      // At a = b, sminLse(a, a) = a - k * ln(2)
      expect(res.val).toBeCloseTo(0.2 - 0.1 * Math.LN2, 5);
      expect(res.dda).toBeCloseTo(0.5, 4);
      expect(res.ddb).toBeCloseTo(0.5, 4);
    });

    it("evaluates smooth maximum (intersection)", () => {
      const k = 0.1;
      const res = smaxPoly(0.8, 0.2, k);
      expect(res.val).toBeCloseTo(0.8, 4);
    });
  });

  describe("Analytical Gradients & Second-Order Hessian Tensors", () => {
    it("computes unit gradient and exact Hessian for a sphere SDF", () => {
      // Sphere at [0, 0, 0] with radius 1.0: SDF(p) = ||p|| - 1
      const sphereFunc = (p: [number, number, number]) => Math.hypot(...p) - 1.0;
      const testPoint: [number, number, number] = [2.0, 0.0, 0.0];

      const { gradient, hessian, normal } = evalGradientAndHessian(sphereFunc, testPoint);

      // Gradient at [2, 0, 0] is [1, 0, 0]
      expect(gradient[0]).toBeCloseTo(1.0, 4);
      expect(gradient[1]).toBeCloseTo(0.0, 4);
      expect(gradient[2]).toBeCloseTo(0.0, 4);
      expect(normal[0]).toBeCloseTo(1.0, 4);

      // Hessian of ||p||: H = (I - n n^T) / ||p||
      // At [2, 0, 0], ||p|| = 2, n = [1, 0, 0]
      // H_xx = 0, H_yy = 0.5, H_zz = 0.5
      expect(hessian[0][0]).toBeCloseTo(0.0, 3);
      expect(hessian[1][1]).toBeCloseTo(0.5, 3);
      expect(hessian[2][2]).toBeCloseTo(0.5, 3);
      expect(hessian[0][1]).toBeCloseTo(0.0, 3);
    });
  });

  describe("Composite Differentiable SDF Node & Near-Surface Refinement", () => {
    it("performs C¹ smooth union between two spheres", () => {
      const s1 = new DifferentiableSdfNode((p) => sdfSphere(p, [-0.5, 0, 0], 0.6).distance, "s1");
      const s2 = new DifferentiableSdfNode((p) => sdfSphere(p, [0.5, 0, 0], 0.6).distance, "s2");

      const unionNode = s1.smoothUnion(s2, 0.2);

      // At midpoint [0, 0, 0], symmetric sphere gradients cancel out (saddle point: gradient = [0, 0, 0])
      const evalMid = unionNode.evaluate([0, 0, 0]);
      expect(evalMid.distance).toBeLessThan(-0.1); // smoothed union expands volume slightly
      expect(Math.hypot(...evalMid.gradient)).toBeCloseTo(0.0, 4); // exact critical point

      // At off-center point [0.3, 0.5, 0], normal has unit length
      const evalOff = unionNode.evaluate([0.3, 0.5, 0]);
      expect(Math.hypot(...evalOff.unitNormal)).toBeCloseTo(1.0, 4);
    });

    it("applies narrow-band Wendland near-surface refinement without affecting far field", () => {
      const baseNode = new DifferentiableSdfNode((p) => sdfSphere(p, [0, 0, 0], 1.0).distance, "base");

      // Micro-displacement function (e.g. sinusoidal surface ripple)
      const rippleFn = (p: [number, number, number]) => 0.02 * Math.sin(p[0] * 20);

      const refinedNode = baseNode.withNearSurfaceRefinement(rippleFn, 0.1);

      // Far point at p=[2.0, 0, 0]: distance = 1.0 (far beyond 0.1 bandWidth)
      const evalFar = refinedNode.evaluate([2.0, 0, 0]);
      expect(evalFar.distance).toBeCloseTo(1.0, 5); // untouched

      // Near surface point at p=[1.0, 0, 0]: base distance = 0
      const evalNear = refinedNode.evaluate([1.0, 0, 0]);
      expect(evalNear.distance).toBeCloseTo(0.02 * Math.sin(20), 4);
    });
  });

  describe("Differentiable Sphere Tracing & Implicit Surface Derivatives", () => {
    it("traces ray to surface and computes implicit derivative dt/do", () => {
      const sphereNode = new DifferentiableSdfNode((p) => sdfSphere(p, [0, 0, 5], 1.0).distance);
      const origin: [number, number, number] = [0, 0, 0];
      const direction: [number, number, number] = [0, 0, 1];

      const res = raymarchDifferentiableSdf(sphereNode, origin, direction);
      expect(res.hit).toBe(true);
      expect(res.distance).toBeCloseTo(4.0, 3); // sphere center at 5, radius 1 -> hit at z=4
      expect(res.hitPoint[2]).toBeCloseTo(4.0, 3);
      expect(res.unitNormal[2]).toBeCloseTo(-1.0, 3); // surface normal points back toward ray origin

      // Implicit derivative: dt/do_z = -1 (moving origin +1 along Z reduces distance to hit by 1)
      expect(res.dDistance_dOrigin[2]).toBeCloseTo(-1.0, 2);
    });
  });

  describe("DifferentiableSceneSDF Multi-Primitive Scene Manager", () => {
    it("evaluates smooth minimum and normalized weights across multiple shapes", () => {
      const scene = new DifferentiableSceneSDF();
      scene.addSphere([0, 0, 0], 1.0);
      scene.addSphere([3, 0, 0], 1.0);

      const ev = scene.evaluate([1.5, 0, 0], 0.1);
      expect(ev.weights.length).toBe(2);
      expect(ev.weights[0].weight).toBeCloseTo(0.5, 2);
      expect(ev.weights[1].weight).toBeCloseTo(0.5, 2);

      const totalWeight = ev.weights[0].weight + ev.weights[1].weight;
      expect(totalWeight).toBeCloseTo(1.0, 4);
      expect(ev.distance).toBeLessThan(0.5);
      expect(ev.distance).toBeGreaterThan(0.4);
    });

    it("smooth minimum converges to hard minimum as smoothing k approaches zero", () => {
      const scene = new DifferentiableSceneSDF();
      scene.addSphere([0, 0, 0], 1.0);
      scene.addBox([5, 0, 0], [1, 1, 1]);

      const p: [number, number, number] = [2, 0, 0];
      const hardMin = 1.0;

      const evSmooth = scene.evaluate(p, 0.2);
      const evSharp = scene.evaluate(p, 0.001);

      expect(Math.abs(evSharp.distance - hardMin)).toBeLessThan(0.01);
      expect(evSmooth.distance).toBeLessThan(hardMin);
    });

    it("projects a point onto composite surface zero-isocontour via gradient descent", () => {
      const scene = new DifferentiableSceneSDF();
      scene.addBox([0, 0, 0], [1, 1, 1]);
      scene.addSphere([0, 1.5, 0], 0.5);

      const surfPt = scene.projectToSurface([2.5, 0, 0]);
      expect(surfPt[0]).toBeCloseTo(1.0, 2);
      expect(surfPt[1]).toBeCloseTo(0.0, 2);
      expect(surfPt[2]).toBeCloseTo(0.0, 2);

      const finalEv = scene.evaluate(surfPt, 0.01);
      expect(Math.abs(finalEv.distance)).toBeLessThan(1e-3);
    });

    it("computes continuous outward clearance direction", () => {
      const scene = new DifferentiableSceneSDF();
      scene.addSphere([0, 0, 0], 1.0);
      scene.addPlane([0, 1, 0], 0);

      const dir = scene.computeClearanceDirection([0, 2, 0]);
      expect(dir[1]).toBeGreaterThan(0.5);
    });
  });
});
