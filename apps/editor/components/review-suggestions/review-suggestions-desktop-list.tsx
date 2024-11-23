import { AlertCircle } from 'lucide-react';

import { TSuggestion } from '@/models/suggestion';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
} from '@naija-spell-checker/ui';

export function ReviewSuggestionsDesktopList({
  list,
  onApplySuggestion,
  isLoadingSuggestions,
}: {
  list: Record<string, TSuggestion[]>;
  onApplySuggestion: (elementId: string, suggestion: TSuggestion) => void;
  isLoadingSuggestions: boolean;
}) {
  return (
    <ul className="overflow-y-scroll h-7/8 border-t border-solid p-4 hidden md:block">
      {Object.entries(list).map(([elementId, suggestions]) =>
        suggestions.map((suggestion) => (
          <li key={elementId + suggestion.offset}>
            <Alert className="my-4 cursor-pointer" variant="destructive">
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
          </li>
        ))
      )}
    </ul>
  );
}
