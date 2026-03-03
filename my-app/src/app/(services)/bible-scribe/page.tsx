import type { Metadata } from "next";
import { BibleScribe } from "./_components/bible-scribe";

export const metadata: Metadata = {
  title: "Bible Scribe — Transcribe Scripture Verse by Verse",
  description:
    "Type the Bible verse by verse in 32 translations across 7 languages. Sequential and random modes, bookmarks, meditative typing sounds. Free, no signup, works offline.",
  keywords: [
    "bible typing",
    "scripture transcription",
    "bible scribe",
    "verse typing practice",
    "bible meditation",
    "type bible",
    "bible copy",
    "scripture writing",
    "bible study tool",
    "bible transcription free",
    "write out bible verses",
    "bible typing practice online",
    "handwrite scripture digitally",
    "multilingual bible tool",
    "offline bible app",
  ],
  alternates: {
    canonical: "/bible-scribe",
  },
  openGraph: {
    title: "Bible Scribe — Transcribe Scripture Verse by Verse",
    description:
      "Type the Bible verse by verse in 32 translations across 7 languages. Sequential or random mode, bookmarks, meditative sounds. Free and offline-ready.",
    url: "/bible-scribe",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Bible Scribe — Transcribe Scripture Verse by Verse",
    description:
      "Type the Bible verse by verse in 32 translations across 7 languages. Sequential or random mode, bookmarks, meditative sounds.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Bible Scribe",
  description:
    "Type the Bible verse by verse in 32 translations across 7 languages. Sequential and random modes, bookmarks, meditative typing sounds. Free, no signup, works offline.",
  url: "https://selah-alpha.vercel.app/bible-scribe",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  inLanguage: ["en", "ko", "es", "fr", "de", "zh", "ja"],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "32 Bible translations in 7 languages",
    "Sequential and random transcription modes",
    "Bookmarks and progress tracking",
    "Meditative typing sounds",
    "Offline support",
    "Dark mode",
  ],
};

export default function BibleScribePage() {
  return (
    <>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <BibleScribe />
    </>
  );
}
