import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elden Ring Randomizer - Tracker",
  description: "Visualize your Elden Ring randomizer seed placements",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Source+Sans+3:wght@300;400;500;600&display=swap"
        />
      </head>
      <body className="min-h-full bg-[var(--bg-primary)] text-[var(--text-primary)]">
        {children}
      </body>
    </html>
  );
}