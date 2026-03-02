import { Bookmark as BookmarkIcon } from "lucide-react";
import type { Bookmark } from "../_lib/types";

interface Props {
  bookmarks: Bookmark[];
  onDelete: (id: string) => void;
  onBack: () => void;
}

export function BookmarksView({ bookmarks, onDelete, onBack }: Props) {
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
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--bs-secondary)" }}>
          <BookmarkIcon size={24} style={{ marginBottom: 8 }} />
          <div>No bookmarks yet</div>
          <div style={{ fontSize: "0.8rem", marginTop: 4 }}>
            Save verses while typing to find them here
          </div>
        </div>
      )}

      <div className="bs-bookmark-list">
        {bookmarks.map((bm) => (
          <div key={bm.id} className="bs-bookmark-item">
            <div className="bs-bookmark-ref">
              {bm.bookName} {bm.chapter}:{bm.verseNumber}
            </div>
            <div className="bs-bookmark-text">{bm.text}</div>
            <button type="button" className="bs-bookmark-delete" onClick={() => onDelete(bm.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
