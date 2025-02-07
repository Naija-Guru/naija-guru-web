import { SettingsIcon, WandSparklesIcon } from 'lucide-react';

import { Button } from '@naija-spell-checker/ui';

import { PreferencesDialog } from '../preferences-dialog';

export const ReviewSuggestionsActions = ({
  isAcceptingAllSuggestions,
  showApplyAllSuggestionsAction,
  onApplyAllSuggestions,
}: {
  isAcceptingAllSuggestions: boolean;
  showApplyAllSuggestionsAction: boolean;
  onApplyAllSuggestions: () => void;
}) => {
  return (
    <div className="p-4 flex justify-between items-center g-4">
      <PreferencesDialog
        trigger={
          <Button variant="outline">
            <SettingsIcon className="h-4 w-4 mr-1" />
            Preferences
          </Button>
        }
      />
      {showApplyAllSuggestionsAction && (
        <Button onClick={onApplyAllSuggestions} variant="outline">
          <WandSparklesIcon className="h-4 w-4 mr-1" />
          {isAcceptingAllSuggestions ? 'Fixing...' : 'Fix all'}
        </Button>
      )}
    </div>
  );
};
