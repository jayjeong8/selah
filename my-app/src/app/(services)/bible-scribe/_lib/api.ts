import type { BibleBook, BibleVerse } from "./types";

// ── helloao.org ──

const HELLOAO_BASE = "https://bible.helloao.org/api";

interface ApiBooksResponse {
  books: {
    id: string;
    name: string;
    order: number;
    numberOfChapters: number;
    totalNumberOfVerses: number;
  }[];
}

type VerseContentItem = string | { text: string } | { noteId: number } | { lineBreak: boolean };

interface ApiChapterResponse {
  book: { id: string; name: string };
  chapter: {
    number: number;
    content: (
      | { type: "verse"; number: number; content: VerseContentItem[] }
      | { type: "heading"; content: string[] }
      | { type: "line_break" }
    )[];
  };
}

export function extractVerseText(content: VerseContentItem[]): string {
  return content
    .map((item) => {
      if (typeof item === "string") return item;
      if ("text" in item) return item.text;
      return "";
    })
    .join("")
    .trim();
}

async function fetchBooksHelloao(translationId: string): Promise<BibleBook[]> {
  const res = await fetch(`${HELLOAO_BASE}/${translationId}/books.json`);
  if (!res.ok) throw new Error(`Failed to fetch books: ${res.status}`);
  const data: ApiBooksResponse = await res.json();
  return data.books.map((b) => ({
    id: b.id,
    name: b.name,
    order: b.order,
    numberOfChapters: b.numberOfChapters,
    totalNumberOfVerses: b.totalNumberOfVerses,
  }));
}

async function fetchChapterHelloao(
  translationId: string,
  bookCode: string,
  chapter: number,
): Promise<{ bookName: string; verses: BibleVerse[] }> {
  const res = await fetch(`${HELLOAO_BASE}/${translationId}/${bookCode}/${chapter}.json`);
  if (!res.ok) throw new Error(`Failed to fetch chapter: ${res.status}`);
  const data: ApiChapterResponse = await res.json();

  const verses: BibleVerse[] = [];
  for (const item of data.chapter.content) {
    if (item.type === "verse") {
      const text = extractVerseText(item.content);
      if (text) {
        verses.push({ number: item.number, text });
      }
    }
  }

  return { bookName: data.book.name, verses };
}

// ── YouVersion ──

const YV_PROXY = "/api/youversion";

// Standard USFM book order for mapping index position → order number
const USFM_BOOK_ORDER: Record<string, number> = {
  GEN: 1,
  EXO: 2,
  LEV: 3,
  NUM: 4,
  DEU: 5,
  JOS: 6,
  JDG: 7,
  RUT: 8,
  "1SA": 9,
  "2SA": 10,
  "1KI": 11,
  "2KI": 12,
  "1CH": 13,
  "2CH": 14,
  EZR: 15,
  NEH: 16,
  EST: 17,
  JOB: 18,
  PSA: 19,
  PRO: 20,
  ECC: 21,
  SNG: 22,
  ISA: 23,
  JER: 24,
  LAM: 25,
  EZK: 26,
  DAN: 27,
  HOS: 28,
  JOL: 29,
  AMO: 30,
  OBA: 31,
  JON: 32,
  MIC: 33,
  NAM: 34,
  HAB: 35,
  ZEP: 36,
  HAG: 37,
  ZEC: 38,
  MAL: 39,
  MAT: 40,
  MRK: 41,
  LUK: 42,
  JHN: 43,
  ACT: 44,
  ROM: 45,
  "1CO": 46,
  "2CO": 47,
  GAL: 48,
  EPH: 49,
  PHP: 50,
  COL: 51,
  "1TH": 52,
  "2TH": 53,
  "1TI": 54,
  "2TI": 55,
  TIT: 56,
  PHM: 57,
  HEB: 58,
  JAS: 59,
  "1PE": 60,
  "2PE": 61,
  "1JN": 62,
  "2JN": 63,
  "3JN": 64,
  JUD: 65,
  REV: 66,
};

interface YvIndexResponse {
  books: {
    id: string;
    title: string;
    chapters: {
      id: string;
      verses: { id: string }[];
    }[];
  }[];
}

interface YvPassageResponse {
  id: string;
  content: string;
  reference: string;
}

async function fetchBooksYouVersion(versionId: string): Promise<BibleBook[]> {
  const res = await fetch(`${YV_PROXY}/bibles/${versionId}/index`);
  if (!res.ok) throw new Error(`Failed to fetch YV books: ${res.status}`);
  const data: YvIndexResponse = await res.json();

  return data.books.map((b, i) => ({
    id: b.id,
    name: b.title,
    order: USFM_BOOK_ORDER[b.id] ?? i + 1,
    numberOfChapters: b.chapters.length,
    totalNumberOfVerses: b.chapters.reduce((sum, ch) => sum + ch.verses.length, 0),
  }));
}

/**
 * Parse YouVersion HTML passage content into individual verses.
 *
 * HTML structure:
 *   <div class="p"><span class="yv-v" v="1"></span><span class="yv-vlbl">1</span>Text...</div>
 *   <div class="p"><span class="yv-v" v="6" ev="7"></span><span class="yv-vlbl">6-7</span>Combined text...</div>
 *
 * For merged verses (v="6" ev="7"), we use the starting verse number.
 */
function parseYvHtmlVerses(html: string): BibleVerse[] {
  const verses: BibleVerse[] = [];
  // Match each verse marker followed by its text content
  const versePattern =
    /<span class="yv-v"[^>]*\bv="(\d+)"[^>]*><\/span><span class="yv-vlbl">[^<]*<\/span>/g;

  let match: RegExpExecArray | null;
  const markers: { verseNum: number; index: number }[] = [];

  // biome-ignore lint/suspicious/noAssignInExpressions: regex exec pattern
  while ((match = versePattern.exec(html)) !== null) {
    markers.push({ verseNum: Number.parseInt(match[1], 10), index: match.index + match[0].length });
  }

  for (let i = 0; i < markers.length; i++) {
    const start = markers[i].index;
    const end = i + 1 < markers.length ? markers[i + 1].index : html.length;

    // Extract text between this marker and the next, stripping HTML tags
    const rawSlice = html.slice(start, end);
    // Find the actual text end (before the next verse's yv-v span)
    const nextVerseIdx = rawSlice.indexOf('<span class="yv-v"');
    const textSlice = nextVerseIdx >= 0 ? rawSlice.slice(0, nextVerseIdx) : rawSlice;

    const text = textSlice
      .replace(/<\/div>/g, " ")
      .replace(/<[^>]+>/g, "")
      .replace(/&[a-z]+;/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (text) {
      verses.push({ number: markers[i].verseNum, text });
    }
  }

  return verses;
}

async function fetchChapterYouVersion(
  versionId: string,
  bookCode: string,
  chapter: number,
): Promise<{ bookName: string; verses: BibleVerse[] }> {
  const passageId = `${bookCode}.${chapter}`;
  const res = await fetch(`${YV_PROXY}/bibles/${versionId}/passages/${passageId}?format=html`);
  if (!res.ok) throw new Error(`Failed to fetch YV chapter: ${res.status}`);
  const data: YvPassageResponse = await res.json();

  const verses = parseYvHtmlVerses(data.content);
  // reference is like "창세기 1" or "Genesis 1" — extract book name by removing chapter number
  const bookName = data.reference.replace(/\s+\d+$/, "");

  return { bookName, verses };
}

// ── Router ──

export async function fetchBooks(
  translationId: string,
  source: "helloao" | "youversion" = "helloao",
): Promise<BibleBook[]> {
  if (source === "youversion") {
    return fetchBooksYouVersion(translationId.replace("yv:", ""));
  }
  return fetchBooksHelloao(translationId);
}

export async function fetchChapter(
  translationId: string,
  bookCode: string,
  chapter: number,
  source: "helloao" | "youversion" = "helloao",
): Promise<{ bookName: string; verses: BibleVerse[] }> {
  if (source === "youversion") {
    return fetchChapterYouVersion(translationId.replace("yv:", ""), bookCode, chapter);
  }
  return fetchChapterHelloao(translationId, bookCode, chapter);
}
