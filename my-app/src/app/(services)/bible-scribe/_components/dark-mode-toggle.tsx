import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  onCycle: () => void;
}

export function DarkModeToggle({ icon: Icon, onCycle }: Props) {
  return (
    <button type="button" className="bs-theme-toggle" onClick={onCycle} title="Toggle theme">
      <Icon size={18} />
    </button>
  );
}
