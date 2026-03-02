"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type ExportData,
  exportAllData,
  getBookmarks,
  getProgress,
  getSettings,
  importAllData,
  putBookmark,
  putProgress,
  putSettings,
  removeBookmark,
} from "../_lib/db";
import type { BibleScribeSettings, Bookmark, CompletedChapter } from "../_lib/types";

export interface DBState {
  loading: boolean;
  settings: BibleScribeSettings | undefined;
  completedChapters: Set<string>;
  bookmarks: Bookmark[];
  totalCompleted: number;
}

export interface DBActions {
  saveSettings: (settings: BibleScribeSettings) => Promise<void>;
  markChapterComplete: (translationId: string, bookCode: string, chapter: number) => Promise<void>;
  addBookmark: (bookmark: Bookmark) => Promise<void>;
  deleteBookmark: (id: string) => Promise<void>;
  toggleSound: () => Promise<void>;
  saveDarkMode: (mode: "auto" | "light" | "dark") => Promise<void>;
  exportData: () => Promise<ExportData>;
  importData: (data: ExportData) => Promise<void>;
}

function chapterKey(translationId: string, bookCode: string, chapter: number): string {
  return `${translationId}/${bookCode}/${chapter}`;
}

export function useDB(): DBState & DBActions {
  const [state, setState] = useState<DBState>({
    loading: true,
    settings: undefined,
    completedChapters: new Set(),
    bookmarks: [],
    totalCompleted: 0,
  });

  const mountedRef = useRef(true);

  const loadAll = useCallback(async (translationId?: string) => {
    const settings = await getSettings();
    const tid = translationId ?? settings?.translationId;

    let progress: CompletedChapter[] = [];
    let bookmarkList: Bookmark[] = [];

    if (tid) {
      [progress, bookmarkList] = await Promise.all([getProgress(tid), getBookmarks(tid)]);
    }

    const completedSet = new Set(
      progress.map((p) => chapterKey(p.translationId, p.bookCode, p.chapter)),
    );

    // Sort bookmarks by savedAt descending
    bookmarkList.sort((a, b) => b.savedAt.localeCompare(a.savedAt));

    if (mountedRef.current) {
      setState({
        loading: false,
        settings,
        completedChapters: completedSet,
        bookmarks: bookmarkList,
        totalCompleted: progress.length,
      });
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    loadAll();
    return () => {
      mountedRef.current = false;
    };
  }, [loadAll]);

  const saveSettings = useCallback(
    async (settings: BibleScribeSettings) => {
      await putSettings(settings);
      await loadAll(settings.translationId);
    },
    [loadAll],
  );

  const markChapterComplete = useCallback(
    async (translationId: string, bookCode: string, chapter: number) => {
      await putProgress({
        translationId,
        bookCode,
        chapter,
        completedAt: new Date().toISOString(),
      });
      await loadAll(translationId);
    },
    [loadAll],
  );

  const addBookmark = useCallback(
    async (bookmark: Bookmark) => {
      await putBookmark(bookmark);
      await loadAll(bookmark.translationId);
    },
    [loadAll],
  );

  const deleteBookmark = useCallback(
    async (id: string) => {
      await removeBookmark(id);
      await loadAll(state.settings?.translationId);
    },
    [loadAll, state.settings?.translationId],
  );

  const toggleSound = useCallback(async () => {
    if (!state.settings) return;
    const updated: BibleScribeSettings = {
      ...state.settings,
      soundEnabled: !state.settings.soundEnabled,
    };
    await putSettings(updated);
    setState((prev) => ({ ...prev, settings: updated }));
  }, [state.settings]);

  const saveDarkMode = useCallback(
    async (mode: "auto" | "light" | "dark") => {
      if (!state.settings) return;
      const updated: BibleScribeSettings = { ...state.settings, darkMode: mode };
      await putSettings(updated);
      setState((prev) => ({ ...prev, settings: updated }));
    },
    [state.settings],
  );

  const exportData = useCallback(async () => {
    return exportAllData();
  }, []);

  const importDataFn = useCallback(
    async (data: ExportData) => {
      await importAllData(data);
      await loadAll();
    },
    [loadAll],
  );

  return {
    ...state,
    saveSettings,
    markChapterComplete,
    addBookmark,
    deleteBookmark,
    toggleSound,
    saveDarkMode,
    exportData,
    importData: importDataFn,
  };
}
