'use client';

import { routing, usePathname } from '@/i18n/routing';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@naija-spell-checker/ui';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ISO_2_COUNTRY_CODE_TO_COUNTRY_LABEL } from '../constants';
import { LocaleFlag } from './locale-flag';

export function MobileLocaleSwitcher() {
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.locale as string;

  return (
    <AccordionItem value={currentLocale}>
      <AccordionTrigger className="px-4">
        <span className="flex gap-2">
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
              className="flex gap-2 p-4"
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
