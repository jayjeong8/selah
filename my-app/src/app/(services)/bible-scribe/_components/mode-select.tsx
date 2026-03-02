import { BookOpen, Shuffle } from "lucide-react";
import type { BibleBook, ScribeMode } from "../_lib/types";

interface Props {
  onSelect: (mode: ScribeMode) => void;
  onChangeTranslation: () => void;
  translationName: string;
  lastBookCode?: string;
  lastChapter?: number;
  books: BibleBook[];
}

export function ModeSelect({
  onSelect,
  onChangeTranslation,
  translationName,
  lastBookCode,
  lastChapter,
  books,
}: Props) {
  const lastBookName = lastBookCode ? books.find((b) => b.id === lastBookCode)?.name : undefined;
  const continueLabel =
    lastBookName && lastChapter ? `Continue from ${lastBookName} ${lastChapter}` : null;

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
        <button type="button" className="bs-mode-card" onClick={() => onSelect("sequential")}>
          <div className="bs-mode-icon">
            <BookOpen size={32} />
          </div>
          <div className="bs-mode-title">Sequential</div>
          <div className="bs-mode-desc">Book by book, chapter by chapter</div>
          {continueLabel && <div className="bs-mode-continue">{continueLabel}</div>}
        </button>

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
