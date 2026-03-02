import { getTranslationsByLanguage, LANGUAGE_GROUPS } from "../_lib/translations";

interface Props {
  onSelect: (translationId: string) => void;
}

export function TranslationSelect({ onSelect }: Props) {
  return (
    <div className="bs-fade-in">
      <div style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 4 }}>Choose your Bible</div>
      <div style={{ fontSize: "0.85rem", color: "var(--bs-secondary)", marginBottom: 16 }}>
        Select a translation to begin transcribing
      </div>

      <div className="bs-translation-list">
        {LANGUAGE_GROUPS.map((group) => {
          const translations = getTranslationsByLanguage(group.language);
          return (
            <div key={group.language} className="bs-lang-group">
              <div className="bs-lang-group-label">
                {group.flag} {group.label}
              </div>
              {translations.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className="bs-translation-btn"
                  onClick={() => onSelect(t.id)}
                >
                  <span className="bs-translation-name">{t.name}</span>
                  <span className="bs-translation-meta">
                    {t.shortName}
                    {t.bookCount === 27 ? " \u00B7 New Testament only" : ""}
                  </span>
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
