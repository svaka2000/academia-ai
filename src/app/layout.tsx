import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://academia-ai.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AcademiaAI — Know exactly what to study next",
    template: "%s · AcademiaAI",
  },
  description:
    "AcademiaAI automatically organizes your assignments into a personalized study plan so you can finish homework faster and stress less.",
  keywords: [
    "AI homework planner",
    "study planner",
    "assignment organizer",
    "student productivity",
    "homework app",
  ],
  authors: [{ name: "AcademiaAI" }],
  openGraph: {
    title: "AcademiaAI — Know exactly what to study next",
    description:
      "Turn your assignments into an organized daily study plan with AI. Open the app and start making progress.",
    url: siteUrl,
    siteName: "AcademiaAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AcademiaAI — Know exactly what to study next",
    description:
      "Turn your assignments into an organized daily study plan with AI.",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-canvas text-ink antialiased">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
