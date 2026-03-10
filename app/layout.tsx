import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-rounded bg-gradient-to-b from-sky-100 to-blue-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
