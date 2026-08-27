# Pass 3/20 — cached normalized latent steps

Status: rejected; no production source change retained.

Opportunity score: 15 under the skill's impact x confidence / effort model.
The candidate cached normalized latent steps for reuse by active-Mahalanobis and
rank-mu covariance work.

The named diagnostic profile appeared promising: `cmaes_run` self-time fell
from 573.4 ms to 507.2 ms (-11.5%). Production evidence did not confirm it:

- UI-default mean: 5.7902 -> 5.7783 ms (-0.21%), with mixed blocks.
- Admitted-maximum mean: 25.4514 -> 25.3306 ms (-0.47%).
- Admitted-maximum p95 regressed 4.65%.
- Hyperfine process lane regressed from 361.7 +/- 5.8 ms to 362.8 +/- 9.3 ms.

Both exact JSON hashes remained unchanged and all native tests, rustfmt,
no-dependency strict Clippy, wasm32 check, and release wasm-pack build passed.
Because the real production artifact showed no repeatable win, the candidate
was manually removed. The FrankenSim worktree returned exactly to its pass-2
commit with no changed files.
