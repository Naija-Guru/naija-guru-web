import { TSuggestion } from '@/models/suggestion';
import { cn } from '@naija-spell-checker/ui';
import { ReviewSuggestionsActions } from './review-suggestions-actions';
import { ReviewSuggestionsDesktopList } from './review-suggestions-desktop-list';
import { ReviewSuggestionsEmpty } from './review-suggestions-empty';
import { ReviewSuggestionsMobileList } from './review-suggestions-mobile-list';

export function ReviewSuggestions({
  list,
  onApplySuggestion,
  onApplyAllSuggestions,
  isLoadingSuggestions,
  isListEmpty,
  isAcceptingAllSuggestions,
}: {
  list: Record<string, TSuggestion[]>;
  onApplySuggestion: (elementId: string, suggestion: TSuggestion) => void;
  onApplyAllSuggestions: () => void;
  isLoadingSuggestions: boolean;
  isListEmpty: boolean;
  isAcceptingAllSuggestions: boolean;
}) {
  return (
    <div
      className={cn(
        'flex',
        'flex-col',
        'lg:w-1/3',
        'lg:static',
        'fixed',
        'bottom-0',
        'left-0',
        'right-0',
        'bg-white',
        'h-[250px]',
        'lg:h-[calc(100vh-300px)]',
        'border',
        'border-solid'
      )}
    >
      <div className="p-4 flex justify-between">
        <h2 className="text-secondary text-xl font-semibold">Suggestions</h2>
      </div>
      <ReviewSuggestionsActions
        showApplyAllSuggestionsAction={!isListEmpty}
        isAcceptingAllSuggestions={isAcceptingAllSuggestions}
        onApplyAllSuggestions={onApplyAllSuggestions}
      />
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
