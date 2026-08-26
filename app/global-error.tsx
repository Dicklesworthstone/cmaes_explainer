"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="gradient-shell min-h-screen flex items-center justify-center p-6 text-slate-100">
        <div className="glass-card max-w-md p-8 text-center space-y-4">
          <h2 className="text-xl font-bold font-display text-white">Something went wrong</h2>
          <p className="text-xs text-slate-400">An unexpected error occurred in the application.</p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-900 font-semibold rounded-xl text-xs transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
