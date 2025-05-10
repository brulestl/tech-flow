import "@/styles/globals.css";
import React from "react";
import { Inter } from 'next/font/google';
import { type Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import MobileNavbar from "@/components/layout/MobileNavbar";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import StatsBar from "@/components/layout/StatsBar";

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
          <div className="relative min-h-screen flex flex-col md:flex-row">
            {/* Desktop sidebar - hidden on mobile */}
            <div className="hidden md:flex">
              <Sidebar />
            </div>
            
            {/* Main content area */}
            <div className="flex-1 flex flex-col h-screen">
              {/* Header with search */}
              <Header />
              
              {/* Main content */}
              <main className="flex-1 overflow-auto p-4 md:p-6">
                {children}
              </main>
              
              {/* Stats bar - desktop only */}
              <div className="hidden md:block border-t border-border">
                <StatsBar />
              </div>
              
              {/* Mobile navigation - visible only on mobile */}
              <div className="md:hidden">
                <MobileNavbar />
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
