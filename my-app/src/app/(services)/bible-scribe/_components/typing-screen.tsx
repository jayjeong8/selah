import { ArrowRight, Bookmark } from "lucide-react";
import type { TypingState } from "../_hooks/use-typing-engine";

interface Props {
  bookName: string;
  chapter: number;
  verseNumber: number;
  verseIdx: number;
  totalVerses: number;
  typingState: TypingState;
  verseText: string;
  composingText: string;
  showBookmarkBtn: boolean;
  onBack: () => void;
  onTapArea: () => void;
  onAddBookmark: () => void;
  onContinue: () => void;
}

export function TypingScreen({
  bookName,
  chapter,
  verseNumber,
  verseIdx,
  totalVerses,
  typingState,
  verseText,
  composingText,
  showBookmarkBtn,
  onBack,
  onTapArea,
  onAddBookmark,
  onContinue,
}: Props) {
  const progressPct =
    totalVerses > 0 ? ((verseIdx + (typingState.done ? 1 : 0)) / totalVerses) * 100 : 0;
  const normalizedText = verseText.normalize("NFC");
  const stateReady = typingState.charStates.length === normalizedText.length;

  return (
    <div className="bs-slide-up">
      <button type="button" className="bs-back-btn" onClick={onBack}>
        &larr; Back
      </button>
      {/* Header row */}
      <div className="bs-typing-header">
        <div className="bs-typing-location">
          {bookName} {chapter}
        </div>
        <div className="bs-typing-counter">
          {verseIdx + 1}/{totalVerses}
        </div>
      </div>

      {/* Verse number label */}
      <div className="bs-verse-label">Verse {verseNumber}</div>

      {/* Typing area */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: tap area wraps hidden input */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: tap area wraps hidden input */}
      <div className="bs-tap-area" onClick={onTapArea}>
        <div className="bs-verse-display">
          {normalizedText.split("").map((char, i) => {
            const charState = stateReady ? typingState.charStates[i] : null;
            const state = charState === null ? "pending" : charState ? "correct" : "error";
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: char positions stable within verse
              <span key={`${verseIdx}-${i}`} className="bs-char" data-state={state}>
                {stateReady &&
                  i === typingState.cursor &&
                  (composingText ? (
                    <span className="bs-composing">{composingText}</span>
                  ) : (
                    <span className="bs-cursor" />
                  ))}
                {char}
              </span>
            );
          })}
          {stateReady &&
            typingState.cursor === normalizedText.length &&
            !typingState.done &&
            (composingText ? (
              <span className="bs-composing">{composingText}</span>
            ) : (
              <span className="bs-cursor" />
            ))}
        </div>

        {!typingState.done && (
          <div
            className="bs-tap-hint"
            style={{ visibility: typingState.cursor === 0 ? "visible" : "hidden" }}
          >
            Tap here and start typing
          </div>
        )}
      </div>

      {/* Verse complete actions */}
      {typingState.done && (
        <div className="bs-verse-actions bs-fade-in">
          <button type="button" className="bs-bookmark-btn" onClick={onAddBookmark}>
            <Bookmark size={16} /> Bookmark
          </button>
          <button type="button" className="bs-continue-btn" onClick={onContinue}>
            Continue <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Progress bar */}
      <div className="bs-progress-bar">
        <div className="bs-progress-fill" style={{ width: `${progressPct}%` }} />
      </div>
    </div>
  );
}
