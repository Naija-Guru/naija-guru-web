'use client';

import Link from 'next/link';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@naija-spell-checker/ui';

import { LocaleFlag } from './locale-flag';
import { ISO_2_COUNTRY_CODE_TO_COUNTRY_LABEL } from '../../constants';

export function MobileLocaleSwitcher({
  pathname,
  currentLocale,
  locales,
}: {
  pathname: string;
  currentLocale: string;
  locales: string[];
}) {
  return (
    <AccordionItem value={currentLocale}>
      <AccordionTrigger className="tw-px-4">
        <span className="tw-flex tw-items-center tw-gap-2">
          <LocaleFlag locale={currentLocale} />
          {ISO_2_COUNTRY_CODE_TO_COUNTRY_LABEL[currentLocale]}
        </span>
      </AccordionTrigger>
      <AccordionContent>
        {locales.map((locale) =>
          locale !== currentLocale ? (
            <Link
              href={`/${locale}${pathname}`}
              key={locale}
              className="tw-flex tw-items-center tw-gap-2 tw-p-4"
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
