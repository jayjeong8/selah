interface Props {
  bookName: string;
  totalChapters: number;
  completedChapters: Set<string>;
  translationId: string;
  bookCode: string;
  onSelect: (chapter: number) => void;
  onBack: () => void;
}

export function ChapterSelect({
  bookName,
  totalChapters,
  completedChapters,
  translationId,
  bookCode,
  onSelect,
  onBack,
}: Props) {
  const chapters = Array.from({ length: totalChapters }, (_, i) => i + 1);

  return (
    <div className="bs-fade-in bs-chapter-select-inner">
      <div className="bs-nav-header">
        <button type="button" className="bs-back-btn" onClick={onBack}>
          &larr; Back
        </button>
        <div className="bs-nav-title">{bookName}</div>
      </div>

      <div className="bs-chapter-grid">
        {chapters.map((ch) => {
          const isCompleted = completedChapters.has(`${translationId}/${bookCode}/${ch}`);
          return (
            <button
              key={ch}
              type="button"
              className={`bs-chapter-btn ${isCompleted ? "bs-chapter-done" : ""}`}
              onClick={() => onSelect(ch)}
            >
              {ch}
            </button>
          );
        })}
      </div>
    </div>
  );
}
