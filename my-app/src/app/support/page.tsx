import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support | Selah",
  description: "Support for Selah.",
};

export default function SupportPage() {
  return (
    <main className="safe-area-page mx-auto min-h-dvh max-w-3xl text-sm leading-7">
      <h1 className="mb-2 text-3xl font-semibold">Selah Support</h1>
      <p className="mb-6">For support, bug reports, or feedback, please <a className="underline" href="https://github.com/jayjeong8/selah/issues">open an issue in the Selah GitHub repository</a>.</p>
      <p>Your progress and bookmarks are saved on your device. An internet connection is needed to load the app and download new Bible passages. Previously downloaded passages can be read from the local cache.</p>
      <a className="mt-6 inline-block underline" href="/">Back to Selah</a>
    </main>
  );
}
