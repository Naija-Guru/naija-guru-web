'use client';

import Link from 'next/link';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@naija-spell-checker/ui';

import { routing, usePathname } from '@/i18n/routing';
import { ISO_2_COUNTRY_CODE_TO_COUNTRY_LABEL } from '@/constants/country';
import { useLocale } from '@/hooks/use-locale';

import { LocaleFlag } from '../locale-flag';

export function MobileLocaleSwitcher() {
  const pathname = usePathname();
  const currentLocale = useLocale();

  return (
    <AccordionItem value={currentLocale}>
      <AccordionTrigger className="tw-px-4">
        <span className="tw-flex tw-gap-2">
          <LocaleFlag locale={currentLocale} />
          {ISO_2_COUNTRY_CODE_TO_COUNTRY_LABEL[currentLocale]}
        </span>
      </AccordionTrigger>
      <AccordionContent>
        {routing.locales.map((locale) =>
          locale !== currentLocale ? (
            <Link
              href={`/${locale}${pathname}`}
              key={locale}
              className="tw-flex tw-gap-2 tw-p-4"
            >
              <LocaleFlag locale={locale} />
              {ISO_2_COUNTRY_CODE_TO_COUNTRY_LABEL[locale]}
            </Link>
          ) : null
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
