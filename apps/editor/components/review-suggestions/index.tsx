import { TSuggestion } from '@/models/suggestion';
import { cn } from '@naija-spell-checker/ui';
import { ApplyAllSuggestions } from './apply-all-suggestions';
import { ReviewSuggestionsDesktopList } from './review-suggestions-desktop-list';
import { ReviewSuggestionsEmpty } from './review-suggestions-empty';
import { ReviewSuggestionsMobileList } from './review-suggestions-mobile-list';

export function ReviewSuggestions({
  className,
  list,
  onApplySuggestion,
  onApplyAllSuggestions,
  isLoadingSuggestions,
  isListEmpty,
  isAcceptingAllSuggestions,
}: {
  className: string;
  list: Record<string, TSuggestion[]>;
  onApplySuggestion: (elementId: string, suggestion: TSuggestion) => void;
  onApplyAllSuggestions: () => void;
  isLoadingSuggestions: boolean;
  isListEmpty: boolean;
  isAcceptingAllSuggestions: boolean;
}) {
  return (
    <div className={cn(className)}>
      <h2 className="text-secondary text-xl font-semibold p-4 text-center">
        Review Suggestions
      </h2>
      {!isListEmpty && (
        <ApplyAllSuggestions
          isAcceptingAllSuggestions={isAcceptingAllSuggestions}
          onApplyAllSuggestions={onApplyAllSuggestions}
        />
      )}
      {!isAcceptingAllSuggestions && (
        <>
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
        </>
      )}
      {isListEmpty && <ReviewSuggestionsEmpty />}
    </div>
  );
}
