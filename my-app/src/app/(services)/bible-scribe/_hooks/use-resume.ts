"use client";

import { useCallback, useEffect, useState } from "react";

export interface ResumePosition {
  bookCode: string;
  chapter: number;
  verseNumber: number;
  verseText: string;
  input: string;
}

function readPosition(key: string): ResumePosition | undefined {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "null");
    if (
      value &&
      typeof value.bookCode === "string" &&
      Number.isInteger(value.chapter) &&
      value.chapter > 0 &&
      Number.isInteger(value.verseNumber) &&
      value.verseNumber > 0 &&
      typeof value.verseText === "string" &&
      typeof value.input === "string"
    )
      return value;
  } catch {
    // A damaged or unavailable local store must not prevent typing.
  }
  return undefined;
}

export function useResume(translationId?: string) {
  const key = `bible-scribe-resume:${translationId ?? ""}`;
  const [saved, setSaved] = useState<{ key: string; position?: ResumePosition }>();

  useEffect(() => {
    setSaved({ key, position: readPosition(key) });
  }, [key]);

  const save = useCallback(
    (position: ResumePosition) => {
      if (!translationId) return;
      try {
        localStorage.setItem(key, JSON.stringify(position));
      } catch {
        // Keep this session usable when device storage is unavailable.
      }
      setSaved({ key, position });
    },
    [key, translationId],
  );

  return { position: saved?.key === key ? saved.position : undefined, save };
}
