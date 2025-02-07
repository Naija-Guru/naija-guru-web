import React from 'react';
import { VirtualElement } from '@floating-ui/dom';

import { Button, Popover } from '@naija-spell-checker/ui';

import { TSuggestion } from '@/models/suggestion';
import { useTranslations } from 'next-intl';

export function SuggestionPopover({
  isOpen,
  toggle,
  elementId,
  suggestion,
  anchorRef,
  onApplySuggestion,
}: {
  isOpen: boolean;
  suggestion: TSuggestion;
  anchorRef: VirtualElement | null;
  elementId: string;
  toggle: (open: boolean) => void;
  onApplySuggestion: (elementId: string, suggestion: TSuggestion) => void;
}) {
  const t = useTranslations('Home');

  return (
    <Popover open={isOpen} toggleOpen={toggle} virtualAnchor={anchorRef}>
      <h4 className="tw-mb-2">Suggestion</h4>
      <p className="tw-text-primary tw-font-bold tw-text-xl tw-mb-2">
        {suggestion.replacements[0].value}
      </p>
      <p className="tw-text-xs tw-mb-4">{suggestion.message}</p>
      <Button onClick={() => onApplySuggestion(elementId, suggestion)}>
        {t('accept_suggestion')}
      </Button>
    </Popover>
  );
}
