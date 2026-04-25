import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Modern Seller · Opener Generator — Cold call openers that actually book",
  description:
    "Free tool from Modern Seller. Paste a prospect, get 5 tailored cold-call openers in seconds — built on the playbook trained on 50,000+ real calls.",
  openGraph: {
    title: "Cold call openers that actually book — Modern Seller",
    description:
      "Free opener generator. Paste a prospect, get 5 tailored openers built from the Modern Seller playbook.",
    url: "https://modernseller.ai",
    siteName: "Modern Seller",
    type: "website",
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
