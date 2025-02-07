import React, { FC } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@naija-spell-checker/ui';

import { TSuggestion } from '@/models/suggestion';

interface SuggestionProps {
  className?: string;
  suggestion: TSuggestion;
  onAccept: () => void;
  disableAccept?: boolean;
}

export const Suggestion: FC<SuggestionProps> = ({
  className,
  disableAccept,
  suggestion,
  onAccept,
}) => {
  const t = useTranslations();

  return (
    <section className={className}>
      <h1 className="tw-text-xl tw-font-bold">
        {suggestion.replacements[0].value}
      </h1>
      <p className="tw-font-normal tw-text-xs">{suggestion.message}</p>
      <Button className="tw-my-4" onClick={onAccept} disabled={disableAccept}>
        {t('accept_suggestion')}
      </Button>
    </section>
  );
};
