import type { Metadata } from "next";
import "./globals.css";
import { BRAND_IMG } from "@/lib/branding";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "LoveYouAI ✨ — A Love Letter Built Into a Link",
  description: "Create a magical, animated love experience for someone special.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Someone made something special for you 💌",
    description: "Open this link — it was made just for you.",
    type: "website",
    images: [{ url: BRAND_IMG.logo, width: 512, height: 512, alt: "LoveYouAI" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
