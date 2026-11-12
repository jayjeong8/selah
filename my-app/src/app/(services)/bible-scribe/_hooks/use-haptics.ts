"use client";

import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { useCallback, useRef } from "react";

/** Small, per-character feedback for the scribe input. */
export function useHaptics() {
  const enabledRef = useRef(true);

  const pulse = useCallback(() => {
    if (!enabledRef.current) return;

    // Capacitor uses UIImpactFeedbackGenerator on iOS and the native haptics
    // implementation on Android. The browser fallback keeps the web build
    // useful on devices that expose the Vibration API.
    void Haptics.impact({ style: ImpactStyle.Light }).catch(() => {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(8);
      }
    });
  }, []);

  const setEnabled = useCallback((enabled: boolean) => {
    enabledRef.current = enabled;
  }, []);

  return { pulse, setEnabled };
}
