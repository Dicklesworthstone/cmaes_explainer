"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error?: Error & { digest?: string };
  reset?: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#020617] text-slate-100 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md p-8 text-center space-y-4 rounded-3xl border border-white/10 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
          <h2 className="text-xl font-bold font-display text-white">Something went wrong</h2>
          <p className="text-xs text-slate-400">
            {error?.message || "An unexpected error occurred in the application."}
          </p>
          {reset && (
            <button
              type="button"
              onClick={() => reset()}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-900 font-semibold rounded-xl text-xs transition-colors"
            >
              Try again
            </button>
          )}
        </div>
      </body>
    </html>
  );
}
