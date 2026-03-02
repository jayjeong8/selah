import type { BibleLanguage, TranslationMeta } from "./types";

export const TRANSLATIONS: TranslationMeta[] = [
  // Korean - helloao
  {
    id: "kor_old",
    name: "개역한글판 (1910)",
    shortName: "개역한글",
    language: "ko",
    languageName: "한국어",
    flag: "🇰🇷",
    bookCount: 66,
    source: "helloao",
  },
  // Korean - YouVersion
  {
    id: "yv:86",
    name: "현대인의 성경",
    shortName: "KLB",
    language: "ko",
    languageName: "한국어",
    flag: "🇰🇷",
    bookCount: 66,
    source: "youversion",
    copyright:
      "Korean Living Bible (현대인의 성경)\nCopyright © 1985 by Biblica, Inc.®\nUsed by permission. All rights reserved worldwide.",
  },
  // English - helloao
  {
    id: "BSB",
    name: "Berean Standard Bible",
    shortName: "BSB",
    language: "en",
    languageName: "English",
    flag: "🇺🇸",
    bookCount: 66,
    source: "helloao",
  },
  {
    id: "eng_kjv",
    name: "King James Version",
    shortName: "KJV",
    language: "en",
    languageName: "English",
    flag: "🇺🇸",
    bookCount: 66,
    source: "helloao",
  },
  {
    id: "eng_web",
    name: "World English Bible",
    shortName: "WEB",
    language: "en",
    languageName: "English",
    flag: "🇺🇸",
    bookCount: 66,
    source: "helloao",
  },
  // English - YouVersion
  {
    id: "yv:111",
    name: "New International Version",
    shortName: "NIV",
    language: "en",
    languageName: "English",
    flag: "🇺🇸",
    bookCount: 66,
    source: "youversion",
    copyright:
      "New International Version (NIV)\nCopyright © 1973, 1978, 1984, 2011 by Biblica, Inc.®\nUsed by permission. All rights reserved worldwide.",
  },
  {
    id: "yv:59",
    name: "English Standard Version 2016",
    shortName: "ESV",
    language: "en",
    languageName: "English",
    flag: "🇺🇸",
    bookCount: 66,
    source: "youversion",
    copyright:
      "The Holy Bible, English Standard Version® (ESV®)\nCopyright © 2001 by Crossway, a publishing ministry of Good News Publishers.\nUsed by permission. All rights reserved.",
  },
  {
    id: "yv:116",
    name: "New Living Translation",
    shortName: "NLT",
    language: "en",
    languageName: "English",
    flag: "🇺🇸",
    bookCount: 66,
    source: "youversion",
    copyright:
      "Holy Bible, New Living Translation\nCopyright © 1996, 2004, 2015 by Tyndale House Foundation.\nUsed by permission. All rights reserved.",
  },
  {
    id: "yv:114",
    name: "New King James Version",
    shortName: "NKJV",
    language: "en",
    languageName: "English",
    flag: "🇺🇸",
    bookCount: 66,
    source: "youversion",
    copyright:
      "New King James Version®\nCopyright © 1982 by Thomas Nelson, Inc.\nUsed by permission. All rights reserved.",
  },
  {
    id: "yv:2692",
    name: "New American Standard Bible 2020",
    shortName: "NASB",
    language: "en",
    languageName: "English",
    flag: "🇺🇸",
    bookCount: 66,
    source: "youversion",
    copyright:
      "New American Standard Bible® (NASB)\nCopyright © 1960, 1971, 1977, 1995, 2020 by The Lockman Foundation.\nAll rights reserved.",
  },
  // Spanish - helloao
  {
    id: "spa_rvg",
    name: "Reina Valera Gómez",
    shortName: "RVG",
    language: "es",
    languageName: "Español",
    flag: "🇪🇸",
    bookCount: 66,
    source: "helloao",
  },
  {
    id: "spa_r09",
    name: "Reina Valera 1909",
    shortName: "RV1909",
    language: "es",
    languageName: "Español",
    flag: "🇪🇸",
    bookCount: 66,
    source: "helloao",
  },
  // French - helloao
  {
    id: "fra_lsg",
    name: "Louis Segond 1910",
    shortName: "LSG",
    language: "fr",
    languageName: "Français",
    flag: "🇫🇷",
    bookCount: 66,
    source: "helloao",
  },
  // German - helloao
  {
    id: "deu_l12",
    name: "Luther 1912",
    shortName: "Luther",
    language: "de",
    languageName: "Deutsch",
    flag: "🇩🇪",
    bookCount: 66,
    source: "helloao",
  },
  // Chinese - helloao
  {
    id: "cmn_cu1",
    name: "简体中文和合本",
    shortName: "简体",
    language: "zh",
    languageName: "中文",
    flag: "🇨🇳",
    bookCount: 66,
    source: "helloao",
  },
  {
    id: "cmn_cuv",
    name: "繁體中文和合本",
    shortName: "繁體",
    language: "zh",
    languageName: "中文",
    flag: "🇹🇼",
    bookCount: 66,
    source: "helloao",
  },
  // Japanese - helloao (NT only)
  {
    id: "jpn_loc",
    name: "日本語新約聖書",
    shortName: "日本語",
    language: "ja",
    languageName: "日本語",
    flag: "🇯🇵",
    bookCount: 27,
    source: "helloao",
  },
  // Japanese - YouVersion (full Bible)
  {
    id: "yv:81",
    name: "口語訳 (1955)",
    shortName: "JA1955",
    language: "ja",
    languageName: "日本語",
    flag: "🇯🇵",
    bookCount: 66,
    source: "youversion",
  },
  {
    id: "yv:83",
    name: "リビングバイブル",
    shortName: "JCB",
    language: "ja",
    languageName: "日本語",
    flag: "🇯🇵",
    bookCount: 66,
    source: "youversion",
    copyright:
      "Japanese Contemporary Bible (リビングバイブル)\nCopyright © 1978, 2011, 2016 by Biblica, Inc.®\nUsed by permission. All rights reserved worldwide.",
  },
];

export const LANGUAGE_GROUPS: { language: BibleLanguage; label: string; flag: string }[] = [
  { language: "ko", label: "한국어", flag: "🇰🇷" },
  { language: "en", label: "English", flag: "🇺🇸" },
  { language: "es", label: "Español", flag: "🇪🇸" },
  { language: "fr", label: "Français", flag: "🇫🇷" },
  { language: "de", label: "Deutsch", flag: "🇩🇪" },
  { language: "zh", label: "中文", flag: "🇨🇳" },
  { language: "ja", label: "日本語", flag: "🇯🇵" },
];

export function getTranslationsByLanguage(language: BibleLanguage): TranslationMeta[] {
  return TRANSLATIONS.filter((t) => t.language === language);
}

export function getTranslationById(id: string): TranslationMeta | undefined {
  return TRANSLATIONS.find((t) => t.id === id);
}
