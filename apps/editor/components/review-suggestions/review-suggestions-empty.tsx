import { FileCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ReviewSuggestionsEmpty() {
  const t = useTranslations('suggestions');

  return (
    <div className="tw-text-secondary tw-my-6">
      <FileCheck className="tw-mx-auto tw-h-10 tw-w-10 md:tw-h-20 md:tw-w-20" />
      <p className="tw-p-4 tw-text-center">{t('empty')}</p>
    </div>
  );
}
