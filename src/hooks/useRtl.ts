'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { createRtlUtils } from '@/utils/rtl';

/**
 * Hook to get RTL-aware utility functions based on the current language
 */
export function useRtl() {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  
  return createRtlUtils(isRtl);
}
