'use client';
import { Nigeria } from '../flags/nigeria';
import { UnitedStates } from '../flags/united-states';

const FLAGS_MAP = {
  pcm: Nigeria,
  en: UnitedStates,
};

export function LocaleFlag({ locale }: { locale: string }) {
  // @ts-ignore
  const Component = FLAGS_MAP[locale];

  return <Component />;
}
