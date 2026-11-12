import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support | Selah",
  description: "Support for Selah.",
};

export default function SupportPage() {
  return (
    <main className="safe-area-page mx-auto min-h-dvh max-w-3xl text-sm leading-7">
      <Link
        href="/"
        aria-label="Back to Selah"
        className="mb-8 inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <span aria-hidden="true" className="text-base leading-none">
          ←
        </span>
        <span>Back to Selah</span>
      </Link>
      <h1 className="mb-2 text-3xl font-semibold">Selah Support</h1>
      <p className="mb-6">
        For support, bug reports, or feedback, please{" "}
        <a className="underline" href="https://github.com/jayjeong8/selah/issues">
          open an issue in the Selah GitHub repository
        </a>
        .
      </p>
      <p>
        Your progress and bookmarks are saved on your device. An internet connection is needed to
        load the app and download new Bible passages. Previously downloaded passages can be read
        from the local cache.
      </p>
    </main>
  );
}
