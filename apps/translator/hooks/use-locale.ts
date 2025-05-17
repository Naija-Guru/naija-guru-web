'use client';

import { useParams } from 'next/navigation';

export function useLocale(): string {
  const params = useParams<{ locale: string }>();
  return params.locale || 'en';
}
