"use client";

import { useEffect, useRef, useState } from "react";

import { getTranslationsByLanguage, LANGUAGE_GROUPS } from "../_lib/translations";
import type { BibleLanguage } from "../_lib/types";

const LS_KEY = "bs-preferred-language";

type LangFilter = BibleLanguage | "all";

interface Props {
  onSelect: (translationId: string) => void;
}

export function TranslationSelect({ onSelect }: Props) {
  const [selectedLanguage, setSelectedLanguage] = useState<LangFilter>(() => {
    if (typeof window === "undefined") return "all";
    return (localStorage.getItem(LS_KEY) as LangFilter) || "all";
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (lang: LangFilter) => {
    setSelectedLanguage(lang);
    localStorage.setItem(LS_KEY, lang);
    setDropdownOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const currentGroup = LANGUAGE_GROUPS.find((g) => g.language === selectedLanguage);
  const filterLabel = currentGroup ? `${currentGroup.flag} ${currentGroup.label}` : "All";

  const filteredGroups =
    selectedLanguage === "all"
      ? LANGUAGE_GROUPS
      : LANGUAGE_GROUPS.filter((g) => g.language === selectedLanguage);

  return (
    <div className="bs-fade-in">
      <div className="bs-translation-header">
        <div>
          <div style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 4 }}>
            Choose your Bible
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--bs-secondary)" }}>
            Select a translation to begin transcribing
          </div>
        </div>
        <div className="bs-lang-filter-wrap" ref={dropdownRef}>
          <button
            type="button"
            className="bs-lang-filter-btn"
            onClick={() => setDropdownOpen((v) => !v)}
          >
            {filterLabel}
            <span className="bs-lang-filter-arrow">{dropdownOpen ? "\u25B2" : "\u25BC"}</span>
          </button>
          {dropdownOpen && (
            <div className="bs-lang-dropdown">
              <button
                type="button"
                className="bs-lang-option"
                data-active={selectedLanguage === "all"}
                onClick={() => handleLanguageChange("all")}
              >
                All Languages
              </button>
              {LANGUAGE_GROUPS.map((g) => (
                <button
                  key={g.language}
                  type="button"
                  className="bs-lang-option"
                  data-active={selectedLanguage === g.language}
                  onClick={() => handleLanguageChange(g.language)}
                >
                  {g.flag} {g.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bs-translation-list">
        {filteredGroups.map((group) => {
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
