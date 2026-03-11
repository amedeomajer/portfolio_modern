export const metadata = {
  title: "Pretty Sudoku Support",
  description: "Support and privacy policy information for Pretty Sudoku.",
  alternates: {
    canonical: "/pretty-sudoku/support",
  },
};

export default function PrettySudokuSupportPage() {
  return (
    <main className="min-h-screen px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-3xl">
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-white/70">Pretty Sudoku</p>
        <h1 className="mb-4 text-5xl font-semibold">Support</h1>
        <p className="mb-10 text-lg text-white/80">
          Need help? Reach out anytime and we will do our best to help quickly.
        </p>

        <section className="mb-10 rounded-2xl border border-white/20 bg-white/5 p-6">
          <h2 className="mb-3 text-3xl font-semibold">Contact</h2>
          <p className="text-lg text-white/85">
            Email:{" "}
            <a className="underline decoration-white/40 underline-offset-4" href="mailto:amedeo.majer@gmail.com">
              amedeo.majer@gmail.com
            </a>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-semibold">FAQ</h2>
          <div className="space-y-4">
            <article className="rounded-2xl border border-white/20 bg-white/5 p-6">
              <h3 className="mb-2 text-2xl font-medium">Does Pretty Sudoku require internet?</h3>
              <p className="text-white/80">No. Pretty Sudoku is fully playable offline.</p>
            </article>
            <article className="rounded-2xl border border-white/20 bg-white/5 p-6">
              <h3 className="mb-2 text-2xl font-medium">How do I change difficulty?</h3>
              <p className="text-white/80">You can select from 5 difficulty levels in the app.</p>
            </article>
            <article className="rounded-2xl border border-white/20 bg-white/5 p-6">
              <h3 className="mb-2 text-2xl font-medium">Can I customize the look of the app?</h3>
              <p className="text-white/80">Yes. Pretty Sudoku includes 8 color themes.</p>
            </article>
            <article className="rounded-2xl border border-white/20 bg-white/5 p-6">
              <h3 className="mb-2 text-2xl font-medium">I found a bug. What should I send in the email?</h3>
              <ul className="list-disc space-y-1 pl-5 text-white/80">
                <li>Device model</li>
                <li>iOS version</li>
                <li>What happened and how to reproduce it</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="rounded-2xl border border-white/20 bg-white/5 p-6">
          <h2 className="mb-3 text-3xl font-semibold">Privacy Policy</h2>
          <p className="mb-4 text-white/85">
            <strong>Effective date:</strong> March 11, 2026
          </p>
          <p className="mb-4 text-white/80">
            Pretty Sudoku (&quot;the App&quot;) is developed by Amedeo Majer (&quot;we&quot;, &quot;us&quot;,
            &quot;our&quot;). This Privacy Policy explains how information is handled when you use the App.
          </p>

          <div className="space-y-4 text-white/80">
            <div>
              <h3 className="mb-1 text-2xl font-medium text-white">1) Data We Collect</h3>
              <p className="mb-2">
                We do not require account creation and we do not directly collect personal information such as
                your name, email address, or phone number inside the App.
              </p>
              <p className="mb-2">
                The App uses Google AdMob to display ads. Through AdMob, certain data may be collected
                automatically by Google and its partners, such as device and app information, approximate
                location (based on IP), advertising identifiers, and ad performance or diagnostic data.
              </p>
              <p>
                This data is used for ad delivery, fraud prevention, and reporting. For more information:{" "}
                <a
                  className="underline decoration-white/40 underline-offset-4"
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noreferrer"
                >
                  Google Privacy Policy
                </a>
              </p>
            </div>

            <div>
              <h3 className="mb-1 text-2xl font-medium text-white">2) Non-Personalized Ads</h3>
              <p>
                Pretty Sudoku requests non-personalized ads where supported. Non-personalized ads do not use
                behavior-based personalization, but may still use limited contextual and technical data.
              </p>
            </div>

            <div>
              <h3 className="mb-1 text-2xl font-medium text-white">3) Data Stored on Device</h3>
              <p>
                Game progress, settings, and preferences are stored locally on your device. We do not operate
                our own backend to collect this data remotely.
              </p>
            </div>

            <div>
              <h3 className="mb-1 text-2xl font-medium text-white">4) Third-Party Services</h3>
              <p>The App uses Google AdMob for advertising.</p>
            </div>

            <div>
              <h3 className="mb-1 text-2xl font-medium text-white">5) Children&apos;s Privacy</h3>
              <p>
                The App is a general-audience puzzle app and is not directed to children under 13. If you
                believe a child has provided personal data, contact us and we will address the issue.
              </p>
            </div>

            <div>
              <h3 className="mb-1 text-2xl font-medium text-white">6) Your Choices</h3>
              <p>
                You can limit ad tracking through your iOS privacy settings. You can also stop all data
                collection by uninstalling the App.
              </p>
            </div>

            <div>
              <h3 className="mb-1 text-2xl font-medium text-white">7) Changes to This Policy</h3>
              <p>We may update this Privacy Policy from time to time. Updates will be posted at this URL.</p>
            </div>

            <div>
              <h3 className="mb-1 text-2xl font-medium text-white">8) Contact</h3>
              <p>
                Email:{" "}
                <a className="underline decoration-white/40 underline-offset-4" href="mailto:amedeo.majer@gmail.com">
                  amedeo.majer@gmail.com
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
