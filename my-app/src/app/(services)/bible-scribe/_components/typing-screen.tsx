import { ArrowRight, Bookmark } from "lucide-react";
import { useState } from "react";
import type { TypingState } from "../_hooks/use-typing-engine";

interface Props {
  bookName: string;
  chapter: number;
  verseIdx: number;
  totalVerses: number;
  typingState: TypingState;
  verseText: string;
  composingText: string;
  onBack: () => void;
  onJumpVerse: (verseIdx: number) => void;
  onTapArea: () => void;
  onAddBookmark: () => void;
  onContinue: () => void;
}

export function TypingScreen({
  bookName,
  chapter,
  verseIdx,
  totalVerses,
  typingState,
  verseText,
  composingText,
  onBack,
  onJumpVerse,
  onTapArea,
  onAddBookmark,
  onContinue,
}: Props) {
  const [showVersePicker, setShowVersePicker] = useState(false);
  const verseNumbers = Array.from({ length: totalVerses }, (_, i) => i + 1);
  const progressPct =
    totalVerses > 0 ? ((verseIdx + (typingState.done ? 1 : 0)) / totalVerses) * 100 : 0;
  const normalizedText = verseText.normalize("NFC");
  const stateReady = typingState.charStates.length === normalizedText.length;

  return (
    <div className="bs-slide-up">
      {/* Header row */}
      <div className="bs-typing-header">
        <button type="button" className="bs-back-btn" onClick={onBack}>
          &larr; Back
        </button>
        <div className="bs-typing-location">
          {bookName} {chapter}
        </div>
        <button
          type="button"
          className="bs-typing-counter"
          onClick={() => setShowVersePicker((v) => !v)}
        >
          {verseIdx + 1}/{totalVerses}
        </button>
      </div>

      {/* Verse picker grid */}
      {showVersePicker && (
        <div className="bs-verse-picker bs-fade-in">
          {verseNumbers.map((num) => (
            <button
              key={num}
              type="button"
              className={`bs-chapter-btn ${num - 1 === verseIdx ? "bs-chapter-done" : ""}`}
              onClick={() => {
                onJumpVerse(num - 1);
                setShowVersePicker(false);
              }}
            >
              {num}
            </button>
          ))}
        </div>
      )}

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
