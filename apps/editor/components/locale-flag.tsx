'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const importSVG = async (locale: string) => {
  const res = await import(`@/images/icons/${locale}.svg?url`);
  return res.default;
};

export function LocaleFlag({ locale }: { locale: string }) {
  const [logoSrc, setLogoSrc] = useState<string>('');

  useEffect(() => {
    importSVG(locale).then(setLogoSrc);
  }, [locale]);

  return logoSrc ? (
    <Image src={logoSrc} alt={locale} width={20} height={20} />
  ) : (
    <div className="h-4 w-6 bg-gray-200 animate-pulse" />
  );
}
