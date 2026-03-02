import type { Metadata } from "next";
import { BibleScribe } from "./_components/bible-scribe";

export const metadata: Metadata = {
  title: "Bible Scribe — Transcribe Scripture Verse by Verse",
  description:
    "Transcribe the Bible verse by verse in your chosen language and translation. Sequential and random modes, bookmarks, meditative typing sounds. Free, no signup, works offline.",
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
  ],
  alternates: {
    canonical: "/bible-scribe",
  },
  openGraph: {
    title: "Bible Scribe — Transcribe Scripture Verse by Verse",
    description:
      "Transcribe the Bible verse by verse. Sequential or random mode, bookmarks, meditative sounds.",
    url: "/bible-scribe",
  },
  twitter: {
    title: "Bible Scribe — Transcribe Scripture Verse by Verse",
    description:
      "Transcribe the Bible verse by verse. Sequential or random mode, bookmarks, meditative sounds.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Bible Scribe",
  description:
    "Transcribe the Bible verse by verse in your chosen language and translation. Sequential and random modes, bookmarks, meditative typing sounds. Free, no signup.",
  url: "/bible-scribe",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function BibleScribePage() {
  return (
    <>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <BibleScribe />
    </>
  );
}
