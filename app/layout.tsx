import type { Metadata } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Kid Smart Learning - Fun English & Math Games",
  description:
    "Interactive learning games for children ages 5-7. Learn English alphabet, words, and Math with fun games!",
  keywords: "kids learning, english games, math games, children education",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-rounded bg-white min-h-screen">
        <main className="pb-20">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
