import { TSuggestion } from '@/models/suggestion';
import { cn, ScrollArea } from '@naija-spell-checker/ui';
import { Suggestion } from '../suggestion';

export function ReviewSuggestionsMobileList({
  list,
  onApplySuggestion,
  onIgnoreRuleOrCategory,
  isLoadingSuggestions,
  isListEmpty,
}: {
  list: Record<string, TSuggestion[]>;
  onApplySuggestion: (elementId: string, suggestion: TSuggestion) => void;
  onIgnoreRuleOrCategory: (elementId: string) => void;
  isLoadingSuggestions: boolean;
  isListEmpty: boolean;
}) {
  return (
    <ScrollArea>
      <div
        className={cn('tw-flex tw-flex-col tw-gap-2 tw-p-8', {
          'tw-border': !isListEmpty,
        })}
      >
        {Object.entries(list).map(([elementId, suggestions]) =>
          suggestions.map((suggestion) => (
            <Suggestion
              key={elementId + suggestion.offset}
              className="tw-p-4 tw-border tw-border-solid"
              suggestion={suggestion}
              onAccept={() => onApplySuggestion(elementId, suggestion)}
              onIgnoreRuleOrCategory={() => onIgnoreRuleOrCategory(elementId)}
              disabled={isLoadingSuggestions}
            />
          ))
        )}
      </div>
    </ScrollArea>
  );
}
