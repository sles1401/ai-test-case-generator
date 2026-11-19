import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

const LOADING_MESSAGES = [
  'Analyzing requirements...',
  'Identifying edge cases & risk areas...',
  'Drafting test scenarios...',
  'Structuring test steps & assertions...',
];

export function LoadingState() {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(18);

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 450);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 94) return prev;
        return Math.min(94, prev + Math.floor(Math.random() * 14) + 6);
      });
    }, 220);

    return () => {
      clearInterval(messageTimer);
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <section
      aria-live="polite"
      className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs"
    >
      {/* Contextual status + progress bar */}
      <div className="mb-6">
        <div className="mb-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Sparkles className="h-4 w-4 animate-pulse" />
            </div>
            <span className="text-sm font-semibold text-slate-800 transition-opacity duration-200">
              {LOADING_MESSAGES[stepIndex]}
            </span>
          </div>
          <span className="font-mono text-xs font-medium text-indigo-600">
            {progress}%
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Skeleton Loader */}
      <div className="space-y-3">
        <div className="grid grid-cols-12 gap-3 rounded-xl bg-slate-50 px-4 py-3">
          <div className="col-span-2 h-3 animate-pulse rounded bg-slate-200" />
          <div className="col-span-4 h-3 animate-pulse rounded bg-slate-200" />
          <div className="col-span-2 h-3 animate-pulse rounded bg-slate-200" />
          <div className="col-span-4 h-3 animate-pulse rounded bg-slate-200" />
        </div>

        {[0, 1, 2, 3].map((row) => (
          <div
            key={row}
            className="grid grid-cols-12 items-start gap-3 rounded-xl border border-slate-100 px-4 py-4"
          >
            <div className="col-span-2 flex items-center gap-2">
              <div className="h-5 w-14 animate-pulse rounded-md bg-slate-200/80" />
            </div>
            <div className="col-span-4 space-y-2">
              <div className="h-3.5 w-11/12 animate-pulse rounded bg-slate-200/80" />
              <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" />
            </div>
            <div className="col-span-2">
              <div className="h-5 w-16 animate-pulse rounded-full bg-indigo-100/70" />
            </div>
            <div className="col-span-4 space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-slate-200/70" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
