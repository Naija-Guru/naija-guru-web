import { TSuggestion } from '@/models/suggestion';
import { cn } from '@naija-spell-checker/ui';
import { ReviewSuggestionsDesktopList } from './review-suggestions-desktop-list';
import { ReviewSuggestionsEmpty } from './review-suggestions-empty';
import { ReviewSuggestionsMobileList } from './review-suggestions-mobile-list';

export function ReviewSuggestions({
  className,
  list,
  onApplySuggestion,
  isLoadingSuggestions,
  isListEmpty,
}: {
  className: string;
  list: Record<string, TSuggestion[]>;
  onApplySuggestion: (elementId: string, suggestion: TSuggestion) => void;
  isLoadingSuggestions: boolean;
  isListEmpty: boolean;
}) {
  return (
    <div className={cn(className)}>
      <h2 className="text-secondary text-xl font-semibold p-4">
        Review Suggestions
      </h2>
      <ReviewSuggestionsMobileList
        list={list}
        onApplySuggestion={onApplySuggestion}
        isLoadingSuggestions={isLoadingSuggestions}
        isListEmpty={isListEmpty}
      />
      <ReviewSuggestionsDesktopList
        list={list}
        onApplySuggestion={onApplySuggestion}
        isLoadingSuggestions={isLoadingSuggestions}
      />
      {isListEmpty && <ReviewSuggestionsEmpty />}
    </div>
  );
}
