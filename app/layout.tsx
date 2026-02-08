import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { FloatingProfileNav } from "@/components/floating-profile-nav";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "SocialCue – Connect IRL",
  description: "Meet new people and find activity partners offline. Real connections, real life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        {children}
        <FloatingProfileNav />
      </body>
    </html>
  );
}
