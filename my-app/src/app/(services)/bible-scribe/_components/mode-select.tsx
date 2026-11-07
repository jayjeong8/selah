import { BookOpen, Shuffle } from "lucide-react";
import type { BibleBook, ScribeMode } from "../_lib/types";

interface Props {
  onSelect: (mode: ScribeMode) => void;
  onChangeTranslation: () => void;
  translationName: string;
  lastBookCode?: string;
  lastChapter?: number;
  books: BibleBook[];
  onContinue: () => void;
}

export function ModeSelect({
  onSelect,
  onChangeTranslation,
  translationName,
  lastBookCode,
  lastChapter,
  books,
  onContinue,
}: Props) {
  const lastBookName = lastBookCode ? books.find((b) => b.id === lastBookCode)?.name : undefined;
  const continueLabel =
    lastBookCode && lastChapter
      ? lastBookName
        ? `Continue from ${lastBookName} ${lastChapter}`
        : "Continue from your last session"
      : null;

  return (
    <div className="bs-fade-in">
      <div className="bs-nav-header">
        <button type="button" className="bs-back-btn" onClick={onChangeTranslation}>
          &larr; Back
        </button>
        <div className="bs-nav-title" style={{ color: "var(--bs-secondary)" }}>
          {translationName}
        </div>
      </div>

      <div className="bs-mode-grid">
        <div className="bs-mode-card-group">
          <button type="button" className="bs-mode-card" onClick={() => onSelect("sequential")}>
            <div className="bs-mode-icon">
              <BookOpen size={32} />
            </div>
            <div className="bs-mode-title">Sequential</div>
            <div className="bs-mode-desc">Book by book, chapter by chapter</div>
          </button>
          {continueLabel && (
            <button type="button" className="bs-mode-continue" onClick={onContinue}>
              {continueLabel} →
            </button>
          )}
        </div>

        <button type="button" className="bs-mode-card" onClick={() => onSelect("random")}>
          <div className="bs-mode-icon">
            <Shuffle size={32} />
          </div>
          <div className="bs-mode-title">Random</div>
          <div className="bs-mode-desc">Curated passages from popular books</div>
        </button>
      </div>
    </div>
  );
}
