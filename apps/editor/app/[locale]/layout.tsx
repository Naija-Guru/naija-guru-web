import type { Metadata } from 'next';
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { GoogleAnalytics } from '@next/third-parties/google'
import { routing } from '@/i18n/routing';

import { Toaster } from '@naija-spell-checker/ui';

import { InstallPrompt } from '@/components/install-prompt';
import { PreferencesProvider } from '@/providers/preferences-provider';
import '@/styles/global.scss';
import { AppLayout } from '@/components/app-layout';

export const metadata: Metadata = {
  title: 'Naija Spell Checker',
  description: 'Nigerian Pidgin spell checker web app',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <PreferencesProvider>
            <AppLayout>
              <div className="tw-flex-1">{children}</div>
              <InstallPrompt />
              <Toaster />
            </AppLayout>
          </PreferencesProvider>
        </NextIntlClientProvider>
        <Script src="/service-worker.js" />
      </body>

      <GoogleAnalytics gaId="G-HNC16XYVG2" />
    </html>
  );
}
