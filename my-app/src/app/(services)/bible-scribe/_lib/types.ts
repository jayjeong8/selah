export type BibleLanguage = "ko" | "en" | "es" | "fr" | "de" | "zh" | "ja";

export interface TranslationMeta {
  id: string;
  name: string;
  shortName: string;
  language: BibleLanguage;
  languageName: string;
  flag: string;
  bookCount: number;
  source: "helloao" | "youversion";
  copyright?: string;
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

export interface BibleScribeSettings {
  translationId: string;
  soundEnabled: boolean;
  lastBookCode?: string;
  lastChapter?: number;
  darkMode?: "auto" | "light" | "dark";
}

export type ScribeMode = "sequential" | "random";
