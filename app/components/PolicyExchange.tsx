"use client";

import { useCallback, useRef, useState } from "react";
import { Download, Link2, Upload } from "lucide-react";
import {
  encodePolicyFragment,
  MAX_POLICY_FILE_BYTES,
  policyFileContents,
  policyFromFileContents,
  policyShareUrl,
  type SharedPolicy,
  type SharedPolicyMeta,
} from "../lib/g1PolicyShare";
import type { PolicyFile } from "../lib/g1PolicyShare";

/**
 * Getting a trained gait out of the tab, and someone else's back in.
 *
 * Hours of search produce 5,040 numbers. Without a way to keep them, closing
 * the tab throws the run away; without a way to send them, showing a colleague
 * means telling them to run it again themselves.
 *
 * Both forms are exact float64. The file is archival; the link puts the policy
 * in the URL fragment, which never reaches a server. Lossy encodings were tried
 * and did not reproduce the trained gait, so the link is large — and the UI
 * says so rather than letting a chat app silently truncate one.
 */
export interface PolicyExchangeProps {
  /** Coefficients currently on stage, or null before any policy has arrived. */
  policy: Float64Array | null;
  /** Short slug for the downloaded file name, e.g. "g1" or "iiwa". */
  subject?: string;
  /** Panel heading; the two robots do not both have a "gait". */
  title?: string;
  /** Owner busy/readiness prevents an import from being silently discarded. */
  disabled?: boolean;
  meta: SharedPolicyMeta;
  /**
   * Physical summary written into the file, for whoever opens it later. Each
   * robot supplies the facts it is actually judged by.
   */
  measured: PolicyFile["measured"] | null;
  /** Called with an imported policy for the owner to replay. */
  onImport: (imported: SharedPolicy) => void;
}

type Notice = { tone: "ok" | "warn" | "error"; text: string } | null;

/** Chat apps and mail clients start mangling links well before browsers do. */
const FRAGILE_LINK_LENGTH = 8_000;

/** Bytes per coefficient in a link, for the size hint before one is built. */
const LINK_BYTES_PER_COEFFICIENT = 8;

export function PolicyExchange({
  policy,
  subject = "g1",
  title = "Keep this gait",
  disabled = false,
  meta,
  measured,
  onImport,
}: PolicyExchangeProps) {
  const [notice, setNotice] = useState<Notice>(null);
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement | null>(null);

  const download = useCallback(() => {
    if (!policy) return;
    // The caller decides which facts describe its robot; this just records them.
    const contents = policyFileContents(policy, meta, measured ?? undefined);
    const blob = new Blob([JSON.stringify(contents, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${subject}-${meta.task}-gen${meta.generation}.policy.json`;
    // Attached, then revoked on a later tick. Revoking synchronously after
    // click() races the browser's own fetch of the blob and cancels the
    // download before it starts; a detached anchor is likewise ignored by some
    // browsers. This worked on the walking page only by timing luck.
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    window.setTimeout(() => {
      anchor.remove();
      URL.revokeObjectURL(url);
    }, 0);
    setNotice({ tone: "ok", text: `Saved ${anchor.download} — ${policy.length} coefficients, full precision.` });
  }, [policy, subject, meta, measured]);

  const share = useCallback(async () => {
    if (!policy) return;
    setBusy(true);
    try {
      const fragment = await encodePolicyFragment(policy, meta);
      const url = policyShareUrl(window.location.origin, window.location.pathname, fragment);
      // Put it in the address bar regardless: if the clipboard is blocked, the
      // link is still somewhere the operator can copy it from by hand.
      window.history.replaceState(null, "", `#zpolicy=${fragment}`);
      const fragile = url.length > FRAGILE_LINK_LENGTH;
      try {
        await navigator.clipboard.writeText(url);
        setNotice({
          tone: fragile ? "warn" : "ok",
          text: fragile
            ? `Link copied (${Math.round(url.length / 1024)} kB). A whole policy makes a long link — paste it somewhere that will not shorten it.`
            : `Link copied (${Math.round(url.length / 1024)} kB). The policy travels inside the link; nothing is uploaded.`,
        });
      } catch {
        setNotice({
          tone: "warn",
          text: "Clipboard permission was denied — the share link is in your address bar, ready to copy.",
        });
      }
    } catch (error) {
      setNotice({
        tone: "error",
        text: error instanceof Error ? error.message : "Could not build a share link for this policy.",
      });
    } finally {
      setBusy(false);
    }
  }, [policy, meta]);

  const importFile = useCallback(
    async (file: File) => {
      setBusy(true);
      try {
        if (file.size > MAX_POLICY_FILE_BYTES) throw new Error("That policy file is too large.");
        const imported = policyFromFileContents(
          await file.text(),
          policy?.length ?? 5_040,
        );
        onImport(imported);
        // A policy from a different owner build is replayed rather than
        // refused, so where it came from has to be said out loud: the receipt
        // on screen is measured by THIS owner and may not match what the sender
        // saw. Silently replaying it would present their gait as ours.
        const foreign = imported.kernelVersion !== meta.kernelVersion;
        const missingExperiment = subject === "g1" && !imported.experiment;
        setNotice({
          tone: foreign || missingExperiment ? "warn" : "ok",
          text: foreign
            ? `Loaded a generation-${imported.generation} ${imported.task} policy trained on ${imported.kernelVersion}; this page runs ${meta.kernelVersion}. Replaying it here, so these numbers are this owner's and may differ from the sender's.`
            : missingExperiment
              ? `Loaded a generation-${imported.generation} policy without a saved scene or seed. Re-evaluating it in this owner's default scene with Seed 1.`
              : `Loaded a generation-${imported.generation} ${imported.task} policy. ${imported.experiment ? "Replaying its saved experiment now." : "Replaying it now."}`,
        });
      } catch (error) {
        setNotice({
          tone: "error",
          text: error instanceof Error ? error.message : "That file could not be read as a policy.",
        });
      } finally {
        setBusy(false);
      }
    },
    [policy, onImport, meta.kernelVersion, subject],
  );

  const ready = policy !== null && !disabled;

  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
      <div className="flex items-baseline justify-between">
        <span className="text-[0.62rem] font-semibold uppercase tracking-wider text-slate-300">
          {title}
        </span>
        <span className="font-mono text-[0.6rem] text-slate-500">
          {/* Keyed off the policy itself, not off `ready`: during a run the
              buttons are disabled but a policy plainly exists, and saying "no
              policy yet" then is simply false. */}
          {policy
            ? `${policy.length.toLocaleString()} coefficients · gen ${meta.generation.toLocaleString()}`
            : "no policy yet"}
        </span>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={download}
          disabled={!ready || busy}
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2 text-[0.68rem] font-semibold text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download className="h-3.5 w-3.5" />
          Download
        </button>
        <button
          type="button"
          onClick={share}
          disabled={!ready || busy}
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-cyan-300/25 bg-cyan-950/40 px-2 text-[0.68rem] font-semibold text-cyan-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Link2 className="h-3.5 w-3.5" />
          Share link
        </button>
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={busy || disabled}
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2 text-[0.68rem] font-semibold text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Upload className="h-3.5 w-3.5" />
          Load
        </button>
      </div>

      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          // Clear first: picking the same file twice must fire again.
          event.target.value = "";
          if (file) void importFile(file);
        }}
      />

      {notice ? (
        <p
          className={`mt-2 text-[0.62rem] leading-4 ${
            notice.tone === "error"
              ? "text-rose-300"
              : notice.tone === "warn"
                ? "text-amber-200"
                : "text-emerald-200"
          }`}
          role="status"
        >
          {notice.text}
        </p>
      ) : (
        <p className="mt-2 text-[0.62rem] leading-4 text-slate-500">
          Both are exact. The file is the archival form; the link carries the
          policy inside the URL fragment, so it is never uploaded anywhere. The
          link is long — around{" "}
          {ready
            ? `${Math.round((policy.length * LINK_BYTES_PER_COEFFICIENT * 1.37) / 1024)} kB`
            : "50 kB"}{" "}
          — because anything smaller stopped reproducing the gait that was
          trained: a rollout this long amplifies rounding, and a lossy link came
          back walking 0.57 m instead of 0.66 m.
        </p>
      )}
    </div>
  );
}
