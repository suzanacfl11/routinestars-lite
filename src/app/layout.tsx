import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RoutineStars Lite",
  description: "A sticker-chart-style routine and chore tracker for kids.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router; not pages/_document */}
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
      </head>
      <body className="min-h-full" style={{ fontFamily: "'Nunito', sans-serif" }}>
        {children}
        <Analytics/>
      </body>
    </html>
  );
}
