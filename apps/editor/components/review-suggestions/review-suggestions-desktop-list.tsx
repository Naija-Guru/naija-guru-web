import { TSuggestion } from '@/models/suggestion';
import { Suggestion } from '../suggestion';

export function ReviewSuggestionsDesktopList({
  list,
  onApplySuggestion,
  onIgnoreRuleOrCategory,
  isLoadingSuggestions,
}: {
  list: Record<string, TSuggestion[]>;
  onApplySuggestion: (
    elementId: string,
    suggestion: TSuggestion,
    replacementIndex: number
  ) => void;
  onIgnoreRuleOrCategory: (elementId: string) => void;
  isLoadingSuggestions: boolean;
}) {
  return (
    <ul className="tw-overflow-x-scroll tw-max-h-[82%] tw-border-t tw-border-solid">
      {Object.entries(list).map(([elementId, suggestions]) =>
        suggestions.map((suggestion) => (
          <li key={elementId + suggestion.offset}>
            <Suggestion
              className="tw-p-4 tw-border-b tw-border-solid"
              suggestion={suggestion}
              onAccept={(replacementIndex) =>
                onApplySuggestion(elementId, suggestion, replacementIndex)
              }
              onIgnoreRuleOrCategory={() => onIgnoreRuleOrCategory(elementId)}
              disabled={isLoadingSuggestions}
            />
          </li>
        ))
      )}
    </ul>
  );
}
