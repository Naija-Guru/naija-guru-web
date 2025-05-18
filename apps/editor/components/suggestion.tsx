import React, { FC } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@naija-spell-checker/ui';

import { TSuggestion } from '@/models/suggestion';
import { formatEnumToText } from '@/lib/string';
import { usePreferences } from '@/providers/preferences-provider';

interface SuggestionProps {
  className?: string;
  suggestion: TSuggestion;
  onAccept: (replacementIndex?: number) => void;
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
  const { dispatch: dispatchPreferences } = usePreferences();
  const t = useTranslations();

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
        {suggestion.replacements.length < 1 && (
          <Button
            className="tw-my-4"
            onClick={() => onAccept()}
            disabled={disabled}
          >
            {t('suggestions.fix')}
          </Button>
        )}
        {suggestion.replacements.map((replacement, index) => (
          <Button
            key={index}
            className="tw-my-4"
            onClick={() => onAccept(index)}
            disabled={disabled}
          >
            {replacement.value.trim().length > 0
              ? replacement.value
              : t('suggestions.fix_whitespace')}
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
              {t('suggestions.ignore_rule')}{' '}
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
              {t('suggestions.ignore_category')}{' '}
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
