'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t, language, isClient } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Return empty during SSR to avoid hydration mismatch
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt="School Management System"
              width={40}
              height={40}
              className="dark:invert"
            />
            <span className="text-xl font-bold">{t('app.title')}</span>
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <div className="flex space-x-2">
              <Button variant="outline" asChild>
                <Link href="/login">{t('app.signIn')}</Link>
              </Button>
              <Button asChild>
                <Link href="/register">{t('app.signUp')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-background to-muted">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('home.title')}</h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              {t('home.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">
                  {t('app.signUp')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">{t('home.learnMore')}</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">{t('home.features.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">{t('home.features.studentManagement.title')}</h3>
                <p className="text-muted-foreground">{t('home.features.studentManagement.description')}</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">{t('home.features.courseManagement.title')}</h3>
                <p className="text-muted-foreground">{t('home.features.courseManagement.description')}</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">{t('home.features.gradeTracking.title')}</h3>
                <p className="text-muted-foreground">{t('home.features.gradeTracking.description')}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-muted-foreground">
                &copy; {new Date().getFullYear()} {t('app.title')}. {t('home.footer.allRightsReserved')}
              </p>
            </div>
            <div className="flex space-x-4">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                {t('home.footer.privacy')}
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                {t('home.footer.terms')}
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                {t('home.footer.contact')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
