import Link from "next/link";

export const metadata = {
  title: "Privacy · Amedeo Majer",
  description: "Privacy information for this portfolio site.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-bg-black text-text-primary px-space-5 py-space-7 max-w-prose mx-auto">
      <Link
        href="/"
        className="text-text-muted hover:text-white text-sm font-medium mb-space-7 inline-block transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-muted)] rounded-sm"
      >
        ← Back home
      </Link>
      <h1 className="type-section-title font-semibold tracking-tight text-balance mb-space-4">
        Privacy
      </h1>
      <p className="type-body-md text-white/80 text-pretty">
        This site is a personal portfolio. It does not use third-party advertising
        cookies. If you contact me by email, I use your address only to reply.
      </p>
    </div>
  );
}
