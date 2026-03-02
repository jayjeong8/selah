export type BibleLanguage = "ko" | "en" | "es" | "fr" | "de" | "zh" | "ja";

export interface TranslationMeta {
  id: string;
  name: string;
  shortName: string;
  language: BibleLanguage;
  languageName: string;
  flag: string;
  bookCount: number;
}

export interface BibleBook {
  id: string;
  name: string;
  order: number;
  numberOfChapters: number;
  totalNumberOfVerses: number;
}

export interface BibleVerse {
  number: number;
  text: string;
}

export interface ChapterData {
  translationId: string;
  bookCode: string;
  bookName: string;
  chapter: number;
  verses: BibleVerse[];
}

export interface CompletedChapter {
  translationId: string;
  bookCode: string;
  chapter: number;
  completedAt: string;
}

export interface Bookmark {
  id: string;
  translationId: string;
  bookCode: string;
  bookName: string;
  chapter: number;
  verseNumber: number;
  text: string;
  savedAt: string;
}

export interface GraceDayState {
  usedThisWeek: boolean;
  usedDate: string | null; // ISO date string (YYYY-MM-DD)
  weekStart: string; // ISO date of the Monday that started this tracking week
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  activeDates: string[]; // ISO date strings (YYYY-MM-DD)
  graceDayActive: boolean; // true if today's streak is preserved by a grace day
}

export interface BibleScribeSettings {
  translationId: string;
  soundEnabled: boolean;
  lastBookCode?: string;
  lastChapter?: number;
  graceDayState?: GraceDayState;
  darkMode?: "auto" | "light" | "dark";
}

export type ScribeMode = "sequential" | "random";
