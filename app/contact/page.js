"use client";

export default function Contact() {
return ( <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900 transition-colors dark:bg-[#050b14] dark:text-white"> <div className="mx-auto max-w-5xl">

```
    {/* Heading */}
    <div className="mb-14 text-center">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-600 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-400">
        🛡️ PhishShield
      </div>

      <h1 className="text-4xl font-extrabold md:text-5xl">
        Get in Touch
      </h1>

      <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
        Have a question, feedback, or collaboration idea?
        Feel free to connect with me.
      </p>
    </div>

    {/* Main Card */}
    <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-white/[0.04] md:p-10">

      {/* Intro */}
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-3xl">
          👋
        </div>

        <h2 className="mt-5 text-2xl font-bold">
          Hi, I'm Prabal Gautam
        </h2>

        <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600 dark:text-slate-400">
          I'm a B.Tech student interested in web development,
          networking, cybersecurity, and building useful projects
          like PhishShield.
        </p>
      </div>

      {/* Contact Details */}
      <div className="mt-10 grid gap-4 md:grid-cols-2">

        {/* Email */}
        <a
          href="mailto:prabal.gautam998@gmail.com?subject=PhishShield%20Inquiry"
          className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-cyan-400 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-cyan-400/40"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-xl">
              📧
            </div>

            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Email
              </p>

              <p className="mt-1 font-semibold text-cyan-600 group-hover:text-cyan-500 dark:text-cyan-400">
                prabal.gautam998@gmail.com
              </p>
            </div>
          </div>
        </a>

        {/* Location */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-xl">
              📍
            </div>

            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Location
              </p>

              <p className="mt-1 font-semibold">
                India
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Social Links */}
      <div className="mt-10">
        <h3 className="text-center text-xl font-bold">
          Connect With Me
        </h3>

        <div className="mt-6 grid gap-4 md:grid-cols-2">

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/prabal-gautam-21b6b4340"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-cyan-400 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-cyan-400/40"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0077B5] text-xl text-white">
              in
            </div>

            <div>
              <p className="font-bold">
                LinkedIn
              </p>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                View my professional profile →
              </p>
            </div>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/prabalgautam14-ctrl"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-cyan-400 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-cyan-400/40"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-xl text-white dark:bg-white dark:text-black">
              Git
            </div>

            <div>
              <p className="font-bold">
                GitHub
              </p>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                View my projects →
              </p>
            </div>
          </a>

        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-10 rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-6 text-center">
        <p className="text-slate-600 dark:text-slate-400">
          Interested in PhishShield or want to collaborate?
        </p>

        <a
          href="mailto:prabal.gautam998@gmail.com?subject=PhishShield%20Collaboration"
          className="mt-4 inline-block rounded-xl bg-cyan-500 px-7 py-3 font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-600 dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300"
        >
          📧 Send Me an Email →
        </a>
      </div>

    </div>

  </div>
</main>


);
}
