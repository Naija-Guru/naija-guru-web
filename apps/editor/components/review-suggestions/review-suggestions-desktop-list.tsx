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
    <ul className="tw-overflow-y-scroll tw-h-7/8 tw-border-t tw-border-solid tw-p-4 tw-hidden md:tw-block">
      {Object.entries(list).map(([elementId, suggestions]) =>
        suggestions.map((suggestion) => (
          <li key={elementId + suggestion.offset}>
            <Alert className="tw-my-4 tw-cursor-pointer" variant="destructive">
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
          </li>
        ))
      )}
    </ul>
  );
}
