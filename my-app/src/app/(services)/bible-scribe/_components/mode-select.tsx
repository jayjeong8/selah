import { BookOpen, Shuffle } from "lucide-react";
import type { BibleBook, GraceDayState, ScribeMode, StreakData } from "../_lib/types";
import { StreakDisplay } from "./streak-display";

interface Props {
  onSelect: (mode: ScribeMode) => void;
  onChangeTranslation: () => void;
  translationName: string;
  lastBookCode?: string;
  lastChapter?: number;
  books: BibleBook[];
  streak: StreakData;
  graceDayState: GraceDayState | undefined;
  onUseGraceDay: () => void;
}

export function ModeSelect({
  onSelect,
  onChangeTranslation,
  translationName,
  lastBookCode,
  lastChapter,
  books,
  streak,
  graceDayState,
  onUseGraceDay,
}: Props) {
  const lastBookName = lastBookCode ? books.find((b) => b.id === lastBookCode)?.name : undefined;
  const continueLabel =
    lastBookName && lastChapter ? `Continue from ${lastBookName} ${lastChapter}` : null;

  return (
    <div className="bs-fade-in">
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: "0.8rem", color: "var(--bs-secondary)" }}>{translationName}</div>
      </div>

      <StreakDisplay streak={streak} graceDayState={graceDayState} onUseGraceDay={onUseGraceDay} />

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

      <button
        type="button"
        className="bs-back-btn"
        style={{
          marginTop: 16,
          display: "block",
          width: "100%",
          textAlign: "center",
          fontSize: "1.125rem",
          padding: "6px 0",
        }}
        onClick={onChangeTranslation}
      >
        Change translation
      </button>
    </div>
  );
}
