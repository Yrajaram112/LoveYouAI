import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LoveYouAI ✨ — A Love Letter Built Into a Link",
  description: "Create a magical, animated love experience for someone special.",
  openGraph: {
    title: "Someone made something special for you 💌",
    description: "Open this link — it was made just for you.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
