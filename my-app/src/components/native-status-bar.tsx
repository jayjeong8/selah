"use client";

import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export function NativeStatusBar() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (Capacitor.getPlatform() !== "ios") return;

    const scribe = pathname === "/bible-scribe" ? document.querySelector(".bs-root") : null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const updateStyle = () => {
      const mode = scribe?.getAttribute("data-theme");
      const dark =
        mode === "auto" ? systemTheme.matches : mode ? mode === "dark" : resolvedTheme === "dark";

      // Older installed shells can still load this website without the plugin.
      // Capacitor names styles for the background: Dark uses light system text.
      void StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light }).catch(() => {});
    };

    updateStyle();
    const observer = new MutationObserver(updateStyle);
    if (scribe) observer.observe(scribe, { attributes: true, attributeFilter: ["data-theme"] });
    systemTheme.addEventListener("change", updateStyle);

    return () => {
      observer.disconnect();
      systemTheme.removeEventListener("change", updateStyle);
    };
  }, [pathname, resolvedTheme]);

  return null;
}
