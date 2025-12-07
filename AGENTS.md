RULE NUMBER 1 (NEVER EVER EVER FORGET THIS RULE!!!): YOU ARE NEVER ALLOWED TO DELETE A FILE WITHOUT EXPRESS PERMISSION FROM ME OR A DIRECT COMMAND FROM ME. EVEN A NEW FILE THAT YOU YOURSELF CREATED, SUCH AS A TEST CODE FILE. YOU HAVE A HORRIBLE TRACK RECORD OF DELETING CRITICALLY IMPORTANT FILES OR OTHERWISE THROWING AWAY TONS OF EXPENSIVE WORK THAT I THEN NEED TO PAY TO REPRODUCE. AS A RESULT, YOU HAVE PERMANENTLY LOST ANY AND ALL RIGHTS TO DETERMINE THAT A FILE OR FOLDER SHOULD BE DELETED. YOU MUST **ALWAYS** ASK AND *RECEIVE* CLEAR, WRITTEN PERMISSION FROM ME BEFORE EVER EVEN THINKING OF DELETING A FILE OR FOLDER OF ANY KIND!!!

### IRREVERSIBLE GIT & FILESYSTEM ACTIONS — DO-NOT-EVER BREAK GLASS

1. **Absolutely forbidden commands:** `git reset --hard`, `git clean -fd`, `rm -rf`, or any command that can delete or overwrite code/data must never be run unless the user explicitly provides the exact command and states, in the same message, that they understand and want the irreversible consequences.
2. **No guessing:** If there is any uncertainty about what a command might delete or overwrite, stop immediately and ask the user for specific approval. “I think it’s safe” is never acceptable.
3. **Safer alternatives first:** When cleanup or rollbacks are needed, request permission to use non-destructive options (`git status`, `git diff`, `git stash`, copying to backups) before ever considering a destructive command.
4. **Mandatory explicit plan:** Even after explicit user authorization, restate the command verbatim, list exactly what will be affected, and wait for a confirmation that your understanding is correct. Only then may you execute it—if anything remains ambiguous, refuse and escalate.
5. **Document the confirmation:** When running any approved destructive command, record (in the session notes / final response) the exact user text that authorized it, the command actually run, and the execution time. If that record is absent, the operation did not happen.

We only use **bun** in this project, NEVER `npm`, `yarn`, or `pnpm`. We target the latest **Node.js** version for both local development and Vercel deployments, and we do **not** care about compatibility with older Node versions. Dependencies are managed **exclusively** via `package.json` + `bun.lock`; do **not** introduce `package-lock.json`, `yarn.lock`, or any other lockfiles.

### IRREVERSIBLE GIT & FILESYSTEM ACTIONS — DO-NOT-EVER BREAK GLASS

1. **Absolutely forbidden commands:** `git reset --hard`, `git clean -fd`, `rm -rf`, or any command that can delete or overwrite code/data must never be run unless the user explicitly provides the exact command and states, in the same message, that they understand and want the irreversible consequences.
2. **No guessing:** If there is any uncertainty about what a command might delete or overwrite, stop immediately and ask the user for specific approval. “I think it’s safe” is never acceptable.
3. **Safer alternatives first:** When cleanup or rollbacks are needed, request permission to use non-destructive options (`git status`, `git diff`, `git stash`, copying to backups) before ever considering a destructive command.
4. **Mandatory explicit plan:** Even after explicit user authorization, restate the command verbatim, list exactly what will be affected, and wait for a confirmation that your understanding is correct. Only then may you execute it—if anything remains ambiguous, refuse and escalate.
5. **Document the confirmation:** When running any approved destructive command, record (in the session notes / final response) the exact user text that authorized it, the command actually run, and the execution time. If that record is absent, the operation did not happen.

### Code Editing Discipline

NEVER run a script that processes/changes code files in this repo, EVER. No “code mods” you just invented, no giant regex-based `sed` one-liners, no auto-refactor scripts that touch large parts of the tree.

That sort of brittle, regex-based stuff is always a huge disaster and creates far more problems than it ever solves.

* If many changes are needed but they’re **mechanical**, use several subagents in parallel to make the edits, but still apply them **manually** and review diffs.
* If changes are **subtle or complex**, you must methodically do them yourself, carefully, file by file.

---

### Backwards Compatibility & File Sprawl

We do **not** care about backwards compatibility right now—we’re early, we want the cleanest possible architecture with **zero tech debt**:

* Do **not** create “compatibility shims”.
* Do **not** keep old APIs around just in case. Migrate callers and delete the old API (subject to the no-deletion rule for files; code removal inside a file is fine).

We must AVOID uncontrolled proliferation of code files:

* If you want to change something or add a feature, you MUST revise the **existing** code file in place.
* You may NEVER, *EVER* take an existing file like `documentProcessor.ts` and create `documentProcessorV2.ts`, `documentProcessorImproved.ts`, `documentProcessorUnified.ts`, or anything like that.
* New code files are reserved for **genuinely new domains** that make no sense to fold into any existing module.
* The bar for adding a new file should be **incredibly high**.


---

### Logging & Console Output

We want all CLI / server-side output to be informative, structured, and easy to scan in Vercel logs:

* Prefer a shared logging utility (e.g., `logger` in `lib/logger.ts` built on something like `pino` or `consola`) instead of raw `console.log`.
* No random `console.log` / `console.error` sprinkled across UI components. If you need diagnostics, either:

  * Use the shared logger with appropriate log levels, or
  * Use dev-only logging that is removed or guarded before merge.
* Log **context** (IDs, user, request, model name, etc.), not just free-form strings.

If the repo already has a logging helper, you MUST use that, not invent a new pattern.

---


### UI Smoke Testing Playbook (Playwright + Chrome)

Goal: fast manual/automated sanity sweep with screenshots and console/error capture, reproducible by any agent.

1) Prep
   - Ensure deps installed (`bun install`) and `.env`/`.env.local` already present (never commit or overwrite).
   - One-time: `bunx playwright install chromium` (only if Chromium missing).

2) Start app
   - Terminal A: `PORT=3200 HOSTNAME=0.0.0.0 bun dev` (or existing start script). Keep running.
   - Health check: `curl -I http://localhost:3200/` and `curl -s http://localhost:3200/api/health || true` (non-fatal if health route absent).

3) Run smoke script (Terminal B)
   - Create a dated run dir: `run_dir=tmp/ui-smoke/$(date +%Y%m%d-%H%M%S); mkdir -p "$run_dir"`.
   - Node snippet (headless new Chrome) targets a few key pages, logs console/network errors, saves screenshots:
```bash
node <<'NODE'
import { chromium } from 'playwright';
import fs from 'fs';
const base = process.env.BASE_URL || 'http://localhost:3200';
const out = process.env.RUN_DIR || 'tmp/ui-smoke';
fs.mkdirSync(out, { recursive: true });

const targets = [
  '/',
  '/checkout',
  '/admin',
];

const errors = [];

const logError = (page, kind, msg) => {
  errors.push({ page: page.url(), kind, message: msg, ts: Date.now() });
};

const run = async () => {
  const browser = await chromium.launch({ headless: 'new' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') logError(page, 'console', msg.text());
  });
  page.on('pageerror', (err) => logError(page, 'pageerror', err.message));
  page.on('requestfailed', (req) => logError(page, 'requestfailed', `${req.method()} ${req.url()} ${req.failure()?.errorText}`));

  for (const path of targets) {
    const url = base + path;
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const name = path === '/' ? 'home' : path.replace(/\//g, '_').replace(/^_/, '');
    await page.screenshot({ path: `${out}/${name || 'home'}.png`, fullPage: true });
  }

  await browser.close();
  fs.writeFileSync(`${out}/errors.json`, JSON.stringify(errors, null, 2));
};

run().catch((err) => { console.error(err); process.exit(1); });
NODE
```

4) Review
   - Inspect `${run_dir}/*.png` for obvious layout/SSR/hydration issues.
   - Check `${run_dir}/errors.json` for console/page/network errors; surface anything non-trivial.

5) Cleanup
   - Stop `bun dev` when finished.
   - Never delete artifacts; keep `tmp/ui-smoke/*` unless user explicitly approves deletion.

---

### Static Analysis & Type Safety

**CRITICAL:** Whenever you make any substantive changes or additions to the TypeScript / React / Next.js code, you MUST check that you didn't introduce lint or type errors.

Run (or the project’s equivalent scripts):

```bash
# Lint (ESLint flat config or Biome)
bun lint

# Type-check (no emit)
bun typecheck

# Format (Prettier or Biome)
bun format
```


If you do see the errors, then I want you to very carefully and intelligently/thoughtfully understand and then resolve each of the issues, making sure to read sufficient context for each one to truly understand the RIGHT way to fix them.


## Integrating with Beads (dependency‑aware task planning)

Beads provides a lightweight, dependency‑aware issue database and a CLI (`bd`) for selecting “ready work,” setting priorities, and tracking status. It complements MCP Agent Mail’s messaging, audit trail, and file‑reservation signals. Project: [steveyegge/beads](https://github.com/steveyegge/beads)

Recommended conventions
- **Single source of truth**: Use **Beads** for task status/priority/dependencies; use **Agent Mail** for conversation, decisions, and attachments (audit).
- **Shared identifiers**: Use the Beads issue id (e.g., `bd-123`) as the Mail `thread_id` and prefix message subjects with `[bd-123]`.
- **Reservations**: When starting a `bd-###` task, call `file_reservation_paths(...)` for the affected paths; include the issue id in the `reason` and release on completion.

Typical flow (agents)
1) **Pick ready work** (Beads)
   - `bd ready --json` → choose one item (highest priority, no blockers)
2) **Reserve edit surface** (Mail)
   - `file_reservation_paths(project_key, agent_name, ["src/**"], ttl_seconds=3600, exclusive=true, reason="bd-123")`
3) **Announce start** (Mail)
   - `send_message(..., thread_id="bd-123", subject="[bd-123] Start: <short title>", ack_required=true)`
4) **Work and update**
   - Reply in‑thread with progress and attach artifacts/images; keep the discussion in one thread per issue id
5) **Complete and release**
   - `bd close bd-123 --reason "Completed"` (Beads is status authority)
   - `release_file_reservations(project_key, agent_name, paths=["src/**"])`
   - Final Mail reply: `[bd-123] Completed` with summary and links

Mapping cheat‑sheet
- **Mail `thread_id`** ↔ `bd-###`
- **Mail subject**: `[bd-###] …`
- **File reservation `reason`**: `bd-###`
- **Commit messages (optional)**: include `bd-###` for traceability

Event mirroring (optional automation)
- On `bd update --status blocked`, send a high‑importance Mail message in thread `bd-###` describing the blocker.
- On Mail “ACK overdue” for a critical decision, add a Beads label (e.g., `needs-ack`) or bump priority to surface it in `bd ready`.

Pitfalls to avoid
- Don’t create or manage tasks in Mail; treat Beads as the single task queue.
- Always include `bd-###` in message `thread_id` to avoid ID drift across tools.

### ast-grep vs ripgrep (quick guidance)

**Use `ast-grep` when structure matters.** It parses code and matches AST nodes, so results ignore comments/strings, understand syntax, and can **safely rewrite** code.

* Refactors/codemods: rename APIs, change import forms, rewrite call sites or variable kinds.
* Policy checks: enforce patterns across a repo (`scan` with rules + `test`).
* Editor/automation: LSP mode; `--json` output for tooling.

**Use `ripgrep` when text is enough.** It’s the fastest way to grep literals/regex across files.

* Recon: find strings, TODOs, log lines, config values, or non‑code assets.
* Pre-filter: narrow candidate files before a precise pass.

**Rule of thumb**

* Need correctness over speed, or you’ll **apply changes** → start with `ast-grep`.
* Need raw speed or you’re just **hunting text** → start with `rg`.
* Often combine: `rg` to shortlist files, then `ast-grep` to match/modify with precision.

**Snippets**

Find structured code (ignores comments/strings):

```bash
ast-grep run -l TypeScript -p 'import $X from "$P"'
```

Codemod (only real `var` declarations become `let`):

```bash
ast-grep run -l JavaScript -p 'var $A = $B' -r 'let $A = $B' -U
```

Quick textual hunt:

```bash
rg -n 'console\.log\(' -t js
```

Combine speed + precision:

```bash
rg -l -t ts 'useQuery\(' | xargs ast-grep run -l TypeScript -p 'useQuery($A)' -r 'useSuspenseQuery($A)' -U
```

**Mental model**

* Unit of match: `ast-grep` = node; `rg` = line.
* False positives: `ast-grep` low; `rg` depends on your regex.
* Rewrites: `ast-grep` first-class; `rg` requires ad‑hoc sed/awk and risks collateral edits.


---

## UBS Quick Reference for AI Agents

UBS stands for "Ultimate Bug Scanner": **The AI Coding Agent's Secret Weapon: Flagging Likely Bugs for Fixing Early On**

**Install:**

```bash
curl -sSL https://raw.githubusercontent.com/Dicklesworthstone/ultimate_bug_scanner/main/install.sh | bash
```

**Golden Rule:** `ubs <changed-files>` before every commit. Exit 0 = safe. Exit >0 = fix & re-run.

**Commands:**

```bash
ubs file.ts file2.ts                    # Specific files (< 1s) — USE THIS
ubs $(git diff --name-only --cached)    # Staged files — before commit
ubs --only=js,ts src/                   # Language filter (3-5x faster)
ubs --ci --fail-on-warning .            # CI mode — before PR
ubs --help                              # Full command reference
ubs sessions --entries 1                # Tail the latest install session log
ubs .                                   # Whole project (ignores things like .next, node_modules automatically)
```

**Output Format:**

```text
⚠️  Category (N errors)
    file.ts:42:5 – Issue description
    💡 Suggested fix
Exit code: 1
```

Parse: `file:line:col` → location | 💡 → how to fix | Exit 0/1 → pass/fail

**Fix Workflow:**

1. Read finding → category + fix suggestion.
2. Navigate `file:line:col` → view context.
3. Verify real issue (not false positive).
4. Fix root cause (not symptom).
5. Re-run `ubs <file>` → exit 0.
6. Commit.

**Speed Critical:** Scope to changed files. `ubs src/file.ts` (< 1s) vs `ubs .` (30s). Never full scan for small edits.

**Bug Severity:**

* **Critical** (always fix): null/undefined safety, injection vulnerabilities, race conditions, resource leaks.
* **Important** (production): type narrowing, error handling, performance landmines.
* **Contextual** (judgment): TODO/FIXME, excessive console logs.

**Anti-Patterns:**

* ❌ Ignore findings → ✅ Investigate each.
* ❌ Full scan per edit → ✅ Scope to changed files.
* ❌ Fix symptom only → ✅ Fix root cause.
