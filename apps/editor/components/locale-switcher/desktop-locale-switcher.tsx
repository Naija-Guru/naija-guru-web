'use client';

import { routing, usePathname } from '@/i18n/routing';
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from '@naija-spell-checker/ui';

import { ISO_2_COUNTRY_CODE_TO_COUNTRY_LABEL } from '@/constants/country';
import { useLocale } from '@/hooks/use-locale';

import { LocaleFlag } from './locale-flag';

export function DesktopLocaleSwitcher() {
  const pathname = usePathname();
  const currentLocale = useLocale();

  return (
    <NavigationMenuItem className="tw-relative">
      <NavigationMenuTrigger className="tw-flex tw-gap-2">
        <LocaleFlag locale={currentLocale} />
        {ISO_2_COUNTRY_CODE_TO_COUNTRY_LABEL[currentLocale]}
      </NavigationMenuTrigger>
      <NavigationMenuContent className="tw-w-[150px]">
        {routing.locales.map((locale) =>
          locale !== currentLocale ? (
            <NavigationMenuLink
              href={`/${locale}${pathname}`}
              key={locale}
              className="tw-flex tw-gap-2"
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
