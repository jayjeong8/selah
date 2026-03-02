import type { BibleBook, BibleVerse } from "./types";

interface RandomPassage {
  bookCode: string;
  bookName: string;
  chapter: number;
  verses: BibleVerse[];
}

// Popular books with higher weights for meaningful random passages
const POPULAR_BOOKS: Record<string, number> = {
  GEN: 3,
  PSA: 5,
  PRO: 4,
  ECC: 3,
  ISA: 2,
  MAT: 3,
  JHN: 4,
  ROM: 3,
  "1CO": 2,
  PHP: 2,
  COL: 2,
  HEB: 2,
  JAS: 2,
  "1JN": 2,
  REV: 2,
};

function weightedRandomBooks(books: BibleBook[], count: number): BibleBook[] {
  const weighted: { book: BibleBook; weight: number }[] = books.map((book) => ({
    book,
    weight: POPULAR_BOOKS[book.id] ?? 1,
  }));

  const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
  const selected: BibleBook[] = [];
  const usedIds = new Set<string>();

  while (selected.length < count && selected.length < books.length) {
    let random = Math.random() * totalWeight;
    for (const w of weighted) {
      if (usedIds.has(w.book.id)) continue;
      random -= w.weight;
      if (random <= 0) {
        selected.push(w.book);
        usedIds.add(w.book.id);
        break;
      }
    }
  }

  return selected;
}

/**
 * Select random passages for a session.
 * Picks 2-3 books, selects random chapters, then picks consecutive verses.
 * Returns ~10 verses total across passages.
 */
export function selectRandomPassages(books: BibleBook[]): { bookCode: string; chapter: number }[] {
  if (books.length === 0) return [];

  const bookCount = Math.min(books.length, 2 + Math.floor(Math.random() * 2)); // 2-3 books
  const selectedBooks = weightedRandomBooks(books, bookCount);
  const targets: { bookCode: string; chapter: number }[] = [];

  for (const book of selectedBooks) {
    const chapter = 1 + Math.floor(Math.random() * book.numberOfChapters);
    targets.push({ bookCode: book.id, chapter });
  }

  return targets;
}

/**
 * From fetched chapter verses, pick a consecutive slice of 3-4 verses.
 */
export function pickConsecutiveVerses(verses: BibleVerse[], count: number): BibleVerse[] {
  if (verses.length <= count) return verses;
  const start = Math.floor(Math.random() * (verses.length - count));
  return verses.slice(start, start + count);
}

/**
 * Build the final random session from multiple passages.
 * Each passage contributes 3-4 consecutive verses, total ~10.
 */
export function buildRandomSession(
  passages: RandomPassage[],
  targetVerses = 10,
): { bookCode: string; bookName: string; chapter: number; verse: BibleVerse }[] {
  const result: { bookCode: string; bookName: string; chapter: number; verse: BibleVerse }[] = [];
  const versesPerPassage = Math.max(3, Math.ceil(targetVerses / Math.max(passages.length, 1)));

  for (const passage of passages) {
    const picked = pickConsecutiveVerses(passage.verses, versesPerPassage);
    for (const verse of picked) {
      result.push({
        bookCode: passage.bookCode,
        bookName: passage.bookName,
        chapter: passage.chapter,
        verse,
      });
      if (result.length >= targetVerses) return result;
    }
  }

  return result;
}
