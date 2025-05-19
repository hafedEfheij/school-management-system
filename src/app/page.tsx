'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from './styles.module.css';

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
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('home.title')}</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            {t('home.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className={styles.container}>
            <h2 className={styles.heading}>{t('home.features.studentManagement.title')}</h2>
            <p className={styles.paragraph}>{t('home.features.studentManagement.description')}</p>
            <Button className={styles.button}>{t('home.learnMore')}</Button>
          </div>
          <div className={styles.container}>
            <h2 className={styles.heading}>{t('home.features.courseManagement.title')}</h2>
            <p className={styles.paragraph}>{t('home.features.courseManagement.description')}</p>
            <Button className={styles.button}>{t('home.learnMore')}</Button>
          </div>
          <div className={styles.container}>
            <h2 className={styles.heading}>{t('home.features.gradeTracking.title')}</h2>
            <p className={styles.paragraph}>{t('home.features.gradeTracking.description')}</p>
            <Button className={styles.button}>{t('home.learnMore')}</Button>
          </div>
        </div>

        <div className="text-center">
          <Image
            src="/logo.svg"
            alt="School Management System"
            width={120}
            height={120}
            className="mx-auto mb-6 dark:invert"
          />
          <p className="text-lg text-muted-foreground">
            {t('app.description')}
          </p>
        </div>
      </div>
    </div>
  );
}
