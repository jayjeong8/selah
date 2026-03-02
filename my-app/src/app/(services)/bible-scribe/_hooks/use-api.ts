"use client";

import { useCallback } from "react";
import { fetchBooks, fetchChapter } from "../_lib/api";
import { getCachedChapter, putCachedChapter } from "../_lib/db";
import { getTranslationById } from "../_lib/translations";
import type { BibleBook, BibleVerse } from "../_lib/types";

export function useApi() {
  const loadBooks = useCallback(async (translationId: string): Promise<BibleBook[]> => {
    const source = getTranslationById(translationId)?.source ?? "helloao";
    return fetchBooks(translationId, source);
  }, []);

  const loadChapter = useCallback(
    async (
      translationId: string,
      bookCode: string,
      chapter: number,
    ): Promise<{ bookName: string; verses: BibleVerse[] }> => {
      // Check cache first
      const cached = await getCachedChapter(translationId, bookCode, chapter);
      if (cached) {
        return { bookName: cached.bookName, verses: cached.verses };
      }

      // Fetch from API (route based on source)
      const source = getTranslationById(translationId)?.source ?? "helloao";
      const data = await fetchChapter(translationId, bookCode, chapter, source);

      // Cache the result (chapter data is immutable, no expiry needed)
      await putCachedChapter(translationId, bookCode, data.bookName, chapter, data.verses);

      return data;
    },
    [],
  );

  return { loadBooks, loadChapter };
}
