"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors dark:bg-[#050b14] dark:text-white">

      {/* Background Glow */}
      <div className="pointer-events-none fixed left-1/2 top-[-150px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 md:px-10">

          <div className="grid items-center gap-16 md:grid-cols-2">

            {/* Left Side */}
            <div className="space-y-8">

              {/* Logo / Brand */}
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-500/10">
                  <span className="text-3xl">🛡️</span>
                </div>

                <div>
                  <h2 className="text-2xl font-bold">
                    Phish<span className="text-cyan-500 dark:text-cyan-400">Shield</span>
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-gray-500">
                    AI-Powered URL Security
                  </p>
                </div>
              </div>

              {/* Main Heading */}
              <div>
                <h1 className="text-5xl font-extrabold leading-tight md:text-7xl">
                  Shorten.
                  <br />

                  <span className="text-cyan-500 dark:text-cyan-400">
                    Scan.
                  </span>

                  <br />

                  Stay Safe.
                </h1>

                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-gray-400 md:text-xl">
                  PhishShield analyzes URLs for potential phishing threats
                  before creating a shortened link. Secure your links with
                  AI-powered URL analysis.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4">

                <Link
                  href="/shorten"
                  className="rounded-xl bg-cyan-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-105 hover:bg-cyan-600 dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300"
                >
                  🛡️ Scan a URL
                </Link>

                <Link
                  href="/about"
                  className="rounded-xl border border-slate-300 bg-white px-8 py-4 text-lg font-bold text-slate-700 transition-all duration-300 hover:border-cyan-400 hover:bg-slate-100 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-cyan-400/40 dark:hover:bg-white/10"
                >
                  Learn More →
                </Link>

              </div>

              {/* Security Features */}
              <div className="flex flex-wrap gap-6 pt-4 text-sm text-slate-500 dark:text-gray-400">

                <div className="flex items-center gap-2">
                  <span className="text-cyan-500 dark:text-cyan-400">✓</span>
                  AI URL Analysis
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-cyan-500 dark:text-cyan-400">✓</span>
                  Phishing Detection
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-cyan-500 dark:text-cyan-400">✓</span>
                  Secure Short Links
                </div>

              </div>

            </div>

            {/* Right Side - Security Dashboard */}
            <div className="flex justify-center">

              <div className="relative w-full max-w-md">

                {/* Glow */}
                <div className="absolute inset-0 rounded-full bg-cyan-400/10 blur-3xl" />

                {/* Main Card */}
                <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">

                  {/* Card Header */}
                  <div className="mb-6 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10">
                        🔐
                      </div>

                      <div>
                        <h3 className="font-bold">
                          Security Scanner
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-gray-500">
                          PhishShield AI
                        </p>
                      </div>

                    </div>

                    <div className="rounded-full border border-green-400/20 bg-green-500/10 px-3 py-1 text-xs text-green-600 dark:text-green-400">
                      ● Online
                    </div>

                  </div>

                  {/* URL Box */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/30">

                    <p className="mb-2 text-xs text-slate-500 dark:text-gray-500">
                      URL ANALYSIS
                    </p>

                    <p className="break-all text-sm text-slate-700 dark:text-gray-300">
                      https://example.com/login
                    </p>

                  </div>

                  {/* Scan Result */}
                  <div className="mt-5 rounded-xl border border-green-400/20 bg-green-500/5 p-5">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                        ✓
                      </div>

                      <div>
                        <p className="font-semibold text-green-600 dark:text-green-400">
                          URL Appears Safe
                        </p>

                        <p className="text-xs text-slate-500 dark:text-gray-500">
                          Security analysis completed
                        </p>
                      </div>

                    </div>

                    {/* Probability */}
                    <div className="mt-5">

                      <div className="mb-2 flex justify-between text-xs">
                        <span className="text-slate-500 dark:text-gray-400">
                          Legitimate Probability
                        </span>

                        <span className="font-semibold text-green-600 dark:text-green-400">
                          96%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/5">
                        <div className="h-full w-[96%] rounded-full bg-green-500 dark:bg-green-400" />
                      </div>

                    </div>

                  </div>

                  {/* Features */}
                  <div className="mt-5 grid grid-cols-2 gap-3">

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/[0.03]">
                      <p className="text-xs text-slate-500 dark:text-gray-500">
                        URL Features
                      </p>

                      <p className="mt-1 text-lg font-bold">
                        8
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/[0.03]">
                      <p className="text-xs text-slate-500 dark:text-gray-500">
                        Detection
                      </p>

                      <p className="mt-1 text-lg font-bold text-cyan-500 dark:text-cyan-400">
                        ML Model
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* Bottom Feature Cards */}
          <div className="mt-20 grid gap-5 md:grid-cols-3">

            {/* Card 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-cyan-400/50 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-cyan-400/30">

              <div className="mb-4 text-2xl">🔍</div>

              <h3 className="text-lg font-bold">
                Phishing Detection
              </h3>

              <p className="mt-2 text-sm text-slate-500 dark:text-gray-500">
                Analyze suspicious URLs using machine-learning based
                security features.
              </p>

            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-cyan-400/50 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-cyan-400/30">

              <div className="mb-4 text-2xl">🔗</div>

              <h3 className="text-lg font-bold">
                Secure URL Shortening
              </h3>

              <p className="mt-2 text-sm text-slate-500 dark:text-gray-500">
                Create short, shareable links after completing a security
                analysis.
              </p>

            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-cyan-400/50 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-cyan-400/30">

              <div className="mb-4 text-2xl">📊</div>

              <h3 className="text-lg font-bold">
                Link Analytics
              </h3>

              <p className="mt-2 text-sm text-slate-500 dark:text-gray-500">
                Track clicks and manage your shortened links from your
                application.
              </p>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}