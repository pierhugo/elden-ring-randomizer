import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elden Ring Randomizer - Map Tracker",
  description: "Visualize your Elden Ring randomizer seed placements",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
