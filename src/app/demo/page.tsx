'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRtl } from '@/hooks/useRtl';
import { DateFormatter, NumberFormatter, CurrencyFormatter, RelativeTimeFormatter } from '@/components/common/Formatters';

export default function DemoPage() {
  const { t, language } = useLanguage();
  const rtl = useRtl();
  const [name, setName] = useState('User');
  
  // Sample data for demonstration
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const lastWeek = new Date(now);
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  const lastMonth = new Date(now);
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  
  return (
    <MainLayout>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Internationalization Demo</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Variable Substitution */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Variable Substitution</h2>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                {t('common.name')}:
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="p-4 bg-gray-100 rounded-md">
              <p>{t('app.welcome', { name })}</p>
            </div>
          </div>
          
          {/* Date Formatting */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Date Formatting</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Short:</span>
                <DateFormatter date={now} options={{ dateStyle: 'short' }} />
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Medium:</span>
                <DateFormatter date={now} options={{ dateStyle: 'medium' }} />
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Long:</span>
                <DateFormatter date={now} options={{ dateStyle: 'long' }} />
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Full:</span>
                <DateFormatter date={now} options={{ dateStyle: 'full' }} />
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Time:</span>
                <DateFormatter date={now} options={{ timeStyle: 'medium' }} />
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date & Time:</span>
                <DateFormatter date={now} options={{ dateStyle: 'medium', timeStyle: 'short' }} />
              </div>
            </div>
          </div>
          
          {/* Number Formatting */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Number Formatting</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Integer:</span>
                <NumberFormatter value={1234567} />
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Decimal:</span>
                <NumberFormatter value={1234567.89} />
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Percentage:</span>
                <NumberFormatter value={0.7654} options={{ style: 'percent' }} />
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Scientific:</span>
                <NumberFormatter value={1234567.89} options={{ notation: 'scientific' }} />
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Compact:</span>
                <NumberFormatter value={1234567} options={{ notation: 'compact' }} />
              </div>
            </div>
          </div>
          
          {/* Currency Formatting */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Currency Formatting</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">USD:</span>
                <CurrencyFormatter amount={1234.56} currency="USD" />
              </div>
              <div className="flex justify-between">
                <span className="font-medium">EUR:</span>
                <CurrencyFormatter amount={1234.56} currency="EUR" />
              </div>
              <div className="flex justify-between">
                <span className="font-medium">GBP:</span>
                <CurrencyFormatter amount={1234.56} currency="GBP" />
              </div>
              <div className="flex justify-between">
                <span className="font-medium">JPY:</span>
                <CurrencyFormatter amount={1234.56} currency="JPY" />
              </div>
              <div className="flex justify-between">
                <span className="font-medium">SAR:</span>
                <CurrencyFormatter amount={1234.56} currency="SAR" />
              </div>
            </div>
          </div>
          
          {/* Relative Time Formatting */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Relative Time</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Now:</span>
                <RelativeTimeFormatter date={now} />
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Yesterday:</span>
                <RelativeTimeFormatter date={yesterday} />
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Last Week:</span>
                <RelativeTimeFormatter date={lastWeek} />
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Last Month:</span>
                <RelativeTimeFormatter date={lastMonth} />
              </div>
            </div>
          </div>
          
          {/* RTL Support Demo */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">RTL Support</h2>
            <div className="space-y-4">
              <div className={`flex ${rtl.flexDirection()} items-center gap-4 p-4 bg-gray-100 rounded-md`}>
                <div className={`${rtl.border('left')} ${rtl.padding('left', 4)}`}>
                  <span className="font-medium">{t('common.first')}</span>
                </div>
                <div className={`${rtl.border('left')} ${rtl.padding('left', 4)}`}>
                  <span className="font-medium">{t('common.second')}</span>
                </div>
                <div className={`${rtl.padding('left', 4)}`}>
                  <span className="font-medium">{t('common.third')}</span>
                </div>
              </div>
              
              <div className={`text-${rtl.textAlign()} p-4 bg-gray-100 rounded-md`}>
                <p>{t('common.rtlExample')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
