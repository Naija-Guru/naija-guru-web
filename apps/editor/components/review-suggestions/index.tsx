import { TSuggestion } from '@/models/suggestion';
import {
  cn,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  FloatingButton,
} from '@naija-spell-checker/ui';
import { ReviewSuggestionsActions } from './review-suggestions-actions';
import { ReviewSuggestionsDesktopList } from './review-suggestions-desktop-list';
import { ReviewSuggestionsEmpty } from './review-suggestions-empty';
import { ReviewSuggestionsMobileList } from './review-suggestions-mobile-list';
import { ReviewSuggestionsHeader } from './review-suggestions-header';
import { Settings2Icon } from 'lucide-react';

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
    <>
      <div
        className={cn(
          'tw-hidden md:tw-block',
          'tw-flex',
          'tw-flex-col',
          'tw-bg-white',
          'tw-border',
          'tw-h-[calc(100vh-300px)]',
          'tw-border-l-0',
          'tw-border-solid'
        )}
      >
        <ReviewSuggestionsHeader />
        <ReviewSuggestionsActions
          showApplyAllSuggestionsAction={!isListEmpty}
          isAcceptingAllSuggestions={isAcceptingAllSuggestions}
          onApplyAllSuggestions={onApplyAllSuggestions}
        />
        {!isAcceptingAllSuggestions && (
          <>
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
      <Drawer>
        <DrawerTrigger asChild>
          <FloatingButton variant="outline" className="md:tw-hidden" size="lg">
            <Settings2Icon />
          </FloatingButton>
        </DrawerTrigger>
        <DrawerContent className="tw-h-[80vh]">
          <DrawerHeader>
            <DrawerTitle>Suggestions</DrawerTitle>
          </DrawerHeader>
          <ReviewSuggestionsActions
            showApplyAllSuggestionsAction={!isListEmpty}
            isAcceptingAllSuggestions={isAcceptingAllSuggestions}
            onApplyAllSuggestions={onApplyAllSuggestions}
          />
          <ReviewSuggestionsMobileList
            list={list}
            onApplySuggestion={onApplySuggestion}
            onIgnoreRuleOrCategory={onIgnoreRuleOrCategory}
            isLoadingSuggestions={isLoadingSuggestions}
            isListEmpty={isListEmpty}
          />
          {isListEmpty && <ReviewSuggestionsEmpty />}
        </DrawerContent>
      </Drawer>
    </>
  );
}
