import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-dvh min-h-[100vh] bg-bg-black text-text-primary flex flex-col items-center justify-center px-6 py-24">
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4">
        404
      </p>
      <h1 className="type-section-title font-semibold tracking-tight text-balance text-center mb-4">
        Page not found
      </h1>
      <p className="text-white/70 text-center max-w-md mb-10 text-pretty leading-relaxed">
        The page you asked for is missing or the link is out of date.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full border border-glass-border px-6 py-3 text-sm font-medium text-white/90 hover:border-white/25 hover:bg-white/5 active:scale-[0.98] active:translate-y-px transition-all duration-300 ease-out-fluid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-muted)]"
      >
        Back home
      </Link>
    </div>
  );
}
