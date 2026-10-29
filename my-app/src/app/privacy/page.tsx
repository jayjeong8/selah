import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Selah",
  description: "Privacy Policy for Selah.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-dvh max-w-3xl px-6 py-16 text-sm leading-7">
      <h1 className="mb-2 text-3xl font-semibold">Privacy Policy</h1>
      <p className="mb-10 text-muted-foreground">Last updated: October 29, 2026</p>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Overview</h2>
        <p>Selah is a faith-based Bible engagement app. We respect your privacy and designed Selah to work without requiring an account.</p>

        <h2 className="pt-6 text-xl font-medium">Information we collect</h2>
        <p>Selah does not collect or sell personal information. Scripture progress, bookmarks, and preferences are stored locally on your device using browser or app storage.</p>
        <p>When you request Bible content, the app may contact third-party Bible data services. Those services may receive technical request data needed to return the requested content.</p>

        <h2 className="pt-6 text-xl font-medium">Analytics</h2>
        <p>The web version may use privacy-conscious, aggregate analytics to understand general usage. The app does not use advertising identifiers or sell data.</p>

        <h2 className="pt-6 text-xl font-medium">Children</h2>
        <p>Selah is not directed to children under 13, and we do not knowingly collect information from children.</p>

        <h2 className="pt-6 text-xl font-medium">Changes and contact</h2>
        <p>We may update this policy as Selah evolves. For privacy questions, contact the developer through the Selah project repository.</p>
      </section>
    </main>
  );
}
