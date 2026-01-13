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

// --- Metadata Configuration ---
// This defines the SEO tags, page title, description, and icons for the application.
// Next.js uses this to populate the <head> of the HTML document.
export const metadata: Metadata = {
  title: "Telegram Express - Contactless Messaging",
  description: "Send Telegram messages directly to a phone number without saving the contact.",
  icons: {
    icon: "/favicon.ico", // Points to our user-provided logo (logo.ico)
  },
};

// --- Root Layout Component ---
// This is the top-level wrapper for all pages in the application.
// It sets the HTML structure, global fonts, and applies the global CSS.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 
          Apply the CSS variables for the fonts 'Geist' and 'Geist Mono' 
          to the body so they can be used throughout the app. 
      */}
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
