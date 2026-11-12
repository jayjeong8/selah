import { Bookmark as BookmarkIcon } from "lucide-react";
import type { Bookmark } from "../_lib/types";

interface Props {
  bookmarks: Bookmark[];
  onDelete: (id: string) => void;
  onScribe: (bookmark: Bookmark) => void;
  onBack: () => void;
}

export function BookmarksView({ bookmarks, onDelete, onScribe, onBack }: Props) {
  return (
    <div className="bs-fade-in">
      <button type="button" className="bs-back-btn" onClick={onBack}>
        &larr; Back
      </button>
      <div
        style={{
          fontSize: "1.1rem",
          fontWeight: 600,
          margin: "8px 0 16px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <BookmarkIcon size={18} /> Bookmarks
      </div>

      {bookmarks.length === 0 && (
        <div className="bs-bookmark-empty">
          <BookmarkIcon className="bs-bookmark-empty-icon" size={32} aria-hidden="true" />
          <div className="bs-bookmark-empty-title">No bookmarks yet</div>
          <div className="bs-bookmark-empty-copy">Save verses while typing to find them here</div>
        </div>
      )}

      <div className="bs-bookmark-list">
        {bookmarks.map((bm) => (
          <div key={bm.id} className="bs-bookmark-item">
            <div className="bs-bookmark-ref">
              {bm.bookName} {bm.chapter}:{bm.verseNumber}
            </div>
            <div className="bs-bookmark-text">{bm.text}</div>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button type="button" className="bs-bookmark-delete" onClick={() => onScribe(bm)}>
                Scribe
              </button>
              <button type="button" className="bs-bookmark-delete" onClick={() => onDelete(bm.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
