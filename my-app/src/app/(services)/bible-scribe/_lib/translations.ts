import type { BibleLanguage, TranslationMeta } from "./types";

export const TRANSLATIONS: TranslationMeta[] = [
  // Korean
  {
    id: "kor_old",
    name: "개역한글판 (1910)",
    shortName: "개역한글",
    language: "ko",
    languageName: "한국어",
    flag: "\uD83C\uDDF0\uD83C\uDDF7",
    bookCount: 66,
  },
  // English
  {
    id: "BSB",
    name: "Berean Standard Bible",
    shortName: "BSB",
    language: "en",
    languageName: "English",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    bookCount: 66,
  },
  {
    id: "eng_kjv",
    name: "King James Version",
    shortName: "KJV",
    language: "en",
    languageName: "English",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    bookCount: 66,
  },
  {
    id: "eng_web",
    name: "World English Bible",
    shortName: "WEB",
    language: "en",
    languageName: "English",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    bookCount: 66,
  },
  // Spanish
  {
    id: "spa_rvg",
    name: "Reina Valera G\u00F3mez",
    shortName: "RVG",
    language: "es",
    languageName: "Espa\u00F1ol",
    flag: "\uD83C\uDDEA\uD83C\uDDF8",
    bookCount: 66,
  },
  {
    id: "spa_r09",
    name: "Reina Valera 1909",
    shortName: "RV1909",
    language: "es",
    languageName: "Espa\u00F1ol",
    flag: "\uD83C\uDDEA\uD83C\uDDF8",
    bookCount: 66,
  },
  // French
  {
    id: "fra_lsg",
    name: "Louis Segond 1910",
    shortName: "LSG",
    language: "fr",
    languageName: "Fran\u00E7ais",
    flag: "\uD83C\uDDEB\uD83C\uDDF7",
    bookCount: 66,
  },
  // German
  {
    id: "deu_l12",
    name: "Luther 1912",
    shortName: "Luther",
    language: "de",
    languageName: "Deutsch",
    flag: "\uD83C\uDDE9\uD83C\uDDEA",
    bookCount: 66,
  },
  // Chinese
  {
    id: "cmn_cu1",
    name: "\u7B80\u4F53\u4E2D\u6587\u548C\u5408\u672C",
    shortName: "\u7B80\u4F53",
    language: "zh",
    languageName: "\u4E2D\u6587",
    flag: "\uD83C\uDDE8\uD83C\uDDF3",
    bookCount: 66,
  },
  {
    id: "cmn_cuv",
    name: "\u7E41\u9AD4\u4E2D\u6587\u548C\u5408\u672C",
    shortName: "\u7E41\u9AD4",
    language: "zh",
    languageName: "\u4E2D\u6587",
    flag: "\uD83C\uDDF9\uD83C\uDDFC",
    bookCount: 66,
  },
  // Japanese
  {
    id: "jpn_loc",
    name: "\u65E5\u672C\u8A9E\u65B0\u7D04\u8056\u66F8",
    shortName: "\u65E5\u672C\u8A9E",
    language: "ja",
    languageName: "\u65E5\u672C\u8A9E",
    flag: "\uD83C\uDDEF\uD83C\uDDF5",
    bookCount: 27,
  },
];

export const LANGUAGE_GROUPS: { language: BibleLanguage; label: string; flag: string }[] = [
  { language: "ko", label: "\uD55C\uAD6D\uC5B4", flag: "\uD83C\uDDF0\uD83C\uDDF7" },
  { language: "en", label: "English", flag: "\uD83C\uDDFA\uD83C\uDDF8" },
  { language: "es", label: "Espa\u00F1ol", flag: "\uD83C\uDDEA\uD83C\uDDF8" },
  { language: "fr", label: "Fran\u00E7ais", flag: "\uD83C\uDDEB\uD83C\uDDF7" },
  { language: "de", label: "Deutsch", flag: "\uD83C\uDDE9\uD83C\uDDEA" },
  { language: "zh", label: "\u4E2D\u6587", flag: "\uD83C\uDDE8\uD83C\uDDF3" },
  { language: "ja", label: "\u65E5\u672C\u8A9E", flag: "\uD83C\uDDEF\uD83C\uDDF5" },
];

export function getTranslationsByLanguage(language: BibleLanguage): TranslationMeta[] {
  return TRANSLATIONS.filter((t) => t.language === language);
}

export function getTranslationById(id: string): TranslationMeta | undefined {
  return TRANSLATIONS.find((t) => t.id === id);
}
