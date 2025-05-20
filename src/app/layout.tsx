import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SafeThemeProvider } from "@/components/ui/safe-theme-provider";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { ClientOnly } from "@/components/ui/client-only";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TestNavigation from "@/components/TestNavigation";
import "./globals.css";
import "../styles/global.css"; // Import our global CSS

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "School Management System",
  description: "A comprehensive school management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <ClientOnly fallback={<div className="p-8 text-center">Loading...</div>}>
            <LanguageProvider>
              <SafeThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-1">
                    {children}
                  </main>
                  <Footer />
                  <TestNavigation />
                </div>
              </SafeThemeProvider>
            </LanguageProvider>
          </ClientOnly>
        </ErrorBoundary>
      </body>
    </html>
  );
}
