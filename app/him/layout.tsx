import type { Metadata } from "next";
import "../globals.css";
import "./him.css";

export const metadata: Metadata = {
  title: "LoveYouAI ⚡ — For Him",
  description: "A love letter — or an apology — built into a link. For him.",
  openGraph: {
    title: "Someone made something for you ⚡",
    description: "Open this link — it was made just for you.",
    type: "website",
  },
};

export default function HimLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
