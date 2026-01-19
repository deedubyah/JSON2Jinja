import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JSON2Jinja - JSON to Jinja2 Expression Builder",
  description: "Build Jinja2 template expressions from JSON payloads with tree visualization and live preview",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="px-5 py-4 border-b border-border">
          <h1 className="text-xl font-semibold text-accent">JSON2Jinja</h1>
        </header>
        <main className="p-5">
          {children}
        </main>
      </body>
    </html>
  );
}
