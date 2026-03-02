import { useState } from "react";
import type { BibleBook } from "../_lib/types";

interface Props {
  books: BibleBook[];
  completedChapters: Set<string>;
  translationId: string;
  isNewTestamentOnly: boolean;
  onSelect: (book: BibleBook) => void;
  onBack: () => void;
}

// Old Testament book IDs (standard Protestant order)
const OT_BOOKS = new Set([
  "GEN",
  "EXO",
  "LEV",
  "NUM",
  "DEU",
  "JOS",
  "JDG",
  "RUT",
  "1SA",
  "2SA",
  "1KI",
  "2KI",
  "1CH",
  "2CH",
  "EZR",
  "NEH",
  "EST",
  "JOB",
  "PSA",
  "PRO",
  "ECC",
  "SNG",
  "ISA",
  "JER",
  "LAM",
  "EZK",
  "DAN",
  "HOS",
  "JOL",
  "AMO",
  "OBA",
  "JON",
  "MIC",
  "NAM",
  "HAB",
  "ZEP",
  "HAG",
  "ZEC",
  "MAL",
]);

export function BookSelect({
  books,
  completedChapters,
  translationId,
  isNewTestamentOnly,
  onSelect,
  onBack,
}: Props) {
  const [activeTab, setActiveTab] = useState<"ot" | "nt">(isNewTestamentOnly ? "nt" : "ot");
  const otBooks = books.filter((b) => OT_BOOKS.has(b.id));
  const ntBooks = books.filter((b) => !OT_BOOKS.has(b.id));

  function getBookProgress(book: BibleBook): number {
    let completed = 0;
    for (let ch = 1; ch <= book.numberOfChapters; ch++) {
      if (completedChapters.has(`${translationId}/${book.id}/${ch}`)) {
        completed++;
      }
    }
    return completed;
  }

  function renderBookGrid(bookList: BibleBook[]) {
    return (
      <div className="bs-book-grid">
        {bookList.map((book) => {
          const progress = getBookProgress(book);
          const pct =
            book.numberOfChapters > 0 ? Math.round((progress / book.numberOfChapters) * 100) : 0;
          return (
            <button
              key={book.id}
              type="button"
              className="bs-book-btn"
              onClick={() => onSelect(book)}
            >
              <div className="bs-book-name">{book.name}</div>
              <div className="bs-book-meta">
                {book.numberOfChapters} ch
                {progress > 0 && <span className="bs-book-progress"> &middot; {pct}%</span>}
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bs-fade-in bs-book-select-inner">
      <div className="bs-nav-header">
        <button type="button" className="bs-back-btn" onClick={onBack}>
          &larr; Back
        </button>
        <div className="bs-nav-title">Choose a Book</div>
      </div>

      {isNewTestamentOnly ? (
        <div className="bs-book-scroll-area">{renderBookGrid(ntBooks)}</div>
      ) : (
        <>
          <div className="bs-tab-bar">
            <button
              type="button"
              className="bs-tab-btn"
              data-active={activeTab === "ot"}
              onClick={() => setActiveTab("ot")}
            >
              Old Testament
            </button>
            <button
              type="button"
              className="bs-tab-btn"
              data-active={activeTab === "nt"}
              onClick={() => setActiveTab("nt")}
            >
              New Testament
            </button>
          </div>
          <div className="bs-book-scroll-area">
            {activeTab === "ot" ? renderBookGrid(otBooks) : renderBookGrid(ntBooks)}
          </div>
        </>
      )}
    </div>
  );
}
