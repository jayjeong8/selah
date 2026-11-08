import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Selah",
  description: "Privacy Policy for Selah.",
};

export default function PrivacyPage() {
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
      <h1 className="mb-2 text-3xl font-semibold">Privacy Policy</h1>
      <p className="mb-10 text-muted-foreground">Last updated: November 5, 2026</p>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Overview</h2>
        <p>
          Selah is a faith-based Bible engagement app. We respect your privacy and designed Selah to
          work without requiring an account.
        </p>

        <h2 className="pt-6 text-xl font-medium">Information we collect</h2>
        <p>
          Selah does not require an account or ask for your name, email address, contacts, or
          location. Scripture typing progress, bookmarks, and preferences are stored locally on your
          device using browser or app storage. They are not uploaded to a Selah account or cloud
          database.
        </p>
        <p>
          The app loads its interface from Vercel and requests Scripture from AO Lab&apos;s Free Use
          Bible API or, for supported translations, through our server&apos;s YouVersion API
          integration. These requests disclose technical information such as your IP address,
          request time, requested URL, browser or device information, and response status to the
          service handling the request. The YouVersion proxy sends the Bible request from our server
          without forwarding your IP address, typing progress, or bookmarks.
        </p>
        <p>
          Service providers may retain request and security logs to deliver content, prevent abuse,
          and diagnose problems. These logs can remain after a request has completed. We do not
          promise that technical request data is never collected. Provider retention periods and
          privacy practices are governed by their own policies.
        </p>

        <h2 className="pt-6 text-xl font-medium">Analytics</h2>
        <p>
          Selah does not include analytics or advertising tracking SDKs and does not use advertising
          identifiers. We do not sell personal information or combine your activity with other apps
          for targeted advertising. Hosting and Bible content providers may process service usage
          and diagnostic information as described above.
        </p>

        <h2 className="pt-6 text-xl font-medium">Service providers</h2>
        <p>
          Read more about{" "}
          <a className="underline" href="https://vercel.com/legal/privacy-policy">
            Vercel&apos;s privacy practices
          </a>
          ,{" "}
          <a className="underline" href="https://bible.helloao.org/docs/">
            AO Lab&apos;s Free Use Bible API
          </a>
          , and{" "}
          <a className="underline" href="https://www.bible.com/privacy">
            YouVersion&apos;s privacy practices
          </a>
          . Provider requests are made over HTTPS. Our hosting and content providers may process
          requests outside your country.
        </p>

        <h2 className="pt-6 text-xl font-medium">Your choices and local data</h2>
        <p>
          You can use the app without creating an account. Clear app or browser storage, or remove
          the app, to delete locally stored progress, bookmarks, preferences, and cached passages.
          Exported files remain wherever you choose to save them. An internet connection is needed
          to open the app and obtain new passages.
        </p>

        <h2 className="pt-6 text-xl font-medium">Children</h2>
        <p>
          Selah is not directed to children under 13, and we do not knowingly collect information
          from children.
        </p>

        <h2 className="pt-6 text-xl font-medium">Changes and contact</h2>
        <p>
          We may update this policy as Selah evolves. For privacy questions, contact the developer
          through the{" "}
          <a className="underline" href="https://github.com/jayjeong8/selah/issues">
            Selah project repository
          </a>
          .
        </p>
      </section>
    </main>
  );
}
