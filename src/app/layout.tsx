import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Safara - Jastip Terpercaya dari Tanah Suci & Turki",
    template: "%s | Safara",
  },
  description:
    "Platform jastip (jasa titip) terpercaya untuk oleh-oleh dari Makkah, Madinah & Turki. Escrow aman, traveler terverifikasi, perlindungan pembeli 100%.",
  keywords: [
    "jastip",
    "jasa titip",
    "oleh-oleh haji",
    "oleh-oleh umrah",
    "parfum arab",
    "kurma ajwa",
    "sajadah",
    "turkish delight",
    "makkah",
    "madinah",
    "turki",
    "istanbul",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${plusJakarta.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
