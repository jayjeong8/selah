import { PenLine } from "lucide-react";
import { ServiceCard } from "@/components/service-card";

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
    <main className="flex min-h-dvh flex-col items-center justify-center p-6">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">selah</h1>
        <p className="mt-3 text-muted-foreground">Bible & Christian web services</p>
      </header>

      <nav className="mt-10 w-full max-w-sm">
        <ul className="grid gap-3">
          {services.map((service) => (
            <li key={service.href}>
              <ServiceCard
                title={service.title}
                description={service.description}
                href={service.href}
                icon={service.icon}
              />
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
