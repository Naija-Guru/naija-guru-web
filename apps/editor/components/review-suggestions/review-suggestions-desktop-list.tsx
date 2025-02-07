import { TSuggestion } from '@/models/suggestion';
import { Suggestion } from '../suggestion';

export function ReviewSuggestionsDesktopList({
  list,
  onApplySuggestion,
  isLoadingSuggestions,
}: {
  list: Record<string, TSuggestion[]>;
  onApplySuggestion: (elementId: string, suggestion: TSuggestion) => void;
  isLoadingSuggestions: boolean;
}) {
  return (
    <ul className="tw-overflow-y-scroll tw-h-7/8 tw-border-t tw-border-solid tw-hidden md:tw-block">
      {Object.entries(list).map(([elementId, suggestions]) =>
        suggestions.map((suggestion) => (
          <li key={elementId + suggestion.offset}>
            <Suggestion
              className="tw-p-4 tw-border-b tw-border-solid"
              suggestion={suggestion}
              onAccept={() => onApplySuggestion(elementId, suggestion)}
              disableAccept={isLoadingSuggestions}
            />
          </li>
        ))
      )}
    </ul>
  );
}
