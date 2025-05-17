import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';

import { Toaster } from '@naija-spell-checker/ui';

import '@/styles/global.scss';
import { AppLayout } from '../components/app-layout';

export const metadata: Metadata = {
  title: 'Naija Translator',
  description: 'Nigerian Pidgin translator web app',
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
          <AppLayout>
            <div className="tw-flex-1">{children}</div>
          </AppLayout>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
