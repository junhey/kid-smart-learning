import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { DailyTasksProvider } from "@/contexts/DailyTasksContext";
import { SoundSettings } from "@/components/ui/SoundSettings";

const nunito = Nunito({
  weight: ["400", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

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
    <html lang="zh-CN" className={nunito.variable}>
      <body className="font-rounded bg-white min-h-screen">
        <DailyTasksProvider>
          <main className="pb-20">
            {children}
          </main>
          <BottomNav />
          <SoundSettings />
        </DailyTasksProvider>
      </body>
    </html>
  );
}
