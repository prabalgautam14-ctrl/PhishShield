import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900 transition-colors dark:bg-[#050b14] dark:text-white">

      {/* Background Glow */}
      <div className="pointer-events-none fixed left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-14 text-center">

          <div className="mb-6 inline-flex items-center gap-3">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-50 dark:bg-cyan-500/10">
              <span className="text-3xl">🛡️</span>
            </div>

            <h1 className="text-4xl font-extrabold md:text-5xl">
              Phish<span className="text-cyan-500 dark:text-cyan-400">Shield</span>
            </h1>

          </div>

          <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-500 dark:text-gray-400">
            A security-focused URL shortener designed to analyze links for
            potential phishing threats before they are shortened and shared.
          </p>

        </div>

        {/* About Card */}
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-white/[0.04] md:p-10">

          <h2 className="mb-5 text-2xl font-bold">
            What is PhishShield?
          </h2>

          <p className="leading-8 text-slate-600 dark:text-gray-400">
            PhishShield combines URL shortening with machine-learning based
            phishing detection. Instead of simply creating a shortened link,
            the application first analyzes the submitted URL using security
            features extracted from the URL.
          </p>

          <p className="mt-5 leading-8 text-slate-600 dark:text-gray-400">
            If the URL is classified as potentially phishing, the application
            prevents it from being shortened. If it is classified as
            legitimate, users can create a secure short link and QR code.
          </p>

        </section>

        {/* Features */}
        <section className="mt-8 grid gap-5 md:grid-cols-2">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-colors dark:border-white/10 dark:bg-white/[0.04]">
            <div className="mb-4 text-3xl">🤖</div>

            <h3 className="text-xl font-bold">
              Machine Learning Detection
            </h3>

            <p className="mt-3 leading-7 text-slate-500 dark:text-gray-500">
              The system uses a trained machine-learning model to analyze
              characteristics of URLs and classify them as potentially
              phishing or legitimate.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-colors dark:border-white/10 dark:bg-white/[0.04]">
            <div className="mb-4 text-3xl">🔍</div>

            <h3 className="text-xl font-bold">
              URL Security Analysis
            </h3>

            <p className="mt-3 leading-7 text-slate-500 dark:text-gray-500">
              PhishShield examines URL characteristics such as IP addresses,
              URL length, subdomains, special symbols, redirects and SSL
              information.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-colors dark:border-white/10 dark:bg-white/[0.04]">
            <div className="mb-4 text-3xl">🔗</div>

            <h3 className="text-xl font-bold">
              Secure URL Shortening
            </h3>

            <p className="mt-3 leading-7 text-slate-500 dark:text-gray-500">
              URLs are shortened only after the security analysis has been
              completed and the URL passes the application's phishing check.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-colors dark:border-white/10 dark:bg-white/[0.04]">
            <div className="mb-4 text-3xl">📱</div>

            <h3 className="text-xl font-bold">
              QR Code Generation
            </h3>

            <p className="mt-3 leading-7 text-slate-500 dark:text-gray-500">
              Generated short links can also be converted into QR codes for
              convenient sharing across devices.
            </p>
          </div>

        </section>

        {/* Detection Features */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl transition-colors dark:border-white/10 dark:bg-white/[0.04] md:p-10">

          <h2 className="mb-6 text-2xl font-bold">
            Security Features Used
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/5 dark:bg-black/20">
              <p className="font-semibold text-cyan-500 dark:text-cyan-400">
                IP Address
              </p>

              <p className="mt-2 text-xs text-slate-500 dark:text-gray-500">
                Detects URLs using IP addresses.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/5 dark:bg-black/20">
              <p className="font-semibold text-cyan-500 dark:text-cyan-400">
                URL Length
              </p>

              <p className="mt-2 text-xs text-slate-500 dark:text-gray-500">
                Examines unusual URL lengths.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/5 dark:bg-black/20">
              <p className="font-semibold text-cyan-500 dark:text-cyan-400">
                Subdomains
              </p>

              <p className="mt-2 text-xs text-slate-500 dark:text-gray-500">
                Analyzes the number of subdomains.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/5 dark:bg-black/20">
              <p className="font-semibold text-cyan-500 dark:text-cyan-400">
                SSL State
              </p>

              <p className="mt-2 text-xs text-slate-500 dark:text-gray-500">
                Considers HTTPS and SSL characteristics.
              </p>
            </div>

          </div>

        </section>

        {/* How It Works */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl transition-colors dark:border-white/10 dark:bg-white/[0.04] md:p-10">

          <h2 className="mb-8 text-2xl font-bold">
            How PhishShield Works
          </h2>

          <div className="grid gap-5 md:grid-cols-4">

            <div>
              <div className="mb-3 text-2xl font-bold text-cyan-500 dark:text-cyan-400">
                01
              </div>

              <h3 className="font-bold">
                Enter URL
              </h3>

              <p className="mt-2 text-sm text-slate-500 dark:text-gray-500">
                Enter the URL you want to analyze.
              </p>
            </div>

            <div>
              <div className="mb-3 text-2xl font-bold text-cyan-500 dark:text-cyan-400">
                02
              </div>

              <h3 className="font-bold">
                Extract Features
              </h3>

              <p className="mt-2 text-sm text-slate-500 dark:text-gray-500">
                Security-related characteristics are extracted from the URL.
              </p>
            </div>

            <div>
              <div className="mb-3 text-2xl font-bold text-cyan-500 dark:text-cyan-400">
                03
              </div>

              <h3 className="font-bold">
                ML Prediction
              </h3>

              <p className="mt-2 text-sm text-slate-500 dark:text-gray-500">
                The trained model classifies the URL.
              </p>
            </div>

            <div>
              <div className="mb-3 text-2xl font-bold text-cyan-500 dark:text-cyan-400">
                04
              </div>

              <h3 className="font-bold">
                Create Link
              </h3>

              <p className="mt-2 text-sm text-slate-500 dark:text-gray-500">
                Legitimate URLs can be converted into short links.
              </p>
            </div>

          </div>

        </section>

        {/* CTA */}
        <div className="mt-12 text-center">

          <h2 className="text-2xl font-bold">
            Ready to check a URL?
          </h2>

          <p className="mt-2 text-slate-500 dark:text-gray-500">
            Analyze a link before you trust or share it.
          </p>

          <Link
            href="/shorten"
            className="mt-6 inline-block rounded-xl bg-cyan-500 px-8 py-3 font-bold text-black transition-all hover:scale-105 hover:bg-cyan-400"
          >
            🛡️ Scan a URL
          </Link>

        </div>

      </div>

    </main>
  );
}