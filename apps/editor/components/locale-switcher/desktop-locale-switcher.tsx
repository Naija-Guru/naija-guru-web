'use client';

import { routing, usePathname } from '@/i18n/routing';
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from '@naija-spell-checker/ui';

import { ISO_2_COUNTRY_CODE_TO_COUNTRY_LABEL } from '../../constants';
import { LocaleFlag } from '../locale-flag';
import { useLocale } from '@/hooks/useLocale';

export function DesktopLocaleSwitcher() {
  const pathname = usePathname();
  const currentLocale = useLocale();

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
