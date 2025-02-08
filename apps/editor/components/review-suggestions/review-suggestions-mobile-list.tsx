import { TSuggestion } from '@/models/suggestion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@naija-spell-checker/ui';
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
    <Carousel className="tw-w-full md:tw-hidden">
      <CarouselContent>
        {Object.entries(list).map(([elementId, suggestions]) =>
          suggestions.map((suggestion) => (
            <CarouselItem key={elementId + suggestion.offset}>
              <Suggestion
                className="tw-p-4 tw-border tw-border-solid tw-w-[60%] tw-m-auto"
                suggestion={suggestion}
                onAccept={() => onApplySuggestion(elementId, suggestion)}
                onIgnoreRuleOrCategory={() => onIgnoreRuleOrCategory(elementId)}
                disabled={isLoadingSuggestions}
              />
            </CarouselItem>
          ))
        )}
      </CarouselContent>
      {!isListEmpty && (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      )}
    </Carousel>
  );
}
