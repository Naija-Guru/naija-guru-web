import { SettingsIcon, WandSparklesIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@naija-spell-checker/ui';

import { PreferencesDialog } from '../preferences-dialog/preferences-dialog';

export const ReviewSuggestionsActions = ({
  isAcceptingAllSuggestions,
  showApplyAllSuggestionsAction,
  onApplyAllSuggestions,
}: {
  isAcceptingAllSuggestions: boolean;
  showApplyAllSuggestionsAction: boolean;
  onApplyAllSuggestions: () => void;
}) => {
  const t = useTranslations();

  return (
    <div className="tw-px-4 tw-py-2 tw-flex tw-items-center tw-justify-center tw-gap-2">
      <PreferencesDialog
        trigger={
          <Button variant="outline">
            <SettingsIcon className="tw-h-4 tw-w-4 tw-mr-1" />
            {t('preferences.title')}
          </Button>
        }
      />
      {showApplyAllSuggestionsAction && (
        <Button onClick={onApplyAllSuggestions} variant="outline">
          <WandSparklesIcon className="tw-h-4 tw-w-4 tw-mr-1" />
          {isAcceptingAllSuggestions
            ? t('suggestions.fixing')
            : t('suggestions.fix_all')}
        </Button>
      )}
    </div>
  );
};
