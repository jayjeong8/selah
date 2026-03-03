import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import Link from "next/link";
import "./home.css";

export const metadata: Metadata = {
  title: "selah — Pause. Reflect. Grow.",
  description:
    "Faith-based web tools for deeper Bible engagement. Transcribe Scripture verse by verse, build spiritual habits, and grow in the Word — free, offline-ready, and multilingual.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "selah — Pause. Reflect. Grow.",
    description:
      "Faith-based web tools for deeper Bible engagement. Transcribe Scripture, build spiritual habits, and grow in the Word.",
    url: "/",
  },
};

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-home-serif",
});

export default function Home() {
  return (
    <main className={`home-root ${cormorant.variable}`}>
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-20">
        {/* Title */}
        <h1
          className="home-reveal-1 text-center font-[family-name:var(--font-home-serif)] text-4xl font-light tracking-[0.35em] uppercase sm:text-5xl"
          style={{ color: "var(--home-text)" }}
        >
          selah
        </h1>

        {/* Decorative Divider */}
        <div
          className="home-reveal-2 mt-6 flex items-center gap-3"
          style={{ color: "var(--home-accent)" }}
        >
          <span className="block h-px w-8 bg-current opacity-50" />
          <span
            className="home-breathe block text-xs"
            style={{ animation: "home-breathe 4s ease-in-out infinite" }}
          >
            &#9670;
          </span>
          <span className="block h-px w-8 bg-current opacity-50" />
        </div>

        {/* Tagline */}
        <p
          className="home-reveal-3 mt-5 font-[family-name:var(--font-home-serif)] text-lg italic"
          style={{ color: "var(--home-text-muted)" }}
        >
          pause. reflect. grow.
        </p>

        {/* Services */}
        <nav className="home-reveal-4 mt-12 w-full max-w-sm">
          <Link href="/bible-scribe" className="home-entry">
            <svg
              width="48"
              height="48"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <g transform="translate(5, 4)">
                <path
                  d="M11 4 C8 4 4 5 2 7 L2 22 C4 20 8 19 11 19 Z"
                  fill="currentColor"
                  opacity="0.25"
                />
                <path
                  d="M11 4 C14 4 18 5 20 7 L20 22 C18 20 14 19 11 19 Z"
                  fill="currentColor"
                  opacity="0.18"
                />
                <line
                  x1="11"
                  y1="4"
                  x2="11"
                  y2="19"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  opacity="0.4"
                />
                <line
                  x1="4"
                  y1="9"
                  x2="9"
                  y2="9"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
                <line
                  x1="4"
                  y1="11"
                  x2="9"
                  y2="11"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
                <line
                  x1="4"
                  y1="13"
                  x2="8"
                  y2="13"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
                <line
                  x1="13"
                  y1="9"
                  x2="18"
                  y2="9"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
                <line
                  x1="13"
                  y1="11"
                  x2="18"
                  y2="11"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
                <line
                  x1="13"
                  y1="13"
                  x2="17"
                  y2="13"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
                <line
                  x1="11"
                  y1="22"
                  x2="11"
                  y2="26"
                  stroke="var(--home-accent)"
                  strokeWidth="1.2"
                />
                <line
                  x1="9"
                  y1="24"
                  x2="13"
                  y2="24"
                  stroke="var(--home-accent)"
                  strokeWidth="1.2"
                />
              </g>
            </svg>
            <span className="home-entry-title">Bible Scribe</span>
            <span className="home-entry-desc">Handwrite the Word, one verse at a time</span>
          </Link>
        </nav>
      </div>
    </main>
  );
}
