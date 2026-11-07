"use client";

import { useCallback } from "react";
import { fetchBooks, fetchChapter, fetchTranslationCopyright } from "../_lib/api";
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

      // YouVersion controls retention through Cache-Control. A missing
      // directive is treated as provider-unlimited; max-age=0/no-store is not
      // persisted at all.
      if (data.cacheMaxAgeSeconds === undefined || data.cacheMaxAgeSeconds > 0) {
        const expiresAt =
          data.cacheMaxAgeSeconds === undefined
            ? undefined
            : Date.now() + data.cacheMaxAgeSeconds * 1000;
        await putCachedChapter(
          translationId,
          bookCode,
          data.bookName,
          chapter,
          data.verses,
          expiresAt,
        );
      }

      return data;
    },
    [],
  );

  return { loadBooks, loadChapter, loadCopyright: fetchTranslationCopyright };
}
