import type { Metadata } from 'next';
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { InstallPrompt } from '@/components/install-prompt';
import '@/styles/global.scss';
import { Toaster } from '@naija-spell-checker/ui';

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

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div className="tw-flex tw-flex-col tw-min-h-screen">
            <Header />
            <div className="tw-flex-1">{children}</div>
            <Footer />
            <InstallPrompt />
            <Toaster />
          </div>
        </NextIntlClientProvider>
        <Script src="/service-worker.js" />
      </body>
    </html>
  );
}
