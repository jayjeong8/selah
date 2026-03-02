import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export function ServiceCard({ title, description, href, icon: Icon }: ServiceCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-4 rounded-lg border border-border bg-card p-4",
        "transition-colors duration-200",
        "hover:border-ring/50 hover:bg-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="h-5 w-5 text-muted-foreground transition-colors duration-200 group-hover:text-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium leading-none">{title}</p>
        <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}
