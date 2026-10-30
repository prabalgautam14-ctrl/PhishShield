import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white text-slate-900 shadow-md transition-colors dark:border-slate-800 dark:bg-[#050b14] dark:text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8">

        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-extrabold tracking-wide text-slate-900 transition hover:text-cyan-500 dark:text-white dark:hover:text-cyan-400"
        >
          🛡️ Phish<span className="text-cyan-500 dark:text-cyan-400">Shield</span>
        </Link>

        {/* Navigation Links */}
        <ul className="flex items-center gap-10 text-lg font-semibold">

          <li>
            <Link
              href="/"
              className="text-slate-700 transition hover:text-cyan-500 dark:text-slate-300 dark:hover:text-cyan-400"
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              href="/about"
              className="text-slate-700 transition hover:text-cyan-500 dark:text-slate-300 dark:hover:text-cyan-400"
            >
              About
            </Link>
          </li>

          <li>
            <Link
              href="/shorten"
              className="text-slate-700 transition hover:text-cyan-500 dark:text-slate-300 dark:hover:text-cyan-400"
            >
              Shorten
            </Link>
          </li>

          <li>
            <Link
              href="/contact"
              className="text-slate-700 transition hover:text-cyan-500 dark:text-slate-300 dark:hover:text-cyan-400"
            >
              Contact
            </Link>
          </li>

          {/* Dark / Light Mode */}
          <li>
            <ThemeToggle />
          </li>

        </ul>
      </div>
    </nav>
  );
}