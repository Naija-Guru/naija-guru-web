import React, { FC } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@naija-spell-checker/ui';

import { TSuggestion } from '@/models/suggestion';
import { formatEnumToText } from '@/lib/string';
import { usePreferences } from '@/providers/preferences-provider';

interface SuggestionProps {
  className?: string;
  suggestion: TSuggestion;
  onAccept: (replacementIndex: number) => void;
  onIgnoreRuleOrCategory?: () => void;
  disabled?: boolean;
}

export const Suggestion: FC<SuggestionProps> = ({
  className,
  disabled,
  suggestion,
  onAccept,
  onIgnoreRuleOrCategory,
}) => {
  const t = useTranslations();
  const { dispatch: dispatchPreferences } = usePreferences();

  const handleIgnoreCategory = () => {
    dispatchPreferences({
      type: 'ADD_IGNORED_CATEGORY',
      payload: {
        categoryId: suggestion.rule.category.id,
      },
    });
    onIgnoreRuleOrCategory?.();
  };

  const handleIgnoreRule = () => {
    dispatchPreferences({
      type: 'ADD_IGNORED_RULE',
      payload: {
        ruleId: suggestion.rule.id,
      },
    });
    onIgnoreRuleOrCategory?.();
  };

  return (
    <section className={className}>
      <h1 className="tw-text-l tw-font-bold">
        {formatEnumToText(suggestion.rule.id)}
      </h1>
      <p className="tw-font-normal tw-text-xs">{suggestion.message}</p>
      <div className="tw-flex tw-gap-x-2 tw-flex-wrap">
        {suggestion.replacements.map((replacement, index) => (
          <Button
            key={index}
            className="tw-my-4"
            onClick={() => onAccept(index)}
            disabled={disabled}
          >
            {replacement.value}
          </Button>
        ))}
      </div>
      {onIgnoreRuleOrCategory && (
        <div className="tw-flex tw-gap-x-2 tw-flex-wrap">
          <Button
            className="tw-my-2 tw-text-xs tw-whitespace-break-spaces"
            variant="outline"
            onClick={handleIgnoreRule}
            disabled={disabled}
          >
            <span>
              Ignore rule{' '}
              <span className="tw-text-secondary">
                {formatEnumToText(suggestion.rule.id)}
              </span>
            </span>
          </Button>
          <Button
            className="tw-my-2 tw-text-xs tw-whitespace-break-spaces"
            variant="outline"
            onClick={handleIgnoreCategory}
            disabled={disabled}
          >
            <span>
              Ignore category{' '}
              <span className="tw-text-secondary">
                {formatEnumToText(suggestion.rule.category.id)}
              </span>
            </span>
          </Button>
        </div>
      )}
    </section>
  );
};
