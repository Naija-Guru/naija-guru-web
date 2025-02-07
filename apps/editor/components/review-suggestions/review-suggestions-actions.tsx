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
    <div className="tw-p-4 tw-flex tw-justify-between tw-items-center tw-g-4">
      <PreferencesDialog
        trigger={
          <Button variant="outline">
            <SettingsIcon className="tw-h-4 tw-w-4 tw-mr-1" />
            Preferences
          </Button>
        }
      />
      {showApplyAllSuggestionsAction && (
        <Button onClick={onApplyAllSuggestions} variant="outline">
          <WandSparklesIcon className="tw-h-4 tw-w-4 tw-mr-1" />
          {isAcceptingAllSuggestions ? 'Fixing...' : 'Fix all'}
        </Button>
      )}
    </div>
  );
};
