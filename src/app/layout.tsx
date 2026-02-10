import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Noto_Serif,
  PT_Serif,
  Montserrat,
  Cabin,
  Merriweather_Sans,
  Noto_Sans_Arabic,
  Poppins
} from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
});

const ptSerif = PT_Serif({
  variable: "--font-pt-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const cabin = Cabin({
  variable: "--font-cabin",
  subsets: ["latin"],
});

const merriweatherSans = Merriweather_Sans({
  variable: "--font-merriweather-sans",
  subsets: ["latin"],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TrainTracks - Special Education Resource Hub",
  description: "Empowering teachers of autistic children with personalized learning plans based on the AET Progression Framework",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSerif.variable} ${ptSerif.variable} ${montserrat.variable} ${cabin.variable} ${merriweatherSans.variable} ${notoSansArabic.variable} ${poppins.variable} antialiased bg-gray-50 min-h-screen flex flex-col`}
        style={{ fontFamily: "var(--font-poppins), 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
      >
        <LanguageProvider>
          {/* <Header /> */}
          <main className="flex-1">
            {children}
          </main>
          {/* <Footer /> */}
        </LanguageProvider>
      </body>
    </html>
  );
}
