import { type DBSchema, type IDBPDatabase, openDB } from "idb";
import type { BibleScribeSettings, BibleVerse, Bookmark, CompletedChapter } from "./types";

interface CachedChapter {
  key: string; // "translationId/bookCode/chapter"
  translationId: string;
  bookCode: string;
  bookName: string;
  chapter: number;
  verses: BibleVerse[];
}

interface BibleScribeDB extends DBSchema {
  settings: {
    key: string;
    value: BibleScribeSettings;
  };
  progress: {
    key: string; // "translationId/bookCode/chapter"
    value: CompletedChapter;
    indexes: {
      "by-translation": string;
    };
  };
  bookmarks: {
    key: string; // id
    value: Bookmark;
    indexes: {
      "by-translation": string;
      "by-saved-at": string;
    };
  };
  cache: {
    key: string; // "translationId/bookCode/chapter"
    value: CachedChapter;
  };
}

const DB_NAME = "bible-scribe-v1";
const DB_VERSION = 1;
const SETTINGS_KEY = "user";

let dbPromise: Promise<IDBPDatabase<BibleScribeDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<BibleScribeDB>> {
  if (!dbPromise) {
    dbPromise = openDB<BibleScribeDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore("settings");

        const progressStore = db.createObjectStore("progress", { keyPath: "key" });
        progressStore.createIndex("by-translation", "translationId");

        const bookmarkStore = db.createObjectStore("bookmarks", { keyPath: "id" });
        bookmarkStore.createIndex("by-translation", "translationId");
        bookmarkStore.createIndex("by-saved-at", "savedAt");

        db.createObjectStore("cache", { keyPath: "key" });
      },
    });
  }
  return dbPromise;
}

function progressKey(translationId: string, bookCode: string, chapter: number): string {
  return `${translationId}/${bookCode}/${chapter}`;
}

// ── Settings ──

export async function getSettings(): Promise<BibleScribeSettings | undefined> {
  const db = await getDB();
  return db.get("settings", SETTINGS_KEY);
}

export async function putSettings(settings: BibleScribeSettings): Promise<void> {
  const db = await getDB();
  await db.put("settings", settings, SETTINGS_KEY);
}

// ── Progress ──

export async function getProgress(translationId: string): Promise<CompletedChapter[]> {
  const db = await getDB();
  return db.getAllFromIndex("progress", "by-translation", translationId);
}

export async function putProgress(entry: CompletedChapter): Promise<void> {
  const db = await getDB();
  const key = progressKey(entry.translationId, entry.bookCode, entry.chapter);
  await db.put("progress", { ...entry, key } as CompletedChapter & { key: string });
}

export async function isChapterCompleted(
  translationId: string,
  bookCode: string,
  chapter: number,
): Promise<boolean> {
  const db = await getDB();
  const key = progressKey(translationId, bookCode, chapter);
  const entry = await db.get("progress", key);
  return !!entry;
}

// ── Bookmarks ──

export async function getBookmarks(translationId?: string): Promise<Bookmark[]> {
  const db = await getDB();
  if (translationId) {
    return db.getAllFromIndex("bookmarks", "by-translation", translationId);
  }
  return db.getAll("bookmarks");
}

export async function putBookmark(bookmark: Bookmark): Promise<void> {
  const db = await getDB();
  await db.put("bookmarks", bookmark);
}

export async function removeBookmark(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("bookmarks", id);
}

// ── Cache ──

export async function getCachedChapter(
  translationId: string,
  bookCode: string,
  chapter: number,
): Promise<CachedChapter | undefined> {
  const db = await getDB();
  const key = progressKey(translationId, bookCode, chapter);
  return db.get("cache", key);
}

export async function putCachedChapter(
  translationId: string,
  bookCode: string,
  bookName: string,
  chapter: number,
  verses: BibleVerse[],
): Promise<void> {
  const db = await getDB();
  const key = progressKey(translationId, bookCode, chapter);
  await db.put("cache", { key, translationId, bookCode, bookName, chapter, verses });
}

// ── Export / Import ──

export interface ExportData {
  version: 1;
  exportedAt: string;
  settings: BibleScribeSettings | undefined;
  progress: CompletedChapter[];
  bookmarks: Bookmark[];
}

export async function exportAllData(): Promise<ExportData> {
  const db = await getDB();
  const [settings, progress, bookmarks] = await Promise.all([
    db.get("settings", SETTINGS_KEY),
    db.getAll("progress"),
    db.getAll("bookmarks"),
  ]);
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    settings,
    progress,
    bookmarks,
  };
}

export async function importAllData(data: ExportData): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(["settings", "progress", "bookmarks"], "readwrite");

  await Promise.all([
    tx.objectStore("settings").clear(),
    tx.objectStore("progress").clear(),
    tx.objectStore("bookmarks").clear(),
  ]);

  if (data.settings) {
    tx.objectStore("settings").put(data.settings, SETTINGS_KEY);
  }
  for (const entry of data.progress) {
    const key = progressKey(entry.translationId, entry.bookCode, entry.chapter);
    tx.objectStore("progress").put({ ...entry, key } as CompletedChapter & { key: string });
  }
  for (const bookmark of data.bookmarks) {
    tx.objectStore("bookmarks").put(bookmark);
  }

  await tx.done;
}
