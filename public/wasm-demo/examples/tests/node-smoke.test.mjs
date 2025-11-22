import init, { fmin } from '../../pkg/cmaes_wasm.js';
import assert from 'node:assert';

(async () => {
  const x0 = new Float64Array([2.0, -1.0]);
  const sigma = 0.8;
  await init();
  const res = fmin(x0, sigma, (x) => x[0] * x[0] + x[1] * x[1]);
  assert(res.best_f <= 1e-4, `best_f too high: ${res.best_f}`);
  assert(res.evals > 0, 'evals should be positive');
  console.log('node smoke: ok');
})();
