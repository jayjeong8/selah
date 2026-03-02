import { EB_Garamond } from "next/font/google";
import type { ReactNode } from "react";
import "./style.css";

const ebGaramond = EB_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-bs-serif",
});

export default function BibleScribeLayout({ children }: { children: ReactNode }) {
  return <div className={ebGaramond.variable}>{children}</div>;
}
