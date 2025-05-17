'use client';

import { PropsWithChildren } from 'react';

import { Footer, Header } from '@naija-spell-checker/layout';

import { useLocale } from '@/hooks/use-locale';
import { routing, usePathname } from '@/i18n/routing';

export const AppLayout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const currentLocale = useLocale();

  return (
    <div className="tw-flex tw-flex-col tw-min-h-screen">
      <Header
        pathname={pathname}
        currentLocale={currentLocale}
        locales={routing.locales as unknown as string[]}
      />
      {children}
      <Footer appName="Naija Translator" />
    </div>
  );
};
