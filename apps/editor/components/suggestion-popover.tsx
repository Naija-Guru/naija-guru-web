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
}: {
  isOpen: boolean;
  suggestion: TSuggestion;
  anchorRef: VirtualElement | null;
  elementId: string;
  toggle: (open: boolean) => void;
  onApplySuggestion: (elementId: string, suggestion: TSuggestion) => void;
}) {
  return (
    <Popover open={isOpen} toggleOpen={toggle} virtualAnchor={anchorRef}>
      <Suggestion
        className="tw-cursor-pointer"
        suggestion={suggestion}
        onAccept={() => onApplySuggestion(elementId, suggestion)}
      />
    </Popover>
  );
}
