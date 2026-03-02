"use client";

import type { LucideIcon } from "lucide-react";
import { MonitorCog, Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type ThemeMode = "auto" | "light" | "dark";

interface UseDarkModeOptions {
  saved: ThemeMode | undefined;
  onSave: (mode: ThemeMode) => void;
}

export function useDarkMode({ saved, onSave }: UseDarkModeOptions) {
  const [mode, setMode] = useState<ThemeMode>(saved ?? "auto");

  // Sync when saved value loads from DB
  useEffect(() => {
    if (saved !== undefined) {
      setMode(saved);
    }
  }, [saved]);

  const cycle = useCallback(() => {
    const next: ThemeMode = mode === "auto" ? "light" : mode === "light" ? "dark" : "auto";
    setMode(next);
    onSave(next);
  }, [mode, onSave]);

  // Resolve the effective theme attribute for the DOM
  const themeAttr: string = mode;

  const icon: LucideIcon = mode === "auto" ? MonitorCog : mode === "light" ? Sun : Moon;

  return { mode, cycle, themeAttr, icon };
}
