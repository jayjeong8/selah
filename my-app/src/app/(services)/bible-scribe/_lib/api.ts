import type { BibleBook, BibleVerse } from "./types";

const API_BASE = "https://bible.helloao.org/api";

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

export async function fetchBooks(translationId: string): Promise<BibleBook[]> {
  const res = await fetch(`${API_BASE}/${translationId}/books.json`);
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

export async function fetchChapter(
  translationId: string,
  bookCode: string,
  chapter: number,
): Promise<{ bookName: string; verses: BibleVerse[] }> {
  const res = await fetch(`${API_BASE}/${translationId}/${bookCode}/${chapter}.json`);
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
