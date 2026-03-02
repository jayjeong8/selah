"use client";

import { Bookmark as BookmarkIcon, Sparkles, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useApi } from "../_hooks/use-api";
import { useDarkMode } from "../_hooks/use-dark-mode";
import { useDB } from "../_hooks/use-db";
import { useKeySound } from "../_hooks/use-key-sound";
import { useTypingEngine } from "../_hooks/use-typing-engine";
import { buildRandomSession, selectRandomPassages } from "../_lib/random-session";
import { getTranslationById } from "../_lib/translations";
import type { BibleBook, BibleVerse, Bookmark, ScribeMode } from "../_lib/types";
import { BookSelect } from "./book-select";
import { BookmarksView } from "./bookmarks-view";
import { ChapterSelect } from "./chapter-select";
import { DarkModeToggle } from "./dark-mode-toggle";
import { ModeSelect } from "./mode-select";
import { TranslationSelect } from "./translation-select";
import { TypingScreen } from "./typing-screen";

type Phase =
  | "loading"
  | "translation-select"
  | "mode-select"
  | "book-select"
  | "chapter-select"
  | "typing"
  | "chapter-done"
  | "session-done"
  | "bookmarks";

interface SequentialState {
  bookCode: string;
  bookName: string;
  chapter: number;
  verses: BibleVerse[];
  verseIdx: number;
  totalChapters: number;
}

interface RandomVerseItem {
  bookCode: string;
  bookName: string;
  chapter: number;
  verse: BibleVerse;
}

export function BibleScribe() {
  const db = useDB();
  const api = useApi();
  const sound = useKeySound();
  const theme = useDarkMode({ saved: db.settings?.darkMode, onSave: db.saveDarkMode });
  const [phase, setPhase] = useState<Phase>("loading");
  const [mode, setMode] = useState<ScribeMode>("sequential");
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [seqState, setSeqState] = useState<SequentialState | null>(null);
  const [randomVerses, setRandomVerses] = useState<RandomVerseItem[]>([]);
  const [randomIdx, setRandomIdx] = useState(0);
  const [showBookmarkBtn, setShowBookmarkBtn] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [composingText, setComposingText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const currentVerse =
    mode === "sequential" ? seqState?.verses[seqState.verseIdx] : randomVerses[randomIdx]?.verse;
  const currentBookName =
    mode === "sequential" ? (seqState?.bookName ?? "") : (randomVerses[randomIdx]?.bookName ?? "");
  const currentChapter =
    mode === "sequential" ? (seqState?.chapter ?? 0) : (randomVerses[randomIdx]?.chapter ?? 0);
  const totalVerses = mode === "sequential" ? (seqState?.verses.length ?? 0) : randomVerses.length;
  const currentVerseIdx = mode === "sequential" ? (seqState?.verseIdx ?? 0) : randomIdx;

  const typing = useTypingEngine({
    onCharCorrect: () => sound.play("correct"),
    onCharError: () => sound.play("error"),
    onVerseDone: () => {
      sound.play("verse-done");
      setShowBookmarkBtn(true);
    },
  });

  // Phase transitions
  useEffect(() => {
    if (db.loading) return;
    if (phase !== "loading") return;

    if (!db.settings?.translationId) {
      setPhase("translation-select");
    } else {
      setPhase("mode-select");
    }
  }, [db.loading, db.settings, phase]);

  // Sound sync
  useEffect(() => {
    sound.setEnabled(db.settings?.soundEnabled ?? true);
  }, [db.settings?.soundEnabled, sound]);

  // Start typing when verse changes
  useEffect(() => {
    if (phase === "typing" && currentVerse) {
      typing.start(currentVerse.text);
      setShowBookmarkBtn(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [phase, currentVerse, typing.start]);

  const handleSelectTranslation = useCallback(
    async (translationId: string) => {
      sound.init();
      await db.saveSettings({
        translationId,
        soundEnabled: db.settings?.soundEnabled ?? true,
        lastBookCode: db.settings?.lastBookCode,
        lastChapter: db.settings?.lastChapter,
      });
      setPhase("mode-select");
    },
    [db, sound],
  );

  const handleSelectMode = useCallback(
    async (selectedMode: ScribeMode) => {
      setMode(selectedMode);
      const translationId = db.settings?.translationId;
      if (!translationId) return;

      setLoadingData(true);
      try {
        const bookList = await api.loadBooks(translationId);
        setBooks(bookList);

        if (selectedMode === "sequential") {
          setPhase("book-select");
        } else {
          // Random mode: pick passages
          const targets = selectRandomPassages(bookList);
          const passages = await Promise.all(
            targets.map(async (t) => {
              const data = await api.loadChapter(translationId, t.bookCode, t.chapter);
              return {
                bookCode: t.bookCode,
                bookName: data.bookName,
                chapter: t.chapter,
                verses: data.verses,
              };
            }),
          );
          const session = buildRandomSession(passages);
          setRandomVerses(session);
          setRandomIdx(0);
          setPhase("typing");
          inputRef.current?.focus();
        }
      } finally {
        setLoadingData(false);
      }
    },
    [db.settings, api],
  );

  const handleSelectBook = useCallback((book: BibleBook) => {
    setSeqState({
      bookCode: book.id,
      bookName: book.name,
      chapter: 0,
      verses: [],
      verseIdx: 0,
      totalChapters: book.numberOfChapters,
    });
    setPhase("chapter-select");
  }, []);

  const handleSelectChapter = useCallback(
    async (chapter: number) => {
      if (!seqState || !db.settings?.translationId) return;
      setLoadingData(true);
      try {
        const data = await api.loadChapter(db.settings.translationId, seqState.bookCode, chapter);
        setSeqState((prev) =>
          prev
            ? {
                ...prev,
                chapter,
                bookName: data.bookName,
                verses: data.verses,
                verseIdx: 0,
              }
            : null,
        );
        await db.saveSettings({
          ...db.settings,
          lastBookCode: seqState.bookCode,
          lastChapter: chapter,
        });
        setPhase("typing");
        inputRef.current?.focus();
      } finally {
        setLoadingData(false);
      }
    },
    [seqState, db, api],
  );

  const handleNextVerse = useCallback(() => {
    inputRef.current?.focus();

    if (mode === "sequential" && seqState) {
      const nextIdx = seqState.verseIdx + 1;
      if (nextIdx >= seqState.verses.length) {
        // Chapter complete
        sound.play("chapter-done");
        db.markChapterComplete(
          db.settings?.translationId ?? "",
          seqState.bookCode,
          seqState.chapter,
        );
        setPhase("chapter-done");
      } else {
        setSeqState((prev) => (prev ? { ...prev, verseIdx: nextIdx } : null));
      }
    } else {
      const nextIdx = randomIdx + 1;
      if (nextIdx >= randomVerses.length) {
        sound.play("chapter-done");
        setPhase("session-done");
      } else {
        setRandomIdx(nextIdx);
      }
    }
  }, [mode, seqState, randomIdx, randomVerses.length, db, sound]);

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (phase !== "typing") return;
      if (typing.state.done) return;
      const val = (e.target as HTMLInputElement).value;
      typing.handleInput(val);
    },
    [phase, typing.state.done, typing.handleInput],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (phase === "typing" && typing.state.done) {
        e.preventDefault();
      }
    },
    [phase, typing.state.done],
  );

  const handleTapArea = useCallback(() => {
    if (!typing.state.done) {
      inputRef.current?.focus();
    }
  }, [typing.state.done]);

  const handleAddBookmark = useCallback(() => {
    if (!currentVerse || !db.settings?.translationId) return;
    const bookCode = mode === "sequential" ? seqState?.bookCode : randomVerses[randomIdx]?.bookCode;
    if (!bookCode) return;

    const bookmark: Bookmark = {
      id: `${db.settings.translationId}/${bookCode}/${currentChapter}/${currentVerse.number}`,
      translationId: db.settings.translationId,
      bookCode,
      bookName: currentBookName,
      chapter: currentChapter,
      verseNumber: currentVerse.number,
      text: currentVerse.text,
      savedAt: new Date().toISOString(),
    };
    db.addBookmark(bookmark);
  }, [currentVerse, db, mode, seqState, randomVerses, randomIdx, currentChapter, currentBookName]);

  const handleNextChapter = useCallback(async () => {
    if (!seqState || !db.settings?.translationId) return;
    const nextChapter = seqState.chapter + 1;
    if (nextChapter > seqState.totalChapters) {
      setPhase("book-select");
      return;
    }
    await handleSelectChapter(nextChapter);
  }, [seqState, db.settings, handleSelectChapter]);

  const translationName = db.settings?.translationId
    ? (getTranslationById(db.settings.translationId)?.shortName ?? db.settings.translationId)
    : "";

  // Completed chapters for current book
  const bookCompletedCount =
    seqState && db.settings?.translationId
      ? [...db.completedChapters].filter((k) =>
          k.startsWith(`${db.settings?.translationId}/${seqState.bookCode}/`),
        ).length
      : 0;

  return (
    <div className="bs-root" data-theme={theme.themeAttr}>
      <div className="bs-container">
        <div className="bs-header">
          <button
            type="button"
            className="bs-title"
            onClick={() =>
              setPhase(db.settings?.translationId ? "mode-select" : "translation-select")
            }
          >
            Bible<span className="bs-title-accent">Scribe</span>
          </button>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {db.settings && phase !== "bookmarks" && (
              <button
                type="button"
                className="bs-icon-btn"
                onClick={() => setPhase("bookmarks")}
                title="Bookmarks"
              >
                <BookmarkIcon size={18} />
              </button>
            )}
            {db.settings && (
              <button type="button" className="bs-icon-btn" onClick={db.toggleSound}>
                {db.settings.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
            )}
            <DarkModeToggle icon={theme.icon} onCycle={theme.cycle} />
          </div>
        </div>

        <div className="bs-card">
          {/* Loading */}
          {(phase === "loading" || loadingData) && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--bs-secondary)" }}>
              Loading...
            </div>
          )}

          {/* Translation Select */}
          {phase === "translation-select" && !loadingData && (
            <TranslationSelect onSelect={handleSelectTranslation} />
          )}

          {/* Mode Select */}
          {phase === "mode-select" && !loadingData && (
            <ModeSelect
              onSelect={handleSelectMode}
              onChangeTranslation={() => setPhase("translation-select")}
              translationName={translationName}
              lastBookCode={db.settings?.lastBookCode}
              lastChapter={db.settings?.lastChapter}
              books={books}
            />
          )}

          {/* Book Select */}
          {phase === "book-select" && !loadingData && (
            <BookSelect
              books={books}
              completedChapters={db.completedChapters}
              translationId={db.settings?.translationId ?? ""}
              isNewTestamentOnly={
                getTranslationById(db.settings?.translationId ?? "")?.bookCount === 27
              }
              onSelect={handleSelectBook}
              onBack={() => setPhase("mode-select")}
            />
          )}

          {/* Chapter Select */}
          {phase === "chapter-select" && seqState && !loadingData && (
            <ChapterSelect
              bookName={seqState.bookName || seqState.bookCode}
              totalChapters={seqState.totalChapters}
              completedChapters={db.completedChapters}
              translationId={db.settings?.translationId ?? ""}
              bookCode={seqState.bookCode}
              onSelect={handleSelectChapter}
              onBack={() => setPhase("book-select")}
            />
          )}

          {/* Typing */}
          {phase === "typing" && currentVerse && !loadingData && (
            <TypingScreen
              bookName={currentBookName}
              chapter={currentChapter}
              verseNumber={currentVerse.number}
              verseIdx={currentVerseIdx}
              totalVerses={totalVerses}
              typingState={typing.state}
              verseText={currentVerse.text}
              composingText={composingText}
              showBookmarkBtn={showBookmarkBtn}
              onTapArea={handleTapArea}
              onAddBookmark={handleAddBookmark}
              onContinue={handleNextVerse}
            />
          )}

          {/* Chapter Done */}
          {phase === "chapter-done" && seqState && (
            <div className="bs-fade-in" style={{ textAlign: "center" }}>
              <Sparkles size={40} style={{ margin: "16px auto", color: "var(--bs-gold)" }} />
              <div style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: 8 }}>
                Chapter Complete
              </div>
              <div style={{ fontSize: "0.9rem", color: "var(--bs-secondary)", marginBottom: 24 }}>
                {seqState.bookName}: {bookCompletedCount}/{seqState.totalChapters} chapters
              </div>
              <button
                type="button"
                className="bs-btn bs-btn-primary bs-btn-full"
                onClick={handleNextChapter}
              >
                {seqState.chapter < seqState.totalChapters ? "Next Chapter" : "Choose Book"}
              </button>
              <button
                type="button"
                className="bs-back-btn"
                style={{ marginTop: 12, display: "block", width: "100%" }}
                onClick={() => setPhase("book-select")}
              >
                Choose another book
              </button>
            </div>
          )}

          {/* Session Done (random) */}
          {phase === "session-done" && (
            <div className="bs-fade-in" style={{ textAlign: "center" }}>
              <Sparkles size={40} style={{ margin: "16px auto", color: "var(--bs-gold)" }} />
              <div style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: 8 }}>
                Session Complete
              </div>
              <div style={{ fontSize: "0.9rem", color: "var(--bs-secondary)", marginBottom: 24 }}>
                {randomVerses.length} verses transcribed
              </div>
              <button
                type="button"
                className="bs-btn bs-btn-primary bs-btn-full"
                onClick={() => handleSelectMode("random")}
              >
                New Session
              </button>
              <button
                type="button"
                className="bs-back-btn"
                style={{ marginTop: 12, display: "block", width: "100%" }}
                onClick={() => setPhase("mode-select")}
              >
                Back
              </button>
            </div>
          )}

          {/* Bookmarks */}
          {phase === "bookmarks" && (
            <BookmarksView
              bookmarks={db.bookmarks}
              onDelete={db.deleteBookmark}
              onBack={() => setPhase("mode-select")}
            />
          )}

          {/* Hidden input for keyboard capture */}
          <input
            ref={inputRef}
            className="bs-hidden-input"
            type="text"
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            onInput={handleInput}
            onCompositionStart={() => {
              typing.handleCompositionStart();
              setComposingText("");
            }}
            onCompositionUpdate={(e) => setComposingText(e.data)}
            onCompositionEnd={(e) => {
              setComposingText("");
              const val = (e.target as HTMLInputElement).value;
              typing.handleCompositionEnd(val);
            }}
            onKeyDown={handleKeyDown}
            onChange={() => {}}
          />
        </div>

        <div className="bs-footer">
          <Link href="/" className="bs-footer-link">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
