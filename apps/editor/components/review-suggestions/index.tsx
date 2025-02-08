import { TSuggestion } from '@/models/suggestion';
import { cn } from '@naija-spell-checker/ui';
import { ReviewSuggestionsActions } from './review-suggestions-actions';
import { ReviewSuggestionsDesktopList } from './review-suggestions-desktop-list';
import { ReviewSuggestionsEmpty } from './review-suggestions-empty';
import { ReviewSuggestionsMobileList } from './review-suggestions-mobile-list';

export function ReviewSuggestions({
  list,
  onApplySuggestion,
  onIgnoreRuleOrCategory,
  onApplyAllSuggestions,
  isLoadingSuggestions,
  isListEmpty,
  isAcceptingAllSuggestions,
}: {
  list: Record<string, TSuggestion[]>;
  onApplySuggestion: (elementId: string, suggestion: TSuggestion) => void;
  onIgnoreRuleOrCategory: (elementId: string) => void;
  onApplyAllSuggestions: () => void;
  isLoadingSuggestions: boolean;
  isListEmpty: boolean;
  isAcceptingAllSuggestions: boolean;
}) {
  return (
    <div
      className={cn(
        'tw-flex',
        'tw-flex-col',
        'lg:tw-w-1/3',
        'lg:tw-static',
        'tw-fixed',
        'tw-bottom-0',
        'tw-left-0',
        'tw-right-0',
        'tw-bg-white',
        'tw-h-[40vh]',
        'lg:tw-h-[calc(100vh-300px)]',
        'tw-border',
        'tw-border-solid'
      )}
    >
      <div className="tw-p-4 tw-pb-0 tw-flex tw-justify-between">
        <h2 className="tw-text-secondary tw-text-xl tw-font-semibold tw-text-center tw-w-full">
          Suggestions
        </h2>
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
            onIgnoreRuleOrCategory={onIgnoreRuleOrCategory}
            isLoadingSuggestions={isLoadingSuggestions}
            isListEmpty={isListEmpty}
          />
          <ReviewSuggestionsDesktopList
            list={list}
            onApplySuggestion={onApplySuggestion}
            onIgnoreRuleOrCategory={onIgnoreRuleOrCategory}
            isLoadingSuggestions={isLoadingSuggestions}
          />
        </>
      )}
      {isListEmpty && <ReviewSuggestionsEmpty />}
    </div>
  );
}
