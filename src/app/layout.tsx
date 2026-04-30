import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// metadataBase resolves all relative OG URLs (including the auto-generated
// opengraph-image) against this domain. Without it, Next falls back to the
// Vercel deploy URL or localhost, which breaks LinkedIn/X previews.
export const metadata: Metadata = {
  metadataBase: new URL("https://opener.modernseller.ai"),
  title: "Cold-call openers that actually book — Modern Seller",
  description:
    "Free tool. Drop in your prospect's name + company. Get 3 tailored cold-call openers anchored in live web research — built by Luke Ross, founder of Modern Seller.",
  openGraph: {
    title: "Cold-call openers that actually book — Modern Seller",
    description:
      "Free tool. Drop in your prospect's name + company. Get 3 tailored cold-call openers anchored in live web research.",
    url: "https://opener.modernseller.ai",
    siteName: "Modern Seller",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cold-call openers that actually book — Modern Seller",
    description:
      "Drop in your prospect's name + company. Get 3 tailored cold-call openers anchored in live web research.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
