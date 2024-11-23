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
    <Carousel className="w-full md:hidden">
      <CarouselContent>
        {Object.entries(list).map(([elementId, suggestions]) =>
          suggestions.map((suggestion) => (
            <CarouselItem key={elementId + suggestion.offset}>
              <Alert
                className="cursor-pointer w-4/6 mx-auto"
                variant="destructive"
              >
                <AlertCircle className="h-5" />
                <AlertTitle className="font-normal">
                  {suggestion.message}
                </AlertTitle>
                <AlertDescription className="font-bold text-xl">
                  <p>{suggestion.replacements[0].value}</p>
                  <Button
                    className="my-4"
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
