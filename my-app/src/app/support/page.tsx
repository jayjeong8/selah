import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support | Selah",
  description: "Support for Selah.",
};

export default function SupportPage() {
  return (
    <main className="mx-auto min-h-dvh max-w-3xl px-6 py-16 text-sm leading-7">
      <h1 className="mb-2 text-3xl font-semibold">Selah Support</h1>
      <p>For support, bug reports, or feedback, please open an issue in the Selah GitHub repository.</p>
    </main>
  );
}
