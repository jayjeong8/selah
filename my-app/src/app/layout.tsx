import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://selah-alpha.vercel.app"),
  title: {
    template: "%s | selah",
    default: "selah — Pause. Reflect. Grow.",
  },
  description:
    "Faith-based web tools for deeper Bible engagement. Transcribe Scripture verse by verse, build spiritual habits, and grow in the Word — free, offline-ready, and multilingual.",
  keywords: [
    "bible tools",
    "christian web app",
    "scripture engagement",
    "bible study online",
    "faith tools",
    "bible meditation",
    "spiritual growth",
  ],
  openGraph: {
    type: "website",
    siteName: "selah",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
