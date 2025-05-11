import "@/styles/globals.css";
import React from "react";
import { Inter } from 'next/font/google';
import { type Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import LayoutClient from "@/components/layout/LayoutClient";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "TechVault",
    template: "%s | TechVault",
  },
  description: "Organize your tech resources, bookmarks, and learning materials",
  applicationName: "TechVault",
  keywords: [
    "tech resources", 
    "bookmarks", 
    "learning", 
    "developer tools",
    "code snippets",
    "knowledge management"
  ],
  authors: [{ name: "TechVault Team" }],
  creator: "TechVault Team",
  publisher: "TechVault Team",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TechVault",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <LayoutClient>{children}</LayoutClient>
        </ThemeProvider>
      </body>
    </html>
  );
}
