import { AlertCircle } from 'lucide-react';

import { TSuggestion } from '@/models/suggestion';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@naija-spell-checker/ui';

export function ReviewSuggestionsMobileList({
  list,
  onApplySuggestion,
  isLoadingSuggestions,
  isListEmpty,
}: {
  list: Record<string, TSuggestion[]>;
  onApplySuggestion: (elementId: string, suggestion: TSuggestion) => void;
  isLoadingSuggestions: boolean;
  isListEmpty: boolean;
}) {
  return (
    <Carousel className="tw-w-full md:tw-hidden">
      <CarouselContent>
        {Object.entries(list).map(([elementId, suggestions]) =>
          suggestions.map((suggestion) => (
            <CarouselItem key={elementId + suggestion.offset}>
              <Alert
                className="tw-cursor-pointer tw-w-4/6 tw-mx-auto"
                variant="destructive"
              >
                <AlertCircle className="tw-h-5" />
                <AlertTitle className="tw-font-normal">
                  {suggestion.message}
                </AlertTitle>
                <AlertDescription className="tw-font-bold tw-text-xl">
                  <p>{suggestion.replacements[0].value}</p>
                  <Button
                    className="tw-my-4"
                    onClick={() => onApplySuggestion(elementId, suggestion)}
                    disabled={isLoadingSuggestions}
                  >
                    Accept Suggestion
                  </Button>
                </AlertDescription>
              </Alert>
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
