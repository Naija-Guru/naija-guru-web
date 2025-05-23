import { TSuggestion } from '@/models/suggestion';
import { cn, ScrollArea, ScrollBar } from '@naija-spell-checker/ui';
import { Suggestion } from '../suggestion';

export function ReviewSuggestionsMobileList({
  list,
  onApplySuggestion,
  onIgnoreRuleOrCategory,
  isLoadingSuggestions,
  isListEmpty,
}: {
  list: Record<string, TSuggestion[]>;
  onApplySuggestion: (
    elementId: string,
    suggestion: TSuggestion,
    replacementIndex?: number
  ) => void;
  onIgnoreRuleOrCategory: (elementId: string) => void;
  isLoadingSuggestions: boolean;
  isListEmpty: boolean;
}) {
  return (
    <ScrollArea>
      <div
        className={cn('tw-flex tw-flex-col tw-gap-2 tw-px-12 tw-h-[70vh]', {
          'tw-border': !isListEmpty,
        })}
      >
        {Object.entries(list).map(([elementId, suggestions]) =>
          suggestions.map((suggestion) => (
            <Suggestion
              key={elementId + suggestion.offset}
              className="tw-p-4 tw-border tw-border-solid"
              suggestion={suggestion}
              onAccept={(replacementIndex) =>
                onApplySuggestion(elementId, suggestion, replacementIndex)
              }
              onIgnoreRuleOrCategory={() => onIgnoreRuleOrCategory(elementId)}
              disabled={isLoadingSuggestions}
            />
          ))
        )}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}
