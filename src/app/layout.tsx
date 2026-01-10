import type { Metadata } from "next";
import { Frank_Ruhl_Libre, Inter } from "next/font/google";
import "./globals.css";

const frankRuhlLibre = Frank_Ruhl_Libre({
  variable: "--font-frank-ruhl",
  subsets: ["hebrew", "latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kavanah - Jewish Spiritual Wellness",
  description: "A minimalist spiritual wellness app offering Jewish wisdom.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${frankRuhlLibre.variable} ${inter.variable} antialiased bg-royal-blue-900 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
