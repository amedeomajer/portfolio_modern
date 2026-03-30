import Link from "next/link";

export const metadata = {
  title: "Terms · Amedeo Majer",
  description: "Terms of use for this portfolio site.",
};

export default function TermsPage() {
  return (
    <div className="min-h-dvh bg-bg-black text-text-primary px-space-5 py-space-7 max-w-prose mx-auto">
      <Link
        href="/"
        className="text-text-muted hover:text-white text-sm font-medium mb-space-7 inline-block transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-muted)] rounded-sm"
      >
        ← Back home
      </Link>
      <h1 className="type-section-title font-semibold tracking-tight text-balance mb-space-4">
        Terms
      </h1>
      <p className="type-body-md text-white/80 text-pretty">
        Content on this site is for information about my work. Projects and
        case studies reflect my experience; client-owned details stay
        confidential unless agreed otherwise.
      </p>
    </div>
  );
}
