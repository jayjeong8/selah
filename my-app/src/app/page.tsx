import { PenLine } from "lucide-react";
import { Cormorant_Garamond } from "next/font/google";
import { ServiceCard } from "@/components/service-card";
import "./home.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-home-serif",
});

const services = [
  {
    title: "Bible Scribe",
    description: "Handwrite the Word, one verse at a time",
    href: "/bible-scribe",
    icon: PenLine,
  },
];

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
          <ul className="grid gap-3">
            {services.map((service) => (
              <li key={service.href}>
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  href={service.href}
                  icon={service.icon}
                  className="home-card"
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
