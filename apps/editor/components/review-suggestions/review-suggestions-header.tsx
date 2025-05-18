import React from 'react';
import { useTranslations } from 'next-intl';

export const ReviewSuggestionsHeader = () => {
  const t = useTranslations('suggestions');

  return (
    <div className="tw-p-4 tw-pb-0 tw-flex tw-justify-between">
      <h2 className="tw-text-secondary tw-text-xl tw-font-semibold tw-text-center tw-w-full">
        {t('title')}
      </h2>
    </div>
  );
};
