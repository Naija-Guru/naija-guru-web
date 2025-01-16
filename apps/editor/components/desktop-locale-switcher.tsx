'use client';

import { routing, usePathname } from '@/i18n/routing';
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from '@naija-spell-checker/ui';

import { useParams } from 'next/navigation';
import { ISO_2_COUNTRY_CODE_TO_COUNTRY_LABEL } from '../constants';
import { LocaleFlag } from './review-suggestions/locale-flag';

export function DesktopLocaleSwitcher() {
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.locale as string;

  return (
    <NavigationMenuItem className="relative">
      <NavigationMenuTrigger className="flex gap-2">
        <LocaleFlag locale={currentLocale} />
        {ISO_2_COUNTRY_CODE_TO_COUNTRY_LABEL[currentLocale]}
      </NavigationMenuTrigger>
      <NavigationMenuContent className="w-[150px]">
        {routing.locales.map((locale) =>
          locale !== currentLocale ? (
            <NavigationMenuLink
              href={`/${locale}${pathname}`}
              key={locale}
              className="flex gap-2"
            >
              <LocaleFlag locale={locale} />
              {ISO_2_COUNTRY_CODE_TO_COUNTRY_LABEL[locale]}
            </NavigationMenuLink>
          ) : null
        )}
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
