import { VirtualElement } from '@floating-ui/dom';

import { Popover } from '@naija-spell-checker/ui';

import { TSuggestion } from '@/models/suggestion';
import { Suggestion } from './suggestion';

export function SuggestionPopover({
  isOpen,
  toggle,
  elementId,
  suggestion,
  anchorRef,
  onApplySuggestion,
  onIgnoreRuleOrCategory,
}: {
  isOpen: boolean;
  suggestion: TSuggestion;
  anchorRef: VirtualElement | null;
  elementId: string;
  toggle: (open: boolean) => void;
  onApplySuggestion: (elementId: string, suggestion: TSuggestion) => void;
  onIgnoreRuleOrCategory: (elementId: string) => void;
}) {
  return (
    <Popover open={isOpen} toggleOpen={toggle} virtualAnchor={anchorRef}>
      <Suggestion
        suggestion={suggestion}
        onAccept={() => onApplySuggestion(elementId, suggestion)}
        onIgnoreRuleOrCategory={() => onIgnoreRuleOrCategory(elementId)}
      />
    </Popover>
  );
}
