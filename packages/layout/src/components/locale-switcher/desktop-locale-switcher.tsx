'use client';

import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from '@naija-spell-checker/ui';

import { LocaleFlag } from './locale-flag';
import { ISO_2_COUNTRY_CODE_TO_COUNTRY_LABEL } from '../../constants';

export function DesktopLocaleSwitcher({
  pathname,
  currentLocale,
  locales,
}: {
  pathname: string;
  currentLocale: string;
  locales: string[];
}) {
  return (
    <NavigationMenuItem className="tw-relative">
      <NavigationMenuTrigger className="tw-flex tw-items-center tw-gap-2">
        <LocaleFlag locale={currentLocale} />
        {ISO_2_COUNTRY_CODE_TO_COUNTRY_LABEL[currentLocale]}
      </NavigationMenuTrigger>
      <NavigationMenuContent className="tw-w-[150px]">
        {locales.map((locale) =>
          locale !== currentLocale ? (
            <NavigationMenuLink href={`/${locale}${pathname}`} key={locale}>
              <div className="tw-flex tw-items-center tw-gap-2">
                <LocaleFlag locale={locale} />
                {ISO_2_COUNTRY_CODE_TO_COUNTRY_LABEL[locale]}
              </div>
            </NavigationMenuLink>
          ) : null
        )}
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
