import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const mplusRounded = M_PLUS_Rounded_1c({
  variable: "--font-rounded",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "探究活動記録・分析システム（モック）｜青楓館高等学院",
  description: "AI（Gemini）を活用した探究活動記録・分析システムのUIモック",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${mplusRounded.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
