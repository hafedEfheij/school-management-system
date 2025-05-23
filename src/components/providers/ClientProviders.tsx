'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import NotificationContainer from '@/components/ui/notification-container';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <LanguageProvider>
        <AuthProvider>
          {children}
          <NotificationContainer />
        </AuthProvider>
      </LanguageProvider>
    </NotificationProvider>
  );
}
