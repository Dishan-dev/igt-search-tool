import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IGT AIESEC CS - Global Talent Opportunities",
  description: "Global Talent Opportunities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex h-screen flex-col font-sans antialiased bg-slate-50 relative overflow-hidden`}
      >
        {/* Subtle background decorative gradient */}
        <div className="absolute top-0 inset-x-0 h-[50rem] -z-10 pointer-events-none" />
        
        <main className="flex-1 overflow-y-auto">{children}</main>
      </body>
    </html>
  );
}
