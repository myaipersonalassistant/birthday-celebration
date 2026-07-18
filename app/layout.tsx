import type { Metadata } from "next";
import {
  Alex_Brush,
  Cormorant_Garamond,
  Manrope,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
});

const alexBrush = Alex_Brush({
  variable: "--font-alex-brush",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Angela Ifonlaja's Birthday",
  description: "Join us in celebrating Angela Ifonlaja's birthday.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable} ${alexBrush.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
