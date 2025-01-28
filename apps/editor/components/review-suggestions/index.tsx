import { TSuggestion } from '@/models/suggestion';
import { Button, cn } from '@naija-spell-checker/ui';
import { ApplyAllSuggestions } from './apply-all-suggestions';
import { ReviewSuggestionsDesktopList } from './review-suggestions-desktop-list';
import { ReviewSuggestionsEmpty } from './review-suggestions-empty';
import { ReviewSuggestionsMobileList } from './review-suggestions-mobile-list';
import { PreferencesDialog } from '../preferences-dialog';
import { SettingsIcon } from 'lucide-react';

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
      <h2 className="text-secondary text-xl font-semibold p-4 text-center">
        Review Suggestions
      </h2>
      <PreferencesDialog
        trigger={
          <Button className="mx-4" variant="link">
            <SettingsIcon className="px-1" />
            Preferences
          </Button>
        }
      />
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
